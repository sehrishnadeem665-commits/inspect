"use client"

import React from 'react'

const packages = [
  { key: 'basic', name: 'Basic Plan' },
  { key: 'standard', name: 'Standard Plan' },
  { key: 'premium', name: 'Premium Plan' },
]

export default function SubscribeButtons() {
  return (
    <div className="flex gap-3">
      {packages.map((pkg) => (
        <button
          key={pkg.key}
          className="px-4 py-2 rounded bg-gray-400 text-white cursor-not-allowed opacity-50"
          disabled={true}
          title="Payment processing currently unavailable"
        >
          Subscribe to {pkg.name}
        </button>
      ))}
    </div>
  )
}
