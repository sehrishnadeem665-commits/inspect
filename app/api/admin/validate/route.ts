import { NextResponse } from 'next/server'
import { validateToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const ok = await validateToken(token)
    if (!ok) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error('Error validating admin token:', err)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
