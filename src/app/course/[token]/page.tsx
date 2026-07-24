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
import {
  Shield, AlertTriangle, Menu, X, Zap, BookOpen, ChevronLeft,
  Eye, EyeOff, Lock, Mail, Phone, CheckSquare, Square,
} from 'lucide-react'

type PageState = 'loading' | 'registration' | 'auth' | 'course' | 'error'

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

  const [pageState, setPageState]                = useState<PageState>('loading')
  const [errorMsg, setErrorMsg]                  = useState('')
  const [accessData, setAccessData]              = useState<AccessData | null>(null)
  const [currentLesson, setCurrentLesson]        = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons]  = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen]            = useState(false)
  const [nextCountdown, setNextCountdown]        = useState<number | null>(null)
  const autoAdvancedRef                          = React.useRef<string | null>(null)
  const nearEndTriggeredRef                      = React.useRef<string | null>(null)
  const handleVideoEndRef                        = React.useRef<() => void>(() => {})

  // Registration form state
  const [regName, setRegName]           = useState('')
  const [regEmail, setRegEmail]         = useState('')
  const [regPassword, setRegPassword]   = useState('')
  const [regConfirm, setRegConfirm]     = useState('')
  const [regPhone, setRegPhone]         = useState('')
  const [regAgreed, setRegAgreed]       = useState(false)
  const [regError, setRegError]         = useState('')
  const [regLoading, setRegLoading]     = useState(false)
  const [showRegPass, setShowRegPass]   = useState(false)

  // Auth (login) form state
  const [authEmail, setAuthEmail]       = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError]       = useState('')
  const [authLoading, setAuthLoading]   = useState(false)
  const [showAuthPass, setShowAuthPass] = useState(false)

  // ── Initial check ──────────────────────────────────────────────────────────
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

        if (data.valid) {
          if (data.session_key) localStorage.setItem(`sk_${tokenStr}`, data.session_key)
          const stored = localStorage.getItem(`done_${tokenStr}`)
          if (stored) setCompletedLessons(JSON.parse(stored))
          const allL = (DEMO_COURSE.modules ?? []).flatMap(m => m.lessons ?? [])
          const lastId = localStorage.getItem(`last_${tokenStr}`)
          const lastLesson = lastId ? allL.find(l => l.id === lastId) : null
          setCurrentLesson(lastLesson ?? allL[0] ?? null)
          setAccessData(data)
          setPageState('course')
        } else if (data.needs_registration) {
          setPageState('registration')
        } else if (data.needs_auth) {
          setPageState('auth')
        } else {
          setErrorMsg(data.error || 'الرابط غير صالح')
          setPageState('error')
        }
      } catch {
        setErrorMsg('خطأ في التحقق من الرابط')
        setPageState('error')
      }
    }
    verifyAccess()
  }, [tokenStr])

  // ── After successful auth/register ────────────────────────────────────────
  function enterCourse(data: { session_key: string; token: Token; ip: string }) {
    localStorage.setItem(`sk_${tokenStr}`, data.session_key)
    const stored = localStorage.getItem(`done_${tokenStr}`)
    if (stored) setCompletedLessons(JSON.parse(stored))
    const allL = (DEMO_COURSE.modules ?? []).flatMap(m => m.lessons ?? [])
    const lastId = localStorage.getItem(`last_${tokenStr}`)
    const lastLesson = lastId ? allL.find(l => l.id === lastId) : null
    setCurrentLesson(lastLesson ?? allL[0] ?? null)
    setAccessData({ valid: true, token: data.token, session_key: data.session_key, ip: data.ip })
    setPageState('course')
  }

  // ── Registration submit ────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError('')

    if (!regName || !regEmail || !regPassword || !regPhone) {
      setRegError('جميع الحقول مطلوبة'); return
    }
    if (regPassword.length < 6) {
      setRegError('كلمة السر يجب أن تكون 6 أحرف على الأقل'); return
    }
    if (regPassword !== regConfirm) {
      setRegError('كلمتا السر غير متطابقتين'); return
    }
    if (!regAgreed) {
      setRegError('يجب الموافقة على شروط الاستخدام'); return
    }

    setRegLoading(true)
    try {
      const res = await fetch('/api/course/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenStr, name: regName, email: regEmail, password: regPassword, phone: regPhone }),
      })
      const data = await res.json()
      if (!res.ok) { setRegError(data.error || 'حدث خطأ'); return }
      enterCourse(data)
    } catch {
      setRegError('خطأ في الاتصال')
    } finally {
      setRegLoading(false)
    }
  }

  // ── Auth (login) submit ───────────────────────────────────────────────────
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    if (!authPassword) { setAuthError('ادخل كلمة السر'); return }

    if (!authEmail) { setAuthError('ادخل البريد الإلكتروني'); return }

    setAuthLoading(true)
    try {
      const res = await fetch('/api/course/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenStr, email: authEmail, password: authPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setAuthError(data.error || 'حدث خطأ'); return }
      enterCourse(data)
    } catch {
      setAuthError('خطأ في الاتصال')
    } finally {
      setAuthLoading(false)
    }
  }

  // ── Course logic ───────────────────────────────────────────────────────────
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
    nearEndTriggeredRef.current = null
    setNextCountdown(null)
    setCurrentLesson(lesson)
    localStorage.setItem(`last_${tokenStr}`, lesson.id)
    setSidebarOpen(false)
  }, [currentLesson, markCompleted, tokenStr])

  const handleProgress = useCallback((seconds: number) => {
    if (!currentLesson || !accessData?.token) return
    const dur = currentLesson.duration_seconds || 600
    const threshold = Math.min(dur * 0.85, 300)
    if (seconds === 999999 || seconds >= threshold) {
      markCompleted(currentLesson.id)
    }
    // Trigger 30s countdown before end
    if (seconds !== 999999 && dur > 60 && dur - seconds <= 30 && nearEndTriggeredRef.current !== currentLesson.id) {
      const allL = (DEMO_COURSE.modules ?? []).flatMap(m => m.lessons ?? [])
      const idx  = allL.findIndex(l => l.id === currentLesson.id)
      if (allL[idx + 1]) {
        nearEndTriggeredRef.current = currentLesson.id
        setNextCountdown(30)
      }
    }
  }, [currentLesson, accessData, markCompleted])

  const handleVideoEnd = useCallback(() => {
    setNextCountdown(null)
    if (!currentLesson) return
    markCompleted(currentLesson.id)
    if (autoAdvancedRef.current === currentLesson.id) return
    autoAdvancedRef.current = currentLesson.id
    const allL = (DEMO_COURSE.modules ?? []).flatMap(m => m.lessons ?? [])
    const idx  = allL.findIndex(l => l.id === currentLesson.id)
    const next = allL[idx + 1]
    if (next) setTimeout(() => { setCurrentLesson(next); localStorage.setItem(`last_${tokenStr}`, next.id) }, 500)
  }, [currentLesson, markCompleted, tokenStr])

  // Sync ref so countdown effect always has latest callback
  useEffect(() => { handleVideoEndRef.current = handleVideoEnd }, [handleVideoEnd])

  // Countdown tick — advances to next lesson at 0
  useEffect(() => {
    if (nextCountdown === null) return
    if (nextCountdown === 0) {
      handleVideoEndRef.current()
      setNextCountdown(null)
      return
    }
    const t = setTimeout(() => setNextCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [nextCountdown])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: 'rgba(59,130,246,0.12)', filter: 'blur(100px)' }} />
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

  // ── Error ──────────────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
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
          <p className="text-brand-gray mb-6 leading-relaxed text-sm">{errorMsg}</p>
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

  // ── Registration form ──────────────────────────────────────────────────────
  if (pageState === 'registration') {
    const inputCls = 'w-full py-4 rounded-2xl text-base text-white placeholder-white/30 focus:outline-none transition-all duration-200'
    const inputStyle = {
      background: 'rgba(93,214,44,0.04)',
      border: '1px solid rgba(93,214,44,0.18)',
    }
    const inputFocusStyle = {
      background: 'rgba(93,214,44,0.07)',
      border: '1px solid rgba(93,214,44,0.55)',
      boxShadow: '0 0 0 3px rgba(93,214,44,0.10)',
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
        style={{ background: 'transparent' }}>

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
            style={{ background: 'rgba(59,130,246,0.08)', filter: 'blur(80px)' }} />
          <div className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full"
            style={{ background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Glass card */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(14,18,48,0.70)',
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 0 0 0.5px rgba(59,130,246,0.08) inset, 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.08)',
            }}>

            {/* Light sweep animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(59,130,246,0.06) 50%, transparent 75%)' }}
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
            />

            {/* Top blue line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)' }} />

            {/* Header */}
            <div className="relative z-10 pt-8 pb-6 px-8 text-center"
              style={{ borderBottom: '1px solid rgba(59,130,246,0.12)' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">أكمل تسجيلك</h1>
              <p className="text-white/50 text-sm mt-1.5">ستستخدم هذه البيانات في كل مرة تريد الدخول</p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="relative z-10 p-8 space-y-4">
              {regError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl text-sm text-red-300"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {regError}
                </motion.div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">الاسم الكامل</label>
                <div className="relative group">
                  <Shield className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type="text" value={regName} onChange={e => setRegName(e.target.value)}
                    placeholder="أدخل اسمك الكامل" required
                    className={`${inputCls} pr-12 pl-4`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    placeholder="example@email.com" required
                    className={`${inputCls} pr-12 pl-4`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">رقم الهاتف</label>
                <div className="relative group">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)}
                    placeholder="+212600000000" required
                    className={`${inputCls} pr-12 pl-4`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">كلمة السر</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type={showRegPass ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل" required
                    className={`${inputCls} pr-12 pl-12`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <button type="button" onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showRegPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">تأكيد كلمة السر</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type={showRegPass ? 'text' : 'password'} value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                    placeholder="أعد كتابة كلمة السر" required
                    className={`${inputCls} pr-12 pl-4`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Agreement */}
              <button type="button" onClick={() => setRegAgreed(!regAgreed)}
                className="flex items-center gap-3 w-full text-right py-1">
                <div className="flex-shrink-0">
                  {regAgreed
                    ? <CheckSquare className="w-5 h-5 text-brand-green" />
                    : <Square className="w-5 h-5 text-white/30" />}
                </div>
                <span className="text-sm text-white/60 leading-relaxed">
                  مشاركة الرابط سيؤدي إلى إلغاء الوصول نهائياً.
                </span>
              </button>

              {/* Submit */}
              <motion.button
                type="submit" disabled={regLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-2xl font-bold text-base text-black disabled:opacity-50 transition-all relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #5DD62C 0%, #337418 100%)', boxShadow: '0 4px 24px rgba(93,214,44,0.3)' }}
              >
                {regLoading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      جارٍ التسجيل...
                    </span>
                  : 'تسجيل والدخول للكورس'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Auth (login) form ──────────────────────────────────────────────────────
  if (pageState === 'auth') {
    const inputCls = 'w-full py-4 rounded-2xl text-base text-white placeholder-white/30 focus:outline-none transition-all duration-200'
    const inputStyle = {
      background: 'rgba(93,214,44,0.04)',
      border: '1px solid rgba(93,214,44,0.18)',
    }
    const inputFocusStyle = {
      background: 'rgba(93,214,44,0.07)',
      border: '1px solid rgba(93,214,44,0.55)',
      boxShadow: '0 0 0 3px rgba(93,214,44,0.10)',
    }
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
        style={{ background: 'linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 50%, #080d08 100%)' }}>

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(93,214,44,0.18) 0%, rgba(51,116,24,0.10) 50%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Glass card */}
          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(14,18,48,0.70)',
              backdropFilter: 'blur(48px)',
              WebkitBackdropFilter: 'blur(48px)',
              border: '1px solid rgba(59,130,246,0.25)',
              boxShadow: '0 0 0 0.5px rgba(59,130,246,0.08) inset, 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.08)',
            }}>

            {/* Light sweep animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(59,130,246,0.06) 50%, transparent 75%)' }}
              animate={{ x: ['-120%', '220%'] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
            />

            {/* Top blue line */}
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)' }} />

            {/* Header */}
            <div className="relative z-10 pt-8 pb-6 px-8 text-center"
              style={{ borderBottom: '1px solid rgba(59,130,246,0.12)' }}>
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.35)', boxShadow: '0 0 20px rgba(59,130,246,0.15)' }}>
                <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">مرحباً بعودتك</h1>
              <p className="text-white/50 text-sm mt-1.5">ادخل بياناتك للمتابعة</p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="relative z-10 p-8 space-y-4">
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl text-sm text-red-300"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {authError}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">البريد الإلكتروني</label>
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                    placeholder="example@email.com" autoFocus required
                    className={`${inputCls} pr-12 pl-4`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/90">كلمة السر</label>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-brand-green transition-colors" />
                  <input
                    type={showAuthPass ? 'text' : 'password'} value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                    placeholder="ادخل كلمة السر" required
                    className={`${inputCls} pr-12 pl-12`}
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocusStyle)}
                    onBlur={e => Object.assign(e.target.style, inputStyle)}
                  />
                  <button type="button" onClick={() => setShowAuthPass(!showAuthPass)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showAuthPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit" disabled={authLoading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-2xl font-bold text-base text-black disabled:opacity-50 transition-all mt-2"
                style={{ background: 'linear-gradient(135deg, #5DD62C 0%, #337418 100%)', boxShadow: '0 4px 24px rgba(93,214,44,0.3)' }}
              >
                {authLoading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      جارٍ التحقق...
                    </span>
                  : 'دخول للكورس'}
              </motion.button>

              <p className="text-center text-xs text-white/30 pt-1">
                نسيت كلمة السر؟{' '}
                <a href="https://wa.me/212624821600" target="_blank" rel="noopener noreferrer"
                  className="text-brand-green hover:underline">تواصل معنا</a>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Course ─────────────────────────────────────────────────────────────────
  const student    = accessData!.token!
  const partialIp  = maskIP(accessData!.ip || '0.0.0.0')
  const allModules = DEMO_COURSE.modules || []
  const allLessons = allModules.flatMap(m => m.lessons ?? [])
  const currentIdx = allLessons.findIndex(l => l.id === currentLesson?.id)
  const nextLesson = allLessons[currentIdx + 1] ?? null

  return (
    <div className="min-h-screen select-none" dir="rtl" style={{ background: 'transparent', fontFamily: 'var(--font-cairo), "Cairo", "Tajawal", sans-serif' }}>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, rgba(124,58,237,0.08) 55%, transparent 75%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full"
          style={{ background: 'rgba(59,130,246,0.08)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[300px] rounded-full"
          style={{ background: 'rgba(124,58,237,0.08)', filter: 'blur(80px)' }} />
      </div>

      {/* Animated dots */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {DOTS.map(dot => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-blue-400"
            style={{ top: dot.top, left: dot.left, width: dot.size, height: dot.size }}
            animate={{ opacity: [0.15, 0.6, 0.15], scale: [1, 1.4, 1] }}
            transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Top bar */}
      <header className="h-16 border-b border-white/10 fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5"
        style={{ background: 'rgba(7,11,26,0.85)', backdropFilter: 'blur(24px)' }}>
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-1.5 rounded-lg text-brand-gray hover:text-brand-white hover:bg-brand-card transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Sisyph Lab" width={36} height={36} className="rounded-lg" />
            <span className="font-black text-white text-base hidden sm:block" style={{ fontFamily: 'var(--font-cairo)', letterSpacing: '0.05em', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>Sisyph Lab</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-green/25"
            style={{ background: 'rgba(93,214,44,0.08)', backdropFilter: 'blur(12px)' }}>
            <Shield className="w-4 h-4 text-brand-green" />
            <span className="text-brand-green text-sm font-bold">{student.student_name}</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex pt-16 h-screen overflow-hidden relative z-10">

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
          fixed top-16 bottom-0 w-72 z-30 transition-transform duration-300
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
                <div className="mb-5 rounded-2xl overflow-hidden shadow-green-lg"
                  style={{ boxShadow: '0 0 60px rgba(51,116,24,0.15), 0 20px 60px rgba(0,0,0,0.6)' }}>
                  <ProtectedVideoPlayer
                    videoUrl={currentLesson.video_url}
                    title={currentLesson.title}
                    studentName={student.student_name}
                    partialIp={partialIp}
                    tokenId={student.id}
                    sessionKey={accessData!.session_key!}
                    lessonId={currentLesson.id}
                    onProgress={handleProgress}
                    onEnd={handleVideoEnd}
                  />
                </div>

                {/* Countdown auto-advance banner */}
                <AnimatePresence>
                  {nextCountdown !== null && nextLesson && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-4 rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
                      style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)' }}
                    >
                      <div className="min-w-0">
                        <p className="text-white/40 text-xs font-semibold mb-0.5">الدرس التالي</p>
                        <p className="text-white font-black text-sm truncate">{nextLesson.title}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.25)' }}>
                          <span className="text-white font-black text-base">{nextCountdown}</span>
                        </div>
                        <button
                          onClick={() => { setNextCountdown(null); nearEndTriggeredRef.current = 'cancelled' }}
                          className="text-white/40 hover:text-white/70 text-xs font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                        >
                          إلغاء
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {nextLesson && nextCountdown === null && (
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={handleVideoEnd}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/10 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      {nextLesson.title}
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 p-5"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(32px)',
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 rounded-full bg-white" style={{ boxShadow: '0 0 12px rgba(255,255,255,0.6)' }} />
                    <h1 className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-cairo)', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{currentLesson.title}</h1>
                  </div>
                  {currentLesson.description && (
                    <p className="text-white/55 text-sm leading-relaxed pr-4" style={{ fontFamily: 'var(--font-cairo)' }}>{currentLesson.description}</p>
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
