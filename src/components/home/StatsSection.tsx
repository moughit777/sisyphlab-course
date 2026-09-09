'use client'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'

function Counter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(ease * value)
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>
}

const STATS = [
  { value: 400, suffix: '+', label: 'طالب نجح',    sub: 'من المغرب والعالم العربي', color: '#5DD62C' },
  { value: 40,  suffix: '+', label: 'ساعة محتوى',  sub: 'فيديوهات عالية الجودة',    color: '#9B59FF' },
  { value: 39,  suffix: '',  label: 'درس احترافي', sub: 'Premiere Pro + After Effects', color: '#3366FF', decimals: 0 },
  { value: 4.9, suffix: '/5', label: 'تقييم',      sub: 'من أكثر من 400 طالب',      color: '#5DD62C', decimals: 1 },
]

export default function StatsSection() {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background line */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(93,214,44,0.15), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-2xl p-6 text-center overflow-hidden"
              style={{
                background: 'rgba(14,18,36,0.70)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Top hairline colored */}
              <div className="absolute top-0 inset-x-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}80, transparent)` }} />

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ boxShadow: `0 0 32px ${s.color}10 inset, 0 0 0 1px ${s.color}15` }} />

              <div className="relative">
                <div className="text-4xl md:text-5xl font-black mb-1.5 tabular-nums"
                  style={{ color: s.color, textShadow: `0 0 20px ${s.color}40` }}>
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="text-sm font-black text-white mb-1">{s.label}</div>
                <div className="text-xs text-white/30 leading-snug">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }} />
    </section>
  )
}
