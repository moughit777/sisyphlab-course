'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Check, ArrowLeft } from 'lucide-react'

const benefits = [
  'وصول فوري لجميع الدروس بعد الاشتراك',
  'شرح عربي احترافي خطوة بخطوة',
  'دعم مستمر عبر واتساب',
  'تحديثات مجانية مدى الحياة',
  'شهادة إتمام الدورة',
]

export default function CTASection() {
  const WA = 'https://wa.me/212624821600?text=السلام%20عليكم%2C%20أريد%20الاشتراك%20في%20كورس%20المونتاج'

  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-brand-black" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(93,214,44,0.09) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-brand-green/4 blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-brand-green/20 rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(93,214,44,0.04) 0%, rgba(24,24,24,0.98) 50%, rgba(93,214,44,0.02) 100%)' }}
        >
          {/* Top green line */}
          <div className="h-px bg-gradient-to-r from-transparent via-brand-green/60 to-transparent" />

          <div className="p-8 md:p-14 text-center">
            <div className="tag-green mb-6 mx-auto w-fit">
              🔥 عرض محدود — سارع قبل انتهاء المقاعد
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-white mb-4 leading-tight">
              ابدأ رحلتك نحو<br />
              <span className="text-green-gradient">الاحتراف في المونتاج</span>
            </h2>

            <p className="text-brand-gray text-base mb-10 max-w-lg mx-auto">
              انضم لأكثر من 400 طالب نجحوا وبدأوا مسيرتهم المهنية
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-lg mx-auto text-right">
              {benefits.map(b => (
                <div key={b} className="flex items-center gap-2.5 text-sm text-brand-gray">
                  <div className="w-5 h-5 rounded-full bg-brand-green/15 border border-brand-green/25 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-brand-green" />
                  </div>
                  {b}
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="flex flex-col items-center gap-3">
              <motion.a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] text-black font-black text-lg shadow-[0_4px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_40px_rgba(37,211,102,0.5)] transition-all duration-300"
              >
                <MessageCircle className="w-6 h-6 fill-black" />
                اشترك عبر واتساب
                <ArrowLeft className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Bottom green line */}
          <div className="h-px bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}
