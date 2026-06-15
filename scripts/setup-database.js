#!/usr/bin/env node

/**
 * Database Initialization Script - Using Project Pool
 * Creates the reviews table using the project's existing MySQL configuration
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Use the project's database pool configuration
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

console.log('\n🗄️  Database Initialization Script');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔍 Database Configuration:');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}\n`);

    console.log('🔗 Attempting connection...');
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectTimeout: 10000,
    });

    console.log('✅ Connected successfully!\n');

    // Create reviews table with proper structure
    const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME DEFAULT NULL,
        KEY idx_reviews_status_created (status, created_at),
        KEY idx_reviews_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('📝 Creating reviews table...');
    const [result] = await connection.execute(createReviewsTable);
    console.log('✅ Reviews table created/verified!\n');

    // Verify table structure
    console.log('📋 Verifying table structure...');
    const [columns] = await connection.execute(`DESCRIBE reviews`);
    
    console.log('\n┌─────────────────┬────────────────────┬──────────────┐');
    console.log('│ Field           │ Type               │ Constraints  │');
    console.log('├─────────────────┼────────────────────┼──────────────┤');
    
    columns.forEach(col => {
      const field = col.Field.padEnd(15);
      const type = col.Type.padEnd(18);
      const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
      console.log(`│ ${field} │ ${type} │ ${nullable.padEnd(12)} │`);
    });
    
    console.log('└─────────────────┴────────────────────┴──────────────┘\n');

    // Show indexes
    const [indexes] = await connection.execute(
      `SHOW INDEX FROM reviews WHERE Table_name='reviews'`
    );
    
    if (indexes.length > 1) { // More than just the primary key
      console.log('🔑 Indexes:');
      const uniqueIndexes = new Set();
      indexes.forEach(idx => {
        if (idx.Key_name !== 'PRIMARY' && !uniqueIndexes.has(idx.Key_name)) {
          uniqueIndexes.add(idx.Key_name);
          console.log(`   ✓ ${idx.Key_name}`);
        }
      });
      console.log();
    }

    console.log('✅ Database initialization completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎉 The reviews table is ready!');
    console.log('📝 Users can now submit reviews through the form.\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Database initialization failed!\n');
    console.error('Error:', error.message);
    console.error('Code:', error.code);

    console.log('\n💡 Troubleshooting Tips:\n');

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   • Check your database credentials in .env.local');
      console.log('   • Verify DB_USER and DB_PASSWORD are correct');
      console.log('   • Make sure the database user exists and has proper permissions\n');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('   • MySQL server is not running or not accessible');
      console.log('   • If using Hostinger, check if the database host is correct');
      console.log('   • Try connecting manually with: mysql -h' + dbConfig.host + ' -u' + dbConfig.user + '\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log(`   • Database "${dbConfig.database}" does not exist`);
      console.log('   • Create it with: CREATE DATABASE ' + dbConfig.database + ';\n');
    }

    console.log('For Hostinger users:');
    console.log('   1. Check your actual database host in Hostinger control panel');
    console.log('   2. Update DB_HOST in .env.local if needed');
    console.log('   3. Ensure your IP is whitelisted in Hostinger\n');

    console.error('Full Error Details:', error);
    process.exit(1);

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (e) {
        // Ignore close errors
      }
    }
  }
}

// Run initialization
console.log('Starting database setup...\n');
initializeDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
