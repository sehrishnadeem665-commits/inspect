import { NextRequest, NextResponse } from 'next/server'
import { sendCustomerPaymentConfirmation, sendAdminPaymentNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Default test data if none provided
    const testData = {
      customerEmail: body.customerEmail || 'sehrishnadeem39@gmail.com',
      customerName: body.customerName || 'sehrish test',
      orderId: body.orderId || 'ORD-TEST-' + Date.now(),
      amount: body.amount || 29.99,
      currency: body.currency || 'USD',
      packageName: body.packageName || 'Premium Report',
      vehicleIdentifier: body.vehicleIdentifier || 'ABC1234VIN5678',
      paymentMethod: 'paypal' as const,
    }

    console.log('📧 Sending test emails with data:', testData)

    // Send both emails
    await Promise.all([
      sendCustomerPaymentConfirmation(testData),
      sendAdminPaymentNotification(testData),
    ])

    return NextResponse.json(
      {
        success: true,
        message: 'Test emails sent successfully!',
        data: testData,
        emails: {
          customer: testData.customerEmail,
          admin: process.env.ADMIN_EMAIL,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error sending test emails:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to send test emails',
        details: error instanceof Error ? error.stack : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Test Payment Email Endpoint',
      usage: 'POST /api/test-payment-email',
      example: {
        method: 'POST',
        body: {
          customerEmail: 'your-email@example.com',
          customerName: 'Your Name',
          orderId: 'ORD-12345',
          amount: 29.99,
          currency: 'USD',
          packageName: 'Premium Report',
          vehicleIdentifier: 'ABC1234',
        },
      },
      notes: 'All fields are optional. If not provided, defaults will be used.',
    },
    { status: 200 }
  )
}
