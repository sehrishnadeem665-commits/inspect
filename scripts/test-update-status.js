const mysql = require('mysql2/promise');
const fetch = globalThis.fetch || require('node-fetch');

async function main() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autorevealed',
  });

  try {
    console.log('Inserting order...');
    const [r] = await pool.execute('INSERT INTO orders (customer_email,vehicle_type,identification_type,identification_value,vin_number,package_type,country_code,currency,amount,payment_status,payment_provider,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW())', ['statustester@example.com', 'car', 'vin', 'TESTVIN1234567890', 'TESTVIN1234567890', 'basic', 'US', 'USD', 9.99, 'pending', 'test', 'pending']);
    const insertId = r.insertId;
    await pool.execute('UPDATE orders SET order_number = ? WHERE id = ?', [`ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(insertId).padStart(5,'0')}`, insertId]);

    console.log('Order created with id', insertId);

    // Login as admin using TEST_ADMIN_EMAIL/PASS env vars
    const adminEmail = process.env.TEST_ADMIN_EMAIL;
    const adminPass = process.env.TEST_ADMIN_PASS;
    if (!adminEmail || !adminPass) {
      throw new Error('Please set TEST_ADMIN_EMAIL and TEST_ADMIN_PASS env vars to run this test')
    }

    console.log('Logging in as admin...');
    const loginRes = await fetch(`${baseUrl}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: adminEmail, password: adminPass }) });
    const loginJson = await loginRes.json();
    if (!loginRes.ok || !loginJson.token) {
      console.error('Login failed:', loginJson);
      process.exit(1);
    }
    const token = loginJson.token;

    console.log('Updating status to "completed" via API...');
    const statusRes = await fetch(`${baseUrl}/api/admin/orders/${insertId}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ reportStatus: 'completed' }) });
    const statusJson = await statusRes.json();
    if (!statusRes.ok || !statusJson.success) {
      console.error('Status update failed:', statusJson);
      process.exit(1);
    }

    console.log('Status API response:', statusJson);

    const [rows] = await pool.execute('SELECT status FROM orders WHERE id = ?', [insertId]);
    const order = rows[0];
    console.log('DB status after update:', order.status);

    if (order.status !== 'completed') {
      console.error('Status did not persist to DB');
      process.exit(1);
    }

    console.log('Status successfully updated and persisted. Test passed.');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
