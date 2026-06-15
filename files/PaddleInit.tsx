"use client"

import { useEffect } from 'react'

export default function PaddleInit() {
  useEffect(() => {
    // Poll until the Paddle script is available, then initialize once.
    const interval = setInterval(() => {
      const w = window as any
      if (w && w.Paddle && typeof w.Paddle.Setup === 'function') {
        const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
        
        if (!token) {
          console.error('❌ [Paddle] Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in environment')
          clearInterval(interval)
          return
        }
        
        try {
          // Initialize Paddle with client-side token using Setup method (v2 API)
          w.Paddle.Setup({
            token: token.trim()
          })
          console.log('✅ [Paddle] Initialized successfully with client token')
          console.log(`✅ [Paddle] Token: ${token.substring(0, 20)}...`)
          // Mark as initialized
          w.PADDLE_INITIALIZED = true
          console.log('✅ [Paddle] Setup complete')

          // Verify Checkout is ready
          if (w.Paddle.Checkout && typeof w.Paddle.Checkout.open === 'function') {
            console.log('✅ [Paddle] Checkout.open is ready')
          }
        } catch (e) {
          console.error('❌ [Paddle] Setup error:', e)
        }
        clearInterval(interval)
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return null
}
