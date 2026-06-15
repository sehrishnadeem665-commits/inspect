export const dynamic = 'force-dynamic'

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';
import { getOrganizationSchema } from '@/lib/schema';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Use dynamic metadata so server-rendered metadata can be localized via cookie
export async function generateMetadata(): Promise<Metadata> {
  const { getTranslationsForLang } = await import('@/lib/translations')

  // Resolve language robustly: try cookies(), then headers(), with defensive checks for different runtime shapes.
  let lang = 'en'
  try {
    const nh = await import('next/headers')

    // 1) Try cookies() if available (handle both sync and Promise shapes)
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

    // 2) Fallback: try headers() and parse cookie header (handle Promise or sync)
    if (lang === 'en' && typeof nh.headers === 'function') {
      const hCandidate = nh.headers()
      const h = await Promise.resolve(hCandidate)
      const cookieHeader = typeof h.get === 'function' ? (h.get('cookie') || h.get('Cookie') || '') : ((h as any)['cookie'] || (h as any)['Cookie'] || '')
      const match = (cookieHeader || '').match(/(?:^|; )cv_locale=([^;]+)/)
      if (match) lang = decodeURIComponent(match[1])
    }
  } catch (e) {
    // ignore and keep default lang
    if (process.env.NODE_ENV !== 'production') console.warn('[i18n] Could not read cookies/headers in generateMetadata:', e)
  }

  const tmap = getTranslationsForLang(lang)

  return {
    title: `True Inspectify - ${tmap['banner_title'] || "Check any car's history"}`,
    keywords: ['car history', 'vehicle report', 'VIN check', 'used car', 'vehicle history check', 'car background check'],
    authors: [{ name: 'True Inspectify' }],
    creator: 'True Inspectify',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/favicon.png',
    },
    openGraph: {
      type: 'website',
      url: 'https://autofactscheck.com',
      title: `True Inspectify - ${tmap['banner_title'] || "Check any car's history"}`,
      siteName: 'True Inspectify',
      images: [
        { url: 'https://autofactscheck.com/banner-hero.png', width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `True Inspectify - ${tmap['banner_title'] || "Check any car's history"}`,
      description: tmap['banner_subtitle'] || "VIN Check Can Save You Thousands — Get a Full Vehicle History Report",
      images: [
        { url: 'https://autofactscheck.com/banner-hero.png' },
      ],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaMarkup = getOrganizationSchema();

  return (
    <html lang="en">
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        <link rel="canonical" href="https://autofactscheck.com" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <link rel="icon" href="/favicon-192.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#b08a5a" />
      </head>
      <body suppressHydrationWarning className={inter.className} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <LayoutWrapper>
          <main>{children}</main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
