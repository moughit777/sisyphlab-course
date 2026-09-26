'use client'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import PromoPlayer from './PromoPlayer'
import { DEMO_COURSE } from '@/lib/courseData'

const EASE = [0.165, 0.84, 0.44, 1] as const
const enter = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE, delay: i * 0.07 },
})

const lessons = DEMO_COURSE.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0
const modules = DEMO_COURSE.modules?.length || 0

const FACTS = [
  { value: `${lessons}`, label: 'درس مسجّل' },
  { value: `${modules}`, label: 'موديولات' },
  { value: '+120',        label: 'طالب' },
]

export default function Hero() {
  return (
    <section id="hero" className="relative py-16 md:py-24 lg:py-28">
      {/* The page's single atmospheric element */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 0%, rgba(93,214,44,0.10), transparent 70%)' }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

        <div className="lg:col-span-6">
          <motion.h1 {...enter(0)} className="text-[36px] md:text-[48px] lg:text-[52px] font-bold">
            كيفاش تربح <span className="whitespace-nowrap">أول <bdi className="num">1,000$</bdi></span>
            <br />
            <span className="text-fg-3">من المونتاج.</span>
          </motion.h1>

          <motion.p {...enter(1)} className="mt-6 text-lg text-fg-2 max-w-[36rem]">
            كورس مغربي بالدارجة كيعلّمك <bdi>Premiere Pro</bdi> و <bdi>After Effects</bdi> من الصفر،
            ومن بعد كيوريك كيفاش تلقى أول كليان. مصاوب للمبتدئين وصحاب المحتوى.
          </motion.p>

          <motion.div {...enter(2)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#offer"
              className="inline-flex items-center h-12 px-6 rounded-btn bg-accent text-accent-on font-bold hover:bg-accent-hover transition-colors duration-fast">
              اشترك فالكورس
            </a>
            <a href="#curriculum"
              className="inline-flex items-center gap-1 text-fg-2 hover:text-fg-1 transition-colors duration-fast">
              شوف المنهاج كامل
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </a>
          </motion.div>

          <motion.dl {...enter(3)} className="mt-12 pt-8 border-t border-hair grid grid-cols-3 gap-4 max-w-md">
            {FACTS.map(f => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-fg-3">{f.label}</dt>
                <dd className="text-2xl font-bold text-fg-1 num"><bdi>{f.value}</bdi></dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...enter(2)} className="lg:col-span-6">
          <PromoPlayer />
        </motion.div>
      </div>
    </section>
  )
}
