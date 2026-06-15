import { NextRequest, NextResponse } from 'next/server'
import { updateOrderReportStatus } from '@/lib/database'
import { validateToken } from '@/lib/auth'

const ALLOWED_STATUSES = ['pending', 'processing', 'completed', 'cancelled', 'refunded']

export async function PUT(request: NextRequest, context: any) {
  try {
    const params = await context.params
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log(`🔐 PUT /api/admin/orders/[id]/status - Validating token`)
    if (!token || !(await validateToken(token))) {
      console.error('❌ Unauthorized status update request')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const id = Number(params?.id)
    console.log(`📝 Status update request for order ID: ${id}`)
    
    const body = await request.json()
    const { reportStatus, reportUrl } = body
    
    console.log(`📋 Request body:`, { reportStatus, reportUrl })
    
    if (!reportStatus) {
      console.warn('❌ Missing reportStatus in request')
      return NextResponse.json({ success: false, error: 'reportStatus is required' }, { status: 400 })
    }
    
    if (!ALLOWED_STATUSES.includes(reportStatus)) {
      console.warn('❌ Invalid reportStatus:', reportStatus, 'Allowed:', ALLOWED_STATUSES)
      return NextResponse.json({ success: false, error: `Invalid reportStatus. Allowed: ${ALLOWED_STATUSES.join(', ')}` }, { status: 400 })
    }
    
    console.log(`🔄 Updating order ${id} status to "${reportStatus}"`)
    const updated = await updateOrderReportStatus(id, reportStatus as any, reportUrl || undefined)
    console.log(`✅ Order ${id} report status updated to ${reportStatus}`)
    console.log(`📊 Updated order:`, updated)
    
    return NextResponse.json({ success: true, order: updated })
  } catch (err: any) {
    console.error('❌ Failed to update order status:', err)
    const errorMsg = err?.message || String(err)
    const msg = (process.env.NODE_ENV !== 'production') ? errorMsg : 'Failed to update order'
    return NextResponse.json({ success: false, error: msg, details: errorMsg }, { status: 500 })
  }
} 
