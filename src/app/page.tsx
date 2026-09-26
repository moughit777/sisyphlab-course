import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/home/Hero'
import AudienceSection from '@/components/home/AudienceSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CurriculumSection from '@/components/home/CurriculumSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import OfferSection from '@/components/home/OfferSection'
import FaqSection from '@/components/home/FaqSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HomePage() {
  return (
    // Solid .landing background covers the global studio-photo backdrop on this page only
    <main className="landing relative z-10 min-h-screen overflow-x-clip">
      <Navbar />
      <Hero />
      <AudienceSection />
      <FeaturesSection />
      <CurriculumSection />
      <TestimonialsSection />
      <OfferSection />
      <FaqSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
