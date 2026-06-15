const mysql = require('mysql2/promise');

async function debugOrderTable() {
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

    // Check table structure
    console.log('📋 Orders table structure:');
    const [columns] = await conn.execute(
      `SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'carvertical' ORDER BY ORDINAL_POSITION`
    );
    
    columns.forEach(col => {
      console.log(`  ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${col.COLUMN_KEY ? '[' + col.COLUMN_KEY + ']' : ''} ${col.EXTRA || ''}`);
    });

    // Check the next auto_increment value
    const [autoIncrement] = await conn.execute(
      `SELECT AUTO_INCREMENT FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'carvertical'`
    );
    console.log('\n📊 Next AUTO_INCREMENT:', autoIncrement[0]?.AUTO_INCREMENT);

    // Check current max ID
    const [maxId] = await conn.execute('SELECT MAX(id) as max_id FROM orders');
    console.log('📊 Current MAX(id):', maxId[0]?.max_id);

    // Count rows
    const [count] = await conn.execute('SELECT COUNT(*) as count FROM orders');
    console.log('📊 Total rows:', count[0]?.count);

    // Test raw insert
    console.log('\n🔄 Testing INSERT with LAST_INSERT_ID()...');
    const [result] = await conn.execute(
      `INSERT INTO orders (customer_email, vehicle_type, identification_type, identification_value, package_type, country_code, currency, amount, payment_status, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      ['test2@example.com', 'car', 'vin', 'TEST2', 'standard', 'US', 'USD', 60.00, 'pending', 'pending']
    );

    console.log('Result object:', JSON.stringify(result, null, 2));
    console.log('Result.insertId:', result.insertId);

    // Verify with LAST_INSERT_ID
    const [lastId] = await conn.execute('SELECT LAST_INSERT_ID() as last_id');
    console.log('LAST_INSERT_ID():', lastId[0]?.last_id);

    // List recent orders
    console.log('\n📋 Last 5 orders:');
    const [orders] = await conn.execute('SELECT id, customer_email, created_at FROM orders ORDER BY id DESC LIMIT 5');
    orders.forEach(order => {
      console.log(`  ID: ${order.id}, Email: ${order.customer_email}, Created: ${order.created_at}`);
    });

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

debugOrderTable();
