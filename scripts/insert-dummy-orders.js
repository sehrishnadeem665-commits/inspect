const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carvertical',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function insertDummyOrders() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Database connected\n');

    // Test data templates
    const dummyOrders = [
      {
        order_number: `ORD-${Date.now()}-001`,
        customer_email: 'test1@example.com',
        vehicle_type: 'car',
        identification_type: 'vin',
        identification_value: '5TDJKRFH4LS123456',
        vin_number: '5TDJKRFH4LS123456',
        package_type: 'basic',
        country_code: 'US',
        state: 'California',
        currency: 'USD',
        amount: 29.99,
        payment_status: 'completed',
        payment_provider: 'paypal',
        payment_id: 'PAY-' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
      },
      {
        order_number: `ORD-${Date.now()}-002`,
        customer_email: 'test2@example.com',
        vehicle_type: 'truck',
        identification_type: 'vin',
        identification_value: '1GCEC14X62F123456',
        vin_number: '1GCEC14X62F123456',
        package_type: 'standard',
        country_code: 'US',
        state: 'Texas',
        currency: 'USD',
        amount: 49.99,
        payment_status: 'completed',
        payment_provider: 'paypal',
        payment_id: 'PAY-' + Math.random().toString(36).substr(2, 9),
        status: 'processing',
      },
      {
        order_number: `ORD-${Date.now()}-003`,
        customer_email: 'test3@example.com',
        vehicle_type: 'car',
        identification_type: 'plate',
        identification_value: 'ABC123XYZ',
        package_type: 'premium',
        country_code: 'US',
        state: 'New York',
        currency: 'USD',
        amount: 99.99,
        payment_status: 'completed',
        payment_provider: 'paypal',
        payment_id: 'PAY-' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
      },
      {
        order_number: `ORD-${Date.now()}-004`,
        customer_email: 'test4@example.com',
        vehicle_type: 'car',
        identification_type: 'vin',
        identification_value: '3G5DA03E14S567890',
        vin_number: '3G5DA03E14S567890',
        package_type: 'basic',
        country_code: 'US',
        state: 'Florida',
        currency: 'USD',
        amount: 29.99,
        payment_status: 'completed',
        payment_provider: 'paypal',
        payment_id: 'PAY-' + Math.random().toString(36).substr(2, 9),
        status: 'refunded',
      },
      {
        order_number: `ORD-${Date.now()}-005`,
        customer_email: 'test5@example.com',
        vehicle_type: 'suv',
        identification_type: 'vin',
        identification_value: '2T1BURFE0JC107429',
        vin_number: '2T1BURFE0JC107429',
        package_type: 'standard',
        country_code: 'US',
        state: 'Colorado',
        currency: 'USD',
        amount: 49.99,
        payment_status: 'pending',
        payment_provider: 'paypal',
        payment_id: null,
        status: 'pending',
      },
    ];

    // Insert orders
    console.log('📝 Inserting dummy orders...\n');
    for (const order of dummyOrders) {
      const sql = `
        INSERT INTO orders (
          order_number, customer_email, vehicle_type, identification_type,
          identification_value, vin_number, package_type, country_code, state,
          currency, amount, payment_status, payment_provider, payment_id, status,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        order.order_number,
        order.customer_email,
        order.vehicle_type,
        order.identification_type,
        order.identification_value,
        order.vin_number,
        order.package_type,
        order.country_code,
        order.state,
        order.currency,
        order.amount,
        order.payment_status,
        order.payment_provider,
        order.payment_id,
        order.status,
      ];

      try {
        await conn.execute(sql, values);
        console.log(`✅ Inserted: ${order.order_number}`);
        console.log(`   Email: ${order.customer_email}`);
        console.log(`   Amount: $${order.amount}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Payment: ${order.payment_status}\n`);
      } catch (err) {
        console.error(`❌ Error inserting ${order.order_number}:`, err.message);
      }
    }

    // Show what we inserted
    console.log('\n📊 Verification - All Orders:');
    console.log('=====================================\n');

    const [rows] = await conn.execute(
      'SELECT order_number, customer_email, amount, status, payment_status FROM orders ORDER BY created_at DESC LIMIT 10'
    );

    if (rows.length > 0) {
      rows.forEach((row) => {
        console.log(`Order: ${row.order_number}`);
        console.log(`  Email: ${row.customer_email}`);
        console.log(`  Amount: $${row.amount}`);
        console.log(`  Status: ${row.status}`);
        console.log(`  Payment: ${row.payment_status}\n`);
      });
    }

    // Stats
    const [stats] = await conn.execute(
      `SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status='refunded' THEN 1 ELSE 0 END) as refunded,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) as processing,
        SUM(amount) as total_revenue
       FROM orders`
    );

    console.log('\n📈 Order Statistics:');
    console.log('=====================================');
    console.log(`Total Orders: ${stats[0].total_orders}`);
    console.log(`Completed: ${stats[0].completed}`);
    console.log(`Refunded: ${stats[0].refunded}`);
    console.log(`Pending: ${stats[0].pending}`);
    console.log(`Processing: ${stats[0].processing}`);
    console.log(`Total Revenue: $${stats[0].total_revenue?.toFixed(2) || '0.00'}\n`);

    console.log('✅ Dummy orders inserted successfully!');
    console.log('\n🔗 Next Steps:');
    console.log('1. Go to http://localhost:3000/admin/login');
    console.log('2. Login with: autorevealed.com@gmail.com / Auto12345@');
    console.log('3. Check Dashboard to see orders and stats\n');

  } catch (error) {
    console.error('❌ Error:', error.message || error);
    console.error('Stack:', error.stack);
  } finally {
    if (conn) conn.release();
    await pool.end();
  }
}

// Run the script
insertDummyOrders().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

