import mysql from 'mysql2/promise'

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'u319625572_autorevealed',
  DB_PASSWORD = 'Autorevealed321@',
  DB_NAME = 'u319625572_autorevealed',
} = process.env

console.log('\n📦 Database Configuration:')
console.log(`  Host: ${DB_HOST}`)
console.log(`  Port: ${DB_PORT}`)
console.log(`  Database: ${DB_NAME}`)

const pool = mysql.createPool({
  port: Number(DB_PORT),
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: 10,
  enableKeepAlive: true,
  waitForConnections: true,
  queueLimit: 0,
})

// Test connection on startup
// Optionally test the connection on startup. In some hosting environments
// (CI/build or platforms without DB during build), attempting a connection
// at module import time can cause noisy errors or unexpected failures.
// Control this behavior via the ENABLE_DB_CHECK env var (set to 'true' to enable).
if (process.env.ENABLE_DB_CHECK === 'true') {
  pool.getConnection()
    .then(conn => {
      console.log('✅ Database connection successful\n')
      conn.release()
    })
    .catch(err => {
      console.error('\n❌ DATABASE CONNECTION FAILED:')
      console.error(`   Error: ${err?.message || err}`)
      console.error(`\n   Make sure:`)
      console.error(`   1. MySQL is running`)
      console.error(`   2. Database exists: ${DB_NAME}`)
      console.error(`   3. Credentials are correct`)
      console.error(`   4. Host is accessible: ${DB_HOST}\n`)
    })
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n⚠️ Skipping initial DB connection test (ENABLE_DB_CHECK not set).')
  }
}

// Export a query helper function
export async function query(sql: string, values?: any[]) {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute(sql, values)
    return results
  } finally {
    connection.release()
  }
}

export default pool
