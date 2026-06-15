"use client"

import { useState, useEffect, useRef } from 'react'
import { Info, CheckCircle, Key, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'

const trustLogos = [
  { name: 'AutoBild', width: 'w-20' },
  { name: 'TopGear', width: 'w-20' },
  { name: 'Forbes', width: 'w-20' },
  { name: 'REUTERS', width: 'w-20' },
]

export default function VinChecker() {
  const [vin, setVin] = useState('')
  const [vinError, setVinError] = useState('')
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate'>('vin')
  const [plate, setPlate] = useState('')
  const [plateError, setPlateError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslations()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 px-4 bg-gradient-to-br from-[#b08a5a]/10 via-white to-[#b08a5a]/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">

        <div
          className={`relative bg-gradient-to-br from-[#b08a5a] via-[#8b6a43] to-[#b08a5a] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >

          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#b08a5a]/40 via-transparent to-black/20"></div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#b08a5a]/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse"></div>

          <div className="relative px-6 md:px-12 lg:px-16 py-12 md:py-16 grid lg:grid-cols-2 gap-8 items-center">

            {/* LEFT SIDE */}
            <div className="space-y-6 text-white">

              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
                True Inspectify Vehicle Intelligence
              </h2>

              <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed">
                Instantly uncover accident history, mileage records, ownership changes, and hidden issues before buying any car.
              </p>

              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs sm:text-sm md:text-base">
                  Trusted by 4.5M+ users across 35+ countries
                </span>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {trustLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
                  >
                    <span className="text-white text-[10px] sm:text-xs md:text-sm font-semibold">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white rounded-2xl shadow-2xl p-5">

              {/* Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex bg-gray-100 p-1 rounded-full">

                  <button
                    onClick={() => setVehicleIdType('vin')}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
                      vehicleIdType === 'vin'
                        ? 'bg-[#b08a5a] text-white'
                        : 'text-black'
                    }`}
                  >
                    By VIN
                  </button>

                  <button
                    onClick={() => setVehicleIdType('plate')}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
                      vehicleIdType === 'plate'
                        ? 'bg-[#b08a5a] text-white'
                        : 'text-black'
                    }`}
                  >
                    Plate
                  </button>

                </div>
              </div>

              {/* INPUT */}
              {vehicleIdType === 'vin' ? (
                <Input
                  placeholder="Enter VIN Number"
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  className="text-sm sm:text-base md:text-lg py-4 sm:py-6 placeholder:text-xs sm:placeholder:text-sm"
                />
              ) : (
                <Input
                  placeholder="Enter Plate Number"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="text-sm sm:text-base md:text-lg py-4 sm:py-6 placeholder:text-xs sm:placeholder:text-sm"
                />
              )}

              {/* BUTTON */}
              <Button
                onClick={() => setIsFormOpen(true)}
                className="w-full mt-4 bg-[#b08a5a] hover:bg-[#b08a5a] text-white font-bold py-3 text-sm sm:text-base"
              >
                Get Report
              </Button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Powered by True Inspectify Data Engine
              </p>

            </div>

          </div>

          {/* bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>

        </div>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  )
}