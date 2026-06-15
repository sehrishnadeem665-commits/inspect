import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, getOrderByNumber } from '@/lib/database'

export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = (context as any) || {}
    const raw = params?.id
    const numeric = Number(raw)

    const result: any = { raw, numeric, byId: null, byNumber: null }

    if (!isNaN(numeric)) {
      result.byId = await getOrderById(numeric)
    }
    if (typeof raw === 'string') {
      result.byNumber = await getOrderByNumber(raw)
    }

    return NextResponse.json({ ok: true, result })
  } catch (err) {
    console.error('Debug order lookup failed:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
