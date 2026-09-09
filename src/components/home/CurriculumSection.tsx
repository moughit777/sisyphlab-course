'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, BookOpen, Lock, Play } from 'lucide-react'
import { DEMO_COURSE } from '@/lib/courseData'
import { formatDuration } from '@/lib/utils'

/* Same app-branding logic as the student sidebar — Pr for module 2, Ae for module 3, CC otherwise */
function getModuleBg(order: number): React.CSSProperties {
  if (order === 2) return { background: 'linear-gradient(135deg, #1a0040 0%, #2d0070 50%, #1a0040 100%)' }
  if (order === 3) return { background: 'linear-gradient(135deg, #00003a 0%, #00006e 50%, #00003a 100%)' }
  return { background: 'linear-gradient(135deg, #0d1117 0%, #1c2333 50%, #0d1117 100%)' }
}
function getModuleLogo(order: number): React.CSSProperties {
  if (order === 2) return { fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 900, color: '#bf7fff', letterSpacing: '-1px', textShadow: '0 0 20px rgba(155,77,255,0.9)' }
  if (order === 3) return { fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 900, color: '#9df0fe', letterSpacing: '-1px', textShadow: '0 0 20px rgba(100,220,255,0.9)' }
  return { fontFamily: 'sans-serif', fontSize: '17px', fontWeight: 900, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.5px' }
}
function getModuleLabel(order: number): string {
  if (order === 2) return 'Pr'
  if (order === 3) return 'Ae'
  return 'CC'
}
function getModuleAccent(order: number) {
  if (order === 2) return { glow: '#bf7fff' }
  if (order === 3) return { glow: '#9df0fe' }
  return { glow: '#5DD62C' }
}

export default function CurriculumSection() {
  const [open, setOpen] = useState<string | null>('mod-1')
  const course = DEMO_COURSE

  const totalLessons = course.modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0
  const totalSecs    = course.modules?.reduce((a, m) =>
    a + (m.lessons?.reduce((b, l) => b + (l.duration_seconds || 0), 0) || 0), 0) || 0

  return (
    <section id="curriculum" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 55% at 5% 40%, rgba(93,214,44,0.09) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 45% at 95% 70%, rgba(93,214,44,0.07) 0%, transparent 55%)' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="tag-green mb-4 mx-auto w-fit">
            <BookOpen className="w-3.5 h-3.5" />
            محتوى الدورة
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-white mb-5">
            منهاج <span className="text-green-gradient">الكورس الكامل</span>
          </h2>
          <div className="flex items-center justify-center gap-6 text-sm text-brand-gray">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-green" />
              {totalLessons} درس
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-green" />
              {Math.round(totalSecs / 3600)} ساعات
            </span>
            <span className="flex items-center gap-1.5">
              <Play className="w-4 h-4 text-brand-green" />
              {course.modules?.length} وحدات
            </span>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="space-y-3">
          {course.modules?.map((module, mi) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: mi * 0.08 }}
              className="rounded-2xl overflow-hidden border border-brand-border bg-brand-card"
            >
              {/* Module header */}
              <button
                onClick={() => setOpen(open === module.id ? null : module.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-brand-card2 transition-colors text-right"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={getModuleBg(module.order_index)}>
                    <span style={{ ...getModuleLogo(module.order_index), fontSize: '15px' }}>
                      {getModuleLabel(module.order_index)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-white text-base">{module.title}</div>
                    <div className="text-xs text-brand-muted mt-0.5 flex items-center gap-2">
                      <span>{module.lessons?.length} درس</span>
                      <span>·</span>
                      <span>{formatDuration(module.lessons?.reduce((a, l) => a + (l.duration_seconds || 0), 0) || 0)}</span>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ rotate: open === module.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-brand-gray" />
                </motion.div>
              </button>

              {/* Lessons */}
              <AnimatePresence initial={false}>
                {open === module.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-brand-border divide-y divide-brand-border/40 px-3 pb-3 pt-1">
                      {module.lessons?.map((lesson, li) => {
                        const accent = getModuleAccent(module.order_index)
                        const sweepDelay = `${((mi * 7 + li) % 10) * 0.6}s`
                        return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-brand-black/30 transition-colors"
                        >
                          {/* Thumbnail — branded app cover with CC light sweep */}
                          <div className="thumb-light relative flex-shrink-0 w-44 h-[6.5rem] rounded-xl overflow-hidden hidden sm:block"
                            style={{ '--sweep-delay': sweepDelay } as React.CSSProperties}>
                            {/* Branded gradient cover */}
                            <div className="absolute inset-0" style={getModuleBg(module.order_index)} />
                            {/* Big translucent app logo, off-center like a poster */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-90">
                              <span style={{ ...getModuleLogo(module.order_index), fontSize: '34px' }}>
                                {getModuleLabel(module.order_index)}
                              </span>
                            </div>
                            {/* Vignette for depth */}
                            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)' }} />
                            {/* Lock overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ background: 'rgba(0,0,0,0.42)' }}>
                              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(0,0,0,0.55)', border: `1px solid ${accent.glow}55`, boxShadow: `0 0 18px ${accent.glow}30` }}>
                                <Lock className="w-4 h-4" style={{ color: accent.glow }} />
                              </div>
                            </div>
                            {/* Lesson number badge */}
                            <div className="absolute top-1.5 right-1.5 bg-black/60 text-white/70 text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                              {String(li + 1).padStart(2, '0')}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 text-right">
                            <div className="text-sm font-medium text-brand-gray leading-snug">
                              {lesson.title}
                            </div>
                            {lesson.duration_seconds && (
                              <div className="flex items-center gap-1 mt-1.5 justify-end text-xs text-brand-muted">
                                <Clock className="w-3 h-3" />
                                {formatDuration(lesson.duration_seconds)}
                              </div>
                            )}
                          </div>

                          {/* Lock badge */}
                          <div className="flex-shrink-0 flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold"
                            style={{ background: `${accent.glow}18`, border: `1px solid ${accent.glow}35`, color: accent.glow }}>
                            <Lock className="w-3 h-3" />
                            <span className="hidden sm:inline">مقفول</span>
                          </div>
                        </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 p-6 rounded-2xl border border-brand-green/15 bg-brand-green/5 text-center"
        >
          <p className="text-brand-gray text-sm mb-4">🔒 جميع الدروس محمية — يمكن الوصول إليها فقط بعد الاشتراك</p>
          <motion.a
            href="#cta"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.97 }}
            className="btn-green inline-flex items-center gap-2.5 px-10 py-5 rounded-2xl text-lg font-bold relative overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(93,214,44,0.35), 0 2px 8px rgba(93,214,44,0.2)' }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)',
                transform: 'skewX(-15deg)',
              }}
              animate={{ x: ['-150%', '250%'] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }}
            />
            اشترك وابدأ التعلم الآن
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
