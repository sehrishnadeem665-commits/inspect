import { NextRequest, NextResponse } from 'next/server'
import { getSetting, setSetting } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const key = url.searchParams.get('key') || 'admin'
    
    // Wrap in try-catch for database errors
    let value
    try {
      value = await getSetting(key)
    } catch (dbErr) {
      console.error('Database error fetching setting:', dbErr)
      // Return empty object on database error instead of failing
      value = null
    }
    
    return NextResponse.json({ success: true, value: value || {} })
  } catch (err) {
    console.error('Failed to get setting', err)
    return NextResponse.json({ success: false, error: 'Failed to get setting' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    
    let body
    try {
      body = await req.json()
    } catch (parseErr) {
      return NextResponse.json({ success: false, error: 'Invalid JSON in request body' }, { status: 400 })
    }
    
    const { key, value } = body
    if (!key) return NextResponse.json({ success: false, error: 'Missing key' }, { status: 400 })

    // Basic server-side validation for common admin settings
    try {
      if (key.startsWith('admin_email')) {
        // ensure emails are valid strings when present
        const emailRegex = /^\S+@\S+\.\S+$/
        if (value?.notificationEmail && !emailRegex.test(value.notificationEmail)) {
          return NextResponse.json({ success: false, error: 'Invalid notificationEmail' }, { status: 400 })
        }
        if (value?.emailFrom && !emailRegex.test(value.emailFrom)) {
          return NextResponse.json({ success: false, error: 'Invalid emailFrom' }, { status: 400 })
        }
      }

      if (key.startsWith('admin_reviews')) {
        if (value?.minRatingToFeature && (typeof value.minRatingToFeature !== 'number' || value.minRatingToFeature < 1 || value.minRatingToFeature > 5)) {
          return NextResponse.json({ success: false, error: 'minRatingToFeature must be a number between 1 and 5' }, { status: 400 })
        }
      }

      if (key.startsWith('admin_general')) {
        if (value?.siteTitle && String(value.siteTitle).length > 255) {
          return NextResponse.json({ success: false, error: 'siteTitle too long' }, { status: 400 })
        }
      }
    } catch (vErr) {
      console.warn('Validation error', vErr)
      return NextResponse.json({ success: false, error: 'Invalid setting format' }, { status: 400 })
    }

    // Wrap setSetting in try-catch for database errors
    try {
      await setSetting(key, value || {})
    } catch (dbErr) {
      console.error('Database error setting value:', dbErr)
      return NextResponse.json({ success: false, error: 'Failed to save setting to database' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to set setting', err)
    return NextResponse.json({ success: false, error: 'Failed to set setting' }, { status: 500 })
  }
}
