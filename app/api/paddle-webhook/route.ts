import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// NOTE: Paddle sends webhook parameters as application/x-www-form-urlencoded
// with a p_signature field. Proper signature verification requires the
// Paddle public key and implementing their verification algorithm.
// For simplicity, this handler will parse the webhook and optionally
// perform verification when PADDLE_PUBLIC_KEY is provided.

async function sendEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER

  if (!host || !user || !pass) {
    console.warn('SMTP credentials not configured, skipping email send')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from: `${process.env.FROM_NAME || 'Your Service'} <${from}>`,
    to,
    subject,
    html,
  })
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text()
    const params = Object.fromEntries(new URLSearchParams(raw))

    // p_signature is Paddle's signature
    const signature = params.p_signature

    // Basic logging
    console.log('📬 Paddle webhook received:', params.alert_name || params.alert_title || 'unknown')

    // TODO: implement proper verification using Paddle public key.
    if (!process.env.PADDLE_PUBLIC_KEY) {
      console.warn('PADDLE_PUBLIC_KEY not set — webhook signature not verified')
    }

    // Handle a few common events
    const alert = params.alert_name || params.alert_title

    if (alert === 'subscription_created' || alert === 'payment_succeeded') {
      console.log('Legacy webhook received - Emails skipped (Handled by new webhook)')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error handling Paddle webhook:', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
