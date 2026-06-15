const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.log('Usage: node scripts/create-admin.js email@example.com password');
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'autorevealed',
  });

  const hash = bcrypt.hashSync(password, 10);
  const [res] = await pool.execute('INSERT INTO users (email, password_hash, role, created_at) VALUES (?, ?, ?, NOW())', [email, hash, 'admin']);
  console.log('Created admin user:', email);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1) })
