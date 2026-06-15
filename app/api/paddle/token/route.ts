import { NextResponse } from 'next/server'

// Server route to generate a Paddle sandbox client token (ctok_...)
// This calls Paddle vendors API server-side using PADDLE_API_KEY (vendor_auth_code)
export async function GET() {
  try {
    // Paddle's vendors client token endpoint requires legacy vendor credentials (vendor_id + vendor_auth_code)
    const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID
    const PADDLE_VENDOR_AUTH_CODE = process.env.PADDLE_VENDOR_AUTH_CODE || process.env.PADDLE_VENDOR_AUTH || process.env.PADDLE_API_KEY

    if (!PADDLE_VENDOR_AUTH_CODE) {
      return NextResponse.json({ error: 'PADDLE_VENDOR_AUTH_CODE (legacy vendor_auth_code) not configured on server. Set PADDLE_VENDOR_ID and PADDLE_VENDOR_AUTH_CODE in your .env.' }, { status: 500 })
    }

    if (!PADDLE_VENDOR_ID) {
      console.warn('PADDLE_VENDOR_ID not provided — request may still succeed for some accounts but often requires vendor_id.')
    }

    // Try vendor_auth_code first, but support alternative param names just in case
    const tries = [
      { name: 'vendor_auth_code', value: PADDLE_VENDOR_AUTH_CODE },
      { name: 'vendor_auth_token', value: PADDLE_VENDOR_AUTH_CODE },
    ]

    let lastJson: any = null
    for (const t of tries) {
      const params = new URLSearchParams()
      if (PADDLE_VENDOR_ID) params.append('vendor_id', PADDLE_VENDOR_ID)
      params.append(t.name, t.value)

      const resp = await fetch('https://vendors.paddle.com/api/2.0/client/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })

      const json = await resp.json().catch(() => null)
      lastJson = json

      if (resp.ok && json && json.success) {
        const clientToken = json?.response?.client_token || json?.response?.clientToken
        if (clientToken) return NextResponse.json({ clientToken })
        return NextResponse.json({ error: 'No client token returned', details: json }, { status: 500 })
      }

      // continue to next try
    }

    // If we get here, all attempts failed. Return last response for debugging.
    return NextResponse.json({ error: 'Failed to generate client token', details: lastJson }, { status: 500 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
