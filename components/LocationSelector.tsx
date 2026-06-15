"use client"

import { useState } from 'react'
import { useCountry } from '@/contexts/CountryContext'
import { MapPin } from 'lucide-react'
import LocationPopup from './LocationPopup'

export default function LocationSelector() {
  const { selectedCountry } = useCountry()
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition text-sm font-medium text-foreground"
        title="Change location and currency"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden sm:inline">{selectedCountry.code}</span>
        <span className="sm:hidden">📍</span>
      </button>
      {showPopup && <LocationPopupModal onClose={() => setShowPopup(false)} />}
    </>
  )
}

// Separate modal component that can be triggered manually
function LocationPopupModal({ onClose }: { onClose: () => void }) {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const [searchQuery, setSearchQuery] = useState('')
  const { countries } = require('@/contexts/CountryContext')

  const [filteredCountries, setFilteredCountries] = useState(countries)

  // Filter countries based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredCountries(countries)
    } else {
      const q = query.toLowerCase()
      setFilteredCountries(
        countries.filter((country: any) =>
          country.name.toLowerCase().includes(q) ||
          country.code.toLowerCase().includes(q) ||
          country.currency.toLowerCase().includes(q)
        )
      )
    }
  }

  const handleSelectCountry = (country: any) => {
    setSelectedCountry(country)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-700">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Change Location</h2>
              <p className="text-amber-100 text-sm">Select your country to adjust currency and language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-600 rounded-lg transition text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Search Box */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by country name or code..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Countries List */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country: any) => (
                <button
                  key={country.code}
                  onClick={() => handleSelectCountry(country)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedCountry.code === country.code
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="font-semibold">{country.name}</div>
                  <div className={`text-sm ${selectedCountry.code === country.code ? 'text-amber-100' : 'text-gray-600'}`}>
                    {country.currency} • {country.code}
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <p>No countries found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Currently selected: <span className="font-semibold">{selectedCountry.name}</span>
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
