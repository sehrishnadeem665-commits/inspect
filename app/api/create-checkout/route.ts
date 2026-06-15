import { NextResponse } from 'next/server'

/**
 * POST /api/create-checkout
 * 
 * Paddle v2 Sandbox JWT Generation
 * 
 * This route generates a JWT token for Paddle v2 Sandbox checkout.
 * API KEY is kept secure server-side and never exposed to the frontend.
 * 
 * Request body:
 *   { productId: string }
 * 
 * Response:
 *   { jwt: string } - Valid Paddle JWT for checkout
 *   { error: string } - Error message if failed
 */

interface CheckoutRequest {
  productId: string
}

interface CheckoutResponse {
  jwt?: string
  error?: string
  details?: any
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequest
    const { productId } = body

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid productId' }, { status: 400 })
    }

    // Return the priceId for the client; no need to call Paddle API server-side
    return NextResponse.json({ priceId: productId })
  } catch (err: any) {
    console.error('[create-checkout] ❌', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
