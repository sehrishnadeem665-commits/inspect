// Email Service using Nodemailer
import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface PaymentConfirmationEmailData {
  customerEmail: string
  customerName: string
  orderId: string
  amount: number
  currency: string
  packageName: string
  vehicleIdentifier: string
  paymentMethod: 'paypal' | 'card'
}

/**
 * Send customer payment confirmation email
 */
export async function sendCustomerPaymentConfirmation(data: PaymentConfirmationEmailData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #b08a5a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #b08a5a; }
          .detail-row { margin: 8px 0; }
          .label { font-weight: bold; color: #b08a5a; }
          .button { background: #b08a5a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed!</h1>
            <p>Your report is being prepared</p>
          </div>
          <div class="content">
            <p>Hi ${data.customerName},</p>
            <p>Thank you for your payment! We've successfully received your payment and are preparing your vehicle report.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Order ID:</span> ${data.orderId}
              </div>
              <div class="detail-row">
                <span class="label">Amount:</span> ${data.currency} ${data.amount.toFixed(2)}
              </div>
              <div class="detail-row">
                <span class="label">Package:</span> ${data.packageName}
              </div>
              <div class="detail-row">
                <span class="label">Vehicle:</span> ${data.vehicleIdentifier}
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span> ${data.paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
              </div>
            </div>

            <p>Your report will be emailed to you within 24 hours. You can also check your account for download links.</p>
            <p>If you have any questions, please contact us at ${process.env.ADMIN_PAYMENT_EMAIL}</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 True Inspectify. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: data.customerEmail,
      subject: `Payment Confirmed - True Inspectify Order #${data.orderId}`,
      html: htmlContent,
    })
    console.log('✅ Customer payment confirmation email sent')
  } catch (error) {
    console.error('❌ Failed to send customer payment confirmation email:', error)
    throw error
  }
}

/**
 * Send admin payment notification email
 */
export async function sendAdminPaymentNotification(data: PaymentConfirmationEmailData) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #b08a5a; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #b08a5a; }
          .detail-row { margin: 8px 0; }
          .label { font-weight: bold; color: #b08a5a; }
          .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin: 10px 0; border-radius: 3px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Payment Received</h1>
          </div>
          <div class="content">
            <p>A new payment has been successfully processed.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="label">Order ID:</span> ${data.orderId}
              </div>
              <div class="detail-row">
                <span class="label">Customer Email:</span> ${data.customerEmail}
              </div>
              <div class="detail-row">
                <span class="label">Customer Name:</span> ${data.customerName}
              </div>
              <div class="detail-row">
                <span class="label">Amount:</span> ${data.currency} ${data.amount.toFixed(2)}
              </div>
              <div class="detail-row">
                <span class="label">Package:</span> ${data.packageName}
              </div>
              <div class="detail-row">
                <span class="label">Vehicle Identifier:</span> ${data.vehicleIdentifier}
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span> ${data.paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
              </div>
              <div class="detail-row">
                <span class="label">Timestamp:</span> ${new Date().toISOString()}
              </div>
            </div>

            <div class="alert">
              <strong>Action Required:</strong> Please prepare and send the vehicle report to the customer.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 True Inspectify. All rights reserved.</p>
        </div>
      </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_PAYMENT_EMAIL,
      subject: `New Payment Received - Order #${data.orderId}`,
      html: htmlContent,
    })
    console.log('✅ Admin payment notification email sent')
  } catch (error) {
    console.error('❌ Failed to send admin payment notification email:', error)
    throw error
  }
}

/**
 * Test email connection
 */
export async function testEmailConnection() {
  try {
    await transporter.verify()
    console.log('✅ Email configuration is valid and connected')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error)
    return false
  }
}
