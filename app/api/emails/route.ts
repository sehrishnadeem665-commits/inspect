import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'

// Protect this endpoint: if ADMIN_SECRET is set, require Authorization: Bearer <ADMIN_SECRET> header.
// Otherwise allow only in non-production for local/dev usage.
export async function GET(request: NextRequest) {
  try {
    const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
    const NODE_ENV = process.env.NODE_ENV || 'development'

    if (ADMIN_SECRET) {
      const auth = request.headers.get('authorization') || ''
      if (!auth.startsWith('Bearer ') || auth.split(' ')[1] !== ADMIN_SECRET) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
      }
    } else if (NODE_ENV === 'production') {
      return NextResponse.json({ success: false, message: 'Not available in production without ADMIN_SECRET' }, { status: 403 })
    }

    const limitParam = new URL(request.url).searchParams.get('limit')
    const limit = Math.min(100, Math.max(10, Number(limitParam || '50')))

    const [rows] = await pool.execute(
      `SELECT id, to_address, subject, provider, preview_url, status, error_message, created_at FROM email_outbox ORDER BY created_at DESC LIMIT ?`,
      [limit]
    )

    return NextResponse.json({ success: true, emails: rows })
  } catch (err: any) {
    console.error('Error fetching emails:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
