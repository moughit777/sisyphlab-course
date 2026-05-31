"use client"

import { MeshGradient } from "@paper-design/shaders-react"

export function GlobalBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Animated mesh gradient — covers full page */}
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        colors={["#091507", "#0b1c08", "#162e0e", "#1f4d12", "#337418", "#5DD62C"]}
        speed={0.42}
        distortion={0.85}
        swirl={0.18}
      />

      {/* Noise / film grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.04,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Dark vignette edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(5,10,4,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}
