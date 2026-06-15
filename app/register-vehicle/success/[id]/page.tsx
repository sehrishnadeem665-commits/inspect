"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Mail } from 'lucide-react'

export default function SuccessPage() {
  const params = useParams()
  const router = useRouter()
  const registrationId = params.id as string
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to confirm registration
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">Your vehicle listing is being processed</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">What Happens Next:</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">1</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Listing Under Review</p>
                  <p className="text-sm text-gray-600">Our team will review your vehicle details and photos within 24 hours.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">2</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Approval Notification</p>
                  <p className="text-sm text-gray-600">You'll receive an email confirming that your vehicle has been approved and is now listed.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">3</div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start Receiving Interest</p>
                  <p className="text-sm text-gray-600">Potential buyers can view your vehicle listing in our Registered Vehicles section.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <Mail className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="font-semibold text-amber-900 mb-1">Confirmation Email</p>
              <p className="text-sm text-amber-800">Check your email for payment confirmation and next steps. Don't forget to check your spam folder!</p>
            </div>
          </div>

          {/* Registration ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-gray-600 mb-1">Registration Number:</p>
            <p className="font-mono font-semibold text-gray-900">{registrationId}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="w-full">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/registered-vehicles" className="w-full">
              <Button variant="outline" className="w-full py-6 text-lg">
                View Registered Vehicles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
