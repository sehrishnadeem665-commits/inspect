import Banner from '@/components/Banner'
import WhyVehicleHealthAnalysis from '@/components/WhyAutoRevealed'
import FeaturesGrid from '@/components/FeaturesGrid'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import VinChecker from '@/components/VinChecker'
import Support from '@/components/Support'

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturesGrid />
      <HowItWorks />
      <Testimonials />
      <VinChecker />
      <Support />
      <WhyVehicleHealthAnalysis />

    </>
  );
}
