'use client'

import { useState, useEffect } from 'react'
import { X, HelpCircle, Key, Hash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslations } from '@/lib/translations'
import { getPrice, formatCurrency } from '@/lib/prices'

interface GetReportFormProps {
  isOpen: boolean
  onClose: () => void
  preselectedPackage?: string
  prefilledIdentType?: 'vin' | 'plate'
  prefilledIdentValue?: string
}

const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Boat', 'ATV', 'RVS', 'Caravan', 'Motorhome', 'Campervan']
const packages: Array<{ id: 'basic' | 'standard' | 'premium'; name: string }> = [
  { id: 'basic', name: 'Basic Report' },
  { id: 'standard', name: 'Standard Report' },
  { id: 'premium', name: 'Premium Report' },
]

const STRIPE_CHECKOUT_URLS: Record<'basic' | 'standard' | 'premium', string> = {
  basic: 'https://buy.stripe.com/00w7sL6hx0Nxbkp5k6bo403',
  standard: 'https://buy.stripe.com/fZu7sL5dtao7gEJ3bYbo401',
  premium: 'https://buy.stripe.com/00w9ATdJZgMvaglcMybo402',
}

export default function GetReportForm({ isOpen, onClose, preselectedPackage, prefilledIdentType, prefilledIdentValue }: GetReportFormProps) {
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate'>('vin')
  const [vehicleType, setVehicleType] = useState('')
  const [vinNumber, setVinNumber] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(preselectedPackage || '')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prefill values coming from the banner when the form opens.
  useEffect(() => {
    if (!isOpen) return

    if (prefilledIdentType === 'plate') {
      setVehicleIdType('plate')
      setPlateNumber(prefilledIdentValue || '')
      setVinNumber('')
    } else {
      setVehicleIdType('vin')
      setVinNumber(prefilledIdentValue || '')
      setPlateNumber('')
    }

    if (preselectedPackage) {
      setSelectedPackage(preselectedPackage)
    }
  }, [isOpen, prefilledIdentType, prefilledIdentValue, preselectedPackage])

  // Add dropdown styling
  useEffect(() => {
    if (!isOpen) return
    
    const style = document.createElement('style')
    style.textContent = `
      [role="option"]:hover {
        background-color: #b08a5a !important;
        color: white !important;
      }
      [role="option"][data-state="checked"] {
        background-color: #b08a5a !important;
        color: white !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style)
    }
  }, [isOpen])

  const validateForm = () => {
    setError('')
    if (!vehicleType) return setError('Select vehicle type'), false
    if (vehicleIdType === 'vin' && !vinNumber) return setError('Enter VIN'), false
    if (vehicleIdType === 'plate' && !plateNumber) return setError('Enter plate number'), false
    if (!customerName.trim()) return setError('Enter full name'), false
    if (!customerPhone.trim()) return setError('Enter phone number'), false
    if (!customerEmail) return setError('Enter email'), false
    if (!selectedPackage) return setError('Select a package'), false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      // Prepare form data
      const formData = {
        packageId: selectedPackage,
        currency: 'GBP',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail,
        vehicleIdentifier: vehicleIdType === 'vin' ? vinNumber : plateNumber,
        vehicleType,
        amount: getPrice(selectedPackage as any, 'GBP'),
      }
      
      // Send form submission to admin email
      console.log('📧 Sending form submission to admin...')
      const submissionResponse = await fetch('/api/report-form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!submissionResponse.ok) {
        console.warn('⚠️ Form submission email failed:', submissionResponse.status)
        // Continue even if email fails
      } else {
        console.log('✅ Form submission email sent successfully')
      }

      // Store payment form data in sessionStorage for fallback / checkout flow.
      sessionStorage.setItem('paymentFormData', JSON.stringify(formData))

      const checkoutUrl = STRIPE_CHECKOUT_URLS[selectedPackage as keyof typeof STRIPE_CHECKOUT_URLS]
      if (checkoutUrl) {
        window.location.assign(checkoutUrl)
        return
      }

      window.location.href = '/checkout'
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process payment. Please try again.'
      setError(errorMessage)
      console.error('❌ Error in handleSubmit:', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="fixed inset-x-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[9999] rounded-2xl sm:rounded-3xl shadow-2xl w-[calc(100vw-1.5rem)] max-w-2xl max-h-[95vh] overflow-hidden border border-[#b08a5a]/20 flex flex-col">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#b08a5a] via-[#a67c4a] to-[#b08a5a] border-b border-[#b08a5a]/30 px-4 py-4 sm:px-8 sm:py-6 flex items-start sm:items-center justify-between flex-shrink-0 relative z-10 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              Get Vehicle Report
            </h2>
            <p className="text-[11px] sm:text-xs text-white/80 mt-1 leading-snug">Quick and easy vehicle information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/20 rounded-xl transition-colors duration-200"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6 text-white hover:text-white/80 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Search Type Selection */}
            <div className="bg-gradient-to-br from-[#b08a5a]/5 to-[#a67c4a]/5 p-4 rounded-xl border border-[#b08a5a]/30">
              <Label className="block text-sm font-semibold text-foreground mb-3">
                Search By
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleIdType('vin')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    vehicleIdType === 'vin'
                      ? 'bg-gradient-to-r from-[#b08a5a] to-[#b08a5a] text-white shadow-lg shadow-[#b08a5a]/40 scale-105'
                      : 'bg-white border-2 border-[#b08a5a]/30 text-foreground hover:border-[#b08a5a]/60 hover:bg-[#b08a5a]/5'
                  }`}
                >
                  <Key className="w-5 h-5" />
                  <span>By VIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleIdType('plate')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    vehicleIdType === 'plate'
                      ? 'bg-gradient-to-r from-[#b08a5a] to-[#b08a5a] text-white shadow-lg shadow-[#b08a5a]/40 scale-105'
                      : 'bg-white border-2 border-[#b08a5a]/30 text-foreground hover:border-[#b08a5a]/60 hover:bg-[#b08a5a]/5'
                  }`}
                >
                  <Hash className="w-5 h-5" />
                  <span>By Plate</span>
                </button>
              </div>
            </div>

            {/* VIN or Plate Input */}
            {vehicleIdType === 'vin' ? (
              <div className="space-y-2">
                <Label htmlFor="vin" className="block text-sm font-semibold text-foreground">
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
                    className="h-12 pr-10 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] focus:ring-2 focus:ring-[#b08a5a]/20 bg-white transition-colors"
                    maxLength={17}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#b08a5a] transition-colors"
                    title="VIN (Vehicle Identification Number) is a unique 17-character code"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter your 17-character Vehicle Identification Number
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="plate" className="block text-sm font-semibold text-foreground">
                  License Plate Number
                </Label>
                <Input
                  id="plate"
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  placeholder="Enter Plate Number"
                  required
                  className="h-12 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] focus:ring-2 focus:ring-[#b08a5a]/20 bg-white transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your vehicle&apos;s license plate number
                </p>
              </div>
            )}

            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType" className="block text-sm font-semibold text-foreground">
                Vehicle Type
              </Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger className="h-12 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] bg-white">
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

            {/* Customer Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="block text-sm font-semibold text-foreground">
                  Full Name
                </Label>
                <Input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="h-12 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] focus:ring-2 focus:ring-[#b08a5a]/20 bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="block text-sm font-semibold text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                  className="h-12 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] focus:ring-2 focus:ring-[#b08a5a]/20 bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="h-12 border-2 border-[#b08a5a]/30 focus:border-[#b08a5a] focus:ring-2 focus:ring-[#b08a5a]/20 bg-white transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                We'll send the report to this email address
              </p>
            </div>

            {/* Package Selection */}
            <div className="space-y-3">
              <Label className="block text-sm font-semibold text-foreground">
                Select Your Package
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center group ${
                      selectedPackage === pkg.id
                        ? 'bg-gradient-to-br from-[#b08a5a]/15 to-[#a67c4a]/10 border-[#b08a5a] shadow-lg shadow-[#b08a5a]/20'
                        : 'bg-white border-[#b08a5a]/30 hover:border-[#b08a5a]/60 hover:bg-[#b08a5a]/5 hover:shadow-md'
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground group-hover:text-[#b08a5a] transition-colors">
                      {pkg.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 font-semibold">
                      {formatCurrency(
                        getPrice(pkg.id as any, 'GBP'),
                        'GBP'
                      )}
                    </div>
                    <span className="mt-3 block text-xs text-[#b08a5a] font-semibold">
                      Select package
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl animate-in fade-in">
                <p className="text-sm font-medium text-amber-700">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[#b08a5a]/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:flex-1 h-12 rounded-lg font-semibold border-2 border-[#b08a5a]/30 text-foreground hover:bg-[#b08a5a]/5 hover:border-[#b08a5a]/60"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 h-12 rounded-lg font-semibold bg-gradient-to-r from-[#b08a5a] to-[#b08a5a] hover:from-[#b08a5a] hover:to-[#480000] text-white shadow-lg shadow-[#b08a5a]/40 disabled:opacity-60 transition-all"
                disabled={isSubmitting || !selectedPackage}
              >
                {isSubmitting
                  ? 'Processing...'
                  : `Continue to Payment - ${
                      selectedPackage
                        ? formatCurrency(
                            getPrice(selectedPackage as any, 'GBP'),
                            'GBP'
                          )
                        : '£0'
                    }`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}