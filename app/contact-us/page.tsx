import type { Metadata } from 'next'
import { Suspense } from 'react'
import ContactUsClient from './contact-us-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact True Inspectify - Customer Support',
  description: 'Get in touch with True Inspectify for any inquiries, support, or sales questions. Available 24/7 to help you.',
  openGraph: {
    title: 'Contact True Inspectify',
    description: 'Reach out to our customer support team for assistance with vehicle history reports.',
    url: 'https://trueinspectify.com/contact-us',
    type: 'website',
  },
}

export default function ContactUsPage() {
  return <ContactUsClient />
}
