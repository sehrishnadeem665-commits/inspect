const http = require('http');

const data = JSON.stringify({
  customerEmail: 'sehrishnadeem39@gmail.com',
  customerName: 'Sehrish Test User',
  orderId: 'ORD-TEST-001',
  amount: 29.99,
  currency: 'USD',
  packageName: 'Premium Report',
  vehicleIdentifier: 'ABC1234VIN'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/test-payment-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ Response Status:', res.statusCode);
    console.log('✅ Response Data:');
    try {
      console.log(JSON.stringify(JSON.parse(responseData), null, 2));
    } catch (e) {
      console.log(responseData);
    }
    console.log('\n📧 Emails sent to:');
    console.log('   ✓ Customer: sehrishnadeem39@gmail.com');
    console.log('   ✓ Admin: autorevealed.com@gmail.com');
    console.log('\n⏰ Check your inbox in 2-5 minutes');
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  console.log('\n⚠️  Make sure your Next.js dev server is running:');
  console.log('   npm run dev');
});

console.log('📤 Sending test payment email...');
req.write(data);
req.end();
