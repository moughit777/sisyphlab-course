'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Shield, Users, Star, Zap } from 'lucide-react'

/* ─── Scrolling marquee ──────────────────────────────────────── */
const TOOLS = ['Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics', 'Reels', 'TikTok', 'Freelance', 'VFX', 'YouTube', 'Instagram']

function Marquee() {
  const repeated = [...TOOLS, ...TOOLS, ...TOOLS]
  return (
    <div className="overflow-hidden py-3 select-none" style={{ maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)' }}>
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {repeated.map((tool, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-bold whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <span className="w-1 h-1 rounded-full" style={{ background: '#5DD62C', opacity: 0.6 }} />
            {tool}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">

      {/* Background — subtle, not overwhelming */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(51,116,24,0.55) 0%, rgba(93,214,44,0.06) 45%, transparent 65%)' }} />
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(7,11,26,1))' }} />

      {/* Floating Adobe badges — more visible */}
      <motion.div
        className="absolute pointer-events-none select-none hidden lg:flex items-center justify-center"
        style={{ top: '18%', left: '5%' }}
        animate={{ y: [-10, 10, -10], rotate: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#2d0060,#6b00cc)', borderRadius: 18, border: '1px solid rgba(155,89,255,0.25)', boxShadow: '0 0 40px rgba(155,89,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 28, color: '#bf7fff' }}>Pr</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute pointer-events-none select-none hidden lg:flex items-center justify-center"
        style={{ top: '22%', right: '5%' }}
        animate={{ y: [10, -10, 10], rotate: [3, -3, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#00003a,#0000cc)', borderRadius: 16, border: '1px solid rgba(51,102,255,0.25)', boxShadow: '0 0 40px rgba(51,102,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 26, color: '#9df0fe' }}>Ae</span>
        </div>
      </motion.div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">

          {/* Social proof pill */}
          <motion.div variants={item} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ background: 'rgba(93,214,44,0.08)', border: '1px solid rgba(93,214,44,0.20)', color: '#5DD62C' }}>
              <div className="flex -space-x-1.5 space-x-reverse">
                {['م','س','ي','ف','ع'].map((a, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black"
                    style={{ borderColor: '#070B1A', background: '#5DD62C', color: '#000' }}>
                    {a}
                  </div>
                ))}
              </div>
              <span className="w-1 h-1 rounded-full bg-current opacity-50" />
              +400 طالب نجحوا
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-6"
          >
            <span className="text-white">كيفاش تربح</span>
            <br />
            <span style={{ background: 'linear-gradient(90deg, #5DD62C 0%, #7EE84E 50%, #5DD62C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              1,000$ من المونتاج
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed mb-4"
          >
            من الصفر حتى أول عميل — كورس مغربي متكامل بـ
            {' '}<span className="text-white/80 font-semibold">Premiere Pro</span>{' '}
            و<span className="text-white/80 font-semibold">After Effects</span>
          </motion.p>

          {/* Trust signals row */}
          <motion.div variants={item} className="flex items-center justify-center gap-4 flex-wrap text-sm mb-10">
            <span className="flex items-center gap-1.5 text-white/40 font-semibold">
              <Shield className="w-4 h-4" style={{ color: '#5DD62C' }} />
              دعم مستمر
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/40 font-semibold">
              <Zap className="w-4 h-4" style={{ color: '#5DD62C' }} />
              وصول فوري
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/40 font-semibold">
              <Star className="w-4 h-4 fill-current" style={{ color: '#5DD62C' }} />
              4.9 / 5.0
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-white/40 font-semibold">
              <Users className="w-4 h-4" style={{ color: '#5DD62C' }} />
              +40 ساعة محتوى
            </span>
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">

            <motion.a
              href="#cta"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-base text-black"
              style={{ background: 'linear-gradient(135deg, #5DD62C, #7EE84E)', boxShadow: '0 6px 28px rgba(93,214,44,0.40)' }}
            >
              {/* Sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)', transform: 'skewX(-15deg)' }}
                animate={{ x: ['-150%', '250%'] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
              />
              اشترك الآن
              <motion.div
                animate={{ x: [0, -4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </motion.a>

            <motion.a
              href="#promo"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden flex items-center gap-3.5 pl-8 pr-3 py-3 rounded-2xl font-semibold text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              {/* Sweep */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(93,214,44,0.18) 50%, transparent 65%)', transform: 'skewX(-15deg)' }}
                animate={{ x: ['-150%', '250%'] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
              />
              <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                <motion.div className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: 'rgba(93,214,44,0.5)' }}
                  animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }} />
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#5DD62C', boxShadow: '0 4px 18px rgba(93,214,44,0.45)' }}>
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </div>
              </div>
              شاهد الفيديو التعريفي
            </motion.a>

          </motion.div>

          {/* Marquee */}
          <motion.div variants={item}>
            <Marquee />
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
          <motion.div
            className="w-1 h-1.5 rounded-full"
            style={{ background: '#5DD62C' }}
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
