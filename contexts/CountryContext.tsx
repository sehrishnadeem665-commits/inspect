"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Country {
  code: string
  name: string
  countryCode: string
  currency: string
  language: string
}

import countriesList from '@/lib/countries'

export const countries: Country[] = countriesList


interface CountryContextType {
  selectedCountry: Country
  setSelectedCountry: (country: Country) => void
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry] = useState<Country>(
    countries.find(c => c.code === 'US') || countries[0]
  )

  if (process.env.NODE_ENV !== 'production') {
    // quick debug: country is locked to US only
    console.log('[i18n] Country locked to:', selectedCountry.code)
  }

  useEffect(() => {
    try {
      // Keep the site locked to US settings, even if localStorage contains another country
      document.cookie = `cv_locale=${selectedCountry.language}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {
      // ignore localStorage / cookie errors
    }
  }, [selectedCountry])

  const setSelectedCountry = (_country: Country) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[i18n] Country selection disabled: keeping US only')
    }
  }

  return (
    <CountryContext.Provider value={{ selectedCountry: selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}
