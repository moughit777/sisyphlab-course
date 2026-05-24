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

  function toggleModule(id: string) {
    setOpenModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  return (
    <div className="h-full flex flex-col bg-dark-800/60 border-r border-dark-500/40">
      {/* Header */}
      <div className="p-4 border-b border-dark-500/40">
        <h3 className="font-bold text-white text-sm">محتوى الكورس</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {modules.reduce((a, m) => a + (m.lessons?.length || 0), 0)} درس
        </p>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto">
        {modules.map((module) => (
          <div key={module.id} className="border-b border-dark-500/30">
            {/* Module header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-dark-500/30 transition-colors text-right"
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="w-5 h-5 rounded bg-accent-purple/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-accent-purple-light text-xs font-bold">{module.order_index}</span>
                </div>
                <span className="text-sm font-semibold text-slate-200 text-right leading-tight">{module.title}</span>
              </div>
              <motion.div
                animate={{ rotate: openModules.includes(module.id) ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 mr-2"
              >
                <ChevronDown className="w-4 h-4 text-slate-500" />
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
                  {module.lessons?.map((lesson) => {
                    const isActive = lesson.id === currentLessonId
                    const isCompleted = completedLessons.includes(lesson.id)

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson)}
                        className={`w-full flex items-start gap-3 px-4 py-3 transition-all duration-200 text-right ${
                          isActive
                            ? 'bg-accent-purple/15 border-r-2 border-accent-purple'
                            : 'hover:bg-dark-500/30'
                        }`}
                      >
                        {/* Status icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : isActive ? (
                            <Play className="w-4 h-4 text-accent-purple-light fill-accent-purple-light" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium leading-tight ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
                            {lesson.order_index}. {lesson.title}
                          </div>
                          {lesson.duration_seconds && (
                            <div className="flex items-center gap-1 mt-1 text-slate-600 text-xs">
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
