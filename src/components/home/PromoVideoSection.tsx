'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react'
import Hls from 'hls.js'

const PROMO_HLS_URL = 'https://video.gumlet.io/69ef95a94d5bf5db18bcea67/69ef962aa3dc19951ffedcea/main.m3u8'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export default function PromoVideoSection() {
  const [playing,      setPlaying]      = useState(false)
  const [muted,        setMuted]        = useState(false)
  const [progress,     setProgress]     = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [hlsReady,     setHlsReady]     = useState(false)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hlsRef      = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hlsRef.current = hls
      hls.loadSource(PROMO_HLS_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => setHlsReady(true))
      return () => { hls.destroy() }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = PROMO_HLS_URL
      setHlsReady(true)
    }
  }, [])

  function resetHide() {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false) }, 3000)
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video || !hlsReady) return
    if (playing) {
      video.pause()
      setPlaying(false)
    } else {
      video.play().then(() => setPlaying(true)).catch(() => {})
    }
    resetHide()
  }

  function onTimeUpdate() {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  function onProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current
    if (!progressRef.current || !video || !video.duration) return
    const rect  = progressRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    video.currentTime = ratio * video.duration
  }

  return (
    <section id="promo" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none glow-center opacity-60" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="tag-green mb-4 mx-auto w-fit">
            <Play className="w-3.5 h-3.5" />
            فيديو تعريفي مجاني
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-white mb-3">
            شاهد ما ستتعلمه
            <span className="text-green-gradient"> في هذا الكورس</span>
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto text-sm">
            فيديو تعريفي كامل يشرح محتوى الدورة وما ستكتسبه من مهارات احترافية
          </p>
        </motion.div>

        {/* Player wrapper */}
        <motion.div
          id="promo-wrap"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-brand-border"
          style={{ boxShadow: '0 0 0 1px rgba(93,214,44,0.1), 0 0 80px rgba(93,214,44,0.07), 0 24px 60px rgba(0,0,0,0.8)' }}
          onMouseMove={resetHide}
        >

          <div className="aspect-video relative bg-brand-black">

            {/* Big play button overlay when not playing */}
            {!playing && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                onClick={togglePlay}
              >
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(93,214,44,0.06) 0%, transparent 70%)' }} />
                <motion.div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(93,214,44,0.15)', border: '2px solid rgba(93,214,44,0.4)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  animate={{ boxShadow: ['0 0 20px rgba(93,214,44,0.2)', '0 0 60px rgba(93,214,44,0.5)', '0 0 20px rgba(93,214,44,0.2)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Play className="w-10 h-10 text-brand-green fill-brand-green mr-[-3px]" />
                </motion.div>
              </div>
            )}

            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onTimeUpdate={onTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => { setPlaying(false); setProgress(0) }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              playsInline
            />

            {/* Controls bar */}
            <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-12 pb-4 px-5 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}>
              {/* Progress */}
              <div ref={progressRef} className="w-full h-1.5 bg-white/15 rounded-full mb-4 cursor-pointer group/p" onClick={onProgressClick}>
                <div className="h-full bg-brand-green rounded-full relative transition-all" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(93,214,44,0.8)] opacity-0 group-hover/p:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-brand-green transition-colors">
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>
                  <button
                    onClick={() => { setMuted(m => { if (videoRef.current) videoRef.current.muted = !m; return !m }) }}
                    className="text-white/60 hover:text-brand-green transition-colors"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-white/40 text-xs font-mono">{fmt(duration * progress / 100)} / {fmt(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; setProgress(0) } }} className="text-white/60 hover:text-brand-green transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { const w = document.getElementById('promo-wrap'); w?.requestFullscreen?.() }} className="text-white/60 hover:text-brand-green transition-colors">
                    <Maximize className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-5 rounded-xl border border-brand-border bg-brand-card"
        >
          <h3 className="font-bold text-brand-white mb-2">عن هذه الدورة</h3>
          <p className="text-brand-gray text-sm leading-relaxed mb-3">
            هذه الدورة صُممت لمساعدتك على تعلم أساسيات المونتاج باستخدام Adobe Premiere Pro وAdobe After Effects بطريقة عملية وبسيطة، حتى لو كنت تبدأ من الصفر. ستتعلم كيفية تعديل الفيديوهات باحتراف، صناعة فيديوهات جذابة للسوشيال ميديا، وإتقان أهم الأدوات والتقنيات المستخدمة في صناعة المحتوى الحديثة.
          </p>
          <p className="text-brand-gray text-sm leading-relaxed">
            كما ستكتشف داخل الدورة كيفية تطوير مهاراتك كمحرر فيديو، إنشاء معرض أعمال بسيط، وأفضل الطرق لإيجاد أول عميل والبدء في تحقيق دخل من مهارة المونتاج.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Premiere Pro','After Effects','Color Grading','Reels','Visual Effects','Social Media'].map(t => (
              <span key={t} className="px-2.5 py-1 rounded-lg bg-brand-black border border-brand-border text-brand-gray text-xs">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
