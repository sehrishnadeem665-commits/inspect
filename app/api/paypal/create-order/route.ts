import { NextRequest, NextResponse } from 'next/server'
import { createPayPalOrder } from '@/lib/paypal'
import { getPrice, getCurrencySymbol } from '@/lib/prices'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      packageId,
      currency,
      customerEmail,
      vehicleIdentifier,
      vehicleType,
      amount: clientAmount, // Optional amount from client for validation
    } = body

    // Validate request
    if (!packageId || !currency || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get price based on package and currency
    const amount = getPrice(packageId as any, currency)
    
    // Validate that client amount matches server-calculated amount
    if (clientAmount && Math.abs(amount - clientAmount) > 0.01) {
      console.warn(`⚠️ Amount mismatch: Client sent ${clientAmount}, calculated ${amount}`)
      // Use the server-calculated amount for security
    }
    
    // Generate order ID (combine timestamp and random string)
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Map package ID to name
    const packageNames = {
      basic: 'Basic Report',
      standard: 'Standard Report',
      premium: 'Premium Report',
    }

    // Create PayPal order
    const paypalOrder = await createPayPalOrder({
      amount,
      currency,
      description: `${packageNames[packageId as keyof typeof packageNames]} for ${vehicleType}`,
      customerEmail,
      orderId,
      packageName: packageNames[packageId as keyof typeof packageNames],
    })

    // Return order details
    return NextResponse.json(
      {
        success: true,
        orderId: paypalOrder.id,
        internalOrderId: orderId,
        amount,
        currency,
        approvalLink: paypalOrder.links.find((link: any) => link.rel === 'approve')?.href,
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('❌ Error creating PayPal order:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
