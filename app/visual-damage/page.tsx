import VisualDamageDetector from '@/components/VisualDamageDetector'

export const metadata = {
  title: 'Visual Damage Detection',
}

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-10">
      <VisualDamageDetector />
    </main>
  )
}
