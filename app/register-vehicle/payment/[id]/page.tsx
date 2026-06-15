"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCountry } from '@/contexts/CountryContext'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedCountry } = useCountry()
  const registrationId = params.id as string
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const registrationPrice = 30 // Fixed at $30

  const handlePayment = async () => {
    setError('Payment system is currently unavailable. Paddle integration has been removed.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <div className="w-12 h-1 bg-gray-300"></div>
            <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
              3
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Required</h1>
          <p className="text-gray-600 mb-8">Complete the payment to list your vehicle</p>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-amber-50 to-indigo-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-200">
              <div>
                <p className="text-gray-600 mb-1">Vehicle Registration Listing</p>
                <p className="text-sm text-gray-500">One-time fee to list your vehicle</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {selectedCountry.currency} {registrationPrice.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Unlimited vehicle photos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Admin review & approval</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Exposure to potential buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Email notification on approval</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-amber-900">
              <strong>Next Steps:</strong> After payment, your vehicle listing will be reviewed by our team within 24 hours. Once approved, it will appear in our "Registered Vehicles" section and you'll receive a confirmation email.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-600 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-lg py-6"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ${selectedCountry.currency} ${registrationPrice.toFixed(2)}`}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            Secure payment powered by Paddle
          </p>
        </div>
      </div>
    </div>
  )
}
