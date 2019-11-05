DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
  id INT NOT NULL
  AUTO_INCREMENT,
  product_name varchar
  (50) NOT NULL,
  department_name varchar
  (50) DEFAULT NULL,
  price int
  (11) NOT NULL,
  stock_quantity int
  (11) NOT NULL,
  product_sales int
  (20) NOT NULL DEFAULT 0,
  PRIMARY KEY
  (id)
);
