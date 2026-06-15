"use client"

import React, { Suspense } from 'react'
import { useCountry } from '@/contexts/CountryContext'
import { useTranslations, getAllKeys, getTranslationsForLang } from '@/lib/translations'

function I18nDebugContent() {
  const { selectedCountry } = useCountry()
  const { t } = useTranslations()
  const lang = selectedCountry?.language || 'en'

  const keys = getAllKeys()
  const currentTranslations = getTranslationsForLang(lang)
  const enTranslations = getTranslationsForLang('en')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">i18n debug</h1>
      <p className="mb-2">Selected country: <strong>{selectedCountry.code}</strong></p>
      <p className="mb-6">Language: <strong>{lang}</strong></p>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Key</th>
            <th className="py-2">Value ({lang})</th>
            <th className="py-2">English</th>
            <th className="py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {keys.map(k => {
            const val = currentTranslations[k] ?? enTranslations[k] ?? ''
            const isFallback = !currentTranslations[k] || currentTranslations[k] === enTranslations[k]
            return (
              <tr key={k} className="border-b">
                <td className="py-2 align-top font-mono">{k}</td>
                <td className="py-2 align-top">{val}</td>
                <td className="py-2 align-top">{enTranslations[k]}</td>
                <td className="py-2 align-top">{isFallback ? 'fallback/identical to EN' : 'translated'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Sample rendered text</h2>
        <p className="mt-2">{t('nav_home')} / {t('nav_pricing')} / {t('form_title')}</p>
      </div>
    </div>
  )
}

export default function I18nDebugPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <I18nDebugContent />
    </Suspense>
  )
}
