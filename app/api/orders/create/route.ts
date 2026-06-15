import { NextRequest, NextResponse } from 'next/server'
import { insertOrder } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_email,
      vehicle_type,
      identification_type,
      identification_value,
      vin_number,
      package_type,
      country_code,
      currency,
      amount,
      paymentProvider,
    } = body

    console.log('\n📝 Creating order with data:', { 
      customer_email, 
      vehicle_type, 
      package_type,
      amount,
      currency,
      paymentProvider
    })

    if (!customer_email || !vehicle_type || !identification_type || !identification_value || !package_type || !amount) {
      console.error('❌ Missing required fields:', { 
        customer_email: !!customer_email,
        vehicle_type: !!vehicle_type,
        identification_type: !!identification_type,
        identification_value: !!identification_value,
        package_type: !!package_type,
        amount: !!amount,
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('✓ All required fields present, inserting order with package_type:', package_type)
    const order = await insertOrder({
      customer_email,
      vehicle_type,
      identification_type,
      identification_value,
      vin_number: vin_number || null,
      package_type,
      country_code: country_code || 'US',
      currency: currency || 'USD',
      amount,
      payment_provider: paymentProvider || undefined,
    })

    console.log('✅ Order created successfully:', { 
      orderId: order?.id, 
      orderNumber: order?.order_number,
      packageType: order?.package_type,
      amount: order?.amount,
      fullOrder: JSON.stringify(order)
    })

    if (!order?.id) {
      console.error('❌ Order created but no ID returned:', order)
      return NextResponse.json(
        { error: 'Order created but no ID returned: ' + JSON.stringify(order) },
        { status: 500 }
      )
    }

    // NOTE: Emails are NOT sent here. They will be sent after successful payment
    // in the PayPal webhook handler (/api/paypal/webhook)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('❌ Error creating order:', errorMsg)
    console.error('Full error:', error)
    return NextResponse.json(
      { error: 'Failed to create order: ' + errorMsg },
      { status: 500 }
    )
  }
}
