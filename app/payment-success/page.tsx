'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const processPayment = async () => {
      try {
        const token = searchParams.get('token')
        const payerId = searchParams.get('PayerID')
        const internalOrderId = searchParams.get('orderId')

        if (!token) {
          setError('No payment token found')
          setIsProcessing(false)
          return
        }

        // In a real implementation, you would:
        // 1. Get the order details from your database using internalOrderId
        // 2. Call the capture-order API
        // 3. Handle the response

        setSuccess(true)
        setOrderId(internalOrderId || '')
        setIsProcessing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process payment')
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 mb-4">
              <span className="text-amber-700 text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-amber-700 hover:bg-amber-800"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <span className="text-green-700 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">
            Thank you for your payment.
          </p>
          {orderId && (
            <p className="text-gray-500 text-sm mb-4">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email with your receipt and next steps.
          </p>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-amber-700 hover:bg-amber-800"
            >
              <Link href="/registered-vehicles">View Your Reports</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          <p className="text-gray-500 text-xs mt-4">
            Your report will be available within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
