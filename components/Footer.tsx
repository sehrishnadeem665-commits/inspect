"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { useTranslations } from '@/lib/translations'

const footerLinks = [
  { key: 'footer_privacy', href: '/privacy' },
  { key: 'footer_terms', href: '/terms' },
  { key: 'footer_refund', href: '/refund-policy' },
]

const socialLinks = [
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const { t } = useTranslations()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)

  return (
    <footer className="relative overflow-hidden text-white bg-gradient-to-b from-[#b08a5a] via-[#7a5a33] to-[#03182f]">

      {/* glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#b08a5a]/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#b08a5a]/20 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 py-12">

        {/* TEXT */}
        <div className="border-b border-white/10 pb-6 text-center">
          <p className="text-[11px] sm:text-xs md:text-sm text-white/70 leading-relaxed">

            <span className="block mb-2">
           All Rights Reserved. {new Date().getFullYear()} © True Inspectify. {''}
            </span>

            <Link href="/terms" className="text-amber-200 hover:text-amber-400 transition">
             <u> Terms & Conditions</u>
            </Link>
            {' , '}
            <Link href="/privacy" className="text-amber-200 hover:text-amber-400 transition">
             <u> Privacy Policy</u>
            </Link>
            {' , '}
            <Link href="/refund-policy" className="text-amber-200 hover:text-amber-400 transition">
             <u> Refund Policy</u>
            </Link>

            <span className="block mt-2">
              An approved NMVTIS data provider.
            </span>

            <span className="block mt-2">
              <span className="text-white/90">Email: info@trueinspectify.com</span>
            </span>
          </p>
        </div>

        {/* PAYMENT */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">

            <img src="/paypal-icon.svg" className="h-6 opacity-80 hover:opacity-100 transition" />
            <img src="/master-card-icon.svg" className="h-6 opacity-80 hover:opacity-100 transition" />
            <img src="/visa-icon.svg" className="h-6 opacity-80 hover:opacity-100 transition" />
            <img src="/norton-extra-text-icon.svg" className="h-6 opacity-80 hover:opacity-100 transition" />

          </div>
        </div>

      </div>

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#b08a5a] to-transparent" />
    </footer>
  )
}
