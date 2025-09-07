CREATE TABLE Products(
  ProductID INT IDENTITY PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Category NVARCHAR(50) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  Stock INT NOT NULL
);

INSERT INTO Products(Name, Category, Price, Stock) VALUES
('Surface Laptop 7', 'Computers', 1299.99, 12),
('Xbox Controller', 'Gaming', 59.99, 54),
('Adaptive Mouse', 'Accessories', 39.99, 80),
('Surface Pen', 'Accessories', 99.99, 30),
('Noise-Canceling Headset', 'Accessories', 199.00, 20);

