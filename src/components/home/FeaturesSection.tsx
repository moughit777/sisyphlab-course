'use client'
import { motion } from 'framer-motion'
import { Film, Layers, Smartphone, Share2, Sparkles, Wand2, Monitor, Zap } from 'lucide-react'

const features = [
  { icon: Film,       title: 'Premiere Pro الاحترافي',     desc: 'إتقان التحرير والقص والانتقالات وتصحيح الألوان وصادرات الفيديو بجودة عالية' },
  { icon: Layers,     title: 'After Effects متقدم',         desc: 'Motion Graphics وتحريك النصوص والـ Keyframes والمؤثرات المرئية بشكل احترافي' },
  { icon: Smartphone, title: 'Reels & TikTok',              desc: 'إنشاء ريلز انستغرام وتيك توك احترافية تجذب المشاهدين وتزيد المتابعين' },
  { icon: Share2,     title: 'مونتاج السوشيال ميديا',       desc: 'محتوى عالي الجودة ليوتيوب وانستغرام وفيسبوك وتيك توك بإعدادات مثالية' },
  { icon: Sparkles,   title: 'المؤثرات البصرية VFX',        desc: 'تقنيات Visual Effects المذهلة التي تجعل فيديوهاتك لا تُنسى' },
  { icon: Wand2,      title: 'Color Grading احترافي',       desc: 'أسرار تصحيح وتدرج الألوان لإعطاء فيديوهاتك مظهراً سينمائياً رائعاً' },
  { icon: Monitor,    title: 'الصادر والضغط',               desc: 'إعدادات التصدير المثالية لكل منصة بأفضل جودة وأصغر حجم ممكن' },
  { icon: Zap,        title: 'الاختصارات والسرعة',          desc: 'تقنيات العمل السريع واختصارات لوحة المفاتيح لتوفير وقتك ومضاعفة إنتاجيتك' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 15% 50%, rgba(93,214,44,0.11) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 85% 80%, rgba(93,214,44,0.07) 0%, transparent 55%)' }} />
      <div className="divider-green mb-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="tag-green mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            ماذا ستتعلم
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-white leading-tight">
              كل ما تحتاجه<br />
              <span className="text-green-gradient">في مكان واحد</span>
            </h2>
            <p className="text-brand-gray max-w-sm text-sm leading-relaxed">
              دورة شاملة تغطي كل جوانب المونتاج من الأساسيات حتى التقنيات المتقدمة
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-border rounded-2xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-brand-black p-6 hover:bg-brand-card transition-all duration-300 cursor-default"
            >
              {/* Green corner on hover */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[24px] border-t-brand-green/0 group-hover:border-t-brand-green/20 transition-all duration-300" />

              <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center mb-4 group-hover:bg-brand-green/15 group-hover:border-brand-green/30 transition-all duration-300">
                <f.icon className="w-5 h-5 text-brand-green" />
              </div>

              <h3 className="font-bold text-brand-white text-sm mb-2 group-hover:text-brand-green transition-colors duration-200">
                {f.title}
              </h3>
              <p className="text-xs text-brand-gray leading-relaxed">{f.desc}</p>

              {/* Number */}
              <div className="absolute bottom-4 left-4 text-5xl font-black transition-colors duration-300 leading-none select-none" style={{ color: 'rgba(93,214,44,0.18)' }} onMouseEnter={e => (e.currentTarget.style.color='rgba(93,214,44,0.38)')} onMouseLeave={e => (e.currentTarget.style.color='rgba(93,214,44,0.18)')}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="divider-green mt-16" />
    </section>
  )
}
