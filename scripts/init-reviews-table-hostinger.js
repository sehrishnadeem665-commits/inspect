#!/usr/bin/env node

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function initReviewsTable() {
  let connection;
  
  try {
    console.log('🔌 Connecting to Hostinger database...');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   Port:', process.env.DB_PORT);
    console.log('   Database:', process.env.DB_NAME);
    console.log('   User:', process.env.DB_USER);
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database successfully!\n');

    // Check if reviews table exists
    console.log('📋 Checking if reviews table exists...');
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'reviews'"
    );

    if (tables.length > 0) {
      console.log('✅ Reviews table already exists!\n');
      
      // Show table structure
      const [columns] = await connection.execute('DESC reviews');
      console.log('📊 Table structure:');
      console.table(columns);
    } else {
      console.log('📝 Creating reviews table...\n');
      
      const createTableSQL = `
        CREATE TABLE reviews (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          rating TINYINT NOT NULL,
          comment TEXT NOT NULL,
          status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_at DATETIME DEFAULT NULL,
          INDEX idx_status_created (status, created_at)
        );
      `;

      await connection.execute(createTableSQL);
      console.log('✅ Reviews table created successfully!\n');
      
      // Show table structure
      const [columns] = await connection.execute('DESC reviews');
      console.log('📊 Table structure:');
      console.table(columns);
    }

    // Insert a test review to verify it works
    console.log('\n📝 Testing review insertion...');
    const testReview = {
      name: 'Test User',
      email: 'test@example.com',
      rating: 5,
      comment: 'This is a test review to verify the database is working correctly.',
    };

    const [result] = await connection.execute(
      'INSERT INTO reviews (name, email, rating, comment, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [testReview.name, testReview.email, testReview.rating, testReview.comment, 'pending']
    );

    console.log('✅ Test review inserted successfully!');
    console.log('   Review ID:', result.insertId);

    // Fetch and display the test review
    const [rows] = await connection.execute('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
    if (rows.length > 0) {
      console.log('✅ Review retrieved successfully:');
      console.table(rows[0]);
      
      // Clean up: delete the test review
      await connection.execute('DELETE FROM reviews WHERE id = ?', [result.insertId]);
      console.log('✅ Test review cleaned up\n');
    }

    console.log('✅ All database operations completed successfully!');
    console.log('📝 The reviews system is ready to use.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('   Error Code:', error.code);
    }
    if (error.errno) {
      console.error('   MySQL Error Number:', error.errno);
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

initReviewsTable();
