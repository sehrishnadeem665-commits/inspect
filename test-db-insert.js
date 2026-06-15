const pool = require('./lib/mysql').default;

async function testInsert() {
  try {
    console.log('Testing vehicle registration insert...')
    
    const [result] = await pool.execute(
      `INSERT INTO vehicle_registrations (
        registration_number, owner_name, owner_email, vehicle_title, 
        vehicle_year, vehicle_make, vehicle_model, vehicle_type, 
        description, price, currency, images_json, 
        approval_status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'TEST-001',
        'Test User',
        'test@example.com',
        'Test Vehicle',
        '2020',
        'Toyota',
        'Camry',
        'Sedan',
        'A test vehicle',
        '10000',
        'USD',
        JSON.stringify([]),
        'pending',
        'pending'
      ]
    )
    
    console.log('Insert successful!')
    console.log('Result:', result)
    console.log('Insert ID:', result.insertId)
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

testInsert()
