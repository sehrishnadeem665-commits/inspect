import { NextResponse } from 'next/server'
import { validateToken, getEmailFromToken, changeAdminPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const email = getEmailFromToken(token)
    if (!email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing currentPassword or newPassword' }, { status: 400 })
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const ok = await changeAdminPassword(email, currentPassword, newPassword)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Current password incorrect' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to change password', err)
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 })
  }
}