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
      .atmosphereColor('#FF8C42')
      .atmosphereAltitude(0.12)
      .enablePointerInteraction(true)

    // Load and configure country polygons with warm colors
    fetch('//unpkg.com/world-atlas/countries-50m.json')
      .then(res => res.json())
      .then(countries => {
        const warmColors = ['#F39C12', '#E67E22', '#D68910', '#CA6F1E', '#E74C3C', '#C0392B', '#FF8C42', '#B7950B', '#A04000', '#DC7633'];
        
        const countriesWithColors = countries.objects.countries.geometries.map((country: any) => ({
          ...country,
          color: warmColors[Math.floor(Math.random() * warmColors.length)]
        }));

        world.hexPolygonsData(countriesWithColors)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.4)
          .hexPolygonColor('color')
          .hexPolygonAltitude(0.01)
          .hexPolygonUseDots(false);
      })
      .catch(error => console.error('Error loading country data:', error))

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
