const mysql = require('mysql2/promise')
require('dotenv').config({ path: '.env.local' })

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'carvertical',
  })

  const [rows] = await pool.execute(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = 'owner_phone'`,
    [process.env.DB_NAME || 'carvertical', 'vehicle_registrations']
  )

  if (rows.length > 0) {
    console.log('owner_phone column already exists.')
    await pool.end()
    return
  }

  console.log('Adding owner_phone column to vehicle_registrations...')
  await pool.execute(`ALTER TABLE vehicle_registrations ADD COLUMN owner_phone VARCHAR(50) NULL`)
  console.log('Done.')
  await pool.end()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})