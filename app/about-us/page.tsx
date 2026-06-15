import { Metadata } from 'next'
import AboutUsClient from './about-us-client'

export const metadata: Metadata = {
  title: 'About True Inspectify - Vehicle History Transparency',
  description:
    'Learn how True Inspectify is driving transparency in the automotive industry with data-powered vehicle history reports from 900+ global databases.',
  openGraph: {
    title: 'About True Inspectify - Vehicle History Transparency',
    description:
      'Learn how True Inspectify is driving transparency in the automotive industry with data-powered vehicle history reports from 900+ global databases.',
    url: 'https://trueinspectify.com/about-us',
    type: 'website',
  },
}

export default function AboutUs() {
  return <AboutUsClient />
}
