import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import PromoVideoSection from '@/components/home/PromoVideoSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CurriculumSection from '@/components/home/CurriculumSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-dark-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <PromoVideoSection />
      <StatsSection />
      <FeaturesSection />
      <CurriculumSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
