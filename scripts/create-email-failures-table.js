const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autorevealed',
  });

  const createSql = `
CREATE TABLE IF NOT EXISTS email_failures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_address VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  error_message TEXT,
  created_at DATETIME
);

CREATE TABLE IF NOT EXISTS email_outbox (
  id INT AUTO_INCREMENT PRIMARY KEY,
  to_address VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  provider VARCHAR(50),
  preview_url VARCHAR(255),
  status VARCHAR(50),
  error_message TEXT,
  created_at DATETIME
);
`;

  try {
    await pool.execute(createSql);
    console.log('email_failures table ensured.');
  } catch (err) {
    console.error('Error creating email_failures table:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();