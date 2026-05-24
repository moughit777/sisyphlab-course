'use client'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * value))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{count.toLocaleString('ar')}{suffix}</span>
}

const stats = [
  { value: 2400, suffix: '+', label: 'طالب مسجل',    sub: 'من المغرب والعالم العربي' },
  { value: 40,   suffix: '+', label: 'ساعة محتوى',   sub: 'فيديوهات عالية الجودة' },
  { value: 13,   suffix: '',  label: 'درس متخصص',    sub: 'في 4 وحدات متكاملة' },
  { value: 98,   suffix: '%', label: 'معدل الرضا',   sub: 'من تقييمات الطلاب' },
]

export default function StatsSection() {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(93,214,44,0.07) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-border rounded-2xl overflow-hidden border border-brand-border"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-brand-black hover:bg-brand-card transition-colors duration-300 p-6 md:p-8 text-center group"
            >
              <div className="text-4xl md:text-5xl font-black text-brand-green stat-number mb-1 group-hover:text-brand-green-light transition-colors">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-sm font-semibold text-brand-white mb-0.5">{s.label}</div>
              <div className="text-xs text-brand-muted">{s.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
