import { NextResponse } from 'next/server'
import { getOrders } from '@/lib/database'

export async function GET() {
  try {
    // return most recent 50 orders for debugging
    const orders = await getOrders({ limit: 50 })
    return NextResponse.json({ ok: true, count: orders.length, orders })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}
