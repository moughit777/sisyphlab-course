"use client"

export function GlobalBackground() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#070B1A",
      }}
    >
      {/* Studio photo - blurred */}
      <div style={{
        position: "absolute",
        inset: "-5%",
        backgroundImage: "url('/studio-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "blur(1.5px) brightness(0.55)",
      }} />

      {/* Dark overlay for readability */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(4, 6, 18, 0.55)",
      }} />

      {/* Blue ambient glow right */}
      <div style={{
        position: "absolute",
        right: "-10%", top: "10%",
        width: "50%", height: "70%",
        background: "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Purple ambient glow left */}
      <div style={{
        position: "absolute",
        left: "-10%", bottom: "0%",
        width: "50%", height: "60%",
        background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(2,4,14,0.75) 100%)",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        opacity: 0.04,
        mixBlendMode: "overlay",
      }} />

      {/* Adobe Pr logo - bottom left */}
      <img
        src="/pr-logo.webp"
        alt=""
        style={{
          position: "absolute",
          bottom: "5%", left: "4%",
          width: 72, height: 72,
          opacity: 0.85,
          borderRadius: 14,
        }}
      />

      {/* Adobe Ae logo - bottom right */}
      <img
        src="/ae-logo.webp"
        alt=""
        style={{
          position: "absolute",
          bottom: "5%", right: "4%",
          width: 72, height: 72,
          opacity: 0.85,
          borderRadius: 14,
        }}
      />
    </div>
  )
}
