'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PaymentCancel() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <span className="text-yellow-700 text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been cancelled. No charges have been made to your account.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => router.back()}
              className="w-full bg-amber-700 hover:bg-amber-800"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
