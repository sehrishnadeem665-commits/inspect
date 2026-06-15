const mysql = require('mysql2/promise');

async function checkReviewsTable() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'carvertical',
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
    });

    const conn = await pool.getConnection();

    console.log('📋 Checking reviews table structure:');
    const [tables] = await conn.execute(
      `SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_NAME = 'reviews' AND TABLE_SCHEMA = 'carvertical'`
    );

    if (tables[0].count === 0) {
      console.error('❌ reviews table does not exist!');
      console.log('\nCreating reviews table...');
      
      await conn.execute(`
        CREATE TABLE reviews (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          rating TINYINT NOT NULL,
          comment TEXT NOT NULL,
          status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_at DATETIME DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      
      console.log('✅ reviews table created successfully');
    } else {
      console.log('✅ reviews table exists');
      
      // Check table structure
      const [columns] = await conn.execute(
        `SELECT COLUMN_NAME, COLUMN_TYPE, COLUMN_KEY, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'reviews' AND TABLE_SCHEMA = 'carvertical' ORDER BY ORDINAL_POSITION`
      );
      
      columns.forEach(col => {
        console.log(`  ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${col.COLUMN_KEY ? '[' + col.COLUMN_KEY + ']' : ''} ${col.EXTRA || ''}`);
      });

      // Check if id has AUTO_INCREMENT
      const idColumn = columns.find(c => c.COLUMN_NAME === 'id');
      if (!idColumn?.EXTRA?.includes('auto_increment')) {
        console.error('❌ id column does not have AUTO_INCREMENT!');
        console.log('Fixing the table...');
        
        // Drop and recreate
        await conn.execute('DROP TABLE reviews');
        await conn.execute(`
          CREATE TABLE reviews (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            rating TINYINT NOT NULL,
            comment TEXT NOT NULL,
            status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            approved_at DATETIME DEFAULT NULL
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        
        console.log('✅ reviews table fixed with AUTO_INCREMENT');
      }

      // Test insert
      console.log('\n🔄 Testing insert...');
      const [result] = await conn.execute(
        `INSERT INTO reviews (name, email, rating, comment) VALUES (?, ?, ?, ?)`,
        ['Test User', 'test@example.com', 5, 'Great service!']
      );

      console.log(`✅ Insert successful! insertId: ${result.insertId}`);
      
      // Clean up
      await conn.execute('DELETE FROM reviews WHERE id = ?', [result.insertId]);
      console.log('✅ Test data cleaned up');
    }

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkReviewsTable();
