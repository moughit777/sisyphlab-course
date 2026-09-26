'use client'
import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import Hls from 'hls.js'
import { PROMO_HLS_URL } from './constants'

function fmt(s: number) {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export default function PromoPlayer() {
  const [playing,     setPlaying]     = useState(false)
  const [started,     setStarted]     = useState(false)
  const [muted,       setMuted]       = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [ready,       setReady]       = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hls.loadSource(PROMO_HLS_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => setReady(true))
      return () => { hls.destroy() }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = PROMO_HLS_URL
      setReady(true)
    }
  }, [])

  function togglePlay() {
    const video = videoRef.current
    if (!video || !ready) return
    if (video.paused) { video.play().catch(() => {}); setStarted(true) } else { video.pause() }
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const video = videoRef.current
    if (!video) return
    video.currentTime = parseFloat(e.target.value)
  }

  function fullscreen() {
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null
    if (wrapRef.current?.requestFullscreen) wrapRef.current.requestFullscreen()
    else video?.webkitEnterFullscreen?.() // iPhone Safari only supports fullscreen on the video element
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div ref={wrapRef} className="relative aspect-video rounded-media border border-hair overflow-hidden bg-surface-1">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover bg-black"
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setStarted(false); setCurrentTime(0) }}
        playsInline
        preload="metadata"
      />

      {/* Hides the caption burned into the bottom of the source video */}
      <div className="absolute inset-x-0 bottom-0 h-[15%] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #000 55%, transparent)' }} />

      {/* Cover — shown until the first play */}
      {!started && (
        <button
          onClick={togglePlay}
          className="group absolute inset-0 z-20 flex flex-col items-start justify-end gap-3 p-5 sm:p-6 text-start bg-surface-1"
          aria-label="شغّل الفيديو التعريفي"
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-fg-1 text-ink flex items-center justify-center transition-transform duration-base ease-out group-hover:scale-105">
              {/* Play icon is not mirrored in RTL — it shows media direction, not reading direction */}
              <Play className="w-7 h-7 fill-current translate-x-[2px]" />
            </span>
          </span>
          <span className="relative text-fg-1 text-base font-medium">فيديو تعريفي بالكورس</span>
          <span className="relative text-fg-3 text-sm">
            شنو غتتعلم، وكيفاش الكورس مقسوم{duration ? <> · <bdi className="num">{fmt(duration)}</bdi></> : null}
          </span>
        </button>
      )}

      {started && (
        <>
          <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />
          <div dir="ltr" className="absolute inset-x-0 bottom-0 z-20 px-4 pb-3 pt-8 flex items-center gap-3"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
            <button onClick={togglePlay} className="text-white/90 hover:text-white" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <div className="relative flex-1 h-1.5 rounded-full bg-white/20">
              <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress}%` }} />
              <input type="range" min={0} max={duration || 100} step={0.1} value={currentTime} onChange={seek}
                aria-label="Seek" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            <span className="text-white/80 text-xs num tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
            <button onClick={toggleMute} className="text-white/80 hover:text-white" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button onClick={fullscreen} className="text-white/80 hover:text-white" aria-label="Fullscreen">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
