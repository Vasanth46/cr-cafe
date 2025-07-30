-- V1__Create_Complete_Schema.sql
-- Complete database schema for CR Cafe Billing System
-- This script can be run directly in MySQL Workbench on a new database

-- Drop database if exists and create fresh (uncomment if needed)
-- DROP DATABASE IF EXISTS cr_cafe;
-- CREATE DATABASE cr_cafe;
-- USE cr_cafe;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('OWNER', 'MANAGER', 'WORKER') NOT NULL DEFAULT 'WORKER',
    refresh_token VARCHAR(512),
    profile_image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    receipt_id VARCHAR(100) NOT NULL UNIQUE,
    payment_mode ENUM('CASH', 'ONLINE') NOT NULL DEFAULT 'CASH',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create discounts table
CREATE TABLE IF NOT EXISTS discounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create financial_summary table (for archiving old bills)
CREATE TABLE IF NOT EXISTS financial_summary (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    archived_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    original_bill_date TIMESTAMP,
    total_amount DECIMAL(10,2),
    discount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    receipt_id VARCHAR(100),
    total_revenue DECIMAL(12,2),
    total_discount DECIMAL(12,2),
    total_orders BIGINT
);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);
CREATE INDEX idx_bills_order_id ON bills(order_id);
CREATE INDEX idx_bills_receipt_id ON bills(receipt_id);
CREATE INDEX idx_bills_date ON bills(bill_date);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_financial_summary_archived_date ON financial_summary(archived_date);

-- Insert sample data (optional - uncomment if needed)
-- INSERT INTO users (username, password, role) VALUES 
-- ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'OWNER'); -- password: admin123

-- INSERT INTO items (name, price, category, is_available) VALUES 
-- ('Coffee', 25.00, 'Beverages', true),
-- ('Tea', 20.00, 'Beverages', true),
-- ('Dosa', 50.00, 'Snacks', true),
-- ('Idli', 30.00, 'Snacks', true);

-- --- INITIAL DATA ---
INSERT INTO items (name, price, is_available) VALUES
('schezwan dosa', 70.00, true),
('set dosa', 80.00, true),
('uttapam', 75.00, true),
('idli fry', 50.00, true),
('tea', 10.00, true),
('masala dosa', 50.00, true),
('vegetable idli', 40.00, true),
('paniyaram', 40.00, true),
('Idli (1 Plate)', 40.00, true),
('Dosa', 60.00, true),
('Coffee', 25.00, true),
('Vada (1 piece)', 15.00, true); 