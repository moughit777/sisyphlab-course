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
  if (order === 2) return { fontFamily: 'sans-serif', fontSize: '26px', fontWeight: 900, color: '#bf7fff', letterSpacing: '-1px', textShadow: '0 0 24px rgba(155,77,255,0.9)' }
  if (order === 3) return { fontFamily: 'sans-serif', fontSize: '26px', fontWeight: 900, color: '#9df0fe', letterSpacing: '-1px', textShadow: '0 0 24px rgba(100,220,255,0.9)' }
  return { fontFamily: 'sans-serif', fontSize: '20px', fontWeight: 900, color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.5px' }
}

function getModuleLabel(order: number): string {
  if (order === 2) return 'Pr'
  if (order === 3) return 'Ae'
  return 'CC'
}

export default function LessonSidebar({ modules, currentLessonId, onSelectLesson, completedLessons = [] }: Props) {
  const [openModules, setOpenModules] = useState<string[]>([modules[0]?.id])

  const allLessons = modules.flatMap(m => m.lessons?.filter(l => l.video_url !== 'YOUR_VIDEO_URL') ?? [])
  const totalDone = allLessons.filter(l => completedLessons.includes(l.id)).length
  const remaining = allLessons.length - totalDone

  // find the next lesson to watch (first unlocked and not completed)
  const nextLessonId = allLessons.find(l => {
    const idx = allLessons.findIndex(x => x.id === l.id)
    const prevDone = idx === 0 || completedLessons.includes(allLessons[idx - 1].id)
    return prevDone && !completedLessons.includes(l.id)
  })?.id

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
    <div className="course-font h-full flex flex-col" style={{ background: 'rgba(5,8,20,0.90)', backdropFilter: 'blur(28px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="font-black text-white text-lg">محتوى الكورس</h3>
        <div className="flex items-center gap-3 mt-3">
          {/* Progress bar */}
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${allLessons.length ? (totalDone / allLessons.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #5DD62C, #7EE84E)' }} />
          </div>
          <span className="text-xs font-bold flex-shrink-0" style={{ color: '#5DD62C' }}>
            {totalDone}/{allLessons.length}
          </span>
        </div>
        {remaining > 0 && (
          <p className="text-xs mt-2 font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {remaining} درس متبقي — واصل!
          </p>
        )}
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((module) => {
          const moduleLessons = module.lessons?.filter(l => l.video_url !== 'YOUR_VIDEO_URL') ?? []
          const moduleDone = moduleLessons.filter(l => completedLessons.includes(l.id)).length

          return (
            <div key={module.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Module header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 transition-colors text-right hover:bg-white/4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Module app badge */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={module.order_index === 2
                      ? { background: 'linear-gradient(135deg,#1a0040,#3d0090)', border: '1px solid rgba(155,77,255,0.3)' }
                      : module.order_index === 3
                      ? { background: 'linear-gradient(135deg,#00003a,#00008f)', border: '1px solid rgba(100,200,255,0.3)' }
                      : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }
                    }>
                    <span style={{
                      fontFamily: 'sans-serif',
                      fontSize: '13px',
                      fontWeight: 900,
                      color: module.order_index === 2 ? '#bf7fff' : module.order_index === 3 ? '#9df0fe' : 'rgba(255,255,255,0.5)',
                    }}>
                      {getModuleLabel(module.order_index)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-sm font-black text-white leading-snug">{module.title}</div>
                    <div className="text-xs mt-0.5 font-semibold" style={{ color: 'rgba(255,255,255,0.30)' }}>
                      {moduleDone}/{moduleLessons.length} درس
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openModules.includes(module.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 mr-2"
                >
                  <ChevronDown className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
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
                    <div className="py-2 px-3 space-y-1.5">
                      {moduleLessons.map((lesson) => {
                        const isActive    = lesson.id === currentLessonId
                        const isCompleted = completedLessons.includes(lesson.id)
                        const unlocked    = isUnlocked(lesson)
                        const isNext      = lesson.id === nextLessonId && !isActive
                        const sweepDelay  = `${(flatIdx++ % 8) * 0.45}s`

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => unlocked && onSelectLesson(lesson)}
                            disabled={!unlocked}
                            title={!unlocked ? 'أكمل الدرس السابق أولاً' : lesson.title}
                            className="w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-200 text-right"
                            style={
                              isActive
                                ? { background: 'rgba(93,214,44,0.12)', border: '1px solid rgba(93,214,44,0.35)', boxShadow: '0 0 20px rgba(93,214,44,0.08)' }
                                : isNext
                                ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }
                                : isCompleted
                                ? { background: 'transparent', border: '1px solid transparent', opacity: 0.55, cursor: 'pointer' }
                                : !unlocked
                                ? { background: 'transparent', border: '1px solid transparent', opacity: 0.3, cursor: 'not-allowed' }
                                : { background: 'transparent', border: '1px solid transparent', cursor: 'pointer' }
                            }
                          >
                            {/* Thumbnail */}
                            <div className="thumb-light relative flex-shrink-0 rounded-xl overflow-hidden"
                              style={{ width: '80px', height: '52px', '--sweep-delay': sweepDelay } as React.CSSProperties}>
                              <div className="absolute inset-0" style={getModuleBg(module.order_index)} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span style={getModuleLogo(module.order_index)}>{getModuleLabel(module.order_index)}</span>
                              </div>
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ background: '#fff', boxShadow: '0 0 16px rgba(255,255,255,0.5)' }}>
                                    <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                                  </div>
                                </div>
                              )}
                              {isCompleted && !isActive && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
                                  <CheckCircle className="w-6 h-6" style={{ color: '#5DD62C' }} />
                                </div>
                              )}
                              {!unlocked && (
                                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
                                  <Lock className="w-4 h-4 text-white/30" />
                                </div>
                              )}
                              {isNext && !isCompleted && (
                                <div className="absolute bottom-0 inset-x-0 flex justify-center py-1"
                                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                                  <Play className="w-3 h-3 fill-white/60 text-white/60" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-right">
                              {/* Next badge */}
                              {isNext && (
                                <div className="mb-1">
                                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(93,214,44,0.2)', color: '#5DD62C', border: '1px solid rgba(93,214,44,0.35)' }}>
                                    ← التالي
                                  </span>
                                </div>
                              )}
                              {isActive && (
                                <div className="mb-1">
                                  <span className="text-xs font-black px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(93,214,44,0.25)', color: '#5DD62C' }}>
                                    ▶ يتشغل الآن
                                  </span>
                                </div>
                              )}
                              <div className="text-sm font-bold leading-snug"
                                style={{ color: isActive ? '#fff' : isCompleted ? 'rgba(255,255,255,0.5)' : isNext ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.65)' }}>
                                {lesson.title}
                              </div>
                              {lesson.duration_seconds && (
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <Clock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.25)' }} />
                                  <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {formatDuration(lesson.duration_seconds)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
