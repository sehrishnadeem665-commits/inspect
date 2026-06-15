-- PayPal Payments Table
-- Run this migration to set up PayPal payment tracking

CREATE TABLE IF NOT EXISTS paypal_payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(100) NOT NULL UNIQUE,
  paypal_order_id VARCHAR(255) NOT NULL UNIQUE,
  transaction_id VARCHAR(255) DEFAULT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  package_id VARCHAR(50) NOT NULL,
  vehicle_identifier VARCHAR(255) NOT NULL,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'paypal',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payer_id VARCHAR(255) DEFAULT NULL,
  payer_email VARCHAR(255) DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  captured_at DATETIME DEFAULT NULL,
  metadata JSON DEFAULT NULL,
  
  KEY idx_order_id (order_id),
  KEY idx_paypal_order_id (paypal_order_id),
  KEY idx_customer_email (customer_email),
  KEY idx_payment_status (payment_status),
  KEY idx_created_at (created_at)
);

-- Alter existing payments table to accommodate PayPal data (optional)
-- This adds PayPal-specific columns to the existing payments table
-- Uncomment if you want to use the existing payments table instead

/*
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS package_id VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS vehicle_identifier VARCHAR(255);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(255);

ALTER TABLE payments ADD KEY idx_paypal_order_id (paypal_order_id);
ALTER TABLE payments ADD KEY idx_package_id (package_id);
*/
