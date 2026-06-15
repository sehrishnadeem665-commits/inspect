Development & Email testing (Ethereal / MailHog / Resend / SMTP)

Overview
- The project supports sending email via SMTP (Nodemailer), Resend API (recommended for production), and a development fallback using Ethereal.

Local dev options
1) Ethereal (no signup)
- Automatically used by the server when no SMTP or Resend API is configured *and* NODE_ENV !== 'production'.
- It creates a test SMTP account and prints a Preview URL in server logs (and the API response message field).
- You can use the included script to send a test Ethereal message locally:
  node scripts/test-ethereal.js you@yourdomain.com

2) MailHog / smtp4dev (local inbox)
- Run MailHog (Docker):
  docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog
- Set these env vars for the local server (no auth required):
  SMTP_HOST=localhost
  SMTP_PORT=1025
- Then invoke an action that triggers an email (e.g., create an order); MailHog UI will show the message at http://localhost:8025

3) Gmail SMTP (free)
- You can use a Gmail account to send emails via SMTP (free). For best reliability, set up an App Password (recommended when 2FA is enabled).
- Steps:
  1. Create or use an existing Gmail account.
  2. If your Google account has 2-Step Verification enabled, create an App Password and use it as `SMTP_PASS` (https://myaccount.google.com/apppasswords).
  3. If you do not have 2FA, Google may block login from less secure apps; App Password is the preferred path.
- Example env vars to set:
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_USER=yourgmail@gmail.com
  SMTP_PASS=your_app_password
  SMTP_SECURE=true  # true for port 465, false for 587
  EMAIL_FROM="Vehicle Reports <yourgmail@gmail.com>"
  ADMIN_EMAIL=sehrishnadeem39@gmail.com
- To test immediately, run the server and use the helper script `node scripts/send-test-email.js` (see below).

Production options
- Resend (API): set RESEND_API_KEY to your Resend API key. The app posts to Resend automatically.
- SendGrid / Mailgun (free tiers): either provide SMTP credentials via SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS or use their API + configure RESEND_API_KEY-equivalent.
- Ensure `EMAIL_FROM` and `ADMIN_EMAIL` are set to valid addresses (and verify domains if required by provider).

Testing the running server
- To test the app endpoint directly (replace host if deployed):
  curl -X POST http://localhost:3000/api/send-email \
    -H "Content-Type: application/json" \
    -d '{"type":"order_notification","orderNumber":"TEST-123","customerEmail":"you@example.com","packageType":"basic","amount":9.99,"currency":"USD"}'

Notes
- Creating an order triggers both an administrative `order_notification` email (to `ADMIN_EMAIL`) and a customer `order_confirmation` email.
- When Ethereal is used, the send endpoint will return JSON { success: true, message: "<preview-url>" }. Check server logs for the `Preview URL` message.
- You can view all sent/queued emails via the new endpoint `/api/emails`. If `ADMIN_SECRET` is set, call it with header `Authorization: Bearer <ADMIN_SECRET>`. Otherwise the endpoint is only available in non-production.
- A helper script is included to create a test order and inspect the outbox: `node scripts/test-order-email.js` (run with the dev server running). It will create a sample order with `customer_email: test-user@example.com` and then list recent outbox rows so you can confirm both the admin notification and the customer confirmation were created.
- For production deliverability, use a real provider (Resend, SendGrid, Mailgun) and a verified sending domain.
