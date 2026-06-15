/*
Simple script to test /api/send-email endpoint. It will POST an admin notification and a customer confirmation.
Usage: node scripts/send-test-email.js
Set BASE_URL if your dev server runs on a non-default host.
*/

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function send(type, payload) {
  const res = await fetch(`${BASE_URL}/api/send-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...payload }),
  })
  const json = await res.json().catch(() => null)
  console.log(`Sent ${type} -> status=${res.status}`, json)
  return { res, json }
}

async function main() {
  console.log('Sending admin notification (server will deliver to ADMIN_EMAIL)')
  await send('order_notification', {
    orderId: 12345,
    orderNumber: 'TEST-12345',
    customerEmail: 'test-user@example.com',
    packageType: 'basic',
    amount: 9.99,
    currency: 'USD',
    paymentStatus: 'pending',
  })

  console.log('\nSending customer confirmation (delivered to customerEmail)')
  await send('order_confirmation', {
    orderId: 12345,
    orderNumber: 'TEST-12345',
    customerEmail: 'test-user@example.com',
    packageType: 'basic',
    amount: 9.99,
    currency: 'USD',
    paymentStatus: 'pending',
  })

  console.log('\nDone')
}

main().catch(err => { console.error(err); process.exit(1) })