const mysql = require('mysql2/promise');

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'u319625572_autorevealed',
  DB_PASSWORD = 'Autorevealed321@',
  DB_NAME = 'u319625572_autorevealed',
} = process.env;

console.log('Testing order stats query...');
console.log(`Host: ${DB_HOST}, Port: ${DB_PORT}, Database: ${DB_NAME}`);

(async () => {
  try {
    const pool = mysql.createPool({
      port: Number(DB_PORT),
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 1,
    });

    console.log('\n1. Testing connection...');
    const conn = await pool.getConnection();
    console.log('✅ Connected successfully');
    conn.release();

    console.log('\n2. Testing query...');
    const [rows] = await pool.execute(
      `SELECT DATE(created_at) as day, COUNT(*) as count, COALESCE(SUM(amount),0) as totalAmount
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY day
       ORDER BY day ASC`,
      [30]
    );
    console.log('✅ Query successful');
    console.log(`   Returned ${rows.length} rows`);
    if (rows.length > 0) {
      console.log('   Sample row:', rows[0]);
    }

    await pool.end();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Details:', error.code);
    process.exit(1);
  }
})();
