# Ashbot: From Databases to AI
## Chatting with Azure SQL, powered by Functions + SWA

[![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-0078D4?logo=microsoft-azure)](https://red-desert-02d3eaf0f.1.azurestaticapps.net/)  
**Live Demo:** [https://red-desert-02d3eaf0f.1.azurestaticapps.net/](https://red-desert-02d3eaf0f.1.azurestaticapps.net/)

Ashbot is a lightweight chatbot that connects to an **Azure SQL Database** through an **Azure Functions API**, and serves a chat UI built with **React + Vite**.  
It demonstrates how to bridge enterprise data and conversational interfaces today, while laying the groundwork for future **AI / LLM / Copilot-style** extensions.

---

## Highlights
- React (Vite + TypeScript) chat frontend  
- Azure Functions backend with secure SQL queries  
- Azure SQL Database (Serverless, free tier)  
- CI/CD + Hosting via Azure Static Web Apps (Free)  
- Designed for future **LLM integration**

---

## Project Structure
- `web/` – # React frontend (Vite + TypeScript)
- `api/` – # Azure Functions backend (Node.js v4 model)
- `sql/` – # SQL schema + seed data (Products table)
- `.github/` – # GitHub Actions workflow for build + deploy


---

## Tech Stack
- **Frontend:** React (Vite, TypeScript)  
- **Backend:** Azure Functions (Node.js, mssql)  
- **Database:** Azure SQL Database (Serverless GP_S_Gen5_1, Free Offer)  
- **Hosting & CI/CD:** Azure Static Web Apps (Free plan) + GitHub Actions  

---

## Running Locally

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- An [Azure SQL Database](https://learn.microsoft.com/azure/azure-sql/database/free-offer-overview) (Serverless, free tier)

### Setup
1. **Clone the repo**
   ```
   git clone https://github.com/ashraful-islam-rafi/ashbot.git
   cd ashbot
   ```

2. **Fontend (React)**
    ```
    cd web && npm install && npm run dev # starts at http://localhost:5173
    ```

3. **Backend (Functions API)**
    ```
    cd ../api && npm install && func start # starts at http://localhost:7071/api/ask
    ```

4. **Proxy config for dev**
    Vite (`web/vite.config.ts`) proxies `/api/*` -> Functions on port 7071.



5. **Database**
    1. Create the schema with `sql/seed.sql` (contains `Products` table and sample rows).
    2. Update `api/local.settings.json` with your SQL connection details:
    ```
    {
        "Values": {
            "SQL_SERVER": "your-server.database.windows.net",
            "SQL_DB": "chatbotdb",
            "SQL_USER": "sqladmin",
            "SQL_PASSWORD": "your-password"
        }
    }
    ```

6. **Demo**
    Live: [https://red-desert-02d3eaf0f.1.azurestaticapps.net/](https://red-desert-02d3eaf0f.1.azurestaticapps.net/)
    ```
    Try:
        1.  Accessories under $50
        2.  what is in stock
        3.  gaming items
    ```
---

## License
MIT — free to use, adapt, and extend.