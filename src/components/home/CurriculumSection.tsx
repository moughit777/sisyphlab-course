'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, BookOpen, Lock, Play, CheckCircle } from 'lucide-react'
import { DEMO_COURSE } from '@/lib/courseData'
import { formatDuration } from '@/lib/utils'

const MODULE_COLORS = [
  'from-purple-900/60 to-purple-800/40',
  'from-blue-900/60 to-blue-800/40',
  'from-emerald-900/60 to-emerald-800/40',
]

const MODULE_ACCENT = [
  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
]

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
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-base ${MODULE_ACCENT[mi % 3]}`}>
                    {mi + 1}
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
                      {module.lessons?.map((lesson, li) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-brand-black/30 transition-colors"
                        >
                          {/* Thumbnail with lock */}
                          <div className="relative flex-shrink-0 w-24 h-14 rounded-xl overflow-hidden">
                            <div className={`w-full h-full bg-gradient-to-br ${MODULE_COLORS[mi % 3]} flex items-center justify-center`}>
                              <Play className="w-5 h-5 text-white/30" />
                            </div>
                            {/* Dark lock overlay */}
                            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1">
                              <div className="w-7 h-7 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-brand-green" />
                              </div>
                            </div>
                            {/* Lesson number badge */}
                            <div className="absolute top-1 right-1 bg-black/60 text-white/70 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
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
                          <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-green/10 border border-brand-green/20 text-brand-green text-xs">
                            <Lock className="w-3 h-3" />
                            مقفول
                          </div>
                        </div>
                      ))}
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
          <a
            href="#cta"
            className="btn-green inline-block px-8 py-3 rounded-xl text-sm font-bold"
          >
            اشترك وابدأ التعلم الآن
          </a>
        </motion.div>
      </div>
    </section>
  )
}
