const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carvertical',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function clearDummyOrders() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Database connected\n');

    // Count before deletion
    const [countBefore] = await conn.execute('SELECT COUNT(*) as count FROM orders');
    console.log(`📊 Orders before deletion: ${countBefore[0].count}`);

    // Delete all orders
    const [result] = await conn.execute('DELETE FROM orders');
    console.log(`\n🗑️  Deleted ${result.affectedRows} orders from database\n`);

    // Delete associated payments if any
    const [payments] = await conn.execute('SELECT COUNT(*) as count FROM payments');
    if (payments[0].count > 0) {
      const [paymentResult] = await conn.execute('DELETE FROM payments');
      console.log(`🗑️  Deleted ${paymentResult.affectedRows} payment records\n`);
    }

    // Verify
    const [countAfter] = await conn.execute('SELECT COUNT(*) as count FROM orders');
    console.log(`✅ Orders remaining: ${countAfter[0].count}`);
    console.log('\n✅ Database cleaned successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

clearDummyOrders().catch(console.error);
