const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autorevealed',
  });

  try {
    console.log('Checking admin user...');
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
    if (!rows || rows.length === 0) {
      console.log('Admin not found');
    } else {
      const u = rows[0];
      console.log('Admin found, password_hash:', u.password_hash ? (u.password_hash.slice(0, 8) + '...') : 'n/a');
      console.log('Password check (SomePass123):', bcrypt.compareSync('SomePass123', u.password_hash));
    }

    console.log('Inserting contact submission...');
    await pool.execute('INSERT INTO contact_submissions (name,email,subject,message,status,created_at) VALUES (?,?,?,?,?,NOW())', ['E2E Tester', 'e2e@example.com', 'Hello', 'This is a test', 'new']);
    const [crows] = await pool.execute('SELECT * FROM contact_submissions ORDER BY id DESC LIMIT 1');
    console.log('Latest contact row:', crows[0]);

    console.log('Creating order...');
    const [r] = await pool.execute('INSERT INTO orders (customer_email,vehicle_type,identification_type,identification_value,vin_number,package_type,country_code,currency,amount,payment_status,payment_provider,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,NOW())', ['buyer@example.com', 'car', 'vin', '1HGCM82633A004352', '1HGCM82633A004352', 'basic', 'US', 'USD', 9.99, 'pending', 'paypal', 'pending']);
    const insertId = r.insertId;
    await pool.execute('UPDATE orders SET order_number = ? WHERE id = ?', [`ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(insertId).padStart(5,'0')}`, insertId]);
    const [orows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [insertId]);
    console.log('Inserted order:', orows[0]);

    console.log('Completing order (marking payment completed)');
    await pool.execute('UPDATE orders SET payment_status=?,payment_id=?,updated_at=NOW() WHERE id = ?', ['completed', 'SIMULATED-PAYID', insertId]);
    const [orow2] = await pool.execute('SELECT * FROM orders WHERE id = ?', [insertId]);
    console.log('Order after completion:', orow2[0]);

    console.log('E2E DB checks done.');
  } catch (err) {
    console.error('E2E ERROR', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
