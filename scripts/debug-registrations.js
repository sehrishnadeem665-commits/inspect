const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'carvertical',
    waitForConnections: true,
  })

  const [rows] = await pool.execute('SELECT id, registration_number, owner_email, approval_status, payment_status, created_at, approved_at FROM vehicle_registrations ORDER BY id DESC')
  console.log('Registrations:')
  console.table(rows)

  const [imgs] = await pool.execute('SELECT registration_id, COUNT(*) as cnt FROM vehicle_registration_images GROUP BY registration_id')
  console.log('\nImage counts per registration:')
  console.table(imgs)

  await pool.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
