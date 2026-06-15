'use client'

import { useState, useEffect } from 'react'
import {
  Shield, Users, Globe2, CheckCircle2, Database, Clock,
  Award, Heart, Zap, Eye
} from 'lucide-react'
import Image from 'next/image'

const stats = [
  { value: 900, suffix: '+', label: 'Data Sources Worldwide', icon: Database },
  { value: 5, suffix: 'M+', label: 'Vehicle Reports Delivered', icon: CheckCircle2 },
  { value: 50, suffix: '+', label: 'Countries Supported', icon: Globe2 },
  { value: 24, suffix: '/7', label: 'Customer Support', icon: Clock }
]

const values = [
  {
    icon: Shield,
    title: 'Verified & Trusted Data',
    description:
      'We collect and analyze vehicle data from trusted global databases to ensure every report is accurate, reliable, and up to date.'
  },
  {
    icon: Users,
    title: 'Built for Buyers & Sellers',
    description:
      'Our platform helps both buyers and sellers make confident decisions with complete transparency and reduced risk.'
  },
  {
    icon: Eye,
    title: 'Full Vehicle Transparency',
    description:
      'From accident history to mileage checks, we reveal the complete truth behind every vehicle before you buy.'
  },
  {
    icon: Zap,
    title: 'Fast Digital Reports',
    description:
      'Instant online reports powered by advanced technology so you can make decisions without delays.'
  }
]

export default function AboutUsClient() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState([0, 0, 0, 0])

  useEffect(() => {
    setIsVisible(true)

    const duration = 1800
    const steps = 60
    const interval = duration / steps

    stats.forEach((stat, index) => {
      let current = 0
      const inc = stat.value / steps

      const timer = setInterval(() => {
        current += inc
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }

        setCounters(prev => {
          const updated = [...prev]
          updated[index] = Math.floor(current)
          return updated
        })
      }, interval)
    })
  }, [])

  return (
    <div className="bg-white">

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#b08a5a]/10 via-white to-gray-50">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#b08a5a15,transparent_60%)]" />

        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center max-w-4xl">

          <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#b08a5a]/10 text-[#b08a5a] font-semibold border border-[#b08a5a]/20 text-xs sm:text-sm">
            <Shield size={16} /> About True Inspectify
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mt-4 sm:mt-6 leading-tight">
            Driving <span className="text-[#b08a5a]">Trust</span> Through Vehicle Data
          </h1>

          <p className="text-gray-600 mt-4 sm:mt-5 text-sm sm:text-base md:text-lg">
            True Inspectify is a digital vehicle history platform built to help people make safer,
            smarter, and more transparent car buying decisions.
          </p>

        </div>
      </div>

      {/* STATS */}
      <div className="container mx-auto px-4 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {stats.map((s, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-xl hover:border-[#b08a5a]/30 transition-all"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#b08a5a]/10 flex items-center justify-center group-hover:scale-110 transition">
                <s.icon className="text-[#b08a5a]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mt-3 text-gray-900">
                {counters[i]}{s.suffix}
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* STORY */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">

          <div className="space-y-4 sm:space-y-5">

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
              Why We Built <span className="text-[#b08a5a]">True Inspectify</span>
            </h2>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Buying a used car can be risky. Hidden accidents, mileage fraud, and incomplete history
              often lead to financial loss. We created True Inspectify to solve this problem.
            </p>

            <p className="text-gray-600 text-sm sm:text-base">
              Our platform gives you instant access to verified vehicle history reports so you can
              avoid scams and make confident decisions before buying any vehicle.
            </p>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-gray-700">
                <Award className="text-[#b08a5a]" /> Trusted Reports
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="text-[#b08a5a]" /> User Focused
              </div>
            </div>

          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-[#b08a5a]/10 rounded-3xl blur-2xl"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border">
              <Image
                src="/about-car.jpg"
                alt="About"
                width={800}
                height={500}
                className="object-cover"
              />

              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 p-6 text-white">
                <h3 className="text-xl font-bold">Global Vehicle Intelligence</h3>
                <p className="text-sm text-white/80">
                  Accurate data • Real-time reports • Trusted insights
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* VALUES */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold">
            Our <span className="text-[#b08a5a]">Core Values</span>
          </h2>
          <p className="text-gray-600 mt-2 sm:mt-3 text-sm sm:text-base">
            The principles that define how we build trust and deliver value
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {values.map((v, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-2xl border bg-white hover:shadow-xl hover:border-[#b08a5a]/30 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-[#b08a5a]/10 flex items-center justify-center mb-4">
                <v.icon className="text-[#b08a5a]" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold">{v.title}</h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">{v.description}</p>
            </div>
          ))}

        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#b08a5a] to-black py-12 sm:py-14 md:py-16 text-center text-white">

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold">
          Start Your Vehicle Check Today
        </h2>

        <p className="text-white/80 mt-3 text-sm sm:text-base">
          Get instant reports and protect yourself from risky car purchases
        </p>

        <button className="mt-6 bg-white text-[#b08a5a] hover:bg-gray-200 font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
          Get Report Now
        </button>

      </div>

    </div>
  )
}