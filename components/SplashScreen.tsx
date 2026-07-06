'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

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

const particles: Particle[] = Array.from({ length: 14 }, (_, i) => {
  // Deterministic pseudo-random layout (stable across renders, no hydration mismatch)
  const seed = i * 137.5;
  return {
    id: i,
    x: (seed % 100),
    y: 50 + ((seed * 1.7) % 40),
    size: 3 + (i % 3),
    duration: 2.5 + (i % 4) * 0.6,
    delay: (i % 7) * 0.3,
  };
});

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0=zero-point, 1=bird/expand, 2=arrow/logo reveal
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const show = () => setVisible(true);
    show();

    // Three-stage reveal sequence
    const stage1Timer = window.setTimeout(() => setStage(1), 400);
    const stage2Timer = window.setTimeout(() => setStage(2), 900);

    const start = performance.now();
    let finished = false;

    const tick = window.setInterval(() => {
      progressRef.current += (90 - progressRef.current) * 0.08;
      setProgress(Math.round(progressRef.current));
    }, 60);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(tick);

      const fill = window.setInterval(() => {
        progressRef.current = Math.min(100, progressRef.current + 6);
        setProgress(Math.round(progressRef.current));
        if (progressRef.current >= 100) {
          window.clearInterval(fill);
          const elapsed = performance.now() - start;
          const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
          window.setTimeout(() => setVisible(false), remaining + 300);
        }
      }, 20);
    };

    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish);
    }
    const maxTimer = window.setTimeout(finish, MAX_DISPLAY_MS);

    return () => {
      window.removeEventListener('load', finish);
      window.clearInterval(tick);
      window.clearTimeout(maxTimer);
      window.clearTimeout(stage1Timer);
      window.clearTimeout(stage2Timer);
    };
  }, []);

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
          {/* Deep ambient glow — pulses throughout */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 50% 45% at 50% 50%, rgba(79,209,197,0.16) 0%, transparent 70%)',
            }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Subtle dot grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Floating particles */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                background: 'radial-gradient(circle, rgba(79,209,197,0.9) 0%, rgba(79,209,197,0) 70%)',
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: -50 }}
              transition={{
                duration: p.duration,
                delay: p.delay + 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* ════ THREE-STAGE LOGO REVEAL ════ */}
          <div className="relative flex items-center justify-center" style={{ width: 280, height: 280 }}>
            {/* Stage 0: Zero Point — a single glowing dot that appears from nothing */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 20,
                height: 20,
                background: '#4FD1C5',
                boxShadow: '0 0 40px rgba(79,209,197,0.9), 0 0 80px rgba(79,209,197,0.5)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: stage === 0 ? 1 : stage >= 1 ? 0 : 1,
                scale: stage === 0 ? [0, 1.2, 1] : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Stage 1: Bird / Expansion — concentric energy rings burst outward */}
            {stage >= 1 && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`ring-${i}`}
                    className="absolute rounded-full border"
                    style={{ borderColor: 'rgba(79,209,197,0.4)' }}
                    initial={{ width: 20, height: 20, opacity: 0.8 }}
                    animate={{ width: [20, 240 + i * 50], height: [20, 240 + i * 50], opacity: [0.8, 0] }}
                    transition={{ duration: 1, delay: i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                ))}
                {/* Energy streaks suggesting flight/motion */}
                <motion.svg
                  className="absolute"
                  width="280"
                  height="280"
                  viewBox="0 0 280 280"
                  initial={{ opacity: 0, rotate: -15 }}
                  animate={{ opacity: [0, 1, 0], rotate: [-15, 5, 0] }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <path
                    d="M 55 200 Q 100 120 140 100 Q 180 80 225 55"
                    fill="none"
                    stroke="rgba(79,209,197,0.6)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </>
            )}

            {/* Stage 2: Arrow / Logo Reveal — full logo materializes with a sweep */}
            {stage >= 2 && (
              <>
                {/* Arrow-like sweep that cuts across revealing the logo */}
                <motion.div
                  className="absolute rounded-full overflow-hidden"
                  style={{ width: 250, height: 250 }}
                  initial={{ clipPath: 'inset(50% 50% 50% 50%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                >
                  {/* Diagonal light sweep */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(135deg, transparent 40%, rgba(79,209,197,0.25) 50%, transparent 60%)',
                    }}
                    initial={{ x: '-100%', y: '-100%' }}
                    animate={{ x: '100%', y: '100%' }}
                    transition={{ duration: 0.7, ease: 'easeInOut' }}
                  />
                </motion.div>

                {/* Pulsing rings around the logo */}
                <motion.span
                  className="absolute rounded-full border"
                  style={{ borderColor: 'rgba(79,209,197,0.35)', width: 200, height: 200 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span
                  className="absolute rounded-full border"
                  style={{ borderColor: 'rgba(79,209,197,0.2)', width: 200, height: 200 }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />

                {/* The actual logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                  className="relative flex items-center justify-center"
                >
                  <Image
                    src="/logo.png"
                    alt="VentureCraft"
                    width={170}
                    height={170}
                    priority
                    className="relative w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_36px_rgba(79,209,197,0.5)]"
                  />
                </motion.div>
              </>
            )}
          </div>

          {/* Brand name — shimmers in after logo reveal */}
          <motion.span
            initial={{ opacity: 0, y: 8, letterSpacing: '0.5em' }}
            animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 8, letterSpacing: '0.35em' }}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            className="mt-10 text-base uppercase tracking-[0.35em] font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.3), #4FD1C5, rgba(255,255,255,0.3))',
              backgroundSize: '200% auto',
              animation: 'splash-shimmer 2.6s linear infinite',
            }}
          >
            VentureCraft
          </motion.span>

          {/* Determinate loading bar + percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 w-64 flex flex-col items-center gap-3"
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
