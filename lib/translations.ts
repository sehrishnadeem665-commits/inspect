import { useCountry } from '@/contexts/CountryContext'
import en from './i18n/en.json'
import de from './i18n/de.json'
import el from './i18n/el.json'
import pl from './i18n/pl.json'
import pt from './i18n/pt.json'

export const translationsMap: Record<string, Record<string, string>> = {
  en, de, el, pl, pt,
}

// Mutable copy used for runtime fallbacks
const translations = { ...translationsMap }

// Track which languages were originally provided so we can warn when a selected language is only a fallback.
const originalLangs = new Set(Object.keys(translationsMap))

export function getAllKeys() {
  return Object.keys(translationsMap.en)
}



// Simple subscription mechanism so clients can re-render when translations are merged at runtime
const translationListeners = new Set<() => void>()
export function onTranslationsUpdated(fn: () => void) {
  translationListeners.add(fn)
  return () => translationListeners.delete(fn)
}

export function useTranslations() {
  const { selectedCountry } = useCountry()
  const lang = selectedCountry?.language || 'en'

  // Force re-render when runtime translations change
  const [, setTick] = (require('react') as any).useState(0)
  require('react').useEffect(() => {
    const unsub = onTranslationsUpdated(() => setTick((s: number) => s + 1))
    return unsub
  }, [])

  // Ensure we have at least a fallback entry for country languages used in the app.
  const fallbackLangs = ['pl','sv','hr','pt','ar','nl','ro','it','da','lv','cs','lt','sl','bg','et','hu','sk','uk']
  for (const l of fallbackLangs) {
    if (!translations[l]) {
      translations[l] = { ...translations['en'] }
    }
  }

  const t = (key: string) => {
    const value = translations[lang]?.[key] || translations['en'][key] || key

    // If the selected language was not one of the original provided translations, warn in dev
    if (!originalLangs.has(lang) && process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Language "${lang}" has no real translations; showing English fallbacks.`)
    }

    if ((translations[lang] && !translations[lang][key]) && process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing key "${key}" for language "${lang}", falling back to English.`)
    }
    if (value === key && process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing translation for key "${key}" in language "${lang}" (no fallback)`)
    }
    return value
  }

  return { t }
}

export function getTranslationsForLang(lang: string) {
  return translations[lang] || translations.en
}

// Translate missing keys for a language by calling the server-side translate API.
export async function translateMissingKeys(lang: string) {
  // Gather keys that are missing translations for the requested language
  const allKeys = getAllKeys()
  const missing = allKeys.filter(k => !(translations[lang] && translations[lang][k]))
  if (missing.length === 0) return 0

  // Send keys with English source text so server can translate reliably
  const payload = missing.map(k => ({ key: k, text: translationsMap.en[k] || k }))

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang, keys: payload }),
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      let parsed: any = null
      try { parsed = JSON.parse(txt) } catch (_) { parsed = null }
      const msg = (parsed && parsed.error) || txt || `HTTP ${res.status}`
      throw new Error(`Translate API error: ${msg}`)
    }

    const data = await res.json()
    if (!data?.success || !data?.translations) throw new Error(data?.error || 'No translations returned')

    // Merge new translations into runtime translations map
    translations[lang] = translations[lang] || {}
    let count = 0
    for (const k of Object.keys(data.translations)) {
      const v = data.translations[k]
      if (v && v.trim()) {
        translations[lang][k] = v
        count++
      } else {
        // fallback to English copy
        translations[lang][k] = translationsMap.en[k] || ''
      }
    }

    // Notify listeners so components re-render and pick up new translations
    translationListeners.forEach(fn => {
      try { fn() } catch (e) { /* ignore listener errors */ }
    })

    return count
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error('[i18n] translateMissingKeys error:', e)
    return 0
  }
}
