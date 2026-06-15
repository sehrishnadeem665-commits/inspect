/**
 * Database Setup for Webhook Integration
 * 
 * Run this script to ensure your payments table has all required columns
 * for webhook status updates
 * 
 * Usage:
 * npx ts-node scripts/setup-webhook-table.ts
 * 
 * Or execute the SQL directly in your MySQL client
 */

const mysql = require('mysql2/promise');

async function setupWebhookTable() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'carvertical',
    });

    console.log('✅ Connected to database');

    // SQL to create/update payments table
    const sql = `
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE,
        paypal_order_id VARCHAR(100),
        transaction_id VARCHAR(100),
        customer_email VARCHAR(100) NOT NULL,
        customer_name VARCHAR(100),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        webhook_event VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_order_id (order_id),
        INDEX idx_paypal_order_id (paypal_order_id),
        INDEX idx_transaction_id (transaction_id),
        INDEX idx_payment_status (payment_status),
        INDEX idx_customer_email (customer_email),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(sql);
    console.log('✅ Payments table created/updated successfully');

    // Add new columns if they don't exist
    const alterQueries = [
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS webhook_event VARCHAR(100)`,
      `ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
      `ALTER TABLE payments ADD INDEX IF NOT EXISTS idx_payment_status (payment_status)`,
    ];

    for (const query of alterQueries) {
      try {
        await connection.query(query);
        console.log(`✅ ${query.split('ADD')[1]?.trim()}`);
      } catch (err: any) {
        if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_DUP_FIELDNAME') {
          console.log(`ℹ️  Column/index already exists`);
        } else {
          console.warn(`⚠️  ${err.message}`);
        }
      }
    }

    // Display table structure
    const [rows]: any = await connection.query('DESCRIBE payments');
    console.log('\n📋 Current table structure:');
    console.table(rows);

    // Count records by status
    const [statusCount]: any = await connection.query(
      'SELECT payment_status, COUNT(*) as count FROM payments GROUP BY payment_status'
    );
    console.log('\n📊 Payment status breakdown:');
    console.table(statusCount);

    console.log('\n✅ Database setup complete!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup
setupWebhookTable();

export default setupWebhookTable;
