#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;

console.log('🔍 PayPal Credentials Test - Testing Both SANDBOX and PRODUCTION\n');

const modes = [
  { name: 'SANDBOX', url: 'https://api.sandbox.paypal.com' },
  { name: 'PRODUCTION', url: 'https://api.paypal.com' }
];

async function testMode(mode) {
  console.log(`\n📝 Testing ${mode.name} mode...`);
  console.log(`URL: ${mode.url}\n`);

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    const response = await fetch(`${mode.url}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ Failed: ${errorData.error_description || response.statusText}`);
      return false;
    }

    const tokenData = await response.json();
    console.log(`✅ SUCCESS! Token obtained (expires in ${tokenData.expires_in}s)`);
    console.log(`\n✨ Use this setting in .env.local:`);
    console.log(`PAYPAL_MODE=${mode.name.toLowerCase()}`);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let foundWorking = false;
  
  for (const mode of modes) {
    const success = await testMode(mode);
    if (success) {
      foundWorking = true;
    }
  }

  if (!foundWorking) {
    console.log('\n❌ Neither SANDBOX nor PRODUCTION credentials work.');
    console.log('\n💡 This means:');
    console.log('   1. Your credentials are invalid or revoked');
    console.log('   2. Your PayPal account may have issues');
    console.log('\n👉 Next steps:');
    console.log('   1. Go to: https://developer.paypal.com/dashboard/');
    console.log('   2. Create or view an app');
    console.log('   3. Generate NEW Client ID and Secret Key');
    console.log('   4. Update your .env.local file');
    console.log('   5. Run this test again');
  }
}

runTests().catch(console.error);
