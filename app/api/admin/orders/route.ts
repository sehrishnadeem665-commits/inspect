import { NextRequest, NextResponse } from 'next/server'
import { getOrders } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get('status') || undefined
    const startDate = url.searchParams.get('startDate') || undefined
    const endDate = url.searchParams.get('endDate') || undefined
    const search = url.searchParams.get('q') || url.searchParams.get('search') || undefined
    const currency = url.searchParams.get('currency') || undefined
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined

    const orders = await getOrders({ status, startDate, endDate, search, currency, limit })
    return NextResponse.json({ success: true, orders })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('Failed to fetch orders:', errorMessage)
    console.error('Full error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders', details: errorMessage }, { status: 500 })
  }
}
