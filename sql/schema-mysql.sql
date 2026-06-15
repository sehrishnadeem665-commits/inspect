
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE,
  customer_email VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  identification_type VARCHAR(20) NOT NULL,
  identification_value VARCHAR(100) NOT NULL,
  vin_number VARCHAR(50) DEFAULT NULL,
  package_type VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) NOT NULL DEFAULT 'US',
  state VARCHAR(100) DEFAULT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  payment_provider VARCHAR(50) DEFAULT NULL,
  payment_id VARCHAR(255) DEFAULT NULL,
  status ENUM('pending','processing','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  report_url TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(40) DEFAULT NULL,
  whatsapp_number VARCHAR(40) DEFAULT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','read','responded') NOT NULL DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME DEFAULT NULL
);

-- Users table (basic)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) DEFAULT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_payment_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Email failures table (log failed sends for retry/debug)
CREATE TABLE IF NOT EXISTS email_failures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_address VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  error_message TEXT,
  created_at DATETIME
);

CREATE INDEX idx_email_failures_created_at ON email_failures(created_at);

-- Email outbox table (records of sent/previewed/queued emails so they can be viewed without an external provider)
CREATE TABLE IF NOT EXISTS email_outbox (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_address VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  provider VARCHAR(50),
  preview_url VARCHAR(255),
  status VARCHAR(50),
  error_message TEXT,
  created_at DATETIME
);

-- Vehicle registrations table
CREATE TABLE IF NOT EXISTS vehicle_registrations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  registration_number VARCHAR(64) UNIQUE,
  owner_name VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(50),
  owner_email VARCHAR(255) NOT NULL,
  vehicle_title VARCHAR(255) NOT NULL,
  vehicle_year INT,
  vehicle_make VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_type VARCHAR(100),
  vin VARCHAR(50),
  license_plate VARCHAR(50),
  description TEXT,
  price DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'USD',
  images_json JSON,
  payment_id VARCHAR(255),
  payment_status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  approved_by VARCHAR(255),
  approved_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicle_registrations_owner_email ON vehicle_registrations(owner_email);
CREATE INDEX idx_vehicle_registrations_approval_status ON vehicle_registrations(approval_status);
CREATE INDEX idx_vehicle_registrations_payment_status ON vehicle_registrations(payment_status);
CREATE INDEX idx_vehicle_registrations_created_at ON vehicle_registrations(created_at);

-- Vehicle registration images table (to separate large blob data)
CREATE TABLE IF NOT EXISTS vehicle_registration_images (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  registration_id BIGINT UNSIGNED NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  image_type VARCHAR(50),
  image_size BIGINT,
  image_data LONGBLOB,
  display_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (registration_id) REFERENCES vehicle_registrations(id) ON DELETE CASCADE,
  INDEX idx_registration_id (registration_id)
);

CREATE INDEX idx_email_outbox_created_at ON email_outbox(created_at);

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `value` JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

