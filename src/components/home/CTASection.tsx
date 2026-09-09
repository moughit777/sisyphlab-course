'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Check, ArrowLeft, Clock, Zap, Users, Star } from 'lucide-react'

const INCLUDES = [
  { label: '39 درس فيديو احترافي', sub: 'Premiere Pro + After Effects' },
  { label: '+40 ساعة محتوى حصري', sub: 'من الصفر حتى الاحتراف' },
  { label: 'دعم مباشر على واتساب', sub: 'إجابة على كل أسئلتك' },
  { label: 'تحديثات مجانية مدى الحياة', sub: 'محتوى جديد بانتمام' },
  { label: 'مجتمع طلاب نشط', sub: '+400 مونتور مغربي' },
  { label: 'شهادة إتمام الدورة', sub: 'رسمية وقابلة للتحميل' },
]

const FOR_WHO = [
  { icon: '🎬', title: 'المبتدئ الكامل', desc: 'حتى لو ما عندكش أي تجربة في المونتاج' },
  { icon: '💼', title: 'يبي يخدم Freelance', desc: 'وتكسب أول 1,000$ من مهاراتك' },
  { icon: '📱', title: 'صاحب محتوى', desc: 'يبي يحسن جودة فيديوهاته ويزيد المشاهدات' },
]

const WA = 'https://wa.me/212624821600?text=السلام%20عليكم%2C%20أريد%20الاشتراك%20في%20كورس%20المونتاج'

export default function CTASection() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(93,214,44,0.07) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── "لمن هاد الكورس؟" ── */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-bold tracking-widest uppercase mb-4 text-center"
            style={{ color: '#5DD62C', letterSpacing: '0.18em' }}>
            — لمن هاد الكورس؟
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white text-center mb-10">
            مصنوع <span style={{ background: 'linear-gradient(90deg, #5DD62C, #7EE84E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>خصوصاً</span> ليك
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FOR_WHO.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.10, duration: 0.5 }}
                className="p-6 rounded-2xl text-center"
                style={{ background: 'rgba(14,18,36,0.70)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-black text-white text-base mb-2">{f.title}</h3>
                <p className="text-sm text-white/40">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Main CTA card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(8,12,30,0.98) 0%, rgba(14,20,45,0.95) 100%)',
            border: '1px solid rgba(93,214,44,0.18)',
            boxShadow: '0 0 80px rgba(93,214,44,0.06)',
          }}
        >
          {/* Top green line */}
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(93,214,44,0.7), transparent)' }} />

          {/* Sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 25%, rgba(93,214,44,0.025) 50%, transparent 75%)' }}
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }}
          />

          <div className="p-8 md:p-14">
            {/* Urgency */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#5DD62C' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#5DD62C' }} />
              </span>
              <span className="text-sm font-bold" style={{ color: '#5DD62C' }}>مقاعد محدودة — اشترك الآن قبل امتلاء الكورس</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-4 leading-tight">
              ابدأ رحلتك نحو
              <br />
              <span style={{ background: 'linear-gradient(90deg, #5DD62C, #7EE84E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                الاحتراف والربح
              </span>
            </h2>
            <p className="text-white/40 text-center text-base mb-10 max-w-md mx-auto">
              انضم لأكثر من 400 طالب نجحوا وبدأوا مسيرتهم المهنية في المونتاج
            </p>

            {/* What's included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-2xl mx-auto">
              {INCLUDES.map((inc) => (
                <div key={inc.label} className="flex items-start gap-3 text-right p-3 rounded-xl"
                  style={{ background: 'rgba(93,214,44,0.04)', border: '1px solid rgba(93,214,44,0.10)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(93,214,44,0.15)', border: '1px solid rgba(93,214,44,0.25)' }}>
                    <Check className="w-3 h-3" style={{ color: '#5DD62C' }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{inc.label}</div>
                    <div className="text-xs text-white/35 mt-0.5">{inc.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats row */}
            <div className="flex items-center justify-center gap-6 mb-10 flex-wrap">
              {[
                { icon: Users, val: '+400', lab: 'طالب' },
                { icon: Star,  val: '4.9',  lab: 'تقييم' },
                { icon: Zap,   val: '39',   lab: 'درس' },
                { icon: Clock, val: '+40',  lab: 'ساعة' },
              ].map(s => (
                <div key={s.lab} className="flex items-center gap-1.5">
                  <s.icon className="w-4 h-4" style={{ color: '#5DD62C' }} />
                  <span className="font-black text-white text-sm">{s.val}</span>
                  <span className="text-white/35 text-xs">{s.lab}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="flex flex-col items-center gap-4">
              <motion.a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg text-black relative overflow-hidden"
                style={{ background: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(37,211,102,0.20)' }}
              >
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.25) 50%, transparent 65%)', transform: 'skewX(-15deg)' }}
                  animate={{ x: ['-150%', '250%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                />
                <MessageCircle className="w-6 h-6 fill-black" />
                اشترك عبر واتساب
                <motion.div
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.div>
              </motion.a>
              <p className="text-xs text-white/25 font-semibold">رد فوري خلال دقائق · بدون التزام</p>
            </div>
          </div>

          {/* Bottom line */}
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(93,214,44,0.25), transparent)' }} />
        </motion.div>
      </div>
    </section>
  )
}
