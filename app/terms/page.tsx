import type { Metadata } from 'next'
import TermsPageClient from './terms-client'

export const metadata: Metadata = {
  title: 'Terms and Conditions - True Inspectify',
  description: 'Read the terms and conditions for using True Inspectify services. Understand your rights and responsibilities.',
  openGraph: {
    title: 'Terms and Conditions - True Inspectify',
      description: 'Our terms explain the rules for using True Inspectify vehicle history reports.',
    url: 'https://autofactscheck.com/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  return <TermsPageClient />
}
