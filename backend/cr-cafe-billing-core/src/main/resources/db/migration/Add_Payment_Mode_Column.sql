-- Add_Payment_Mode_Column.sql
-- This script adds the payment_mode column to an existing bills table
-- Run this if you already have a bills table and just need to add payment mode support

-- Add payment_mode column to bills table
ALTER TABLE bills 
ADD COLUMN payment_mode ENUM('CASH', 'ONLINE') NOT NULL DEFAULT 'CASH' 
AFTER receipt_id;

-- Update existing bills to have CASH as default payment mode (if any exist)
UPDATE bills SET payment_mode = 'CASH' WHERE payment_mode IS NULL;

-- Add index for better performance on payment_mode queries
CREATE INDEX idx_bills_payment_mode ON bills(payment_mode);

-- Verify the column was added successfully
DESCRIBE bills; 