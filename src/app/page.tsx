import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/home/Hero'
import PromoVideoSection from '@/components/home/PromoVideoSection'
import { GlobalBackground } from '@/components/ui/global-background'

const StatsSection       = dynamic(() => import('@/components/home/StatsSection'))
const FeaturesSection    = dynamic(() => import('@/components/home/FeaturesSection'))
const CurriculumSection  = dynamic(() => import('@/components/home/CurriculumSection'))
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'))
const CTASection         = dynamic(() => import('@/components/home/CTASection'))
const Footer             = dynamic(() => import('@/components/layout/Footer'))
const WhatsAppButton     = dynamic(() => import('@/components/WhatsAppButton'))

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <GlobalBackground />
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
