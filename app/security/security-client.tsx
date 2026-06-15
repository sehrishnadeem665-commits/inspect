'use client'

import { useEffect } from 'react'
import { Shield } from 'lucide-react'
import { useTranslations } from '@/lib/translations'

export default function SecurityPageClient() {
  const { t } = useTranslations()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-full">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">{t('security_title')}</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900">{t('security_title')}</h1>
          <p className="text-gray-600 text-lg">{t('security_intro')}</p>
        </div>

        <div className="mt-10 space-y-8 max-w-3xl mx-auto text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900">{t('security_measures_title')}</h2>
            <p className="mt-3">{t('security_measures_paragraph')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">{t('security_contact_title')}</h2>
            <p className="mt-3">{t('security_contact_paragraph')}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
