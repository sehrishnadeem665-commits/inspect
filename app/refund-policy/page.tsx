import type { Metadata } from 'next'
import RefundPolicyPageClient from './refund-policy-client'

export const metadata: Metadata = {
  title: 'Refund Policy - True Inspectify',
  description: 'Learn about True Inspectify refund policy and how to request a refund for your vehicle history report.',
  openGraph: {
    title: 'Refund Policy - True Inspectify',
    description: 'Our customer-friendly refund policy details.',
    url: 'https://trueinspectify.com/refund-policy',
    type: 'website',
  },
}

export default function RefundPolicyPage() {
  return <RefundPolicyPageClient />
}
