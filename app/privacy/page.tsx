import type { Metadata } from 'next'
import PrivacyPageClient from './privacy-client'

export const metadata: Metadata = {
  title: 'Privacy Policy - True Inspectify',
  description: 'Read our privacy policy to understand how True Inspectify collects, uses, and protects your personal information.',
  openGraph: {
    title: 'Privacy Policy - True Inspectify',
    description: 'Our commitment to protecting your personal information and privacy.',
    url: 'https://trueinspectify.com/privacy',
    type: 'website',
  },
}

export default function PrivacyPage() {
  return <PrivacyPageClient />
}
