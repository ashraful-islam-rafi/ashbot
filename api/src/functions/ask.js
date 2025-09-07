const { app } = require("@azure/functions");
const sql = require("mssql");

// --- helpers ---
function classifyIntent(text) {
  const t = (text || "").toLowerCase();
  if (/(under|below)\s*\$?\d+/.test(t)) return "LIST_UNDER_PRICE";
  if (/\b(stock|inventory|in stock)\b/.test(t)) return "CHECK_STOCK";
  if (/\b(accessories|gaming|computers?)\b/.test(t)) return "LIST_BY_CATEGORY";
  return "LIST_ALL";
}

function parseParams(text) {
  const price = (text || "").match(/(?:under|below)\s*\$?(\d+(?:\.\d+)?)/i);
  const cat = (text || "").match(/\b(accessories|gaming|computers?)\b/i);
  const normalize = (c) => {
    if (!c) return null;
    const x = c.toLowerCase();
    if (x.startsWith("accessor")) return "Accessories";
    if (x.startsWith("gaming")) return "Gaming";
    if (x.startsWith("computer")) return "Computers";
    return null;
  };
  return {
    maxPrice: price ? Number(price[1]) : null,
    category: normalize(cat && cat[1]),
  };
}

async function runQuery(pool, intent, { category, maxPrice }) {
  switch (intent) {
    case "LIST_UNDER_PRICE":
      return pool
        .request()
        .input("maxPrice", sql.Decimal(10, 2), maxPrice)
        .query(
          `SELECT TOP (10) Name, Category, Price, Stock
           FROM Products
           WHERE Price <= @maxPrice
           ORDER BY Price ASC`
        );

    case "LIST_BY_CATEGORY":
      return pool
        .request()
        .input("cat", sql.NVarChar, category)
        .query(
          `SELECT TOP (10) Name, Category, Price, Stock
           FROM Products
           WHERE Category = @cat
           ORDER BY Price ASC`
        );

    case "CHECK_STOCK":
      return pool
        .request()
        .query(
          `SELECT Name, Stock
           FROM Products
           ORDER BY Stock DESC`
        );

    default:
      return pool
        .request()
        .query(
          `SELECT TOP (10) Name, Category, Price, Stock
           FROM Products
           ORDER BY Price ASC`
        );
  }
}

function toAnswer(intent, rows, params) {
  if (!rows || rows.length === 0) return "I didn’t find any matching items.";
  const bullet = (r) =>
    `• ${r.Name}${r.Category ? ` (${r.Category})` : ""} — $${Number(r.Price).toFixed(2)}${r.Stock != null ? ` [${r.Stock} in stock]` : ""}`;
  switch (intent) {
    case "LIST_UNDER_PRICE":
      return `Here are items at or under $${params.maxPrice}:\n` + rows.map(bullet).join("\n");
    case "LIST_BY_CATEGORY":
      return `Top ${params.category} items:\n` + rows.map(bullet).join("\n");
    case "CHECK_STOCK":
      return `Current stock levels:\n` + rows.map((r) => `• ${r.Name}: ${r.Stock}`).join("\n");
    default:
      return `Here are some items:\n` + rows.map(bullet).join("\n");
  }
}

// --- function entrypoint (v4 model) ---
app.http("ask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const body = await request.json().catch(() => ({}));
      const message = (body && body.message) || "";
      const intent = classifyIntent(message);
      const params = parseParams(message);

      const pool = await sql.connect({
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DB,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        options: { encrypt: true },
      });

      const result = await runQuery(pool, intent, params);
      await pool.close();

      const rows = result.recordset || [];
      const response = { intent, params, rows, answer: toAnswer(intent, rows, params) };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      context.log.error(err);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
