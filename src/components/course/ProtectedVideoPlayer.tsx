'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import DynamicWatermark from './DynamicWatermark'
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, AlertTriangle, EyeOff,
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface Props {
  videoUrl: string
  title: string
  studentName: string
  partialIp: string
  tokenId: string
  lessonId: string
  onProgress?: (seconds: number) => void
}

// ─── Extract YouTube video ID from any YouTube URL ───
function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  // If it looks like a plain ID (11 chars, no slashes)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url
  return null
}

export default function ProtectedVideoPlayer({
  videoUrl, title, studentName, partialIp, tokenId, lessonId, onProgress,
}: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hideTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const youtubeId = getYouTubeId(videoUrl)
  const isYouTube = !!youtubeId

  const [playing,       setPlaying]       = useState(false)
  const [muted,         setMuted]         = useState(false)
  const [volume,        setVolume]        = useState(1)
  const [progress,      setProgress]      = useState(0)
  const [currentTime,   setCurrentTime]   = useState(0)
  const [duration,      setDuration]      = useState(0)
  const [showControls,  setShowControls]  = useState(true)
  const [isFullscreen,  setIsFullscreen]  = useState(false)
  const [playbackRate,  setPlaybackRate]  = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [isBlurred,     setIsBlurred]     = useState(false)
  const [blurReason,    setBlurReason]    = useState('')
  const [showWarning,   setShowWarning]   = useState(false)
  const [warningText,   setWarningText]   = useState('')
  const [buffering,     setBuffering]     = useState(false)

  // ─── PROTECTION: disable right-click ───
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    return () => document.removeEventListener('contextmenu', block)
  }, [])

  // ─── PROTECTION: block dangerous keyboard shortcuts ───
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') { e.preventDefault(); showThreatWarning('محاولة فتح أدوات المطور محظورة'); return }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I','J','C'].includes(e.key)) {
        e.preventDefault(); showThreatWarning('محاولة فتح أدوات المطور محظورة'); return
      }
      if ((e.ctrlKey || e.metaKey) && ['u','s','a','p'].includes(e.key)) { e.preventDefault(); return }
      if (e.key === 'PrintScreen') {
        e.preventDefault()
        setIsBlurred(true); setBlurReason('تم اكتشاف محاولة التقاط الشاشة')
        showThreatWarning('⚠️ تم تسجيل محاولة التقاط الشاشة')
        setTimeout(() => setIsBlurred(false), 3000)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ─── PROTECTION: DevTools detection ───
  useEffect(() => {
    let open = false
    const check = () => {
      const w = window.outerWidth - window.innerWidth > 160
      const h = window.outerHeight - window.innerHeight > 160
      if ((w || h) && !open) {
        open = true
        setIsBlurred(true); setBlurReason('تم اكتشاف أدوات المطور')
        showThreatWarning('⚠️ تم اكتشاف أدوات المطور — تم إيقاف الفيديو')
        if (!isYouTube) { videoRef.current?.pause(); setPlaying(false) }
      } else if (!w && !h && open) {
        open = false; setIsBlurred(false); setBlurReason('')
      }
    }
    const t = setInterval(check, 1500)
    return () => clearInterval(t)
  }, [isYouTube])

  // ─── PROTECTION: page visibility ───
  useEffect(() => {
    const handle = () => {
      if (document.hidden && !isYouTube) {
        videoRef.current?.pause(); setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [isYouTube])

  // ─── PROTECTION: window blur ───
  useEffect(() => {
    const onBlur = () => {
      if (playing && !isYouTube) {
        setIsBlurred(true); setBlurReason('يرجى العودة للصفحة لمتابعة الفيديو')
        videoRef.current?.pause(); setPlaying(false)
      }
    }
    const onFocus = () => { setIsBlurred(false); setBlurReason('') }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => { window.removeEventListener('blur', onBlur); window.removeEventListener('focus', onFocus) }
  }, [playing, isYouTube])

  // ─── Session heartbeat (every 30s) ───
  useEffect(() => {
    heartbeatRef.current = setInterval(async () => {
      try {
        await fetch('/api/sessions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId, lessonId }),
        })
      } catch {}
    }, 30000)
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current) }
  }, [tokenId, lessonId])

  // ─── Helpers ───
  function showThreatWarning(msg: string) {
    setWarningText(msg); setShowWarning(true)
    setTimeout(() => setShowWarning(false), 4000)
  }

  function resetHideTimer() {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false) }, 3000)
  }

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current || isBlurred) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else         { videoRef.current.play();  setPlaying(true)  }
    resetHideTimer()
  }, [playing, isBlurred])

  function handleTimeUpdate() {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
    onProgress?.(videoRef.current.currentTime)
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!progressRef.current || !videoRef.current) return
    const rect  = progressRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = ratio * videoRef.current.duration
    resetHideTimer()
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value)
    setVolume(v); if (videoRef.current) videoRef.current.volume = v; setMuted(v === 0)
  }

  function handleFullscreen() {
    if (!containerRef.current) return
    if (!isFullscreen) { containerRef.current.requestFullscreen?.(); setIsFullscreen(true)  }
    else               { document.exitFullscreen?.();                 setIsFullscreen(false) }
  }

  function setSpeed(rate: number) {
    if (videoRef.current) videoRef.current.playbackRate = rate
    setPlaybackRate(rate); setShowSpeedMenu(false)
  }

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2]

  // ══════════════════════════════════════════════════════
  //  YouTube MODE
  // ══════════════════════════════════════════════════════
  if (isYouTube) {
    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?` + new URLSearchParams({
      rel:            '0',
      modestbranding: '1',
      showinfo:       '0',
      iv_load_policy: '3',
      cc_load_policy: '0',
      disablekb:      '1',
      playsinline:    '1',
      color:          'white',
    }).toString()

    return (
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-2xl overflow-hidden select-none"
        style={{ aspectRatio: '16/9' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* YouTube iframe */}
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: 'none' }}
        />

        {/* Watermark always on top */}
        <DynamicWatermark studentName={studentName} partialIp={partialIp} />

        {/* Blur overlay for devtools / threats */}
        {isBlurred && (
          <div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl cursor-pointer"
            onClick={() => { setIsBlurred(false); setBlurReason('') }}
          >
            <EyeOff className="w-12 h-12 text-brand-green mb-4" />
            <p className="text-white font-bold text-lg mb-2">الفيديو محمي</p>
            <p className="text-brand-gray text-sm text-center max-w-xs">{blurReason}</p>
            <button className="mt-4 px-4 py-2 rounded-lg bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm hover:bg-brand-green/30 transition-colors">
              استمر في المشاهدة
            </button>
          </div>
        )}

        {/* Warning notification */}
        {showWarning && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-900/90 border border-red-500/40 text-white text-sm backdrop-blur-sm shadow-xl">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            {warningText}
          </div>
        )}

        {/* Title bar at bottom */}
        <div className="absolute bottom-0 inset-x-0 z-10 px-4 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <p className="text-white/70 text-xs truncate">{title}</p>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════
  //  HLS / MP4 MODE (Gumlet, Bunny, etc.)
  // ══════════════════════════════════════════════════════
  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-2xl overflow-hidden select-none group"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetHideTimer}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => { setPlaying(false); setShowControls(true) }}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        playsInline
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none' } as React.CSSProperties}
      />

      <DynamicWatermark studentName={studentName} partialIp={partialIp} />

      {isBlurred && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl cursor-pointer" onClick={() => { setIsBlurred(false); setBlurReason('') }}>
          <EyeOff className="w-12 h-12 text-brand-green mb-4" />
          <p className="text-white font-bold text-lg mb-2">الفيديو محمي</p>
          <p className="text-brand-gray text-sm text-center max-w-xs">{blurReason}</p>
          <button className="mt-4 px-4 py-2 rounded-lg bg-brand-green/20 border border-brand-green/30 text-brand-green text-sm">استمر في المشاهدة</button>
        </div>
      )}

      {buffering && !isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="spinner" />
        </div>
      )}

      {showWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-900/90 border border-red-500/40 text-white text-sm backdrop-blur-sm shadow-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          {warningText}
        </div>
      )}

      {!playing && !isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer" onClick={handlePlayPause}>
          <div className="w-20 h-20 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center hover:bg-brand-green/30 transition-all">
            <Play className="w-8 h-8 text-brand-green fill-brand-green mr-[-2px]" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300 ${showControls || !playing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-white text-sm font-medium mb-2 truncate">{title}</div>
        <div ref={progressRef} className="w-full h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer group/prog" onClick={handleProgressClick}>
          <div className="h-full bg-brand-green rounded-full relative" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-brand-green shadow-[0_0_8px_rgba(93,214,44,0.8)] opacity-0 group-hover/prog:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handlePlayPause} className="w-8 h-8 flex items-center justify-center text-white hover:text-brand-green transition-colors">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted }} className="text-white hover:text-brand-green transition-colors">
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} onChange={handleVolumeChange} className="w-0 group-hover/vol:w-16 transition-all duration-200 h-1 cursor-pointer accent-brand-green" />
            </div>
            <span className="text-white/60 text-xs">{formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button onClick={() => setShowSpeedMenu(!showSpeedMenu)} className="px-2 py-1 rounded text-white/70 hover:text-white text-xs font-mono flex items-center gap-1 hover:bg-white/10 transition-colors">
                <Settings className="w-3.5 h-3.5" />{playbackRate}×
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-xl z-30">
                  {speeds.map(s => (
                    <button key={s} onClick={() => setSpeed(s)} className={`block w-full px-4 py-2 text-xs text-right hover:bg-brand-card2 transition-colors ${s === playbackRate ? 'text-brand-green font-bold' : 'text-brand-gray'}`}>
                      {s}×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleFullscreen} className="text-white/70 hover:text-white transition-colors">
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-5" onContextMenu={(e) => e.preventDefault()} onClick={playing ? handlePlayPause : undefined} style={{ cursor: playing ? 'none' : 'default' }} />
    </div>
  )
}
