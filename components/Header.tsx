"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu } from 'lucide-react'
import { useTranslations } from '@/lib/translations'

export default function Header() {
  const { t } = useTranslations()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navLink = (href: string) =>
    `relative font-medium tracking-wide transition-all duration-300 group ${
      isActiveLink(href)
        ? 'text-[#b08a5a] rounded-full px-1 py-1'
        : 'text-gray-700 hover:text-[#b08a5a]'
    }`

  const activeLine = (href: string) =>
    `absolute left-0 -bottom-1 h-[2px] transition-all duration-300 ${
      isActiveLink(href)
        ? 'w-full bg-[#b08a5a]'
        : 'w-0 bg-[#b08a5a] group-hover:w-full'
    }`

  return (
    <>
      <header className="sticky top-0 z-[40] bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 max-w-[160px] sm:max-w-[220px] min-w-0">
              <Image
                src="/logo.png"
                alt="True Inspectify"
                width={220}
                height={48}
                className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                priority
              />
            </Link>

            {/* NAV */}
            <nav className="hidden md:flex items-center space-x-10">
              <Link href="/" className={navLink('/')}>
                {t('nav_home')}
                <span className={activeLine('/')}></span>
              </Link>

              <Link href="/pricing" className={navLink('/pricing')}>
                {t('nav_pricing')}
                <span className={activeLine('/pricing')}></span>
              </Link>

              <Link href="/contact-us" className={navLink('/contact-us')}>
                {t('nav_contact')}
                <span className={activeLine('/contact-us')}></span>
              </Link>

              <Link href="/about-us" className={navLink('/about-us')}>
                {t('nav_about')}
                <span className={activeLine('/about-us')}></span>
              </Link>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

                {/* MOBILE MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BORDER ACCENT */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#b08a5a] to-transparent"></div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white p-6">
          <div className="flex justify-between items-center mb-8">
            <Image
              src="/logo.png"
              alt="True Inspectify"
              width={180}
              height={36}
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X />
            </button>
          </div>

          <div className="space-y-3 text-sm sm:text-base font-semibold tracking-wide">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`block rounded-xl px-3 py-2 transition ${isActiveLink('/') ? 'bg-gradient-to-r from-[#b08a5a] to-amber-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.18)]' : 'text-gray-800 hover:bg-amber-50 hover:text-[#b08a5a]'}`} >Home</Link>
            <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className={`block rounded-xl px-3 py-2 transition ${isActiveLink('/pricing') ? 'bg-gradient-to-r from-[#b08a5a] to-amber-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.18)]' : 'text-gray-800 hover:bg-amber-50 hover:text-[#b08a5a]'}`} >Pricing</Link>
            <Link href="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className={`block rounded-xl px-3 py-2 transition ${isActiveLink('/contact-us') ? 'bg-gradient-to-r from-[#b08a5a] to-amber-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.18)]' : 'text-gray-800 hover:bg-amber-50 hover:text-[#b08a5a]'}`} >Contact</Link>
            <Link href="/about-us" onClick={() => setIsMobileMenuOpen(false)} className={`block rounded-xl px-3 py-2 transition ${isActiveLink('/about-us') ? 'bg-gradient-to-r from-[#b08a5a] to-amber-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.18)]' : 'text-gray-800 hover:bg-amber-50 hover:text-[#b08a5a]'}`} >About</Link>
          </div>
        </div>
      )}
    </>
  )
}