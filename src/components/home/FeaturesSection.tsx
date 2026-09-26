'use client'
import { motion } from 'framer-motion'
import { Film, Layers, Smartphone, Share2, Sparkles, Wand2, Monitor, Zap } from 'lucide-react'

/* ─── CC light sweep on icon sides ─────────────────────────── */
function SweepIcon({
  icon: Icon,
  color = '#5DD62C',
  size = 'md',
}: {
  icon: React.ElementType
  color?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dim  = size === 'lg' ? 72 : size === 'md' ? 52 : 40
  const iconW = size === 'lg' ? 32 : size === 'md' ? 24 : 18
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-2xl"
      style={{
        width: dim, height: dim,
        background: `rgba(${color === '#9B59FF' ? '155,89,255' : color === '#3366FF' ? '51,102,255' : '93,214,44'},0.07)`,
        border: `1px solid ${color}28`,
      }}
    >
      {/* Left edge sweep */}
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{ width: 2, background: `linear-gradient(to bottom, transparent, ${color}cc, transparent)` }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
      />
      {/* Right edge sweep */}
      <motion.div
        className="absolute inset-y-0 right-0"
        style={{ width: 2, background: `linear-gradient(to bottom, transparent, ${color}cc, transparent)` }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut', delay: 0.15 }}
      />
      {/* Horizontal scan line */}
      <motion.div
        className="absolute inset-x-0"
        style={{ height: 1, background: `linear-gradient(to right, transparent, ${color}80, transparent)` }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 4, ease: 'linear' }}
      />
      {/* Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon style={{ width: iconW, height: iconW, color }} />
      </div>
    </div>
  )
}

/* ─── Card wrapper with border glow ────────────────────────── */
function FeatureCard({
  children,
  className = '',
  glowColor = '#5DD62C',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  glowColor?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(14,18,36,0.70)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top hairline */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${glowColor}30, transparent)` }} />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ boxShadow: `0 0 40px ${glowColor}12 inset, 0 0 0 1px ${glowColor}18` }} />
      {children}
    </motion.div>
  )
}

/* ─── Data ──────────────────────────────────────────────────── */
const PRCOLOR = '#9B59FF'
const AECOLOR = '#3366FF'
const GR = '#5DD62C'

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Ambient glows — restrained */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 10% 40%, rgba(155,89,255,0.06) 0%, transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 90% 60%, rgba(51,102,255,0.06) 0%, transparent 55%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: GR, letterSpacing: '0.18em' }}>
            — ماذا ستتعلم
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              كل ما تحتاجه<br />
              <span style={{ background: 'linear-gradient(90deg, #5DD62C, #9B59FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                في مكان واحد
              </span>
            </h2>
            <p className="text-white/40 max-w-xs text-sm leading-relaxed md:text-right">
              دورة شاملة تغطي كل جوانب المونتاج من الأساسيات حتى التقنيات الاحترافية
            </p>
          </div>
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-auto">

          {/* ① BIG CARD — Premiere Pro */}
          <FeatureCard
            delay={0}
            glowColor={PRCOLOR}
            className="lg:row-span-2 p-8 flex flex-col justify-between min-h-[280px] lg:min-h-[400px]"
          >
            <div>
              <SweepIcon icon={Film} color={PRCOLOR} size="lg" />
              <h3 className="text-2xl font-black text-white mt-6 mb-2">Premiere Pro</h3>
              <p className="text-sm font-bold" style={{ color: PRCOLOR }}>المونتاج الاحترافي</p>
              <p className="text-sm text-white/40 mt-3 leading-relaxed">
                إتقان التحرير، القص، الانتقالات، تصحيح الألوان، وصادرات الفيديو بجودة سينمائية
              </p>
            </div>
            {/* Pr badge */}
            <div className="mt-8 self-end flex items-center justify-center rounded-2xl font-black"
              style={{ width: 64, height: 64, background: `linear-gradient(135deg, #2d0060, #6b00cc)`, fontSize: 22, color: '#bf7fff', border: '1px solid rgba(155,89,255,0.3)' }}>
              Pr
            </div>
          </FeatureCard>

          {/* ② After Effects */}
          <FeatureCard delay={0.08} glowColor={AECOLOR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Layers} color={AECOLOR} size="md" />
            <div>
              <h3 className="text-base font-black text-white mb-1">After Effects</h3>
              <p className="text-xs text-white/40 leading-relaxed">Motion Graphics، Keyframes، والمؤثرات البصرية الاحترافية</p>
            </div>
          </FeatureCard>

          {/* ③ VFX */}
          <FeatureCard delay={0.12} glowColor={PRCOLOR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Sparkles} color={PRCOLOR} size="md" />
            <div>
              <h3 className="text-base font-black text-white mb-1">المؤثرات البصرية VFX</h3>
              <p className="text-xs text-white/40 leading-relaxed">تقنيات Visual Effects المذهلة التي تجعل فيديوهاتك تبان سينمائية</p>
            </div>
          </FeatureCard>

          {/* ④ Reels & TikTok — wide */}
          <FeatureCard delay={0.16} glowColor={GR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Smartphone} color={GR} size="md" />
            <div>
              <h3 className="text-base font-black text-white mb-1">Reels & TikTok</h3>
              <p className="text-xs text-white/40 leading-relaxed">ريلز وتيك توك احترافية تجذب المشاهدين وتزيد المتابعين بشكل طبيعي</p>
            </div>
          </FeatureCard>

          {/* ⑤ Social Media */}
          <FeatureCard delay={0.20} glowColor={AECOLOR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Share2} color={AECOLOR} size="md" />
            <div>
              <h3 className="text-base font-black text-white mb-1">السوشيال ميديا</h3>
              <p className="text-xs text-white/40 leading-relaxed">إعدادات مثالية ليوتيوب وانستغرام وفيسبوك وتيك توك</p>
            </div>
          </FeatureCard>

          {/* ─── Row 3: 3 equal small cards ─── */}
          {/* ⑥ Color Grading */}
          <FeatureCard delay={0.24} glowColor={PRCOLOR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Wand2} color={PRCOLOR} size="sm" />
            <div>
              <h3 className="text-sm font-black text-white mb-1">Color Grading</h3>
              <p className="text-xs text-white/40 leading-relaxed">أسرار تدرج الألوان بمظهر سينمائي</p>
            </div>
          </FeatureCard>

          {/* ⑦ Export */}
          <FeatureCard delay={0.28} glowColor={GR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Monitor} color={GR} size="sm" />
            <div>
              <h3 className="text-sm font-black text-white mb-1">الصادر والضغط</h3>
              <p className="text-xs text-white/40 leading-relaxed">أفضل جودة بأصغر حجم لكل منصة</p>
            </div>
          </FeatureCard>

          {/* ⑧ Speed */}
          <FeatureCard delay={0.32} glowColor={AECOLOR} className="p-6 flex items-start gap-4">
            <SweepIcon icon={Zap} color={AECOLOR} size="sm" />
            <div>
              <h3 className="text-sm font-black text-white mb-1">الاختصارات والسرعة</h3>
              <p className="text-xs text-white/40 leading-relaxed">اختصارات تضاعف إنتاجيتك</p>
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  )
}
