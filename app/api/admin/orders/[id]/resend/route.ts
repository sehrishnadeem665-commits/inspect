import { NextRequest, NextResponse } from 'next/server'
import { getOrderById } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function POST(request: NextRequest, context: any) {
  try {
    const { params } = (context as any) || {}
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params?.id)
    const order = await getOrderById(id)
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order_confirmation',
        orderId: order.id,
        orderNumber: order.order_number,
        customerEmail: order.customer_email,
        vehicleType: order.vehicle_type,
        identificationType: order.identification_type,
        identificationValue: order.identification_value,
        packageType: order.package_type,
        amount: Number(order.amount),
        currency: order.currency,
        paymentStatus: order.payment_status,
      }),
    })

    const ok = resp.ok && (await resp.json()).success !== false
    return NextResponse.json({ success: ok })
  } catch (err) {
    console.error('Failed to resend confirmation:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
