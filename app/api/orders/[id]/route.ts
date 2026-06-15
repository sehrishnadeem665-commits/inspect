import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, getOrderByNumber } from '@/lib/database'

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = (context as any) || {}
    const rawId = params?.id

    // Support both numeric IDs and order_number strings.
    let order = null
    const numeric = Number(rawId)
    if (!isNaN(numeric)) {
      order = await getOrderById(numeric)
    } else if (typeof rawId === 'string') {
      order = await getOrderByNumber(rawId)
    } else {
      return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 })
    }

    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Failed to fetch order:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 })
  }
}