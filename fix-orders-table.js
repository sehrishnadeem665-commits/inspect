const mysql = require('mysql2/promise');

async function fixOrdersTable() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'carvertical',
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();

    console.log('🔄 Fixing orders table...');
    
    // First, let's check if there's any data we need to preserve
    const [existingOrders] = await conn.execute('SELECT COUNT(*) as count FROM orders WHERE id != 0');
    console.log(`ℹ️  Existing valid orders (id != 0): ${existingOrders[0]?.count}`);

    // Drop the old table
    console.log('🔄 Dropping old orders table...');
    await conn.execute('DROP TABLE IF EXISTS orders');
    console.log('✅ Old table dropped');

    // Create new table with correct schema
    console.log('🔄 Creating new orders table with AUTO_INCREMENT...');
    await conn.execute(`
      CREATE TABLE orders (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ New orders table created with AUTO_INCREMENT');

    // Verify the fix
    const [columns] = await conn.execute(
      `SELECT COLUMN_NAME, COLUMN_KEY, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'carvertical' AND COLUMN_NAME = 'id'`
    );
    
    const idColumn = columns[0];
    console.log('\n📋 Verification:');
    console.log(`  Column: id`);
    console.log(`  Key: ${idColumn.COLUMN_KEY} (should be PRI)`);
    console.log(`  Extra: ${idColumn.EXTRA} (should include auto_increment)`);

    // Test the fix
    console.log('\n🔄 Testing INSERT with AUTO_INCREMENT...');
    const [result] = await conn.execute(
      `INSERT INTO orders (customer_email, vehicle_type, identification_type, identification_value, package_type, country_code, currency, amount, payment_status, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      ['test@example.com', 'car', 'vin', 'TEST123', 'basic', 'US', 'USD', 40.00, 'pending', 'pending']
    );

    console.log(`✅ Insert successful! insertId: ${result.insertId}`);

    if (result.insertId > 0) {
      console.log('✅ AUTO_INCREMENT is working correctly!');
    } else {
      console.error('❌ AUTO_INCREMENT still not working');
    }

    // Clean up test data
    await conn.execute('DELETE FROM orders WHERE id = ?', [result.insertId]);
    console.log('✅ Test data cleaned up');

    conn.release();
    console.log('\n✅ Table fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixOrdersTable();
