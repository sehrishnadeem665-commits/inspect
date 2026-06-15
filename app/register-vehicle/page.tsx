"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { parseJsonSafe } from '@/lib/utils'

interface FormData {
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  vehicleTitle: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleType: string
  vin: string
  licensePlate: string
  description: string
  price: string
}

export default function RegisterVehiclePage() {
  const router = useRouter()
  const { selectedCountry } = useCountry()
  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    vehicleTitle: '',
    vehicleYear: new Date().getFullYear().toString(),
    vehicleMake: '',
    vehicleModel: '',
    vehicleType: 'Car',
    vin: '',
    licensePlate: '',
    description: '',
    price: '',
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'SUV', 'Van', 'Sedan', 'Coupe', 'Hatchback', 'Crossover', 'Other']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }))
      return
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: 'Only image files are allowed' }))
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, images: 'Each image must be less than 5MB' }))
        return false
      }
      return true
    })

    setImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Email is required'
    if (!formData.ownerPhone.trim()) newErrors.ownerPhone = 'Phone is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail)) newErrors.ownerEmail = 'Invalid email format'
    if (!formData.vehicleTitle.trim()) newErrors.vehicleTitle = 'Vehicle title is required'
    if (!formData.vehicleMake.trim()) newErrors.vehicleMake = 'Make is required'
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Model is required'
    if (!formData.price) newErrors.price = 'Price is required'
    if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'
    if (images.length === 0) newErrors.images = 'At least 1 image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Create FormData for multipart upload
      const submitFormData = new FormData()
      submitFormData.append('ownerName', formData.ownerName)
      submitFormData.append('ownerEmail', formData.ownerEmail)
      submitFormData.append('ownerPhone', formData.ownerPhone)
      submitFormData.append('vehicleTitle', formData.vehicleTitle)
      submitFormData.append('vehicleYear', formData.vehicleYear)
      submitFormData.append('vehicleMake', formData.vehicleMake)
      submitFormData.append('vehicleModel', formData.vehicleModel)
      submitFormData.append('vehicleType', formData.vehicleType)
      submitFormData.append('vin', formData.vin)
      submitFormData.append('licensePlate', formData.licensePlate)
      submitFormData.append('description', formData.description)
      submitFormData.append('price', formData.price)
      submitFormData.append('currency', selectedCountry.currency)

      images.forEach((image, index) => {
        submitFormData.append(`images`, image)
      })

      const response = await fetch('/api/vehicle-registration/create', {
        method: 'POST',
        body: submitFormData,
      })

      let data
      try {
        data = await parseJsonSafe(response)
      } catch (err) {
        console.error('Failed to parse response:', err)
        throw new Error('Invalid response from server')
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create registration')
      }

      // Redirect to payment page with registration ID
      router.push(`/register-vehicle/payment/${data.registrationId}`)
    } catch (error) {
      console.error('Error submitting registration:', error)
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to submit registration'
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Register Your Vehicle</h1>
          <p className="text-gray-600">List your vehicle for sale and reach potential buyers</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          {/* Owner Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="ownerName"
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full h-10"
                  placeholder="John Doe"
                />
                {errors.ownerName && <p className="text-amber-600 text-sm mt-1">{errors.ownerName}</p>}
              </div>
              <div>
                <Label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  className="w-full h-10"
                  placeholder="john@example.com"
                />
                {errors.ownerEmail && <p className="text-amber-600 text-sm mt-1">{errors.ownerEmail}</p>}
              </div>
              <div>
                <Label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleInputChange}
                  className="w-full h-10"
                  placeholder="e.g., +1 555 555 5555"
                />
                {errors.ownerPhone && <p className="text-amber-600 text-sm mt-1">{errors.ownerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicleTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Title *
                </Label>
                <Input
                  id="vehicleTitle"
                  type="text"
                  name="vehicleTitle"
                  value={formData.vehicleTitle}
                  onChange={handleInputChange}
                  className="w-full h-10"
                  placeholder="e.g., 2020 Honda Civic Sedan"
                />
                {errors.vehicleTitle && <p className="text-amber-600 text-sm mt-1">{errors.vehicleTitle}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    className="w-full h-10"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-2">
                    Make *
                  </Label>
                  <Input
                    id="vehicleMake"
                    type="text"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleInputChange}
                    className="w-full h-10"
                    placeholder="Honda"
                  />
                  {errors.vehicleMake && <p className="text-amber-600 text-xs mt-1">{errors.vehicleMake}</p>}
                </div>
                <div>
                  <Label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </Label>
                  <Input
                    id="vehicleModel"
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    className="w-full h-10"
                    placeholder="Civic"
                  />
                  {errors.vehicleModel && <p className="text-amber-600 text-xs mt-1">{errors.vehicleModel}</p>}
                </div>
                <div>
                  <Label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </Label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full h-10 border border-gray-300 rounded-md px-3"
                  >
                    {vehicleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                    VIN (Optional)
                  </Label>
                  <Input
                    id="vin"
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleInputChange}
                    className="w-full h-10"
                    placeholder="17-character VIN"
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                    License Plate (Optional)
                  </Label>
                  <Input
                    id="licensePlate"
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full h-10"
                    placeholder="ABC1234"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Describe the condition, features, and any maintenance history..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
            <div className="max-w-xs">
              <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Asking Price ({selectedCountry.currency}) *
              </Label>
              <Input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full h-10"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && <p className="text-amber-600 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Images */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Photos *</h2>
            <p className="text-sm text-gray-600 mb-4">Upload up to 10 high-quality images of your vehicle</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
              </label>
            </div>
            {errors.images && <p className="text-amber-600 text-sm mt-2">{errors.images}</p>}

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {imagePreviewUrls.length} image{imagePreviewUrls.length !== 1 ? 's' : ''} uploaded
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-amber-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>
        </form>

        {/* Recent approved listings */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recently Listing</h2>
          <RecentListings />
        </div>
      </div>
    </div>
  )
}

function RecentListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/vehicles/registered')
        if (!mounted) return
        if (!res.ok) {
          console.error('Failed to fetch listings, status:', res.status)
          setListings([])
          return
        }
        let data: any = null
        try {
          data = await res.json()
        } catch (err) {
          console.error('Failed to parse listings JSON', err)
        }
        if (!mounted) return
        const items = data?.data || []
        setListings(items)
      } catch (err) {
        console.error('Error fetching listings:', err)
        setListings([])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <p className="text-gray-600">Loading listings...</p>
  if (listings.length === 0) return <p className="text-gray-600">No approved listings yet.</p>

  const minutesAgo = (iso?: string) => {
    if (!iso) return ''
    try {
      const diff = Date.now() - new Date(iso).getTime()
      const mins = Math.floor(diff / (60 * 1000))
      if (mins <= 0) return 'Approved just now'
      if (mins === 1) return 'Approved 1 minute ago'
      return `Approved ${mins} minutes ago`
    } catch {
      return ''
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.slice(0,6).map(v => {
          const imgs = v.images_json ? JSON.parse(v.images_json) : []
          const first = imgs[0]
          return (
            <div key={v.id} className="bg-white rounded-lg shadow p-4">
              <div className="h-40 bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                {first ? (
                  <img src={`data:${first.type};base64,${first.data}`} alt={v.vehicle_title} className="w-full h-full object-cover" />
                ) : (
                  <p className="text-gray-500">No image</p>
                )}
              </div>
              <h3 className="font-semibold">{v.vehicle_title}</h3>
              <p className="text-sm text-gray-600">{v.vehicle_make} {v.vehicle_model} • {v.vehicle_year}</p>
              <p className="text-sm text-gray-800 font-medium mt-2">{v.currency} {Number(v.price).toLocaleString()}</p>
              <div className="text-sm text-gray-600 mt-2">
                <p>Seller: {v.owner_name}</p>
                <p>Email: {v.owner_email}</p>
                {v.owner_phone && <p>Phone: {v.owner_phone}</p>}
                <p className="text-xs text-gray-500 mt-2">{minutesAgo(v.approved_at)}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/registered-vehicles')}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">Showing newest {Math.min(6, listings.length)} listings</p>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/registered-vehicles')}
            className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm"
          >
            View all listings
          </button>
          <button
            onClick={() => router.push('/register-vehicle')}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Add your listing
          </button>
        </div>
      </div>
    </div>
  )
}
