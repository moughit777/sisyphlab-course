'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import Hls from 'hls.js'

const PROMO_HLS_URL = 'https://video.gumlet.io/69ef95a94d5bf5db18bcea67/69ef962aa3dc19951ffedcea/main.m3u8'

function fmt(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export default function PromoVideoSection() {
  const [playing,      setPlaying]      = useState(false)
  const [volume,       setVolume]       = useState(1)
  const [currentTime,  setCurrentTime]  = useState(0)
  const [duration,     setDuration]     = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [hlsReady,     setHlsReady]     = useState(false)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hlsRef    = useRef<Hls | null>(null)

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
    hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  function togglePlay() {
    const video = videoRef.current
    if (!video || !hlsReady) return
    if (playing) { video.pause() } else { video.play().catch(() => {}) }
    resetHide()
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current
    if (!video) return
    const t = parseFloat(e.target.value)
    video.currentTime = t
    setCurrentTime(t)
  }

  function handleVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current
    const val = parseFloat(e.target.value)
    if (video) { video.volume = val; video.muted = val === 0 }
    setVolume(val)
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    const newVol = volume > 0 ? 0 : 1
    video.volume = newVol
    video.muted = newVol === 0
    setVolume(newVol)
  }

  return (
    <section id="promo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(93,214,44,0.05) 0%, transparent 70%)' }} />

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

        {/* Player */}
        <motion.div
          id="promo-wrap"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-brand-border"
          style={{ boxShadow: '0 0 0 1px rgba(93,214,44,0.1), 0 24px 60px rgba(0,0,0,0.8)' }}
          onMouseMove={resetHide}
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="aspect-video relative bg-brand-black">

            {/* Big play button — shown when paused */}
            {!playing && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
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

            {/* Click center to pause when playing */}
            {playing && (
              <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
            )}

            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onEnded={() => { setPlaying(false); setCurrentTime(0) }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              playsInline
            />

            {/* Controls bar */}
            <div
              className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-16 pb-4 px-5 transition-opacity duration-300 z-20 ${showControls || !playing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={e => e.stopPropagation()}
            >
              {/* Seek bar */}
              <div className="mb-3 relative group/seek h-1.5">
                <div className="w-full h-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-none"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%`, background: 'rgba(204,255,0,0.65)' }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button onClick={togglePlay} className="text-white hover:text-brand-green transition-colors">
                    {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-white/70 hover:text-brand-green transition-colors">
                      {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0} max={1} step={0.05}
                      value={volume}
                      onChange={handleVolume}
                      className="w-20 h-1 rounded-full cursor-pointer appearance-none"
                      style={{ accentColor: '#CCFF00' }}
                    />
                  </div>

                  {/* Time */}
                  <span className="text-white/50 text-xs font-mono">
                    {fmt(currentTime)} / {fmt(duration)}
                  </span>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={() => { const w = document.getElementById('promo-wrap'); w?.requestFullscreen?.() }}
                  className="text-white/60 hover:text-brand-green transition-colors"
                >
                  <Maximize className="w-4 h-4" />
                </button>
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
