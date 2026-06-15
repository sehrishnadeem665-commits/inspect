#!/usr/bin/env node
const http = require('http');

const data = JSON.stringify({
  priceId: 'pri_01kg4gy97s9knjqxs7nw1t7dyy'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/payments/paddle/create',
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
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      console.log('Parsed:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('(Not JSON)');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

console.log('Sending request to POST /api/payments/paddle/create');
console.log('Request body:', data);
console.log('---');

req.write(data);
req.end();
