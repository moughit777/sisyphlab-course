'use client'
import { useEffect, useRef, useState } from 'react'

interface Props {
  studentName: string
  partialIp: string
}

export default function DynamicWatermark({ studentName, partialIp }: Props) {
  const [position, setPosition] = useState({ top: '15%', right: '5%' })
  const [opacity, setOpacity] = useState(0.18)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null)

  const getTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const getDate = () => {
    return new Date().toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const [timeStr, setTimeStr] = useState(getTime)

  useEffect(() => {
    // Move watermark every 20 seconds to different positions
    const positions = [
      { top: '10%', right: '5%' },
      { top: '50%', right: '60%' },
      { top: '75%', right: '10%' },
      { top: '25%', right: '40%' },
      { top: '60%', right: '70%' },
      { top: '15%', right: '25%' },
    ]
    let idx = 0

    const moveTimer = setInterval(() => {
      idx = (idx + 1) % positions.length
      setPosition(positions[idx])
      // Briefly flash slightly more opaque when moving
      setOpacity(0.35)
      setTimeout(() => setOpacity(0.18), 800)
    }, 20000)

    // Update time every second
    const timeTimer = setInterval(() => setTimeStr(getTime()), 1000)

    return () => {
      clearInterval(moveTimer)
      clearInterval(timeTimer)
    }
  }, [])

  return (
    <div
      className="absolute z-30 pointer-events-none select-none transition-all duration-[1500ms] ease-in-out"
      style={{
        top: position.top,
        right: position.right,
        opacity,
        fontFamily: 'Cairo, monospace',
        direction: 'rtl',
      }}
    >
      <div className="px-3 py-1.5 rounded-lg text-white text-xs font-bold leading-relaxed"
        style={{
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(2px)',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div>{studentName}</div>
        <div className="text-white/70">{timeStr} — {getDate()}</div>
        <div className="text-white/50">{partialIp}</div>
      </div>
    </div>
  )
}
