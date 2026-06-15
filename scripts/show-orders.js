const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autorevealed',
  });

  try {
    const [rows] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC LIMIT 20');
    if (!rows || rows.length === 0) {
      console.log('No orders found');
      return;
    }

    for (const r of rows) {
      const id = Number(r.id);
      const orderNumber = r.order_number;
      const email = r.customer_email;
      const amount = typeof r.amount === 'string' ? parseFloat(r.amount) : Number(r.amount);
      const currency = r.currency || 'USD';
      const paymentStatus = r.payment_status;
      const paymentProvider = r.payment_provider || 'paypal';
      console.log(`Order #${orderNumber} (id:${id}) — ${email} — ${currency} ${amount.toFixed(2)} — ${paymentProvider} — ${paymentStatus}`);
    }
  } catch (err) {
    console.error('Error querying orders:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
