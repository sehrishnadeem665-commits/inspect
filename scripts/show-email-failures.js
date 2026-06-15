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
    const [rows] = await pool.execute('SELECT id, to_address, subject, error_message, created_at FROM email_failures ORDER BY created_at DESC LIMIT 20');
    if (!rows || rows.length === 0) {
      console.log('No email failures found');
      return;
    }

    console.log('Latest email failures:');
    for (const r of rows) {
      console.log(`- id:${r.id} to:${r.to_address} subject:${r.subject} at:${r.created_at}`);
      if (r.error_message) console.log(`  error: ${r.error_message}`);
    }
  } catch (err) {
    console.error('Error querying email_failures:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();