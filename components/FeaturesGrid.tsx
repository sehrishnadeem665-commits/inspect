"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, TrendingUp, FileText, AlertTriangle, Zap, Shield } from 'lucide-react'
import { useTranslations } from '@/lib/translations'

export default function FeaturesGrid() {
  const { t } = useTranslations()
  const [activeTab, setActiveTab] = useState('odometer')
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const tabs = [
    { id: 'odometer', label: 'Odometer Check' },
    { id: 'ownership', label: 'Ownership History' },
    { id: 'photos', label: 'Photos on Sale' },
    { id: 'damage', label: 'Damage Check' },
    { id: 'technical', label: 'Technical Data' },
    { id: 'stolen', label: 'Stolen VIN Check' },
  ]

  // Auto-cycle through tabs
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = tabs.findIndex((tab) => tab.id === prevTab)
        const nextIndex = (currentIndex + 1) % tabs.length
        return tabs[nextIndex].id
      })
    }, 5000) // Change tab every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlay, tabs])

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 animate-fade-in px-2 sm:px-4">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 leading-tight sm:leading-[1.2]">
            Make Smarter Car Decisions with Verified History Reports
          </h2>

          <p className="text-sm sm:text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
            Instantly uncover hidden issues, ownership records, mileage accuracy, and accident history with True Inspectify.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 sm:gap-4 md:gap-8 border-b border-border animate-fade-in-up">
          {tabs.map((tab) => (
            <div key={tab.id} className="relative min-w-max">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm md:text-base font-semibold pb-3 px-3 transition ${activeTab === tab.id
                  ? 'text-[#b08a5a]'
                  : 'text-muted-foreground hover:text-[#b08a5a]'
                  }`}
              >
                {tab.label}
              </button>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                {activeTab === tab.id && (
                  <div className="h-full bg-[#b08a5a] w-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 sm:mt-8 md:mt-10">

          {/* ODOMETER */}
          {activeTab === 'odometer' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/odometer-check-en@1x.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-[#b08a5a]/10 flex items-center justify-center rounded-xl">
                  <TrendingUp className="text-[#b08a5a]" />
                </div>

                <h3 className="text-2xl font-bold">Past Odometer Readings</h3>
                <p className="text-gray-600">
                  Detect mileage fraud by analyzing historical odometer records across multiple sources.
                </p>

                <Link href="/pricing" className="bg-[#b08a5a] hover:bg-[#b08a5a] text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  Check Your Car <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* OWNERSHIP */}
          {activeTab === 'ownership' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/ownership.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-[#b08a5a]/10 flex items-center justify-center rounded-xl">
                  <FileText className="text-[#b08a5a]" />
                </div>

                <h3 className="text-2xl font-bold">Ownership History</h3>
                <p className="text-gray-600">
                  Track previous owners, usage type, and complete ownership timeline.
                </p>

                <Link href="/pricing" className="bg-[#b08a5a] hover:bg-[#b08a5a] text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  Check Ownership <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* PHOTOS */}
          {activeTab === 'photos' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/photos-sale.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-[#b08a5a]/10 flex items-center justify-center rounded-xl">
                  <Zap className="text-[#b08a5a]" />
                </div>

                <h3 className="text-2xl font-bold">Photos on Sale</h3>
                <p className="text-gray-600">
                  Compare vehicle images over time and identify possible damage.
                </p>

                <Link href="/pricing" className="bg-[#b08a5a] hover:bg-[#b08a5a] text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  View Photos <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* DAMAGE */}
          {activeTab === 'damage' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/damage.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-amber-100 flex items-center justify-center rounded-xl">
                  <AlertTriangle className="text-amber-600" />
                </div>

                <h3 className="text-2xl font-bold">Damage Check</h3>
                <p className="text-gray-600">
                  Discover accident, flood, fire, and insurance-reported damages.
                </p>

                <Link href="/pricing" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  Check Damage <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* TECHNICAL */}
          {activeTab === 'technical' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/specification.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-[#b08a5a]/10 flex items-center justify-center rounded-xl">
                  <Zap className="text-[#b08a5a]" />
                </div>

                <h3 className="text-2xl font-bold">Technical Data</h3>
                <p className="text-gray-600">
                  Full specifications including engine, transmission, and features.
                </p>

                <button className="bg-[#b08a5a] hover:bg-[#b08a5a] text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  View Specs <ChevronRight />
                </button>
              </div>
            </div>
          )}

          {/* STOLEN */}
          {activeTab === 'stolen' && (
            <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start">

              <div className="relative w-full h-56 sm:h-72 md:h-80">
                <Image src="/stolen.webp" alt="" fill className="object-contain" />
              </div>

              <div className="space-y-5">
                <div className="w-14 h-14 bg-[#b08a5a]/10 flex items-center justify-center rounded-xl">
                  <Shield className="text-[#b08a5a]" />
                </div>

                <h3 className="text-2xl font-bold">Stolen VIN Check</h3>
                <p className="text-gray-600">
                  Verify if a vehicle is reported stolen or flagged.
                </p>

                <Link href="/pricing" className="bg-[#b08a5a] hover:bg-[#b08a5a] text-white px-6 py-3 rounded-full inline-flex items-center gap-2">
                  Verify Status <ChevronRight />
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Badge */}
        <div className="mt-10 sm:mt-16 p-4 sm:p-6 bg-[#b08a5a]/10 border border-[#b08a5a]/20 rounded-xl flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#b08a5a]/20 rounded-full flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold">Official NMVTIS Source</h4>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              True Inspectify is an approved NMVTIS provider helping prevent fraud and unsafe vehicle purchases.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
