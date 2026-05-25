'use client'
import { motion } from 'framer-motion'
import { Play, ArrowLeft, Users, Clock, Star, Zap } from 'lucide-react'

const stats = [
  { icon: Users, value: '+2,400', label: 'طالب ناجح' },
  { icon: Clock,  value: '+40',   label: 'ساعة محتوى' },
  { icon: Star,   value: '4.9',   label: 'تقييم الطلاب' },
  { icon: Zap,    value: '29',    label: 'درس احترافي' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">

      {/* ── Background layers ── */}
      <div className="absolute inset-0" style={{ background: '#0F0F0F' }} />
      {/* Strong top green glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(51,116,24,0.65) 0%, rgba(93,214,44,0.08) 50%, transparent 68%)' }} />
      {/* Side glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 70% at -5% 35%, rgba(51,116,24,0.35) 0%, transparent 58%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 70% at 105% 55%, rgba(51,116,24,0.30) 0%, transparent 58%)' }} />
      {/* Dot grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      {/* Bottom fade */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(15,15,15,0.99) 100%)' }} />

      {/* Large center glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full pointer-events-none" style={{ background: 'rgba(51,116,24,0.20)', filter: 'blur(120px)' }} />

      {/* ── Adobe icons ── */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ top: '15%', left: '3%', opacity: 0.09 }}
        animate={{ y: [-12, 12, -12], rotate: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-center" style={{ width: 120, height: 120, background: '#9B59FF', borderRadius: 22, boxShadow: '0 0 60px #9B59FF66, 0 0 120px #9B59FF22' }}>
          <span className="font-black text-white" style={{ fontSize: 44 }}>Pr</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ top: '20%', right: '3%', opacity: 0.09 }}
        animate={{ y: [12, -12, 12], rotate: [5, -5, 5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div className="flex items-center justify-center" style={{ width: 110, height: 110, background: '#3366FF', borderRadius: 20, boxShadow: '0 0 60px #3366FF66, 0 0 120px #3366FF22' }}>
          <span className="font-black text-white" style={{ fontSize: 40 }}>Ae</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ top: '60%', right: '4%', opacity: 0.06 }}
        animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        <div className="flex items-center justify-center" style={{ width: 80, height: 80, background: '#9B59FF', borderRadius: 15, boxShadow: '0 0 40px #9B59FF55' }}>
          <span className="font-black text-white" style={{ fontSize: 30 }}>Pr</span>
        </div>
      </motion.div>

      {/* ── CC Light Sweep ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sweep 1 */}
        <motion.div
          className="absolute"
          style={{
            top: '-100%', width: '18%', height: '300%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(204,255,0,0.03) 30%, rgba(255,255,255,0.07) 50%, rgba(204,255,0,0.03) 70%, transparent 100%)',
            transform: 'skewX(-18deg)',
            filter: 'blur(2px)',
          }}
          animate={{ left: ['-25%', '125%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 7, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Sweep 2 - delayed, thinner */}
        <motion.div
          className="absolute"
          style={{
            top: '-100%', width: '8%', height: '300%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            transform: 'skewX(-18deg)',
            filter: 'blur(1px)',
          }}
          animate={{ left: ['-15%', '115%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
        />
      </div>

      {/* Floating dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-brand-green/50"
          style={{ top: `${15 + i * 15}%`, right: `${8 + i * 17}%` }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* ── Badge ── */}
          <motion.div variants={item} className="flex justify-center mb-7">
            <div className="tag-green">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
              دورة مونتاج احترافية — المستوى الكامل
            </div>
          </motion.div>

          {/* ── Heading ── */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.0] tracking-tight mb-6"
          >
            <span className="text-brand-white">كيف تجني</span>
            <br />
            <span className="text-green-gradient">أول 1,000$ من المونتاج</span>
          </motion.h1>

          {/* ── Sub ── */}
          <motion.p
            variants={item}
            className="text-base sm:text-lg text-brand-gray max-w-2xl mx-auto leading-relaxed mb-10"
          >
            إتقن{' '}
            <span className="text-brand-white font-semibold">Adobe Premiere Pro</span>
            {' '}و{' '}
            <span className="text-brand-white font-semibold">After Effects</span>
            {' '}وصناعة{' '}
            <span className="text-brand-green font-semibold">Reels احترافية</span>
            {' '}للسوشيال ميديا — شرح عربي 100%
          </motion.p>

          {/* ── Buttons ── */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.a
              href="#cta"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-green flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold"
            >
              اشترك في الكورس الآن
              <ArrowLeft className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="#promo"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline-green flex items-center gap-3 px-8 py-4 rounded-xl text-base font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-brand-green/15 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-brand-green fill-brand-green" />
              </div>
              شاهد الفيديو التعريفي
            </motion.a>
          </motion.div>

          {/* ── Stats ── */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-green/20 transition-all duration-300 flex flex-col items-center gap-1"
              >
                <Icon className="w-4 h-4 text-brand-green mb-1" />
                <span className="text-2xl font-black text-brand-white stat-number">{value}</span>
                <span className="text-xs text-brand-gray">{label}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full border border-brand-border flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1 h-1.5 rounded-full bg-brand-green"
            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
