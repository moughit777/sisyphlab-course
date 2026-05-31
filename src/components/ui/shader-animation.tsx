"use client"

import { MeshGradient } from "@paper-design/shaders-react"

export function ShaderAnimation({ className = "" }: { className?: string }) {
  return (
    <MeshGradient
      className={className}
      style={{ width: "100%", height: "100%" }}
      colors={["#091507", "#0c1f09", "#1a4a0a", "#337418", "#5DD62C"]}
      speed={0.55}
      distortion={0.75}
      swirl={0.12}
    />
  )
}
