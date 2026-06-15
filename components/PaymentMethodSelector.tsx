'use client'

import { formatCurrency } from '@/lib/prices'

interface PaymentMethodSelectorProps {
  amount: number
  currency: string
  packageId: 'basic' | 'standard' | 'premium'
}

export function PaymentMethodSelector({
  amount,
  currency,
  packageId,
}: PaymentMethodSelectorProps) {

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg border border-gray-200 relative z-10">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Secure Payment</h2>

      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            Your selected plan is ready for secure payment processing. The checkout flow is now handled through our current payment system.
          </p>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">Selected package</span>
            <span className="text-sm font-semibold text-gray-900">{packageId === 'basic' ? 'Basic' : packageId === 'standard' ? 'Standard' : 'Premium'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatCurrency(amount, currency)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-amber-900">
          No external Stripe checkout link is used on this page.
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4 sm:mt-6">
        Secure checkout is handled through the current payment flow on this site.
      </p>
    </div>
  )
}
