#!/usr/bin/env node

/**
 * Database Initialization Script for Local Development
 * Creates the database and imports the schema automatically
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
};

console.log('\n🗄️  Database Initialization Script');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function initializeDatabase() {
  let connection;

  try {
    console.log('📋 Configuration:');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Database: ${dbConfig.database}\n`);

    // Step 1: Connect without selecting database (to create it)
    console.log('🔗 Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      connectTimeout: 10000,
    });
    console.log('✅ Connected to MySQL server!\n');

    // Step 2: Drop existing database and create fresh
    console.log(`📝 Setting up database: ${dbConfig.database}...`);
    await connection.execute(`DROP DATABASE IF EXISTS \`${dbConfig.database}\``);
    await connection.execute(
      `CREATE DATABASE \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database created!\n`);

    // Step 3: Switch to the database
    await connection.changeUser({ database: dbConfig.database });
    console.log(`✅ Switched to database: ${dbConfig.database}\n`);

    // Step 3.5: Set max_allowed_packet for large image uploads
    console.log('⚙️  Configuring MySQL for large file uploads...');
    try {
      await connection.execute('SET GLOBAL max_allowed_packet = 268435456'); // 256MB
      console.log('✅ max_allowed_packet set to 256MB\n');
    } catch (err) {
      console.log('⚠️  Could not set max_allowed_packet globally (may require root config file)\n');
    }

    // Step 4: Read and execute schema
    const schemaPath = path.join(__dirname, '..', 'sql', 'schema-mysql.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📝 Importing schema...');

    // Split by semicolon and execute each statement
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      try {
        await connection.execute(statement);
      } catch (err) {
        // Ignore "table already exists" errors
        if (!err.message.includes('already exists')) {
          console.error('\n❌ SQL Error in statement:');
          console.error(statement.substring(0, 100) + '...');
          console.error(`Error: ${err.message}\n`);
          throw err;
        }
      }
    }
    console.log('✅ Schema imported successfully!\n');

    // Step 5: Verify tables
    console.log('✅ Verifying tables...');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [dbConfig.database]
    );

    const tableNames = tables.map(t => t.TABLE_NAME).sort();
    const expectedTables = [
      'contact_submissions',
      'email_failures',
      'email_outbox',
      'orders',
      'payments',
      'reviews',
      'settings',
      'users',      'vehicle_registration_images',      'vehicle_registrations',
    ];

    console.log('\n📊 Database Tables:');
    console.log('┌──────────────────────────┐');
    tableNames.forEach(name => {
      const checkmark = expectedTables.includes(name) ? '✓' : '✗';
      console.log(`│ ${checkmark} ${name.padEnd(21)} │`);
    });
    console.log('└──────────────────────────┘\n');

    if (expectedTables.every(t => tableNames.includes(t))) {
      console.log('✅ All expected tables created successfully!\n');
    } else {
      const missing = expectedTables.filter(t => !tableNames.includes(t));
      console.log(`⚠️  Missing tables: ${missing.join(', ')}\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🚀 Next steps:');
    console.log('   1. Start dev server: npm run dev');
    console.log('   2. Visit admin: http://localhost:3000/admin/login');
    console.log('   3. Use credentials:');
    console.log('      Email: admin@autorevealed.com');
    console.log('      Password: Admin123@Secure\n');

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error during database initialization:');
    console.error(`   ${err.message}\n`);

    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('💡 MySQL server is not running.');
      console.error('   Start MySQL:');
      console.error('   - Windows: Start the "MySQL80" service');
      console.error('   - Mac: brew services start mysql');
      console.error('   - Linux: sudo service mysql start\n');
    } else if (err.code === 'ACCESS_DENIED_FOR_USER') {
      console.error('💡 Authentication failed.');
      console.error('   Check your .env.local:');
      console.error(`   - DB_USER=${dbConfig.user}`);
      console.error(`   - DB_PASSWORD=${dbConfig.password ? '(set)' : '(empty)'}\n`);
    } else if (err.code === 'ENOENT') {
      console.error('💡 Schema file not found.');
      console.error('   Make sure sql/schema-mysql.sql exists\n');
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();
