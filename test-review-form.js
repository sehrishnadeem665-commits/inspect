const mysql = require('mysql2/promise');

async function testReviewForm() {
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

    console.log('🔄 Testing Review Form Workflow\n');

    // Test 1: Insert a review
    console.log('📝 Test 1: Inserting a new review...');
    const [result] = await conn.execute(
      `INSERT INTO reviews (name, email, rating, comment, status) VALUES (?, ?, ?, ?, ?)`,
      ['John Doe', 'john@example.com', 5, 'Excellent service! Highly recommend AutoRevealed.', 'pending']
    );

    const reviewId = result.insertId;
    console.log(`✅ Review inserted with ID: ${reviewId}`);

    // Test 2: Verify insert
    console.log('\n📋 Test 2: Verifying review was inserted...');
    const [reviews] = await conn.execute(
      `SELECT * FROM reviews WHERE id = ?`,
      [reviewId]
    );

    if (reviews.length > 0) {
      const review = reviews[0];
      console.log(`✅ Review retrieved:`);
      console.log(`   Name: ${review.name}`);
      console.log(`   Email: ${review.email}`);
      console.log(`   Rating: ${review.rating}/5`);
      console.log(`   Comment: ${review.comment}`);
      console.log(`   Status: ${review.status}`);
    } else {
      console.error('❌ Review not found!');
    }

    // Test 3: Fetch all reviews
    console.log('\n📋 Test 3: Fetching all reviews...');
    const [allReviews] = await conn.execute('SELECT * FROM reviews ORDER BY created_at DESC');
    console.log(`✅ Total reviews in database: ${allReviews.length}`);

    // Test 4: Approve a review
    console.log('\n📝 Test 4: Approving review...');
    await conn.execute(
      `UPDATE reviews SET status = ?, approved_at = NOW() WHERE id = ?`,
      ['approved', reviewId]
    );
    console.log('✅ Review approved');

    // Test 5: Verify approval
    const [approvedReview] = await conn.execute(
      `SELECT * FROM reviews WHERE id = ?`,
      [reviewId]
    );
    console.log(`✅ Review status: ${approvedReview[0].status}`);

    // Clean up
    console.log('\n🧹 Cleaning up test data...');
    await conn.execute('DELETE FROM reviews WHERE id = ?', [reviewId]);
    console.log('✅ Test data cleaned up');

    console.log('\n✅ Review form workflow test complete!');

    conn.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testReviewForm();
