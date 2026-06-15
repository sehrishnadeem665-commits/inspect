const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('🔄 Testing MySQL connection...');
    console.log('Connecting to:');
    console.log('  Host: localhost');
    console.log('  Port: 3306');
    console.log('  User: root');
    console.log('  Database: carvertical');
    console.log('');

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
    console.log('✅ Connected to MySQL successfully!');

    // Test the orders table exists
    const [tables] = await conn.execute(
      `SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_NAME = 'orders' AND TABLE_SCHEMA = 'carvertical'`
    );

    if (tables[0].count === 0) {
      console.warn('⚠️  orders table not found!');
      console.log('Run the schema migration:');
      console.log('  mysql -u root carvertical < sql/schema-mysql.sql');
    } else {
      console.log('✅ orders table exists');
    }

    // Test inserting a test order
    console.log('');
    console.log('🔄 Testing order insert...');
    const [result] = await conn.execute(
      `INSERT INTO orders (customer_email, vehicle_type, identification_type, identification_value, package_type, country_code, currency, amount, payment_status, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      ['test@example.com', 'car', 'vin', 'TEST123456789', 'basic', 'US', 'USD', 40.00, 'pending', 'pending']
    );

    console.log('✅ Insert successful!');
    console.log('Insert ID:', result.insertId);

    // Verify the insert
    const [rows] = await conn.execute('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    console.log('✅ Retrieved order:');
    console.log(JSON.stringify(rows[0], null, 2));

    // Clean up
    await conn.execute('DELETE FROM orders WHERE id = ?', [result.insertId]);
    console.log('✅ Test order deleted');

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ MySQL is not running!');
      console.error('To start MySQL on Windows:');
      console.error('  1. Open Services (services.msc)');
      console.error('  2. Find "MySQL80" or similar');
      console.error('  3. Right-click and select "Start"');
      console.error('\nOr if using XAMPP/WAMP:');
      console.error('  Open the control panel and start MySQL from there');
    }
    process.exit(1);
  }
}

testConnection();
