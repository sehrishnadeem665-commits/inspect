#!/usr/bin/env node

// Test script: sends a test email using an Ethereal test account and prints the Preview URL.
// Usage: node scripts/test-ethereal.js [to_email]

const nodemailer = require('nodemailer')

async function main() {
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })

  const to = process.argv[2] || testAccount.user

  const info = await transporter.sendMail({
    from: `Vehicle Reports <${testAccount.user}>`,
    to,
    subject: 'Test email (Ethereal)',
    html: '<p>This is a test email sent via Ethereal from scripts/test-ethereal.js</p>',
  })

  console.log('Message sent, id:', info.messageId)
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})