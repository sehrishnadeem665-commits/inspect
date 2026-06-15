import { NextRequest, NextResponse } from 'next/server'
import { getAdminCounts } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const counts = await getAdminCounts()
    return NextResponse.json({ success: true, ...counts })
  } catch (err) {
    console.error('Failed to fetch admin counts', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch counts' }, { status: 500 })
  }
}
