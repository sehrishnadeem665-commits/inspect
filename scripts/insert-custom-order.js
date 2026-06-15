const mysql = require('mysql2/promise');
const readline = require('readline');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carvertical',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Readline interface for interactive input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function insertCustomOrder() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('✅ Database connected\n');

    console.log('📝 Creating Custom Order\n');
    console.log('=====================================\n');

    // Get input from user
    const customer_email = await question('Customer Email: ');
    const vehicle_type = await question('Vehicle Type (car/truck/suv/bike): ');
    const identification_type = await question('ID Type (vin/plate): ');
    const identification_value = await question('ID Value (VIN or Plate): ');
    const package_type = await question('Package (basic/standard/premium): ');
    const amount = parseFloat(await question('Amount ($): '));
    const currency = await question('Currency (USD/EUR/GBP): ') || 'USD';
    const status = await question(
      'Order Status (pending/processing/completed/refunded/cancelled): '
    );
    const payment_status = await question('Payment Status (pending/completed/failed): ');

    const order_number = `ORD-${Date.now()}-${Math.random().toString().substr(2, 4)}`;
    const country_code = 'US'; // Default
    const state = await question('State (optional): ') || 'California';
    const payment_id = payment_status === 'completed' ? 'PAY-' + Math.random().toString(36).substr(2, 9) : null;
    const vin_number = identification_type === 'vin' ? identification_value : null;

    console.log('\n📋 Order Summary:');
    console.log('=====================================');
    console.log(`Order Number: ${order_number}`);
    console.log(`Email: ${customer_email}`);
    console.log(`Vehicle: ${vehicle_type}`);
    console.log(`ID: ${identification_type} - ${identification_value}`);
    console.log(`Package: ${package_type}`);
    console.log(`Amount: $${amount} ${currency}`);
    console.log(`Order Status: ${status}`);
    console.log(`Payment Status: ${payment_status}`);
    console.log(`State: ${state}`);
    console.log('=====================================\n');

    const confirm = await question('Insert this order? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Order creation cancelled');
      rl.close();
      return;
    }

    // Insert order
    const sql = `
      INSERT INTO orders (
        order_number, customer_email, vehicle_type, identification_type,
        identification_value, vin_number, package_type, country_code, state,
        currency, amount, payment_status, payment_provider, payment_id, status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      order_number,
      customer_email,
      vehicle_type,
      identification_type,
      identification_value,
      vin_number,
      package_type,
      country_code,
      state,
      currency,
      amount,
      payment_status,
      'paypal',
      payment_id,
      status,
    ];

    await conn.execute(sql, values);

    console.log('\n✅ Order inserted successfully!');
    console.log(`\nOrder Number: ${order_number}`);
    console.log(`Email: ${customer_email}`);
    console.log(`Amount: $${amount} ${currency}`);
    console.log(`Status: ${status} (Payment: ${payment_status})\n`);

    // Show latest orders
    const [rows] = await conn.execute(
      'SELECT order_number, customer_email, amount, status, payment_status FROM orders ORDER BY created_at DESC LIMIT 5'
    );

    console.log('\n📊 Latest 5 Orders:');
    console.log('=====================================');
    rows.forEach((row, index) => {
      console.log(
        `${index + 1}. ${row.order_number} | ${row.customer_email} | $${row.amount} | ${row.status} (${row.payment_status})`
      );
    });
    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (conn) conn.release();
    rl.close();
    await pool.end();
  }
}

// Run the script
insertCustomOrder().catch(console.error);
