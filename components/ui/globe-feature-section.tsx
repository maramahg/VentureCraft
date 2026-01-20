"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import createGlobe, { COBEOptions } from "cobe"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export default function Featured_05() {
  return (
    <section className="relative w-full mx-auto overflow-hidden rounded-3xl bg-muted border border-gray-200 dark:border-gray-800 shadow-md px-6 py-16 md:px-16 md:py-24 mt-48">
      <div className="flex flex-col-reverse items-center justify-between gap-10 md:flex-row">
        <div className="z-10 max-w-xl text-left">
          <h1 className="text-3xl font-normal text-gray-900 dark:text-white">
            Build with <span className="text-primary">Ruixen UI</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">Empower your team with fast, elegant, and scalable UI components. Ruixen UI brings simplicity and performance to your modern apps.</span>
          </h1>
          <Button className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-black">
            Join Today <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative h-[180px] w-full max-w-xl">
          <Globe className="absolute -bottom-20 -right-40 scale-150" />
        </div>
      </div>
    </section>
  );
}

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0.4,
  diffuse: 0.8,
  mapSamples: 16000,
  mapBrightness: 2,
  baseColor: [0.1, 0.1, 0.1],
  markerColor: [0 / 255, 163 / 255, 131 / 255], // vc-teal color
  glowColor: [0 / 255, 163 / 255, 131 / 255], // vc-teal glow
  markers: [
    // Major sustainable energy innovation hubs
    { location: [37.7749, -122.4194], size: 0.08 }, // San Francisco (Silicon Valley)
    { location: [40.7128, -74.006], size: 0.1 }, // New York
    { location: [51.5074, -0.1278], size: 0.09 }, // London
    { location: [52.5200, 13.4050], size: 0.07 }, // Berlin
    { location: [55.7558, 37.6173], size: 0.06 }, // Moscow
    { location: [39.9042, 116.4074], size: 0.08 }, // Beijing
    { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
    { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
    { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
    { location: [-23.5505, -46.6333], size: 0.09 }, // São Paulo
    { location: [19.4326, -99.1332], size: 0.07 }, // Mexico City
    { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  let phi = 0
  let width = 0
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef(null)
  const pointerInteractionMovement = useRef(0)
  const [r, setR] = useState(0)

  const updatePointerInteraction = (value: any) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: any) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      setR(delta / 200)
    }
  }

  const onRender = useCallback(
    (state: Record<string, any>) => {
      if (!pointerInteracting.current) phi += 0.005
      state.phi = phi + r
      state.width = width * 2
      state.height = width * 2
    },
    [r],
  )

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    })

    const timeoutId = setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", onResize)
      if (globe && typeof globe.destroy === 'function') {
        globe.destroy()
      }
    }
  }, [config, onRender, onResize])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "w-full h-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          e.preventDefault()
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) => {
          e.preventDefault()
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }}
      />
    </div>
  )
}
