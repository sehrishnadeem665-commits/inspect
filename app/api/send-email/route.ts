import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import { getTranslationsForLang } from '@/lib/translations'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sehrishnadeem39@gmail.com'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''

function generateOrderNotificationEmail(data: any, lang = 'en'): string {
  const t = getTranslationsForLang(lang)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
  const orderLink = `${baseUrl}/admin/dashboard/orders/${data.orderId}`
  return `<!DOCTYPE html><html><body>
    <h1>${t['email_new_order'] || 'New Order Received'}</h1>
    <p><strong>${t['email_order_number'] || 'Order Number'}:</strong> ${data.orderNumber}</p>
    <p><strong>${t['email_customer'] || 'Customer'}:</strong> ${data.customerEmail}</p>
    <p><strong>${t['email_package'] || 'Package'}:</strong> ${data.packageType}</p>
    <p><strong>${t['email_amount'] || 'Amount'}:</strong> ${data.currency} ${Number(data.amount).toFixed(2)}</p>
    <p><strong>${t['email_payment_status'] || 'Payment status'}:</strong> ${data.paymentStatus || 'pending'}</p>
    <p><a href="${orderLink}">View order in admin</a></p>
    </body></html>`
}

function generateOrderConfirmationEmail(data: any, lang = 'en'): string {
  const t = getTranslationsForLang(lang)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
  const checkoutLink = `${baseUrl}/checkout/${data.orderId}`
  return `<!DOCTYPE html><html><body>
    <h1>${t['email_order_confirmed'] || 'Order Confirmed'}</h1>
    <p><strong>${t['email_order_number'] || 'Order Number'}:</strong> ${data.orderNumber}</p>
    <p><strong>${t['email_product'] || 'Product'}:</strong> ${data.packageType} ${t['email_report'] || 'Report'}</p>
    <p><strong>${t['email_amount_paid'] || 'Amount Paid'}:</strong> ${data.currency} ${Number(data.amount).toFixed(2)}</p>
    <p>${t['email_thanks'] || 'Thank you for your purchase! You can view your order or continue to checkout below.'}</p>
    <p><a href="${checkoutLink}">${t['email_view_order'] || 'View order / Continue to checkout'}</a></p>
    </body></html>`
}

function generateContactFormEmail(data: any, lang = 'en'): string {
  const t = getTranslationsForLang(lang)
  return `<!DOCTYPE html><html><body><h1>${t['email_contact_submission'] || 'Contact Form Submission'}</h1><p>${t['email_name'] || 'Name'}: ${data.name}</p><p>${t['email_email'] || 'Email'}: ${data.email}</p><p>${t['email_subject'] || 'Subject'}: ${data.subject}</p><pre>${data.message}</pre></body></html>`
}

function generateReviewNotificationEmail(data: any, lang = 'en'): string {
  const t = getTranslationsForLang(lang)
  return `<!DOCTYPE html><html><body><h1>${t['email_review_submitted'] || 'New Review Submitted'}</h1><p>${t['email_name'] || 'Name'}: ${data.name}</p><p>${t['email_email'] || 'Email'}: ${data.email}</p><p>${t['email_rating'] || 'Rating'}: ${data.rating}</p><p>${t['email_comment'] || 'Comment'}:</p><pre>${data.comment}</pre><p>${t['email_submitted_at'] || 'Submitted at'}: ${data.createdAt}</p></body></html>`
}

function generatePaymentSuccessAdminEmail(data: any): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #22c55e;">Payment Successful! 🥳</h2>
      <p>Hello Admin,</p>
      <p>A new payment has been received for a vehicle history report via <strong>True Inspectify</strong>.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Payment Details:</h3>
        <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${data.transactionId || 'N/A'}</p>
        <p style="margin: 8px 0;"><strong>Product:</strong> ${data.packageType || 'N/A'}</p>
        <p style="margin: 8px 0;"><strong>Amount:</strong> ${data.currency || 'USD'} ${Number(data.amount).toFixed(2)}</p>
        <p style="margin: 8px 0;"><strong>Customer Email:</strong> ${data.customerEmail}</p>
        <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${data.customerName || 'Valued Customer'}</p>
        <p style="margin: 8px 0;"><strong>VIN:</strong> ${data.vinNumber || data.identificationValue || 'N/A'}</p>
      </div>
      
      <p style="margin-top: 20px; color: #666; font-size: 14px;">The order has been marked as completed in the database for True Inspectify.</p>
    </div>
  `
}

function generatePaymentSuccessCustomerEmail(data: any): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #3b82f6;">Order Received - We're processing your report! 📄</h2>
      <p>Hello,</p>
      <p>Thank you for your purchase (Order: <strong>${data.orderNumber}</strong>). Your payment was successful.</p>
      
      <div style="background: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        <p style="margin: 0; color: #b08a5a; font-weight: bold;">Wait Time Notice:</p>
        <p style="margin: 5px 0 0 0; color: #b08a5a;">Your vehicle history report will be ready in approximately <strong>12 to 13 hours</strong>. We will send you a separate email with the full report once it has been generated.</p>
      </div>
      
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best Regards,<br/><strong>True Inspectify</strong></p>
    </div>
  `
}

export async function sendEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Prefer SMTP (Nodemailer) if configured
    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_SECURE = (process.env.SMTP_SECURE || 'false').toLowerCase() === 'true'

    const fromAddress = process.env.EMAIL_FROM || (SMTP_USER ? SMTP_USER : 'Vehicle Reports <no-reply@localhost>')

    if (SMTP_HOST) {
      try {
        // @ts-ignore - optional dependency, install Nodemailer to enable SMTP sending
        const nodemailer = await import('nodemailer') as any
        const transportOptions: any = {
          host: SMTP_HOST,
          port: SMTP_PORT || (SMTP_SECURE ? 465 : 587),
          secure: SMTP_SECURE,
        }
        // Support unauthenticated SMTP (e.g., MailHog) if SMTP_USER/PASS are not provided
        if (SMTP_USER && SMTP_PASS) {
          transportOptions.auth = { user: SMTP_USER, pass: SMTP_PASS }
        }

        const transporter = nodemailer.createTransport(transportOptions)

        const info = await transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html: htmlContent,
        })

        console.log('Email sent via SMTP:', info && (info.messageId || info.response))
        // Persist in outbox
        try {
          await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'smtp', null, 'sent'])
        } catch (e) {
          console.error('Failed to persist sent email to outbox (SMTP):', e)
        }
        return { success: true }
      } catch (smtpErr: any) {
        console.error('SMTP send failed:', smtpErr)
        // persist failure
        try {
          await pool.execute('INSERT INTO email_failures (to_address, subject, body, error_message, created_at) VALUES (?, ?, ?, ?, NOW())', [to, subject, htmlContent, String(smtpErr.message || smtpErr)])
        } catch (e) {
          console.error('Failed to log SMTP email failure to DB:', e)
        }
        // Also record as failed in outbox for visibility
        try {
          await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'smtp', null, 'failed', String(smtpErr.message || smtpErr)])
        } catch (e) {
          console.error('Failed to persist failed email to outbox (SMTP):', e)
        }
        // Fall back to Resend if available
      }
    }

    // Fallback: use Resend if API key is available
    if (RESEND_API_KEY) {
      let effectiveFrom = fromAddress

      // Prevent using the default placeholder domain if it's set in environment variables
      if (effectiveFrom.includes('inspectfax.com')) {
        effectiveFrom = 'Vehicle Reports <onboarding@resend.dev>'
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: effectiveFrom,
          to: [to],
          subject,
          html: htmlContent,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('Resend API error:', text)
        let errorMessage = text
        try {
          const json = JSON.parse(text)
          errorMessage = json.message || text
        } catch (e) {
          // Use raw text if parsing fails
        }
        // Persist failure for later inspection/retry
        try {
          await pool.execute('INSERT INTO email_failures (to_address, subject, body, error_message, created_at) VALUES (?, ?, ?, ?, NOW())', [to, subject, htmlContent, errorMessage])
        } catch (e) {
          console.error('Failed to log email failure to DB:', e)
        }
        // Also record as failed in outbox
        try {
          await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'resend', null, 'failed', String(errorMessage)])
        } catch (e) {
          console.error('Failed to persist failed email to outbox (Resend):', e)
        }
        return { success: false, message: errorMessage }
      }

      // Persist successful send to outbox
      try {
        await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'resend', null, 'sent'])
      } catch (e) {
        console.error('Failed to persist sent email to outbox (Resend):', e)
      }

      return { success: true }
    }

    // Dev fallback: use Ethereal test SMTP when no provider is configured and not in production
    if (!SMTP_HOST && !RESEND_API_KEY && (process.env.NODE_ENV || 'development') !== 'production') {
      try {
        // @ts-ignore - optional dependency
        const nodemailer = await import('nodemailer') as any
        const testAccount = await nodemailer.createTestAccount()
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        })

        const info = await transporter.sendMail({
          from: fromAddress && fromAddress !== 'Vehicle Reports <no-reply@localhost>' ? fromAddress : `Vehicle Reports <${testAccount.user}>`,
          to,
          subject,
          html: htmlContent,
        })

        const previewUrl = nodemailer.getTestMessageUrl(info)
        console.log('Email sent via Ethereal:', previewUrl || (info && (info.messageId || info.response)))
        // Persist preview to outbox
        try {
          await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'ethereal', previewUrl || null, 'preview'])
        } catch (e) {
          console.error('Failed to persist preview email to outbox (Ethereal):', e)
        }
        return { success: true, message: previewUrl || 'Ethereal preview created' }
      } catch (ethErr: any) {
        console.error('Ethereal send failed:', ethErr)
        try {
          await pool.execute('INSERT INTO email_failures (to_address, subject, body, error_message, created_at) VALUES (?, ?, ?, ?, NOW())', [to, subject, htmlContent, String(ethErr.message || ethErr)])
        } catch (e) {
          console.error('Failed to log Ethereal email failure to DB:', e)
        }
        // Also record as failed in outbox
        try {
          await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, error_message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'ethereal', null, 'failed', String(ethErr.message || ethErr)])
        } catch (e) {
          console.error('Failed to persist failed email to outbox (Ethereal):', e)
        }
        // Fall through to generic logging
      }
    }

    // No provider available
    console.warn('No SMTP or Resend configured; email will NOT be sent; message logged to server.')
    console.log('Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('Content (truncated):', htmlContent.substring(0, 200) + '...')
    // Persist queued email for inspection / manual delivery
    try {
      await pool.execute('INSERT INTO email_outbox (to_address, subject, body, provider, preview_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', [to, subject, htmlContent, null, null, 'queued'])
    } catch (e) {
      console.error('Failed to persist queued email to outbox:', e)
    }
    // Also persist failure for visibility
    try {
      await pool.execute('INSERT INTO email_failures (to_address, subject, body, error_message, created_at) VALUES (?, ?, ?, ?, NOW())', [to, subject, htmlContent, 'No SMTP or RESEND configured'])
    } catch (e) {
      console.error('Failed to log email failure to DB:', e)
    }
    return { success: false, message: 'No SMTP or RESEND configured; email queued on server.' }
  } catch (err: any) {
    console.error('Error sending email:', err)
    return { success: false, message: err.message || 'Unknown error sending email' }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const lang = data.locale || data.lang || 'en'

    if (data.type === 'order_notification') {
      const html = generateOrderNotificationEmail(data, lang)
      const subject = (getTranslationsForLang(lang)['email_new_order_subject'] || `New Order: ${data.orderNumber}`)
      const result = await sendEmail(ADMIN_EMAIL, subject, html)
      return NextResponse.json(result)
    }

    if (data.type === 'order_confirmation') {
      const html = generateOrderConfirmationEmail(data, lang)
      const subject = (getTranslationsForLang(lang)['email_order_confirmed_subject'] || `Order Confirmation - ${data.orderNumber}`)
      const result = await sendEmail(data.customerEmail, subject, html)
      return NextResponse.json(result)
    }

    // Convenience: send both admin notification and customer confirmation in a single request
    if (data.type === 'order_both') {
      try {
        const adminHtml = generateOrderNotificationEmail(data, lang)
        const adminSubject = (getTranslationsForLang(lang)['email_new_order_subject'] || `New Order: ${data.orderNumber}`)
        const customerHtml = generateOrderConfirmationEmail(data, lang)
        const customerSubject = (getTranslationsForLang(lang)['email_order_confirmed_subject'] || `Order Confirmation - ${data.orderNumber}`)

        const adminRes = await sendEmail(ADMIN_EMAIL, adminSubject, adminHtml)
        const customerRes = await sendEmail(data.customerEmail, customerSubject, customerHtml)

        return NextResponse.json({ success: true, admin: adminRes, customer: customerRes })
      } catch (err: any) {
        console.error('Error sending order_both emails:', err)
        return NextResponse.json({ success: false, message: 'Failed to send order emails' }, { status: 500 })
      }
    }

    if (data.type === 'contact_form') {
      const html = generateContactFormEmail(data, lang)
      const subject = (getTranslationsForLang(lang)['email_contact_subject'] || `Contact Form: ${data.subject}`)
      const result = await sendEmail(ADMIN_EMAIL, subject, html)
      return NextResponse.json(result)
    }

    if (data.type === 'review_notification') {
      const html = generateReviewNotificationEmail(data, lang)
      const subject = (getTranslationsForLang(lang)['email_review_subject'] || `New Review from ${data.name}`)
      const result = await sendEmail(ADMIN_EMAIL, subject, html)
      return NextResponse.json(result)
    }

    if (data.type === 'payment_success') {
      try {
        const adminHtml = generatePaymentSuccessAdminEmail(data)
        const adminSubject = `Payment Successful! - ${data.orderNumber}`
        const customerHtml = generatePaymentSuccessCustomerEmail(data)
        const customerSubject = `Order Confirmed: Your Report is processing! [${data.orderNumber}]`

        const adminRes = await sendEmail(ADMIN_EMAIL, adminSubject, adminHtml)
        const customerRes = await sendEmail(data.customerEmail, customerSubject, customerHtml)

        return NextResponse.json({ success: true, admin: adminRes, customer: customerRes })
      } catch (err: any) {
        console.error('Error sending payment_success emails:', err)
        return NextResponse.json({ success: false, message: 'Failed to send payment success emails' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid email type' }, { status: 400 })
  } catch (err) {
    console.error('Error in send-email route:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
