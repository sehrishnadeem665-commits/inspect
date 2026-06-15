/*
Simple SMTP test script using nodemailer. Configure credentials via environment variables or edit directly.
Usage:
  npm install nodemailer
  node scripts/test-smtp.js

Environment variables (recommended):
  SMTP_HOST (default smtp.gmail.com)
  SMTP_PORT (default 465)
  SMTP_USER
  SMTP_PASS
  SMTP_SECURE (true/false)
*/

const nodemailer = require('nodemailer')

async function testSMTP() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465
  const secure = (process.env.SMTP_SECURE || 'true').toLowerCase() === 'true'
  const user = process.env.SMTP_USER || 'info@autorevealed.com'
  const pass = process.env.SMTP_PASS || 'your_app_password_here'
  const from = process.env.EMAIL_FROM || '"Vehicle Reports" <info@autorevealed.com>'
  const to = process.env.TO || 'sehrishnadeem39@gmail.com'

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  })

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'SMTP Test Email',
      html: '<h1>SMTP Test Email</h1><p>If you see this, SMTP works!</p>'
    })
    console.log('Email sent:', info)
  } catch (err) {
    console.error('SMTP error:', err)
  }
}

if (require.main === module) {
  testSMTP().catch(err => { console.error(err); process.exit(1) })
}

module.exports = { testSMTP }