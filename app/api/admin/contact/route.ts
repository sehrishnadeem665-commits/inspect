import { NextRequest, NextResponse } from 'next/server'
import { getContactSubmissions, updateContactStatus, deleteContactSubmission } from '@/lib/database'
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
    const q = url.searchParams.get('q') || undefined
    const startDate = url.searchParams.get('startDate') || undefined
    const endDate = url.searchParams.get('endDate') || undefined
    const submissions = await getContactSubmissions({ status, q, startDate, endDate })
    return NextResponse.json({ success: true, submissions })
  } catch (err) {
    console.error('Error fetching contact submissions', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, action } = body
    if (!id || !action) {
      return NextResponse.json({ success: false, error: 'Missing id or action' }, { status: 400 })
    }

    const numericId = Number(id)
    if (action === 'mark_read') {
      const updated = await updateContactStatus(numericId, 'read')
      return NextResponse.json({ success: true, submission: updated })
    } else if (action === 'mark_handled' || action === 'mark_responded') {
      // normalize to DB enum value 'responded'
      const updated = await updateContactStatus(numericId, 'responded')
      return NextResponse.json({ success: true, submission: updated })
    } else if (action === 'delete') {
      await deleteContactSubmission(numericId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Error updating contact submission', err)
    return NextResponse.json({ success: false, error: 'Failed to update contact' }, { status: 500 })
  }
}
