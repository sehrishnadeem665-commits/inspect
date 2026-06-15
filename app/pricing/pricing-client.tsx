'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Sparkles, Zap, Crown, Shield, TrendingUp, Clock } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from '@/lib/translations'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import GetReportForm from '@/components/GetReportForm'

import { PRICING_MAP, formatCurrency } from '@/lib/prices'

const PRIMARY = "#b08a5a"

const basePricingPlans = [
  {
    name: 'Premium',
    badge: 'GOLD',
    badgeColor: `bg-[${PRIMARY}]`,
    priceKey: 'premium' as const,
    icon: Crown,
    popular: false,
    borderColor: `border-[${PRIMARY}]`,
    iconBg: 'bg-amber-50',
    iconColor: `text-[${PRIMARY}]`,
    features: [
      'All Premium Features',
      'Accident Records',
      'Theft Records',
      'Salvage Records',
      'Open Recalls',
      'Odometer Readings',
      'Loan Details',
      'Market Value',
      'Specifications',
    ],
    buttonText: 'Select Plan',
  },
  {
    name: 'Basic',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-amber-600',
    priceKey: 'basic' as const,
    icon: Zap,
    popular: true,
    borderColor: 'border-amber-600',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    features: [
      'Accident Records',
      'Theft Records',
      'Salvage Records',
      'Open Recalls',
      'Lease Records',
    ],
    buttonText: 'Select Plan',
  },
  {
    name: 'Standard',
    badge: 'DIAMOND',
    badgeColor: 'bg-cyan-500',
    priceKey: 'standard' as const,
    icon: Sparkles,
    popular: false,
    borderColor: 'border-cyan-500',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    features: [
      'Accident Records',
      'Theft Records',
      'Salvage Records',
      'Open Recalls',
      'Odometer Readings',
      'Loan Details',
      'Market Value',
    ],
    buttonText: 'Select Plan',
  },
]

export default function PricingClient() {
  const { t } = useTranslations()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('basic')
  const sectionRef = useRef<HTMLDivElement>(null)

  const currencySymbol = '£'
  const pricing = PRICING_MAP['GBP']

  const pricingPlans = basePricingPlans.map(plan => ({
    ...plan,
    price: Number(pricing[plan.priceKey]).toFixed(0),
    currency: currencySymbol,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.1 })

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const handleSelectPlan = (planKey: 'basic' | 'standard' | 'premium') => {
    setSelectedPlan(planKey)
    setIsFormOpen(true)
  }

  return (
    <>
      <div ref={sectionRef} className="relative bg-gradient-to-b from-white via-amber-50/30 to-white overflow-hidden">

        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-200/30 blur-3xl rounded-full"></div>

        <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-20">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[${PRIMARY}]" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Simple & Transparent Pricing</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900">
              Choose Your Plan
            </h1>

            <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg">
              Get instant vehicle history reports with trusted data sources.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">

            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-2xl border-2 bg-white transition-all duration-300
                ${hoveredPlan === i ? 'shadow-2xl scale-105' : 'shadow-md'}
                ${plan.borderColor}`}
              >

                {/* Badge */}
                <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold text-white ${plan.badgeColor}`}>
                  {plan.badge}
                </div>

                <div className="p-6 sm:p-7 md:p-8 text-center">

                  {/* Icon */}
                  <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${plan.iconBg}`}>
                    <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold">{plan.name}</h3>

                  <div className="mt-4">
                    <span className="text-lg sm:text-xl font-semibold">{plan.currency}</span>
                    <span className="text-4xl sm:text-5xl font-bold">{plan.price}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 mt-2">One-time payment</p>

                  {/* Features */}
                  <div className="mt-6 space-y-2 text-left">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[${PRIMARY}]" />
                        <span className="text-xs sm:text-sm text-gray-700">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.priceKey)}
                    className={`mt-6 w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold text-white transition-all
                    ${plan.popular ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#b08a5a] hover:bg-[#b08a5a]'}`}
                  >
                    {plan.buttonText}
                  </button>

                </div>
              </div>
            ))}

          </div>

          {/* Note */}
          <div className="text-center mt-10 sm:mt-12 text-gray-600 text-xs sm:text-sm space-y-2">
            <p>✔ One-time payment only — no subscriptions</p>
            <p>✔ 14-day money-back guarantee</p>
            <p>✔ Instant digital delivery</p>
          </div>

        </div>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        preselectedPackage={selectedPlan}
      />

    </>
  )
}