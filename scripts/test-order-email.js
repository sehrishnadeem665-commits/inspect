/*
Node script to create a test order and list recent emails from /api/emails.
Usage (run the dev server locally first):
  node scripts/test-order-email.js

Optional env vars:
  BASE_URL - default http://localhost:3000
  ADMIN_SECRET - if set, will be used to authorize /api/emails
*/

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

async function main() {
  const orderPayload = {
    customer_email: 'test-user@example.com',
    vehicle_type: 'car',
    identification_type: 'vin',
    identification_value: '1HGCM82633A004352',
    package_type: 'basic',
    country_code: 'US',
    currency: 'USD',
    amount: 9.99,
    paymentProvider: 'ethereal-test',
  }

  console.log('Creating test order...')
  const createResp = await fetch(`${BASE_URL}/api/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  })

  const createJson = await createResp.json()
  console.log('Create order response:', createResp.status, createJson)

  // Wait a little for async email tasks to run
  await new Promise((r) => setTimeout(r, 1200))

  console.log('\nFetching recent emails (outbox)...')
  const emailsResp = await fetch(`${BASE_URL}/api/emails?limit=20`, {
    headers: ADMIN_SECRET ? { Authorization: `Bearer ${ADMIN_SECRET}` } : {},
  })
  const emailsJson = await emailsResp.json()
  console.log('Emails response:', emailsResp.status)
  if (emailsJson && emailsJson.emails) {
    console.log('\nRecent email outbox (first 10):')
    emailsJson.emails.slice(0, 10).forEach((e, i) => {
      console.log(`\n[${i}] id=${e.id} to=${e.to_address} provider=${e.provider} status=${e.status} preview=${e.preview_url || ''} error=${e.error_message || ''} created_at=${e.created_at}`)
    })
  } else {
    console.log('No emails returned or /api/emails responded with:', emailsJson)
  }
}

main().catch((err) => {
  console.error('Error running test-order-email:', err)
  process.exit(1)
})
