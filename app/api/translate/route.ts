import { NextRequest, NextResponse } from 'next/server'

type Body = {
  lang: string
  keys: string[]
}

const LIBRE_URL = process.env.TRANSLATE_API_URL || 'https://libretranslate.de/translate'

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json()
    const { lang, keys } = body
    if (!lang || !keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing lang or keys' }, { status: 400 })
    }

    // For each key, translate the English source
    // To keep things simple and avoid extra lookups here, expect the client to send { key, text }
    // However for compatibility, we'll support single-text translation by calling the API for each key using the provided English text via query param.

    const translations: Record<string, string> = {}

    // If request provided keys as objects: { key, text }
    const keyObjs = keys as any[]
    let successCount = 0
    for (const k of keyObjs) {
      if (!k) continue
      if (typeof k === 'object' && k.key && k.text) {
        const translated = await translateText(k.text, lang)
        translations[k.key] = translated
        if (translated && translated.trim()) successCount++
      } else if (typeof k === 'string') {
        // No source text provided, cannot translate here
        translations[k] = ''
      }
    }

    // If nothing could be translated, report provider failure so clients can show an error
    if (successCount === 0) {
      return NextResponse.json({ success: false, error: 'Translation provider failed or returned no translations' }, { status: 502 })
    }

    return NextResponse.json({ success: true, translations })
  } catch (err: any) {
    console.error('Translate error:', err)
    return NextResponse.json({ success: false, error: err?.message || 'Failed to translate' }, { status: 500 })
  }
}

async function translateText(text: string, target: string) {
  try {
    const resp = await fetch(LIBRE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'text' }),
    })

    if (!resp.ok) {
      const t = await resp.text()
      throw new Error(`Translation API error: ${resp.status} ${t}`)
    }

    // Try to parse JSON, if the provider returned the web UI or HTML then fail
    const respText = await resp.text()
    try {
      const data = JSON.parse(respText)
      if (data && typeof data.translatedText === 'string') {
        return data.translatedText
      }
      // If provider returned other structured response, attempt safe extraction
      if (data && typeof data.translations === 'object') {
        return Object.values(data.translations)[0] as string || ''
      }

      throw new Error('Unexpected translation response')
    } catch (e) {
      // The response wasn't valid JSON / not what we expected
      console.error('translateText parse error:', e, 'response text:', respText)
      throw e
    }
  } catch (e) {
    console.error('translateText error:', e)
    return ''
  }
}
