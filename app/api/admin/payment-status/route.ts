import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql'

/**
 * Admin API endpoint to get all payment statuses for dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Get all payments with their statuses
    const payments = await query(
      `SELECT 
        id,
        order_id,
        paypal_order_id,
        transaction_id,
        customer_email,
        customer_name,
        amount,
        currency,
        payment_status,
        payment_method,
        webhook_event,
        created_at,
        updated_at
      FROM payments
      ORDER BY updated_at DESC
      LIMIT 100`
    )

    // Group by status
    const statusSummary = {
      pending: 0,
      approved: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
      dispute: 0,
    }

    const paymentsByStatus: any = {
      pending: [],
      approved: [],
      completed: [],
      failed: [],
      refunded: [],
      dispute: [],
    }

    payments.forEach((payment: any) => {
      const status = payment.payment_status || 'pending'
      if (statusSummary.hasOwnProperty(status)) {
        statusSummary[status as keyof typeof statusSummary]++
        paymentsByStatus[status].push(payment)
      }
    })

    return NextResponse.json(
      {
        success: true,
        total_payments: payments.length,
        summary: statusSummary,
        payments: paymentsByStatus,
        last_updated: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error fetching payment statuses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment statuses' },
      { status: 500 }
    )
  }
}

/**
 * Get specific payment status
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, paypalOrderId } = await request.json()

    if (!orderId && !paypalOrderId) {
      return NextResponse.json(
        { error: 'orderId or paypalOrderId required' },
        { status: 400 }
      )
    }

    const payment = await query(
      `SELECT * FROM payments 
       WHERE order_id = ? OR paypal_order_id = ?
       LIMIT 1`,
      [orderId, paypalOrderId]
    )

    if (!payment || payment.length === 0) {
      return NextResponse.json(
        { status: 'not_found', message: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        payment: payment[0],
        status_label: getStatusLabel(payment[0].payment_status),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    pending: '⏳ Pending - Awaiting payment',
    approved: '✓ Approved - Ready for capture',
    completed: '✅ Completed - Payment successful',
    failed: '❌ Failed - Payment declined',
    refunded: '🔄 Refunded - Money returned',
    dispute: '⚠️ Dispute - Chargeback raised',
  }
  return labels[status] || `? Unknown - ${status}`
}
