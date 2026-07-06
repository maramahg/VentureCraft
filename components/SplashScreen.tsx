'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

// Minimum time the splash stays visible so it never feels like a flash,
// and a hard cap so it never blocks the user for too long even on slow loads.
const MIN_DISPLAY_MS = 600;
const MAX_DISPLAY_MS = 2800;

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // The root layout only mounts once per real page load (not on internal
    // client-side navigation), so this naturally shows once per visit/reload
    // without needing extra session gating.
    const show = () => setVisible(true);
    show();

    const start = performance.now();
    let finished = false;

    // Ease progress up towards 90% while real assets are still loading —
    // never claims "done" until we actually know the page has finished loading.
    const tick = window.setInterval(() => {
      progressRef.current += (90 - progressRef.current) * 0.08;
      setProgress(Math.round(progressRef.current));
    }, 60);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(tick);

      // Snap the rest of the way to 100% quickly, then dismiss.
      const fill = window.setInterval(() => {
        progressRef.current = Math.min(100, progressRef.current + 6);
        setProgress(Math.round(progressRef.current));
        if (progressRef.current >= 100) {
          window.clearInterval(fill);
          const elapsed = performance.now() - start;
          const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
          window.setTimeout(() => setVisible(false), remaining + 200);
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
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#0B2A24' }}
        >
          {/* Ambient brand glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,209,197,0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="VentureCraft"
              width={80}
              height={80}
              priority
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-5 text-[11px] uppercase tracking-[0.35em] text-white/40 font-bold"
          >
            VentureCraft
          </motion.span>

          {/* Determinate loading bar + percentage */}
          <div className="mt-6 w-48 flex flex-col items-center gap-2.5">
            <div className="w-full h-[3px] rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #23BCAB, #4FD1C5)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              />
            </div>
            <span
              className="text-sm font-black tracking-tight text-white/70 tabular-nums"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
