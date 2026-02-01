-- Create Database
CREATE DATABASE IF NOT EXISTS gemprojectdatabase;
USE gemprojectdatabase;

-- Table for Admins
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN'
);

-- Table for Buyers
CREATE TABLE IF NOT EXISTS buyer_entity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20)
);

-- Table for Products
CREATE TABLE IF NOT EXISTS product_entity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    starting_price DOUBLE,
    auction_start DATETIME,
    auction_end DATETIME,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    winner_buyer_id BIGINT
);

-- Table for Bids
CREATE TABLE IF NOT EXISTS bid_entity (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    buyer_id BIGINT,
    bid_amount DOUBLE,
    bid_time DATETIME,
    FOREIGN KEY (product_id) REFERENCES product_entity(id),
    FOREIGN KEY (buyer_id) REFERENCES buyer_entity(id)
);

-- Insert Default Admin
-- Password is 'admin' (In a real app, use encryption)
INSERT IGNORE INTO admins (username, password, role) VALUES ('admin', 'admin', 'ADMIN');
