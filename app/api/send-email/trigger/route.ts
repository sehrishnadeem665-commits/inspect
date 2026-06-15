import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/app/api/send-email/route'

// Simple trigger route for server-side testing. Call with GET /api/send-email/trigger?to=...&subject=...&html=...
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const to = url.searchParams.get('to') || ''
    const subject = url.searchParams.get('subject') || 'Test Email'
    const html = url.searchParams.get('html') || '<p>Test email</p>'

    if (!to) {
      return NextResponse.json({ success: false, message: 'Missing `to` query parameter' }, { status: 400 })
    }

    const result = await sendEmail(to, subject, html)
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Error in send-email/trigger:', err)
    return NextResponse.json({ success: false, message: err.message || 'Internal error' }, { status: 500 })
  }
}
