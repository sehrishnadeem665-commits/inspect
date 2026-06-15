"use client"

import { useState, useEffect } from 'react'
import { Search, MapPin, DollarSign, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Vehicle {
  id: number
  registration_number?: string
  owner_name: string
  owner_email: string
  owner_phone?: string
  vehicle_title: string
  vehicle_year: number
  vehicle_make: string
  vehicle_model: string
  vehicle_type: string
  description?: string
  price: number
  currency: string
  images_json: string
  approved_at?: string
}

export default function RegisteredVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)

  useEffect(() => { fetchVehicles() }, [])

  useEffect(() => {
    applyFilters(vehicles, searchQuery, sortOrder)
    setPage(1)
  }, [sortOrder, vehicles])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicles/registered')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setVehicles(data.data || [])
      setFilteredVehicles(data.data || [])
    } catch (err) {
      console.error('Error fetching vehicles', err)
      setVehicles([])
      setFilteredVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase()
    setSearchQuery(q)
    applyFilters(vehicles, q, sortOrder)
    setPage(1)
  }

  const applyFilters = (list: Vehicle[], query: string, sort: 'newest' | 'oldest') => {
    let result = [...list]
    if (query) {
      result = result.filter(v =>
        v.vehicle_title.toLowerCase().includes(query) ||
        v.vehicle_make.toLowerCase().includes(query) ||
        v.vehicle_model.toLowerCase().includes(query) ||
        v.vehicle_type.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      const ta = a.approved_at ? new Date(a.approved_at).getTime() : 0
      const tb = b.approved_at ? new Date(b.approved_at).getTime() : 0
      return sort === 'newest' ? tb - ta : ta - tb
    })

    setFilteredVehicles(result)
  }

  const getImages = (imagesJson: string) => {
    try { const imgs = JSON.parse(imagesJson); return Array.isArray(imgs) ? imgs : [] } catch { return [] }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="text-center"><p className="text-gray-600">Loading registered vehicles...</p></div>
    </div>
  )

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize))

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Registered Vehicles</h1>
          <p className="text-gray-600 text-lg mb-8">Browse our collection of featured vehicles for sale</p>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input type="text" placeholder="Search by make, model, or type..." value={searchQuery} onChange={handleSearch} className="pl-12 h-12" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <label className="text-sm text-gray-600 mr-2">Sort:</label>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')} className="border border-gray-300 rounded-md px-3 py-2">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            <div className="ml-auto">
              <button onClick={() => setShowFormModal(true)} className="bg-amber-600 text-white px-4 py-2 rounded-lg">Add your listing</button>
            </div>
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12"><p className="text-gray-600 text-lg">{searchQuery ? 'No vehicles match your search' : 'No registered vehicles available yet'}</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.slice((page - 1) * pageSize, page * pageSize).map(vehicle => {
                const imgs = getImages(vehicle.images_json)
                const first = imgs[0]
                return (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                      {first ? <img src={`data:${first.type};base64,${first.data}`} alt={vehicle.vehicle_title} className="w-full h-full object-cover" /> : <p className="text-gray-500">No image</p>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">{vehicle.vehicle_title}</h3>
                      <div className="flex items-center gap-2 mb-3"><DollarSign className="w-4 h-4 text-amber-600" /><span className="text-xl font-bold text-amber-600">{vehicle.currency} {vehicle.price.toLocaleString()}</span></div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><span className="font-medium">Seller:</span> {vehicle.owner_name}</div>
                        <div><span className="font-medium">Email:</span> {vehicle.owner_email}</div>
                        {vehicle.owner_phone && <div><span className="font-medium">Phone:</span> {vehicle.owner_phone}</div>}
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{vehicle.vehicle_year}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{vehicle.vehicle_type}</span></div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => setSelectedVehicle(vehicle)} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-sm">View Details</button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{approvedMinutesAgo(vehicle.approved_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 border rounded disabled:opacity-50">Prev</button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button key={idx} onClick={() => setPage(idx + 1)} className={`px-3 py-2 border rounded ${page === idx + 1 ? 'bg-amber-600 text-white' : ''}`}>{idx + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-2 border rounded disabled:opacity-50">Next</button>
            </div>
          </>
        )}

        {/* Selected vehicle modal */}
        {selectedVehicle && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedVehicle(null)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="w-full bg-black">
                  {getImages(selectedVehicle.images_json).length > 0 ? (
                    <img src={`data:${getImages(selectedVehicle.images_json)[0].type};base64,${getImages(selectedVehicle.images_json)[0].data}`} alt={selectedVehicle.vehicle_title} className="w-full h-96 object-cover" />
                  ) : (
                    <div className="w-full h-96 bg-gray-300 flex items-center justify-center"><p className="text-gray-500">No image available</p></div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedVehicle.vehicle_title}</h2>
                      <p className="text-gray-600 mt-2">Listed by {selectedVehicle.owner_name}</p>
                      <p className="text-sm text-gray-600">Email: {selectedVehicle.owner_email}</p>
                      {selectedVehicle.owner_phone && <p className="text-sm text-gray-600">Phone: {selectedVehicle.owner_phone}</p>}
                    </div>
                    <button onClick={() => setSelectedVehicle(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-4xl font-bold text-amber-600 mb-2">{selectedVehicle.currency} {selectedVehicle.price.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div><p className="text-sm text-gray-600">Year</p><p className="text-lg font-semibold">{selectedVehicle.vehicle_year}</p></div>
                    <div><p className="text-sm text-gray-600">Type</p><p className="text-lg font-semibold">{selectedVehicle.vehicle_type}</p></div>
                  </div>

                  {selectedVehicle.description && (<div className="mb-6"><h3 className="font-semibold text-gray-900 mb-2">Description</h3><p className="text-gray-600">{selectedVehicle.description}</p></div>)}

                  {getImages(selectedVehicle.images_json).length > 1 && (
                    <div className="mb-6"><h3 className="font-semibold text-gray-900 mb-3">More Photos</h3><div className="grid grid-cols-4 gap-2">{getImages(selectedVehicle.images_json).map((img, idx) => (<img key={idx} src={`data:${img.type};base64,${img.data}`} alt={`Gallery ${idx + 1}`} className="w-full h-20 object-cover rounded-lg" />))}</div></div>
                  )}

                  <button onClick={() => setSelectedVehicle(null)} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors">Close</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Fixed top-right button for quick access on larger screens */}
        <button onClick={() => setShowFormModal(true)} className="hidden md:flex items-center justify-center fixed top-6 right-6 z-50 bg-amber-600 hover:bg-amber-700 text-white rounded-full w-14 h-14 shadow-lg" aria-label="Add your listing">+</button>

        {/* Modal that loads the register page in an iframe */}
        {showFormModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFormModal(false)} />
            <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b"><h3 className="text-lg font-semibold">Add your listing</h3><button onClick={() => setShowFormModal(false)} className="text-gray-600 text-2xl">×</button></div>
                <iframe src="/register-vehicle" className="w-full h-full border-0" title="Register Vehicle Form" />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

function approvedMinutesAgo(iso?: string) {
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
