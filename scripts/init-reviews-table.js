#!/usr/bin/env node

/**
 * Database Initialization Script
 * Creates the reviews table using the project's MySQL pool
 */

const mysql = require('mysql2/promise');

// Read environment variables from .env.local
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env.local not found, using default values');
    return {};
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  });
  return env;
}

const envVars = loadEnv();

const dbConfig = {
  host: envVars.DB_HOST || 'localhost',
  port: parseInt(envVars.DB_PORT || '3306'),
  user: envVars.DB_USER || 'root',
  password: envVars.DB_PASSWORD || '',
  database: envVars.DB_NAME || 'autorevealed',
  connectTimeout: 10000,
};

async function initializeDatabase() {
  let connection;

  try {
    console.log('🔍 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}\n`);

    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database successfully!\n');

    // Create reviews table
    const createReviewsTable = `
      CREATE TABLE IF NOT EXISTS reviews (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating TINYINT NOT NULL,
        comment TEXT NOT NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME DEFAULT NULL,
        INDEX idx_reviews_status_created (status, created_at),
        INDEX idx_reviews_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    console.log('📝 Creating reviews table...');
    await connection.execute(createReviewsTable);
    console.log('✅ Reviews table created/verified successfully!\n');

    // Verify table was created
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'reviews'`,
      [dbConfig.database]
    );

    if (tables.length > 0) {
      console.log('✅ Verified: reviews table exists in database');

      // Show table structure
      const [columns] = await connection.execute(`DESCRIBE reviews`);
      console.log('\n📋 Table Structure:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      columns.forEach(col => {
        const nullable = col.Null === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(
          `  ${col.Field.padEnd(15)} | ${col.Type.padEnd(20)} | ${nullable}`
        );
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      console.log('✅ Database initialization completed successfully!');
      console.log('📝 You can now submit reviews through the form.\n');
      process.exit(0);
    } else {
      console.error('❌ Failed to verify reviews table creation');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Database initialization failed:\n');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Hint: Check your database credentials in .env.local');
      console.error('   DB_HOST, DB_USER, DB_PASSWORD');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n💡 Hint: Database does not exist. Create it first:');
      console.error(`   CREATE DATABASE ${dbConfig.database};`);
    } else if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNREFUSED') {
      console.error('\n💡 Hint: Cannot connect to database. Check if MySQL is running.');
      console.error('   Make sure your MySQL server is running on ' + dbConfig.host);
    }

    console.error('\nFull Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔄 Database connection closed.');
    }
  }
}

// Run initialization
initializeDatabase().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
