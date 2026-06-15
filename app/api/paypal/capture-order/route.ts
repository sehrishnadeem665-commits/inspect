import { NextRequest, NextResponse } from 'next/server'
import { capturePayPalOrder, getPayPalOrder } from '@/lib/paypal'
import { sendCustomerPaymentConfirmation, sendAdminPaymentNotification } from '@/lib/email'
import { query } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      paypalOrderId,
      internalOrderId,
      customerEmail,
      customerName,
      amount,
      currency,
      packageId,
      vehicleIdentifier,
    } = body

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: 'Missing PayPal order ID' },
        { status: 400 }
      )
    }

    // Capture the PayPal order
    const capturedOrder = await capturePayPalOrder(paypalOrderId)

    if (capturedOrder.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment was not completed' },
        { status: 400 }
      )
    }

    // Extract payment details
    const paymentUnit = capturedOrder.purchase_units[0]
    const paymentStatus = paymentUnit.payments.captures[0].status
    const transactionId = paymentUnit.payments.captures[0].id

    if (paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment capture failed' },
        { status: 400 }
      )
    }

    // Map package ID to name
    const packageNames = {
      basic: 'Basic Report',
      standard: 'Standard Report',
      premium: 'Premium Report',
    }

    // Save payment record to database
    try {
      await query(
        `INSERT INTO payments (
          order_id, paypal_order_id, transaction_id, 
          customer_email, customer_name, amount, currency,
          package_id, vehicle_identifier, payment_method,
          payment_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          internalOrderId,
          paypalOrderId,
          transactionId,
          customerEmail,
          customerName,
          amount,
          currency,
          packageId,
          vehicleIdentifier,
          'paypal',
          'completed',
        ]
      )
      console.log('✅ Payment record saved to database')
    } catch (dbError) {
      console.warn('⚠️ Failed to save payment to database:', dbError)
      // Continue even if DB save fails
    }

    // Send confirmation emails
    const emailData = {
      customerEmail,
      customerName,
      orderId: internalOrderId,
      amount,
      currency,
      packageName: packageNames[packageId as keyof typeof packageNames],
      vehicleIdentifier,
      paymentMethod: 'paypal' as const,
    }

    try {
      await Promise.all([
        sendCustomerPaymentConfirmation(emailData),
        sendAdminPaymentNotification(emailData),
      ])
    } catch (emailError) {
      console.error('❌ Failed to send confirmation emails:', emailError)
      // Continue even if emails fail
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment captured successfully',
        orderId: internalOrderId,
        transactionId,
        paymentStatus: 'completed',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error capturing PayPal order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to capture payment' },
      { status: 500 }
    )
  }
}
