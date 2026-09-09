'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'محمد العمراني', role: 'مصور فيديو — الدار البيضاء', avatar: 'م', avatarBg: '#2563eb',
    text: 'هاد الكورس بدّل مساري المهني بالكامل. كنت كنقطع فيديوهات عادية ودابا كنخدم فبروجيات كبيرة ومدفوعة مزيان.',
    result: 'أول عميل في 3 أسابيع',
  },
  {
    name: 'سارة بنسعيد', role: 'صانعة محتوى — أكادير', avatar: 'س', avatarBg: '#7c3aed',
    text: 'من مجرد ما كملت الكورس، المشاهدات ديال الريلزات ديالي تلاتضعفات! تعلمت أسرار المونتاج السريع.',
    result: '×3 مشاهدات في شهر',
  },
  {
    name: 'يوسف التازي', role: 'Freelancer — فاس', avatar: 'ي', avatarBg: '#0891b2',
    text: 'كنت خايف من برامج Adobe، ولكن الشرح كان مبسط بزاف. دابا عندي خدمة فريلانس وكنكسب من المونتاج.',
    result: '1,200$ أول شهر فريلانس',
  },
  {
    name: 'فاطمة الزهراء', role: 'مديرة تسويق — الرباط', avatar: 'ف', avatarBg: '#dc2626',
    text: 'وفّر عليا الكورس ميات الدراهم كنت غادي نعطيهم للمصمم. دابا كنصور الفيديوهات بوحدي بجودة عالية.',
    result: 'وفّرت +500 درهم/شهر',
  },
  {
    name: 'عمر بوعزيز', role: 'يوتيوبر — طنجة', avatar: 'ع', avatarBg: '#059669',
    text: 'After Effects كانت حلم بعيد عليا. مع هاد الكورس فهمت كولشي خطوة بخطوة. Motion Graphics ولات سهلة.',
    result: '+15k مشترك في 4 أشهر',
  },
  {
    name: 'ريم القادري', role: 'إعلامية — مراكش', avatar: 'ر', avatarBg: '#d97706',
    text: 'الـ Color Grading وحدها تستاهل ثمن الكورس. الفيديوهات ديالي بدات تبان سينمائية كيما نتمنى.',
    result: 'عملاء مدفوعة من أول أسبوع',
  },
  {
    name: 'خالد الإدريسي', role: 'مصمم جرافيك — تطوان', avatar: 'خ', avatarBg: '#0d9488',
    text: 'الكورس زادني على مهاراتي في التصميم. دابا كنعرض خدمات مونتاج وتصميم معاً وكنكسب أكثر بكتير.',
    result: 'دخل إضافي +800$/شهر',
  },
  {
    name: 'نور الهدى', role: 'مدرّسة — وجدة', avatar: 'ن', avatarBg: '#9333ea',
    text: 'بدأت كورسات أونلاين ديالي. لولا هاد الكورس ما كنتش نعرف كيف نصور فيديوهات احترافية للتعليم.',
    result: 'أطلقت كورسها الخاص',
  },
]

/* Split into 2 rows for opposite-direction marquees */
const row1 = testimonials.slice(0, 4)
const row2 = testimonials.slice(4)

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="flex-shrink-0 w-72 rounded-2xl p-5 mx-2"
      style={{
        background: 'rgba(14,18,36,0.80)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" style={{ color: '#5DD62C' }} />
        ))}
      </div>

      {/* Result badge */}
      <div className="inline-flex mb-3">
        <span className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(93,214,44,0.12)', color: '#5DD62C', border: '1px solid rgba(93,214,44,0.20)' }}>
          ✓ {t.result}
        </span>
      </div>

      {/* Text */}
      <p className="text-sm text-white/55 leading-relaxed mb-4">{t.text}</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
          style={{ background: t.avatarBg }}>
          {t.avatar}
        </div>
        <div>
          <div className="text-xs font-bold text-white">{t.name}</div>
          <div className="text-xs text-white/35">{t.role}</div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const tripled = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
      <motion.div
        className="flex py-2"
        style={{ width: 'max-content' }}
        animate={{ x: reverse ? ['-33.33%', '0%'] : ['0%', '-33.33%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {tripled.map((t, i) => <TestimonialCard key={i} t={t} />)}
      </motion.div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      {/* Subtle ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(93,214,44,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-widest uppercase mb-4"
            style={{ color: '#5DD62C', letterSpacing: '0.18em' }}>
            — شنو قالو الطلبة
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            نتائج حقيقية،<br />
            <span style={{ background: 'linear-gradient(90deg, #5DD62C, #7EE84E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              مش مجرد كلام
            </span>
          </h2>
          {/* Rating row */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" style={{ color: '#5DD62C' }} />
            ))}
            <span className="text-white font-black text-lg mr-2">4.9</span>
            <span className="text-white/30 text-sm">من أكثر من 120 تقييم</span>
          </div>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-3">
        <MarqueeRow items={row1} />
        <MarqueeRow items={[...row2, ...row1.slice(0, 2)]} reverse />
      </div>
    </section>
  )
}
