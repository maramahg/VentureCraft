'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Minimum time the splash stays visible so it never feels like a flash,
// and a hard cap so it never blocks the user for too long even on slow loads.
const MIN_DISPLAY_MS = 600;
const MAX_DISPLAY_MS = 2800;

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

const particles: Particle[] = Array.from({ length: 24 }, (_, i) => {
  // Deterministic pseudo-random layout (stable across renders, no hydration mismatch)
  const seed = i * 137.5;
  return {
    id: i,
    x: (seed % 100),
    y: 40 + ((seed * 1.7) % 50),
    size: 2 + (i % 4),
    duration: 2 + (i % 5) * 0.5,
    delay: (i % 8) * 0.25,
  };
});

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const show = () => setVisible(true);
    show();

    const dismiss = () => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      setProgress(100);
      window.setTimeout(() => setVisible(false), 300);
    };

    // Fallback: if video fails or doesn't load, cap at MAX_DISPLAY_MS
    const maxTimer = window.setTimeout(dismiss, MAX_DISPLAY_MS);

    return () => {
      window.clearTimeout(maxTimer);
    };
  }, []);

  // iOS Safari sometimes ignores the JSX `muted`/`autoplay` attributes and
  // falls back to showing a native play button instead of autoplaying.
  // Setting the properties imperatively (before calling play()) reliably
  // forces silent autoplay once the <video> element is actually mounted.
  useEffect(() => {
    if (!visible) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      video.muted = true;
      video.play().catch(() => {
        video.addEventListener('loadeddata', attemptPlay, { once: true });
      });
    };
    attemptPlay();
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#0B2A24' }}
        >
          {/* Subtle dot grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06] z-10"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Floating particles — drift upward with twinkle */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full pointer-events-none z-10"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, rgba(79,209,197,0.95) 0%, rgba(79,209,197,0) 70%)',
              }}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                y: -60,
                scale: [0.5, 1.2, 1, 0.3],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay + 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))
          }

          {/* Splash video — centered, with edge gradient blending into bg */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="absolute inset-0 flex items-center justify-center z-0 pb-[320px]"
          >
            <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
              {/* Framer Motion's `scale` on the parent creates a new CSS
                  stacking context, which isolates `mix-blend-mode` below to
                  only blend within this group rather than the real page
                  background behind it. This solid patch (same color as the
                  page background) gives the blend something correct to
                  disappear against, so the video's dark backing color still
                  reads as transparent. */}
              <div
                className="absolute inset-0"
                style={{ background: '#0B2A24' }}
              />
              <video
                ref={videoRef}
                src="/splash.mp4"
                autoPlay
                muted
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration > 0) {
                    setProgress(Math.round((v.currentTime / v.duration) * 100));
                  }
                }}
                onEnded={() => {
                  if (dismissedRef.current) return;
                  dismissedRef.current = true;
                  setProgress(100);
                  window.setTimeout(() => setVisible(false), 300);
                }}
                className="w-full h-full object-contain pointer-events-none"
                style={{
                  maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
                  // The exported video has a solid near-black backing color
                  // baked into every frame (it doesn't support alpha). That
                  // backing color is darker than the splash background in
                  // every channel, so `lighten` makes the video's background
                  // pixels disappear into the page background/glow behind
                  // it, leaving only the brighter logo artwork visible.
                  mixBlendMode: 'lighten',
                  // `contrast` brightens the logo's mid/highlight colors
                  // while pushing the already-dark backing color even
                  // darker (rather than lifting it, like `brightness`
                  // would) — so it won't reintroduce the background seam.
                  filter: 'contrast(1.3) saturate(1.15)',
                }}
              />
            </div>
          </motion.div>

          {/* Brand name — shimmers in */}
          <motion.span
            initial={{ opacity: 0, y: 8, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.35em' }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 mt-32 text-lg uppercase font-black bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.2), #4FD1C5, rgba(255,255,255,0.2))',
              backgroundSize: '200% auto',
              animation: 'splash-shimmer 2.2s linear infinite',
              filter: 'drop-shadow(0 0 12px rgba(79,209,197,0.3))',
            }}
          >
            Venture Craft
          </motion.span>

          {/* Tagline under brand name */}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' }}
            className="relative z-10 mt-2 text-[10px] uppercase tracking-[0.3em] font-medium text-white/30"
          >
            Build Your Venture
          </motion.span>

          {/* Determinate loading bar + percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="relative z-10 mt-10 w-64 flex flex-col items-center gap-3"
          >
            <div className="w-full h-[5px] rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #23BCAB, #4FD1C5)',
                  boxShadow: '0 0 10px rgba(79,209,197,0.8)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
            </div>
            <span
              className="text-lg font-black tracking-tight text-white/60 tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {progress}%
            </span>
          </motion.div>

          <style jsx>{`
            @keyframes splash-shimmer {
              0% {
                background-position: 200% center;
              }
              100% {
                background-position: -200% center;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
