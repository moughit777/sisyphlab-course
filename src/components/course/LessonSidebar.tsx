'use client'
import { useState } from 'react'
import { ChevronDown, Play, CheckCircle, Clock, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Module, Lesson } from '@/lib/types'
import { formatDuration } from '@/lib/utils'

interface Props {
  modules: Module[]
  currentLessonId: string
  onSelectLesson: (lesson: Lesson) => void
  completedLessons?: string[]
}

export default function LessonSidebar({ modules, currentLessonId, onSelectLesson, completedLessons = [] }: Props) {
  const [openModules, setOpenModules] = useState<string[]>([modules[0]?.id])

  const allLessons = modules.flatMap(m => m.lessons ?? [])

  function isUnlocked(lesson: Lesson): boolean {
    const idx = allLessons.findIndex(l => l.id === lesson.id)
    if (idx === 0) return true
    return completedLessons.includes(allLessons[idx - 1].id)
  }

  function toggleModule(id: string) {
    setOpenModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  return (
    <div className="h-full flex flex-col border-r border-brand-green/10" style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(24px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-brand-green/10">
        <h3 className="font-bold text-brand-white text-sm">محتوى الكورس</h3>
        <p className="text-xs text-brand-muted mt-0.5">
          {modules.reduce((a, m) => a + (m.lessons?.filter(l => l.video_url !== 'YOUR_VIDEO_URL').length || 0), 0)} درس
        </p>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((module) => (
          <div key={module.id} className="border-b border-brand-border/50">
            {/* Module header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-card transition-colors text-right"
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="w-5 h-5 rounded bg-brand-green/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-brand-green text-xs font-bold">{module.order_index}</span>
                </div>
                <span className="text-sm font-semibold text-brand-white text-right leading-tight">{module.title}</span>
              </div>
              <motion.div
                animate={{ rotate: openModules.includes(module.id) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mr-2"
              >
                <ChevronDown className="w-4 h-4 text-brand-muted" />
              </motion.div>
            </button>

            {/* Lessons */}
            <AnimatePresence initial={false}>
              {openModules.includes(module.id) && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {module.lessons?.filter(l => l.video_url !== 'YOUR_VIDEO_URL').map((lesson) => {
                    const isActive    = lesson.id === currentLessonId
                    const isCompleted = completedLessons.includes(lesson.id)
                    const unlocked    = isUnlocked(lesson)

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => unlocked && onSelectLesson(lesson)}
                        disabled={!unlocked}
                        title={!unlocked ? 'أكمل الدرس السابق أولاً' : undefined}
                        className={`w-full flex items-start gap-3 px-3 py-3 transition-all duration-200 text-right ${
                          !unlocked
                            ? 'cursor-not-allowed'
                            : isActive
                            ? 'bg-brand-green/10 border-r-2 border-brand-green'
                            : 'hover:bg-brand-card'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden bg-brand-card">
                          <div className={`w-full h-full flex items-center justify-center ${
                            isCompleted ? 'bg-emerald-900/40' :
                            isActive    ? 'bg-brand-green/20' :
                            'bg-brand-card2'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                            ) : isActive ? (
                              <Play className="w-5 h-5 text-brand-green fill-brand-green" />
                            ) : unlocked ? (
                              <Play className="w-4 h-4 text-brand-muted" />
                            ) : (
                              <Lock className="w-4 h-4 text-brand-muted" />
                            )}
                          </div>
                          {!unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                              style={{ background: 'linear-gradient(135deg, rgba(15,15,15,0.75) 0%, rgba(51,116,24,0.25) 100%)' }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #337418 0%, #5DD62C 100%)', boxShadow: '0 0 10px rgba(93,214,44,0.4)' }}>
                                <Lock className="w-3 h-3 text-black" />
                              </div>
                            </div>
                          )}
                          {isCompleted && (
                            <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        <div className={`flex-1 min-w-0 ${!unlocked ? 'opacity-40' : ''}`}>
                          <div className={`text-xs font-medium leading-tight ${
                            isActive    ? 'text-brand-white' :
                            isCompleted ? 'text-brand-gray'  :
                            'text-brand-muted'
                          }`}>
                            {lesson.order_index}. {lesson.title}
                          </div>
                          {lesson.duration_seconds && (
                            <div className="flex items-center gap-1 mt-1 text-brand-muted text-xs">
                              <Clock className="w-3 h-3" />
                              {formatDuration(lesson.duration_seconds)}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
