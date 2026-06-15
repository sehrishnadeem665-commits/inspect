/*
Quick script to call GET /api/send-email/trigger to send an email using the server-side sendEmail function.
Usage (dev server must be running):
  node scripts/test-send-email-trigger.js

Optional env vars:
  BASE_URL (defaults to http://localhost:3000)
  TO (overrides default recipient)
*/

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const to = process.env.TO || 'sehrishnadeem39@gmail.com'

async function main() {
  const subject = encodeURIComponent('Test Email from AutoRevealed')
  const html = encodeURIComponent('<h1>This is a test email from AutoRevealed</h1>')
  const url = `${BASE_URL}/api/send-email/trigger?to=${to}&subject=${subject}&html=${html}`
  console.log('Calling', url)
  const res = await fetch(url)
  const json = await res.json()
  console.log('Response:', res.status, json)
}

main().catch(err => { console.error(err); process.exit(1) })
