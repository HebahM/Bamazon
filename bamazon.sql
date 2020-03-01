DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ear buds", "Electronics", 119.99, 10), 
("Sweater", "Clothing", 49.99, 25),
("Pet Bed", "Pet Supplies", 29.99, 30),
("iPad", "Electronics", 499.99, 10),
("Galaxy S20", "Electronics", 399.99, 15),
("Water Bottle - Glass", "Home", 15.99, 30),
("PS4", "Electronics", 299.99, 20),
("French Press Coffee Maker", "Kitchen", 24.99, 40),
("Harry Potter - Complete Series", "Books", 99.99, 20),
("Protein Powder", "Grocery", 24.99, 50);
