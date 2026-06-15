"use client"

import React from 'react'

export default function OrderPay({ priceId, currency, amount }: { priceId?: string; currency?: string; amount?: number | string }) {
  const displayAmount = amount ? Number(amount).toFixed(2) : ''

  return (
    <div className="mt-6 text-center">
      <div className="mb-3 text-sm text-gray-700">Payment Processing</div>
      <div className="text-sm text-amber-600">
        Payment system is currently unavailable. Paddle integration has been removed.
      </div>
    </div>
  )
}
