"use client"

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { translateMissingKeys } from '@/lib/translations'
import { useToast } from '@/hooks/use-toast'

export default function TranslateButton() {
  const { selectedCountry } = useCountry()
  const { toast, dismiss } = useToast()
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    if (!selectedCountry) return
    setLoading(true)
    const id = toast({ title: 'Translating…' })
    try {
      const count = await translateMissingKeys(selectedCountry.language)
      dismiss(id.id)
      if (count > 0) {
        toast({ title: `Translated ${count} keys to ${selectedCountry.language}` })
      } else {
        toast({ title: `No missing translations for ${selectedCountry.language}` })
      }
    } catch (e) {
      dismiss(id.id)
      toast({ title: 'Translation failed — see console' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      suppressHydrationWarning
      onClick={handleTranslate}
      disabled={loading}
      className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
      title="Auto-translate site"
      aria-label="Auto-translate site"
    >
      <Globe className="w-5 h-5" />
    </button>
  )
}
