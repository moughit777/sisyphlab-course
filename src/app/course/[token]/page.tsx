'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProtectedVideoPlayer from '@/components/course/ProtectedVideoPlayer'
import LessonSidebar from '@/components/course/LessonSidebar'
import { Lesson, Token } from '@/lib/types'
import { DEMO_COURSE } from '@/lib/courseData'
import { maskIP } from '@/lib/utils'
import { Shield, AlertTriangle, Menu, X, Zap } from 'lucide-react'

interface AccessData {
  valid: boolean
  token?: Token
  session_key?: string
  error?: string
  ip?: string
}

export default function CoursePage() {
  const params = useParams()
  const tokenStr = params.token as string

  const [accessData, setAccessData] = useState<AccessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function verifyAccess() {
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenStr }),
        })
        const data = await res.json()
        setAccessData(data)

        if (data.valid && DEMO_COURSE.modules?.[0]?.lessons?.[0]) {
          setCurrentLesson(DEMO_COURSE.modules[0].lessons[0])
        }
      } catch {
        setAccessData({ valid: false, error: 'خطأ في التحقق من الرابط' })
      } finally {
        setLoading(false)
      }
    }
    verifyAccess()
  }, [tokenStr])

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson)
    setSidebarOpen(false)
  }, [])

  const handleProgress = useCallback((seconds: number) => {
    if (!currentLesson || !accessData?.token) return
    if (seconds > (currentLesson.duration_seconds || 999) * 0.9) {
      setCompletedLessons(prev =>
        prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id]
      )
    }
  }, [currentLesson, accessData])

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent-purple/20 border-t-accent-purple animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">جارٍ التحقق من صلاحية الوصول...</p>
        </div>
      </div>
    )
  }

  // Access denied
  if (!accessData?.valid) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-8 rounded-3xl glass border border-red-500/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">وصول مرفوض</h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            {accessData?.error || 'هذا الرابط غير صالح أو منتهي الصلاحية أو غير نشط. يرجى التواصل معنا للحصول على رابط جديد.'}
          </p>
          <a
            href="https://wa.me/212624821600"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            التواصل عبر واتساب
          </a>
        </motion.div>
      </div>
    )
  }

  const student = accessData.token!
  const partialIp = maskIP(accessData.ip || '0.0.0.0')
  const allModules = DEMO_COURSE.modules || []

  return (
    <div className="min-h-screen bg-dark-900 select-none" dir="rtl">
      {/* Top bar */}
      <header className="h-14 border-b border-dark-500/50 bg-dark-800/80 backdrop-blur-xl flex items-center justify-between px-4 z-40 fixed top-0 inset-x-0">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-500/50 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">مونتاج برو</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-medium">{student.student_name}</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex pt-14 h-screen overflow-hidden">
        {/* Sidebar — mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-14 bottom-0 w-72 z-30 transition-transform duration-300
            lg:relative lg:top-0 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <LessonSidebar
            modules={allModules}
            currentLessonId={currentLesson?.id || ''}
            onSelectLesson={handleSelectLesson}
            completedLessons={completedLessons}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {currentLesson ? (
              <motion.div
                key={currentLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Video player */}
                <div className="mb-6">
                  <ProtectedVideoPlayer
                    videoUrl={currentLesson.video_url}
                    title={currentLesson.title}
                    studentName={student.student_name}
                    partialIp={partialIp}
                    tokenId={student.id}
                    lessonId={currentLesson.id}
                    onProgress={handleProgress}
                  />
                </div>

                {/* Lesson info */}
                <div className="p-5 rounded-2xl glass border border-dark-400/30">
                  <h1 className="text-xl font-black text-white mb-2">{currentLesson.title}</h1>
                  {currentLesson.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">{currentLesson.description}</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                اختر درساً للبدء
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
