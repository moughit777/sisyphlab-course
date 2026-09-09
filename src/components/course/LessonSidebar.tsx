'use client'
import React, { useState } from 'react'
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

function getModuleBg(order: number): React.CSSProperties {
  if (order === 2) return { background: 'linear-gradient(135deg, #1a0040 0%, #2d0070 50%, #1a0040 100%)' }
  if (order === 3) return { background: 'linear-gradient(135deg, #00003a 0%, #00006e 50%, #00003a 100%)' }
  return { background: 'linear-gradient(135deg, #0d1117 0%, #1c2333 50%, #0d1117 100%)' }
}

function getModuleLogo(order: number): React.CSSProperties {
  if (order === 2) return { fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 900, color: '#bf7fff', letterSpacing: '-1px', textShadow: '0 0 20px rgba(155,77,255,0.8)' }
  if (order === 3) return { fontFamily: 'sans-serif', fontSize: '22px', fontWeight: 900, color: '#9df0fe', letterSpacing: '-1px', textShadow: '0 0 20px rgba(100,220,255,0.8)' }
  return { fontFamily: 'sans-serif', fontSize: '18px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.5px' }
}

function getModuleLabel(order: number): string {
  if (order === 2) return 'Pr'
  if (order === 3) return 'Ae'
  return 'CC'
}

export default function LessonSidebar({ modules, currentLessonId, onSelectLesson, completedLessons = [] }: Props) {
  const [openModules, setOpenModules] = useState<string[]>([modules[0]?.id])

  const allLessons = modules.flatMap(m => m.lessons ?? [])

  let flatIdx = 0

  function isUnlocked(lesson: Lesson): boolean {
    const idx = allLessons.findIndex(l => l.id === lesson.id)
    if (idx === 0) return true
    return completedLessons.includes(allLessons[idx - 1].id)
  }

  function toggleModule(id: string) {
    setOpenModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  return (
    <div className="course-font h-full flex flex-col border-r border-white/8" style={{ background: 'rgba(5,8,20,0.82)', backdropFilter: 'blur(28px)' }}>
      {/* Header */}
      <div className="px-5 py-5 border-b border-white/8">
        <h3 className="font-black text-white text-base tracking-wide" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>محتوى الكورس</h3>
        <p className="text-sm text-white/35 mt-1 font-semibold">
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
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-right"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center mt-0.5 flex-shrink-0 border border-white/12">
                  <span className="text-white/60 text-sm font-black">{module.order_index}</span>
                </div>
                <span className="text-base font-black text-white text-right leading-snug">{module.title}</span>
              </div>
              <motion.div
                animate={{ rotate: openModules.includes(module.id) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mr-2"
              >
                <ChevronDown className="w-5 h-5 text-white/30" />
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
                    const sweepDelay  = `${(flatIdx++ % 8) * 0.45}s`

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => unlocked && onSelectLesson(lesson)}
                        disabled={!unlocked}
                        title={!unlocked ? 'أكمل الدرس السابق أولاً' : undefined}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 transition-all duration-200 text-right ${
                          !unlocked
                            ? 'cursor-not-allowed opacity-50'
                            : isActive
                            ? 'bg-white/8 border-r-2 border-white'
                            : 'hover:bg-white/5'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="thumb-light relative flex-shrink-0 w-20 h-12 rounded-xl overflow-hidden"
                          style={{ '--sweep-delay': sweepDelay } as React.CSSProperties}>
                          {/* Branded background based on module */}
                          <div className="absolute inset-0" style={getModuleBg(module.order_index)} />
                          {/* App logo text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span style={getModuleLogo(module.order_index)}>{getModuleLabel(module.order_index)}</span>
                          </div>
                          {/* Active overlay */}
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: 'rgba(0,0,0,0.45)' }}>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 0 12px rgba(255,255,255,0.4)' }}>
                                <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
                              </div>
                            </div>
                          )}
                          {/* Completed overlay */}
                          {isCompleted && !isActive && (
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: 'rgba(0,0,0,0.55)' }}>
                              <CheckCircle className="w-6 h-6 text-white/90" />
                            </div>
                          )}
                          {/* Locked overlay */}
                          {!unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl"
                              style={{ background: 'rgba(0,0,0,0.65)' }}>
                              <Lock className="w-4 h-4 text-white/40" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold leading-snug ${
                            isActive    ? 'text-white' :
                            isCompleted ? 'text-white/50' :
                            'text-white/40'
                          }`}>
                            {lesson.order_index}. {lesson.title}
                          </div>
                          {lesson.duration_seconds && (
                            <div className="flex items-center gap-1 mt-1.5 text-white/25 text-xs font-semibold">
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
