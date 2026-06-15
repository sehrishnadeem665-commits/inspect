import { NextResponse } from 'next/server'

// GET: optional passthrough for debugging (kept minimal)
export async function GET(req: Request) {
  return NextResponse.json({ success: false, message: 'Use POST to verify an order with Paddle' })
}

// POST: accept { orderId } and call Paddle sandbox Order API to verify details
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body || {}
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })

    const paddleApiKey = process.env.PADDLE_API_KEY
    if (!paddleApiKey) {
      console.warn('⚠️ PADDLE_API_KEY not set in .env.local')
      return NextResponse.json({ error: 'Server not configured for Paddle API' }, { status: 500 })
    }

    const paddleEnv = process.env.PADDLE_ENV || process.env.NEXT_PUBLIC_PADDLE_ENV || 'production'
    const base = paddleEnv === 'sandbox' 
      ? 'https://sandbox-api.paddle.com/2.0/orders' 
      : 'https://api.paddle.com/2.0/orders'

    // Paddle v2 API uses Bearer token authentication
    const res = await fetch(`${base}/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paddleApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await res.json()
    console.log('✅ Paddle order verification result:', json)
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    console.error('❌ Error in /api/paddle/transactions POST:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
