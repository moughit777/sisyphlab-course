'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ProtectedVideoPlayer from '@/components/course/ProtectedVideoPlayer'
import LessonSidebar from '@/components/course/LessonSidebar'
import { Lesson, Token } from '@/lib/types'
import { DEMO_COURSE } from '@/lib/courseData'
import { maskIP } from '@/lib/utils'
import { Shield, AlertTriangle, Menu, X, Zap, BookOpen, ChevronLeft } from 'lucide-react'

interface AccessData {
  valid: boolean
  token?: Token
  session_key?: string
  error?: string
  ip?: string
}

const DOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  top:  `${Math.floor(Math.random() * 90 + 5)}%`,
  left: `${Math.floor(Math.random() * 90 + 5)}%`,
  size: Math.random() > 0.6 ? 3 : 2,
  duration: 3 + (i % 5) * 0.8,
  delay: (i % 7) * 0.4,
}))

export default function CoursePage() {
  const params = useParams()
  const tokenStr = params.token as string

  const [accessData, setAccessData]             = useState<AccessData | null>(null)
  const [loading, setLoading]                   = useState(true)
  const [currentLesson, setCurrentLesson]       = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen]           = useState(false)
  const autoAdvancedRef = React.useRef<string | null>(null)

  useEffect(() => {
    async function verifyAccess() {
      try {
        const storedSessionKey = localStorage.getItem(`sk_${tokenStr}`)
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenStr, session_key: storedSessionKey }),
        })
        const data = await res.json()
        setAccessData(data)
        if (data.valid) {
          if (data.session_key) localStorage.setItem(`sk_${tokenStr}`, data.session_key)
          const stored = localStorage.getItem(`done_${tokenStr}`)
          if (stored) setCompletedLessons(JSON.parse(stored))
          if (DEMO_COURSE.modules?.[0]?.lessons?.[0]) {
            setCurrentLesson(DEMO_COURSE.modules[0].lessons[0])
          }
        }
      } catch {
        setAccessData({ valid: false, error: 'خطأ في التحقق من الرابط' })
      } finally {
        setLoading(false)
      }
    }
    verifyAccess()
  }, [tokenStr])

  const markCompleted = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev
      const updated = [...prev, lessonId]
      localStorage.setItem(`done_${tokenStr}`, JSON.stringify(updated))
      return updated
    })
  }, [tokenStr])

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    if (currentLesson) markCompleted(currentLesson.id)
    setCurrentLesson(lesson)
    setSidebarOpen(false)
  }, [currentLesson, markCompleted])

  const handleProgress = useCallback((seconds: number) => {
    if (!currentLesson || !accessData?.token) return
    const dur = currentLesson.duration_seconds || 600
    const threshold = Math.min(dur * 0.85, 300) // max 5 minutes
    if (seconds === 999999 || seconds >= threshold) {
      markCompleted(currentLesson.id)
      if (autoAdvancedRef.current !== currentLesson.id) {
        autoAdvancedRef.current = currentLesson.id
        const allL = DEMO_COURSE.modules.flatMap(m => m.lessons)
        const idx  = allL.findIndex(l => l.id === currentLesson.id)
        const next = allL[idx + 1]
        if (next) setTimeout(() => setCurrentLesson(next), 2000)
      }
    }
  }, [currentLesson, accessData, markCompleted])

  const handleVideoEnd = useCallback(() => {
    if (!currentLesson) return
    markCompleted(currentLesson.id)
    const allL = DEMO_COURSE.modules.flatMap(m => m.lessons)
    const idx  = allL.findIndex(l => l.id === currentLesson.id)
    const next = allL[idx + 1]
    if (next) {
      autoAdvancedRef.current = currentLesson.id
      setTimeout(() => setCurrentLesson(next), 1500)
    }
  }, [currentLesson, markCompleted])

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: 'rgba(51,116,24,0.18)', filter: 'blur(100px)' }} />
        </div>
        <div className="text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-green/10 border border-brand-green/30 flex items-center justify-center mx-auto mb-5">
            <Zap className="w-6 h-6 text-brand-green animate-pulse" />
          </div>
          <div className="w-8 h-8 border-2 border-brand-green/20 border-t-brand-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-gray text-sm">جارٍ التحقق من صلاحية الوصول...</p>
        </div>
      </div>
    )
  }

  /* ── Access Denied ── */
  if (!accessData?.valid) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'rgba(220,38,38,0.08)', filter: 'blur(80px)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-8 rounded-3xl border border-red-500/20 relative z-10"
          style={{ background: 'linear-gradient(135deg, rgba(32,20,20,0.9) 0%, rgba(20,20,20,0.95) 100%)', backdropFilter: 'blur(32px)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-brand-white mb-3">وصول مرفوض</h1>
          <p className="text-brand-gray mb-6 leading-relaxed text-sm">
            {accessData?.error || 'هذا الرابط غير صالح أو منتهي الصلاحية. يرجى التواصل معنا.'}
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

  const student    = accessData.token!
  const partialIp  = maskIP(accessData.ip || '0.0.0.0')
  const allModules = DEMO_COURSE.modules || []
  const allLessons = allModules.flatMap(m => m.lessons)
  const currentIdx = allLessons.findIndex(l => l.id === currentLesson?.id)
  const nextLesson = allLessons[currentIdx + 1] ?? null

  return (
    <div className="min-h-screen select-none" dir="rtl" style={{ background: '#0F0F0F' }}>

      {/* ── Background glow ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(51,116,24,0.35) 0%, rgba(93,214,44,0.06) 55%, transparent 75%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
          style={{ background: 'rgba(51,116,24,0.12)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[300px] rounded-full"
          style={{ background: 'rgba(51,116,24,0.10)', filter: 'blur(80px)' }} />
      </div>

      {/* ── Animated dots ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {DOTS.map(dot => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-brand-green"
            style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
            animate={{ opacity: [0.15, 0.6, 0.15], scale: [1, 1.4, 1] }}
            transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Top bar ── */}
      <header className="h-14 border-b border-brand-green/10 fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4"
        style={{ background: 'rgba(15,15,15,0.85)', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-lg text-brand-gray hover:text-brand-white hover:bg-brand-card transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Sisyph Lab" width={28} height={28} className="rounded-lg" />
            <span className="font-black text-brand-white text-sm hidden sm:block tracking-wide">Sisyph Lab</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-green/25"
            style={{ background: 'rgba(93,214,44,0.08)', backdropFilter: 'blur(12px)' }}>
            <Shield className="w-3.5 h-3.5 text-brand-green" />
            <span className="text-brand-green text-xs font-semibold">{student.student_name}</span>
          </div>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex pt-14 h-screen overflow-hidden relative z-10">

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          fixed top-14 bottom-0 w-72 z-30 transition-transform duration-300
          lg:relative lg:top-0 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Video player */}
                <div className="mb-5 rounded-2xl overflow-hidden shadow-green-lg"
                  style={{ boxShadow: '0 0 60px rgba(51,116,24,0.15), 0 20px 60px rgba(0,0,0,0.6)' }}>
                  <ProtectedVideoPlayer
                    videoUrl={currentLesson.video_url}
                    title={currentLesson.title}
                    studentName={student.student_name}
                    partialIp={partialIp}
                    tokenId={student.id}
                    sessionKey={accessData.session_key!}
                    lessonId={currentLesson.id}
                    onProgress={handleProgress}
                    onEnd={handleVideoEnd}
                  />
                </div>

                {/* Next lesson button */}
                {nextLesson && (
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={handleVideoEnd}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                      style={{ background: 'rgba(93,214,44,0.15)', border: '1px solid rgba(93,214,44,0.3)', color: '#5DD62C' }}
                    >
                      {nextLesson.title}
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Lesson info card — Apple glass */}
                <div className="rounded-2xl border border-brand-green/15 p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(32,32,32,0.80) 0%, rgba(20,20,20,0.90) 100%)',
                    backdropFilter: 'blur(32px)',
                    boxShadow: '0 1px 0 rgba(93,214,44,0.06) inset, 0 20px 60px rgba(0,0,0,0.4)',
                  }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 rounded-full bg-brand-green" />
                    <h1 className="text-lg font-black text-brand-white">{currentLesson.title}</h1>
                  </div>
                  {currentLesson.description && (
                    <p className="text-brand-gray text-sm leading-relaxed pr-3">{currentLesson.description}</p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="w-16 h-16 rounded-2xl border border-brand-green/20 flex items-center justify-center"
                  style={{ background: 'rgba(93,214,44,0.06)' }}>
                  <BookOpen className="w-7 h-7 text-brand-green/50" />
                </div>
                <p className="text-brand-muted text-sm">اختر درساً للبدء</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
