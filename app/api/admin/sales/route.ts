import { NextRequest, NextResponse } from 'next/server'
import { getSales } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const startDate = url.searchParams.get('startDate') || undefined
    const endDate = url.searchParams.get('endDate') || undefined
    const status = url.searchParams.get('status') || undefined
    const currency = url.searchParams.get('currency') || undefined

    const rows = await getSales({ startDate, endDate, status, currency })
    return NextResponse.json({ success: true, rows })
  } catch (err) {
    console.error('Failed to fetch sales', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch sales' }, { status: 500 })
  }
}
