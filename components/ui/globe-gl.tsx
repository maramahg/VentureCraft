"use client"

import { useEffect, useRef } from "react"
import Globe from "globe.gl"

interface GlobeGLProps {
  className?: string
}

export function GlobeGL({ className }: GlobeGLProps) {
  const globeEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!globeEl.current) return

    const world = new Globe(globeEl.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundColor('rgba(0,0,0,0)')
      .width(500)
      .height(500)
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#4FD1C5')
      .atmosphereAltitude(0.1)
      .enablePointerInteraction(true)

    // Auto-rotate
    world.controls().autoRotate = true
    world.controls().autoRotateSpeed = 0.5
    world.controls().enableZoom = false

    return () => {
      if (globeEl.current) {
        globeEl.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div 
      ref={globeEl} 
      className={className}
      style={{ 
        width: '500px', 
        height: '500px',
        margin: '0 auto'
      }}
    />
  )
}
