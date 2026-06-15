import { NextRequest, NextResponse } from 'next/server'
import { getOrdersStats } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    console.log('[STATS API] Request received')
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    console.log('[STATS API] Token present:', !!token)
    
    if (!token || !(await validateToken(token))) {
      console.error('[STATS API] Token validation failed')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const days = Number(url.searchParams.get('days') || '30')
    console.log('[STATS API] Fetching stats for', days, 'days')
    
    const stats = await getOrdersStats(days)
    console.log('[STATS API] Stats fetched successfully, count:', stats?.length)
    return NextResponse.json({ success: true, stats })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    const errorStack = err instanceof Error ? err.stack : 'No stack trace'
    console.error('[STATS API] ERROR:', errorMessage)
    console.error('[STATS API] Stack:', errorStack)
    console.error('[STATS API] Full error object:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch stats', 
      details: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }, { status: 500 })
  }
}
