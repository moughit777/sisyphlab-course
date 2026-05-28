'use client'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'محمد العمراني', role: 'مصور فيديو — الدار البيضاء', avatar: 'م',
    text: 'هاد الكورس بدّل مساري المهني بالكامل. كنت كنقطع فيديوهات عادية ودابا كنخدم فبروجيات كبيرة ومدفوعة مزيان.',
    highlight: 'بدّل مساري المهني',
  },
  {
    name: 'سارة بنسعيد', role: 'صانعة محتوى — أكادير', avatar: 'س',
    text: 'من مجرد ما كملت الكورس، المشاهدات ديال الريلزات ديالي تلاتضعفات! تعلمت أسرار المونتاج السريع والإفيهات الزوينة.',
    highlight: 'المشاهدات تلاتضعفات',
  },
  {
    name: 'يوسف التازي', role: 'Freelancer — فاس', avatar: 'ي',
    text: 'كنت خايف من برامج Adobe، ولكن الشرح كان مبسط بزاف وواضح. دابا عندي خدمة فريلانس وكنكسب من المونتاج.',
    highlight: 'كنكسب من المونتاج دابا',
  },
  {
    name: 'فاطمة الزهراء', role: 'مديرة تسويق — الرباط', avatar: 'ف',
    text: 'وفّر عليا الكورس ميات الدراهم كنت غادي نعطيهم للمصمم. دابا كنصور الفيديوهات ديال الشركة بوحدي بجودة عالية.',
    highlight: 'وفّرت ميات الدراهم',
  },
  {
    name: 'عمر بوعزيز', role: 'يوتيوبر — طنجة', avatar: 'ع',
    text: 'After Effects كانت حلم بعيد عليا. مع هاد الكورس فهمت كولشي خطوة بخطوة. Motion Graphics ولات سهلة بزاف.',
    highlight: 'After Effects ولات سهلة',
  },
  {
    name: 'ريم القادري', role: 'إعلامية — مراكش', avatar: 'ر',
    text: 'كورس كامل بزاف، الله يبارك. الـ Color Grading وحدها تستاهل ثمن الكورس. الفيديوهات ديالي بدات تبان سينمائية هادشي!',
    highlight: 'فيديوهات سينمائية',
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 80% 20%, rgba(93,214,44,0.10) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 80%, rgba(93,214,44,0.08) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="tag-green mb-4 mx-auto w-fit">
            <Star className="w-3.5 h-3.5 fill-brand-green" />
            شنو قالو الطلبة
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-white mb-3">
            واش كيقولو <span className="text-green-gradient">الطلبة ديالنا</span>
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-green text-brand-green" />)}
            <span className="text-brand-white font-bold mr-1">4.9</span>
            <span className="text-brand-gray text-sm">/ 5.0 (+400 تقييم)</span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.07 }}
              className="card-hover group relative p-6 rounded-2xl bg-brand-card flex flex-col"
            >
              <Quote className="absolute top-4 left-4 w-8 h-8 text-brand-green/6" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-brand-green text-brand-green" />)}
              </div>

              {/* Highlight tag */}
              <div className="mb-3 inline-flex">
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green font-medium">
                  "{t.highlight}"
                </span>
              </div>

              <p className="text-sm text-brand-gray leading-relaxed flex-1">{t.text}</p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-brand-border">
                <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-white">{t.name}</div>
                  <div className="text-xs text-brand-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
