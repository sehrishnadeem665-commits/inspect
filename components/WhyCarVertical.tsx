import { ShieldAlert, CheckCircle, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import { getTranslationsForLang } from '@/lib/translations'

export default async function WhyTrueInspectify() {
  // Resolve language robustly (handle different shapes of next/headers in various runtimes)
  let lang = 'en'
  try {
    const nh = await import('next/headers')

    if (typeof nh.cookies === 'function') {
      const ckCandidate = nh.cookies()
      const ck = await Promise.resolve(ckCandidate)
      if (ck) {
        if (typeof ck.get === 'function') {
          const c = ck.get('cv_locale')
          if (c && (c as any).value) lang = (c as any).value
        } else if ((ck as any)['cv_locale']) {
          const c = (ck as any)['cv_locale']
          if (typeof c === 'string') lang = c
          else if (c && c.value) lang = c.value
        }
      }
    }

    if (lang === 'en' && typeof nh.headers === 'function') {
      const hCandidate = nh.headers()
      const h = await Promise.resolve(hCandidate)
      const cookieHeader = typeof h.get === 'function' ? (h.get('cookie') || h.get('Cookie') || '') : ((h as any)['cookie'] || (h as any)['Cookie'] || '')
      const match = (cookieHeader || '').match(/(?:^|; )cv_locale=([^;]+)/)
      if (match) lang = decodeURIComponent(match[1])
    }
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.warn('[i18n] Could not read cookies/headers in WhyTrueInspectify:', e)
  }

  const tmap = getTranslationsForLang(lang)
  const t = (k: string) => tmap[k] || k

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('why_title')}
          </h2>
          <p className="text-lg text-gray-700">
            {t('why_subtitle')}
          </p>
        </div>

        <div className="relative h-96 rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <Image
            src="https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt={t('why_title')}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/80 via-amber-900/50 to-transparent flex items-center">
            <div className="container mx-auto px-12">
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('why_section1_title')}
                </h3>
                <p className="text-lg text-white/90">
                  {t('why_section1_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12 text-amber-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('why_section1_title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('why_section1_desc')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('why_section2_title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('why_section2_desc')}
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#9EB8D3] flex items-center justify-center">
              <TrendingDown className="w-12 h-12 text-[#b08a5a]" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {t('why_section3_title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('why_section3_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
