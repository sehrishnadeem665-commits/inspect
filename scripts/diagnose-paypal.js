#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'production'
  ? 'https://api.paypal.com'
  : 'https://api.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;

console.log('🔍 PayPal Integration Diagnostic Tool\n');

// Check environment variables
console.log('📋 Checking environment variables...');
console.log(`✓ PAYPAL_MODE: ${process.env.PAYPAL_MODE || 'not set'}`);
console.log(`✓ PAYPAL_API_URL: ${PAYPAL_API_URL}`);
console.log(`✓ Client ID: ${PAYPAL_CLIENT_ID ? '✓ Set' : '❌ NOT SET'}`);
console.log(`✓ Secret Key: ${PAYPAL_SECRET ? '✓ Set' : '❌ NOT SET'}`);
console.log(`✓ ADMIN_PAYMENT_EMAIL: ${process.env.ADMIN_PAYMENT_EMAIL || '❌ NOT SET'}`);
console.log(`✓ PAYPAL_MERCHANT_ID: ${process.env.PAYPAL_MERCHANT_ID || '❌ NOT SET'}`);
console.log(`✓ NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL || '❌ NOT SET'}`);

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  console.error('\n❌ Error: Missing PayPal credentials!');
  process.exit(1);
}

// Test PayPal API Connection
async function testPayPalConnection() {
  console.log('\n🧪 Testing PayPal API Connection...\n');

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    console.log('📝 Attempting to get access token...');
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    console.log(`Response Status: ${tokenResponse.status} ${tokenResponse.statusText}`);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('❌ Failed to get access token!');
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      return false;
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Successfully obtained access token!');
    console.log(`Token expires in: ${tokenData.expires_in} seconds`);

    // Test creating an order
    console.log('\n📝 Testing order creation...');
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `TEST-${Date.now()}`,
            amount: {
              currency_code: 'USD',
              value: '99.99',
            },
            description: 'Test Order - Basic Report',
            payee: {
              email_address: process.env.ADMIN_PAYMENT_EMAIL,
              merchant_id: process.env.PAYPAL_MERCHANT_ID,
            },
          },
        ],
        payer: {
          email_address: 'test@example.com',
        },
        application_context: {
          brand_name: 'AutoRevealed',
          locale: 'en-US',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
        },
      }),
    });

    console.log(`Response Status: ${orderResponse.status} ${orderResponse.statusText}`);

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json().catch(() => ({}));
      console.error('❌ Failed to create test order!');
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      return false;
    }

    const orderData = await orderResponse.json();
    console.log('✅ Successfully created test order!');
    console.log(`Order ID: ${orderData.id}`);
    console.log(`Status: ${orderData.status}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    return false;
  }
}

// Run diagnostics
testPayPalConnection().then(success => {
  if (success) {
    console.log('\n✅ All PayPal tests passed! Your integration appears to be working.');
  } else {
    console.log('\n❌ PayPal integration has issues. Check the errors above.');
  }
  process.exit(success ? 0 : 1);
});
