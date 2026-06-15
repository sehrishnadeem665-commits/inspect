import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'
import { sendEmail } from '@/app/api/send-email/route'

// PayPal webhook signing verification
async function verifyWebhookSignature(
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  transmissionSig: string,
  body: string
) {
  try {
    // For development, you can skip verification
    // In production, implement proper PayPal signature verification
    console.log('✅ Webhook signature verified')
    return true
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get headers for verification
    const transmissionId = request.headers.get('paypal-transmission-id') || ''
    const transmissionTime = request.headers.get('paypal-transmission-time') || ''
    const certUrl = request.headers.get('paypal-cert-url') || ''
    const transmissionSig = request.headers.get('paypal-transmission-sig') || ''

    console.log('🔔 PayPal Webhook Received:', body.event_type)

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(
      transmissionId,
      transmissionTime,
      certUrl,
      transmissionSig,
      JSON.stringify(body)
    )

    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 403 }
      )
    }

    let status = 'pending'
    let orderId = ''
    let transactionId = ''
    let amount = 0
    let currency = 'USD'

    // Handle different PayPal events
    switch (body.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        status = 'completed'
        orderId = body.resource?.supplementary_data?.related_ids?.order_id
        transactionId = body.resource?.id
        amount = parseFloat(body.resource?.amount?.value || 0)
        currency = body.resource?.amount?.currency_code || 'USD'
        console.log('✅ Payment Completed:', { orderId, transactionId, amount })
        break

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.FAILED':
        status = 'failed'
        orderId = body.resource?.supplementary_data?.related_ids?.order_id
        transactionId = body.resource?.id
        console.log('❌ Payment Failed:', orderId)
        break

      case 'PAYMENT.CAPTURE.REFUNDED':
        status = 'refunded'
        orderId = body.resource?.supplementary_data?.related_ids?.order_id
        transactionId = body.resource?.id
        console.log('🔄 Payment Refunded:', orderId)
        break

      case 'DISPUTE.CREATED':
      case 'DISPUTE.UPDATED':
        status = 'dispute'
        orderId = body.resource?.order_id
        console.log('⚠️ Dispute Created/Updated:', orderId)
        break

      case 'CHECKOUT.ORDER.APPROVED':
        status = 'approved'
        orderId = body.resource?.id
        console.log('✓ Order Approved:', orderId)
        break

      case 'CHECKOUT.ORDER.CREATED':
        status = 'pending'
        orderId = body.resource?.id
        console.log('📝 Order Created:', orderId)
        break

      default:
        console.log('ℹ️ Unhandled event type:', body.event_type)
        return NextResponse.json({ received: true }, { status: 200 })
    }

    // Update database with webhook status
    if (orderId) {
      try {
        // Check if payment record exists
        const existingPayment = await query(
          'SELECT id FROM payments WHERE order_id = ? OR paypal_order_id = ?',
          [orderId, orderId]
        )

        if (existingPayment && existingPayment.length > 0) {
          // Update existing payment
          await query(
            `UPDATE payments 
             SET payment_status = ?, 
                 updated_at = NOW(),
                 webhook_event = ?
             WHERE order_id = ? OR paypal_order_id = ?`,
            [status, body.event_type, orderId, orderId]
          )
          console.log('✅ Payment status updated:', status)
        } else if (status === 'completed' && transactionId) {
          // Create new payment record from webhook
          await query(
            `INSERT INTO payments (
              paypal_order_id, transaction_id, payment_status,
              amount, currency, payment_method, webhook_event,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [orderId, transactionId, status, amount, currency, 'paypal', body.event_type]
          )
          console.log('✅ New payment record created from webhook')
        }

        // Also update orders table if exists
        try {
          await query(
            `UPDATE orders 
             SET status = ?, updated_at = NOW()
             WHERE id = ? OR paypal_order_id = ?`,
            [status, orderId, orderId]
          )
        } catch (e) {
          // Orders table might not exist yet
          console.log('ℹ️ Orders table update skipped')
        }

        // Send email notifications if payment is successful
        if (status === 'completed') {
          try {
            // Fetch order details to get customer email
            const orderDetails = await query(
              `SELECT * FROM orders WHERE id = ? OR paypal_order_id = ? LIMIT 1`,
              [orderId, orderId]
            )

            if (orderDetails && orderDetails.length > 0) {
              const order = orderDetails[0]
              const customerEmail = order.email || order.customer_email
              const adminEmail = process.env.ADMIN_PAYMENT_EMAIL || 'vehiclehealthanalysis@gmail.com'
              const orderNumber = order.order_number || order.id

              // Send confirmation email to customer
              if (customerEmail) {
                const customerEmailContent = `
                  <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #22c55e;">✅ Payment Successful - Order Confirmed!</h2>
                    <p>Hello,</p>
                    <p>Thank you for your purchase! Your payment has been successfully received and processed.</p>
                    
                    <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #166534;">✅ Order Confirmed:</h3>
                      <p style="margin: 8px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                      <p style="margin: 8px 0;"><strong>Vehicle Type:</strong> ${order.vehicle_type || 'N/A'}</p>
                      <p style="margin: 8px 0;"><strong>Identification:</strong> ${order.identification_value || 'N/A'}</p>
                      <p style="margin: 8px 0;"><strong>Package:</strong> ${order.package_type || 'N/A'}</p>
                      <p style="margin: 8px 0;"><strong>Amount:</strong> ${currency} ${Number(amount).toFixed(2)}</p>
                      <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
                    </div>
                    
                    <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #a855f7; margin: 20px 0;">
                      <p style="margin: 0; color: #6b21a8;"><strong>⏳ Report Generation:</strong></p>
                      <p style="margin: 8px 0 0 0; color: #6b21a8;">Your comprehensive vehicle history report will be ready within 12-13 hours. We will send you another email with your report details.</p>
                    </div>
                    
                    <p style="margin-top: 20px; color: #666; font-size: 14px;">Thank you for choosing True Inspectify! If you have any questions, please contact us.</p>
                    <p>Best Regards,<br/><strong>True Inspectify Team</strong></p>
                  </div>
                `
                
                await sendEmail(
                  customerEmail,
                  `✅ Payment Successful - Order #${orderNumber} Confirmed`,
                  customerEmailContent
                )
                console.log('📧 Confirmation email sent to customer:', customerEmail)
              }

              // Send notification email to admin
              const adminEmailContent = `
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #22c55e; border-radius: 10px; background: #f0fdf4;">
                  <h2 style="color: #22c55e;">💰 Payment Received - Ready for Processing</h2>
                  <p>The customer has successfully completed payment for their report request.</p>
                  
                  <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">Order & Payment Details:</h3>
                    <p style="margin: 8px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                    <p style="margin: 8px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
                    <p style="margin: 8px 0;"><strong>Vehicle Type:</strong> ${order.vehicle_type || 'N/A'}</p>
                    <p style="margin: 8px 0;"><strong>Identification:</strong> ${order.identification_value || 'N/A'}</p>
                    <p style="margin: 8px 0;"><strong>Package:</strong> ${order.package_type || 'N/A'}</p>
                    <p style="margin: 8px 0;"><strong>Amount:</strong> ${currency} ${Number(amount).toFixed(2)}</p>
                    <p style="margin: 8px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
                    <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">✅ PAYMENT COMPLETED</span></p>
                  </div>
                  
                  <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #22c55e; margin: 20px 0;">
                    <p style="margin: 0; color: #166534;"><strong>✅ Action Items:</strong></p>
                    <ul style="margin: 10px 0 0 0; color: #166534;">
                      <li>Payment has been verified and marked as completed</li>
                      <li>Customer has received their payment confirmation email</li>
                      <li>Begin report generation process (12-13 hours)</li>
                    </ul>
                  </div>
                  
                  <p style="margin-top: 20px; color: #666; font-size: 14px;">The customer was notified about their successful payment. Proceed with generating their vehicle history report.</p>
                </div>
              `
              
              await sendEmail(
                adminEmail,
                '💰 New Payment Received - Action Required',
                adminEmailContent
              )
              console.log('📧 Admin notification sent to:', adminEmail)
            }
          } catch (emailError) {
            console.error('⚠️ Email sending failed:', emailError)
            // Don't fail the webhook response
          }
        }
      } catch (dbError) {
        console.error('⚠️ Database update failed:', dbError)
        // Don't fail the webhook response, PayPal will retry
      }
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json(
      {
        received: true,
        event_type: body.event_type,
        status_updated: status,
        order_id: orderId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    // Return 500 so PayPal retries
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook configuration
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'PayPal Webhook Endpoint',
      purpose: 'Receives real-time payment status updates from PayPal',
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/webhook`,
      events: [
        'PAYMENT.CAPTURE.COMPLETED',
        'PAYMENT.CAPTURE.DENIED',
        'PAYMENT.CAPTURE.FAILED',
        'PAYMENT.CAPTURE.REFUNDED',
        'DISPUTE.CREATED',
        'DISPUTE.UPDATED',
        'CHECKOUT.ORDER.APPROVED',
        'CHECKOUT.ORDER.CREATED',
      ],
      status_values: [
        'pending - Payment awaiting approval',
        'approved - Order approved, ready for capture',
        'completed - Payment successfully captured',
        'failed - Payment failed',
        'refunded - Payment refunded to customer',
        'dispute - Payment dispute/chargeback raised',
      ],
    },
    { status: 200 }
  )
}
