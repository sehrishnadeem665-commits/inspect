// scripts/generateSandboxToken.js
// Generate a Paddle sandbox client token (ctok_) using server-side API key.
// Usage: node scripts/generateSandboxToken.js

const dotenv = require('dotenv');
// Prefer loading .env.local when present in Next.js projects
dotenv.config({ path: '.env.local' });

async function generateSandboxClientToken() {
  try {
    // Vendor ID is required by Paddle for this endpoint. It may be provided
    // via environment variable PADDLE_VENDOR_ID or as a CLI argument --vendor=ID.
    const argvVendor = process.argv.find((a) => a.startsWith('--vendor='));
    const vendorArg = argvVendor ? argvVendor.split('=')[1] : undefined;
    const vendorId = process.env.PADDLE_VENDOR_ID || vendorArg;
    const vendorAuth = process.env.PADDLE_API_KEY;

    if (!vendorAuth) {
      console.error('Missing PADDLE_API_KEY in .env.local');
      process.exit(1);
    }

    if (!vendorId) {
      console.error('\n❌ Missing vendor ID. Paddle requires a vendor_id for client token generation.');
      console.error('Provide one of:');
      console.error(" - Set PADDLE_VENDOR_ID in .env.local");
      console.error(" - Or pass --vendor=YOUR_VENDOR_ID to this script");
      console.error('\nYou can find your Vendor ID in the Paddle Sandbox dashboard under Developer -> Account or Credentials.');
      process.exit(1);
    }

    const params = new URLSearchParams();
    params.append('vendor_id', vendorId);
    params.append('vendor_auth_code', vendorAuth);

    const res = await fetch('https://vendors.paddle.com/api/2.0/client/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const json = await res.json();
    console.log('HTTP', res.status);
    console.log(JSON.stringify(json, null, 2));

    if (json && (json.response?.client_token || json.response?.client_token)) {
      const token = json.response.client_token || json.response.client_token;
      console.log('\n✅ Sandbox client token (ctok_...):', token);
      console.log('\nCopy this into your .env.local:');
      console.log('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=' + token);
      console.log('NEXT_PUBLIC_PADDLE_ENV=sandbox');
    } else if (json && json.success === false) {
      console.error('\n❌ Paddle responded with error:', JSON.stringify(json, null, 2));
    } else {
      console.error('\n❌ Unexpected response:', JSON.stringify(json, null, 2));
    }
  } catch (err) {
    console.error('❌ Error generating client token:', err);
  }
}

generateSandboxClientToken();
