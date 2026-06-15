"use client"

import { useState, useEffect } from 'react'
import { X, HelpCircle, Key, Hash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCountry } from '@/contexts/CountryContext'
import countriesList from '@/lib/countries'
import { Input as TextInput } from '@/components/ui/input'
import { useTranslations } from '@/lib/translations'
import { parseJsonSafe } from '@/lib/utils'
import { getPrice, formatCurrency, getExternalPriceId } from '@/lib/prices'

interface GetReportFormProps {
  isOpen: boolean
  onClose: () => void
  preselectedPackage?: string
  prefilledIdentType?: 'vin' | 'plate'
  prefilledIdentValue?: string
}

const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Boat', 'ATV', 'Campervan']

const packages = [
  { id: 'basic', name: 'Basic Report' },
  { id: 'standard', name: 'Standard Report' },
  { id: 'premium', name: 'Premium Report' },
]

export default function GetReportForm({ isOpen, onClose, preselectedPackage, prefilledIdentType, prefilledIdentValue }: GetReportFormProps) {
  const { selectedCountry } = useCountry()
  const { setSelectedCountry } = useCountry()
  const { t } = useTranslations()
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate'>('vin')
  const [vehicleType, setVehicleType] = useState('')
  const [vinNumber, setVinNumber] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(preselectedPackage || '')
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(selectedCountry?.code || 'US')
  // search filter for country dropdown
  const [countryFilter, setCountryFilter] = useState<string>('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const paddleAvailable = Boolean(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [showPayPal, setShowPayPal] = useState(false)

  useEffect(() => {
    if (preselectedPackage) {
      setSelectedPackage(preselectedPackage)
    }
  }, [preselectedPackage])

  useEffect(() => {
    // sync local country code with context when context changes
    if (selectedCountry && selectedCountry.code !== selectedCountryCode) {
      setSelectedCountryCode(selectedCountry.code)
    }
  }, [selectedCountry])

  useEffect(() => {
    if (prefilledIdentType && prefilledIdentValue) {
      setVehicleIdType(prefilledIdentType)
      if (prefilledIdentType === 'vin') {
        setVinNumber(prefilledIdentValue.toUpperCase())
      } else {
        setPlateNumber(prefilledIdentValue.toUpperCase())
      }
    }
  }, [prefilledIdentType, prefilledIdentValue])

  useEffect(() => {
    // If user only selected a package externally, preselect it
    if (preselectedPackage) setSelectedPackage(preselectedPackage)
  }, [preselectedPackage])

  const validateForm = () => {
    setError('')

    if (!vehicleType) {
      setError('Please select a vehicle type')
      return false
    }

    if (vehicleIdType === 'vin' && !vinNumber) {
      setError('Please enter a VIN number')
      return false
    }

    if (vehicleIdType === 'plate' && !plateNumber) {
      setError('Please enter a plate number')
      return false
    }

    if (!customerEmail) {
      setError('Please enter your email address')
      return false
    }

    if (!selectedPackage) {
      setError('Please select a package')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const packageData = packages.find(p => p.id === selectedPackage)
      const identificationValue = vehicleIdType === 'vin' ? vinNumber : plateNumber

      const localizedAmount = packageData ? getPrice(packageData.id as any, selectedCountry.currency) : undefined

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: customerEmail,
          vehicle_type: vehicleType,
          vin_number: vehicleIdType === 'vin' ? vinNumber : null,
          identification_type: vehicleIdType,
          identification_value: identificationValue,
          package_type: selectedPackage,
          country_code: selectedCountryCode || selectedCountry.code,
          currency: selectedCountry.currency,
          amount: packageData ? getPrice(packageData.id as any, selectedCountry.currency) : 19.99,
          // If an external price id exists (e.g. Stripe price), include it so it can be recorded with the order.
          paymentProvider: packageData ? (getExternalPriceId(packageData.id as any) ? `stripe:${getExternalPriceId(packageData.id as any)}` : undefined) : undefined,
        }),
      })

      // Read raw response text so we can surface meaningful error messages even when
      // the server returns an empty JSON object or no message fields.
      let data: any = null
      let rawText = ''
      try {
        rawText = await response.text()
        if (rawText) {
          try {
            data = JSON.parse(rawText)
          } catch (e) {
            // not JSON, keep raw text
            data = rawText
          }
        }
      } catch (err) {
        console.error('❌ Failed to read create order response body:', err)
        throw new Error('Failed to create order (invalid response from server)')
      }

      if (!response.ok) {
        // Normalize error message from various API shapes and fallback to status text or raw body
        const errorMsg = (data && typeof data === 'object' ? (data.error || data.message) : undefined) || (typeof data === 'string' ? data : undefined) || response.statusText || `Failed to create order (status ${response.status})`
        console.error('❌ Order creation failed:', { status: response.status, statusText: response.statusText, body: data, rawText })
        throw new Error(errorMsg || 'Failed to create order')
      }

      console.log('✅ Order created successfully:', data)
      if (data.success && data.orderId) {
        setOrderId(data.orderId)
        console.log('🔄 Redirecting to checkout...')
        // Redirect to a dedicated checkout page for this order
        if (typeof window !== 'undefined') {
          window.location.href = `/checkout/${data.orderId}`
          return
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order. Please try again.'
      setError(errorMessage)
      console.error('❌ Error in handleSubmit:', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = async (paymentId: string) => {
    try {
      const response = await fetch('/api/orders/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentId,
        }),
      })

      // Read raw response text and parse locally so we can log raw body when needed
      let data: any = null
      let rawText = ''
      try {
        rawText = await response.text()
        if (rawText) {
          try {
            data = JSON.parse(rawText)
          } catch (e) {
            data = rawText
          }
        }
      } catch (err) {
        console.error('Failed to read complete order response body:', err)
        throw new Error('Failed to complete order (invalid response)')
      }

      if (!response.ok) {
        const msg = (data && typeof data === 'object' ? data.error || data.message : undefined) || (typeof data === 'string' ? data : undefined) || response.statusText || 'Failed to complete order'
        console.error('Failed to complete order:', { status: response.status, statusText: response.statusText, body: data, rawText })
        throw new Error(msg)
      }

      // Show success popup instead of native alert
      import('@/lib/swal').then(mod => mod.showSwal({ title: 'Payment successful!', text: 'You will receive your report via email shortly.', icon: 'success' })).catch(() => {})

      setVehicleType('')
      setVinNumber('')
      setPlateNumber('')
      setCustomerEmail('')
      setSelectedPackage('')
      setShowPayPal(false)
      setOrderId(null)

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete order. Please contact support.')
      console.error('Error completing order:', err)
    }
  }

  const getPackageAmount = () => {
    const packageData = packages.find(p => p.id === selectedPackage)
    return packageData ? getPrice(packageData.id as any, selectedCountry.currency) : 19.99
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[9999] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{t('form_title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                Search By
              </Label>
              <div className="mb-2">
                <div className="inline-flex items-center bg-gray-100 rounded-full p-1 gap-1">
                  <button type="button" onClick={() => setVehicleIdType('vin')} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${vehicleIdType === 'vin' ? 'bg-[#0f4c81] text-white shadow' : 'text-black hover:bg-gray-200'}`}>
                    <Key className="w-4 h-4" />
                    <span className="text-sm font-medium">By VIN</span>
                  </button>
                  <button type="button" onClick={() => setVehicleIdType('plate')} className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${vehicleIdType === 'plate' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow' : 'text-black hover:bg-gray-200'}`}>
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">By Plate</span>
                  </button>
                </div>
              </div>
            </div>

            {vehicleIdType === 'vin' ? (
              <div>
                <Label htmlFor="vin" className="block text-sm font-semibold text-gray-900 mb-2">
                  VIN Number
                </Label>
                <div className="relative">
                  <Input
                    id="vin"
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                    placeholder="Enter VIN number"
                    required
                    className="h-12 pr-10"
                    maxLength={17}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter your 17-character Vehicle Identification Number</p>
              </div>
            ) : (
              <div>
                <Label htmlFor="plate" className="block text-sm font-semibold text-gray-900 mb-2">
                  Plate Number
                </Label>
                <Input
                  id="plate"
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="Enter Plate Number"
                  required
                  className="h-12"
                />
                <p className="text-xs text-gray-500 mt-1">Enter your vehicle&apos;s license plate number</p>
              </div>
            )}

            <div>
              <Label htmlFor="vehicleType" className="block text-sm font-semibold text-gray-900 mb-2">
                Vehicle Type
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent className="z-[10000]">
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="h-12"
              />
            </div>

            {/* Country & State */}
            <div>
              <Label className="block text-sm font-semibold text-gray-900 mb-2">Country</Label>
              <Select value={selectedCountryCode} onValueChange={(v) => {
                setSelectedCountryCode(v)
                const found = countriesList.find(c => c.code === v)
                if (found) setSelectedCountry(found)
              }}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="z-[10000] max-h-60 overflow-auto">
                  <div className="p-2">
                    <TextInput
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      placeholder="Search countries"
                      className="mb-2 h-9"
                    />
                  </div>
                  {countriesList
                    .filter(c => c.name.toLowerCase().includes(countryFilter.toLowerCase()) || c.code.toLowerCase().includes(countryFilter.toLowerCase()))
                    .map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            

            <div>
              <Label className="block text-sm font-semibold text-gray-900 mb-2">Package</Label>
              <div className="flex gap-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`flex-1 p-3 rounded-lg border transition-all text-left ${selectedPackage === pkg.id ? 'bg-[#0f4c81] text-white border-transparent shadow' : 'bg-white border-gray-200 hover:shadow-sm'}`}
                  >
                    <div className="font-semibold">{pkg.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{formatCurrency(getPrice(pkg.id as any, selectedCountry.currency), selectedCountry.currency, `${selectedCountry.language}-${selectedCountry.code}`)}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600">{error}</p>
              </div>
            )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12"
                  disabled={isSubmitting}
                >
                  {t('form_cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Order...' : t('form_continue')}
                </Button>
              </div>
          </form>
        </div>
      </div>
    </>
  )
}
