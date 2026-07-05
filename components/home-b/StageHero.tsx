'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const KEYWORDS = [
  'DEEP-TECH', 'SUSTAINABLE ENERGY', 'KFUPM', 'DTV', 'INNOVATION',
  'DECARBONIZATION', 'AI FOR ENERGY', 'ROBOTICS', 'DHAHRAN', 'GLOBAL IMPACT',
  'STUDENT FOUNDERS', 'RESEARCH TO MARKET', 'ADVANCED MATERIALS', 'ENERGY STORAGE',
];

function OdometerNumber({ target, triggered }: { target: number; triggered: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const duration = 2400;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(animate);
      else setDisplay(target);
    };
    requestAnimationFrame(animate);
  }, [triggered, target]);
  return <span>{display.toLocaleString()}</span>;
}

function usePrizeTilt() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 150, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 150, damping: 25 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  return { rotateX, rotateY, onMouseMove, onMouseLeave };
}

export function StageHero() {
  const [triggered, setTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrambled, setScrambled] = useState('VENTURECRAFT');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!';
  const tilt = usePrizeTilt();

  useEffect(() => {
    setMounted(true);
    const tOdo = setTimeout(() => setTriggered(true), 600);
    const tScramble = setTimeout(() => {
      const target = 'VENTURECRAFT';
      let frame = 0;
      const total = 30;
      const iv = setInterval(() => {
        frame++;
        const progress = frame / total;
        setScrambled(
          target.split('').map((c, i) =>
            i / target.length < progress ? c : chars[Math.floor(Math.random() * chars.length)]
          ).join('')
        );
        if (frame >= total) { clearInterval(iv); setScrambled(target); }
      }, 45);
    }, 700);
    return () => { clearTimeout(tOdo); clearTimeout(tScramble); };
  }, []); // eslint-disable-line

  if (!mounted) return null;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#00120F' }}
    >
      {/* ── Background Image ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&q=80"
          alt="Entrepreneur presenting on stage at an international startup competition"
          fill
          className="object-cover opacity-50"
          sizes="100vw"
        />
        {/* Gradient overlays to ensure text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00120F] via-[#00120F]/80 to-transparent" />
        <div className="absolute inset-0 bg-[#00120F]/30 mix-blend-multiply" />
      </div>

      {/* ── Floating venture keywords ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {KEYWORDS.map((kw, i) => (
          <div
            key={kw}
            className="keyword-float absolute text-[9px] sm:text-[11px] font-black tracking-[0.4em] text-white/10 whitespace-nowrap select-none drop-shadow-lg"
            style={{
              bottom: `-${40 + (i % 5) * 10}%`,
              left:   `${(i / KEYWORDS.length) * 95}%`,
              animationDuration: `${14 + i * 1.6}s`,
              animationDelay:    `${i * 1.0}s`,
            }}
          >
            {kw}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,209,197,1) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,197,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 text-center mt-12">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="h-px w-8 bg-[#4FD1C5]/40" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#4FD1C5] font-bold">
            KFUPM × DTV Present
          </span>
          <div className="h-px w-8 bg-[#4FD1C5]/40" />
        </motion.div>

        {/* Title — massive with depth shadow */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] as const }}
          className="text-7xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black tracking-tighter leading-[0.85] mb-6 select-none"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 20%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 60px rgba(79,209,197,0.25))',
          }}
          aria-label="VentureCraft"
        >
          {scrambled}
        </motion.h1>

        {/* Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white/80 mb-10 max-w-2xl mx-auto"
        >
          Forge your deep-tech venture from{' '}
          <span className="text-[#4FD1C5] font-bold">Dhahran to the world.</span>
        </motion.p>

        {/* ── Odometer prize box with 3D mouse tilt ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="relative inline-block mb-10"
          style={{ perspective: '800px' }}
        >
          <motion.div
            style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            className="cursor-default"
          >
            {/* Animated gradient border */}
            <div className="p-px rounded-2xl animated-border shadow-2xl shadow-[#4FD1C5]/20 backdrop-blur-md">
              <div className="rounded-2xl px-10 py-7 text-center relative overflow-hidden" style={{ background: 'rgba(0,18,15,0.85)' }}>
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4FD1C5]/10 to-transparent animate-[shimmer_3s_ease_infinite] pointer-events-none" />

                <div
                  className="text-6xl sm:text-7xl font-black text-white tracking-tighter leading-none mb-1"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  $<OdometerNumber target={245000} triggered={triggered} />
                </div>
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-bold mb-3">
                  Total Prize Pool
                </div>
                <div className="h-px w-full bg-white/10 mb-3" />
                <div className="text-sm font-semibold text-[#4FD1C5]">
                  Up to $100K Grand Prize
                </div>

                {/* 3D depth face — bottom edge */}
                <div
                  className="absolute inset-x-0 -bottom-2 h-2 rounded-b-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(180deg, rgba(79,209,197,0.3) 0%, transparent 100%)',
                    transform: 'translateZ(-8px)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <Link
            href="/about"
            id="hero-b-explore"
            className="group relative px-9 py-4 rounded-full text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#4FD1C5]/20"
          >
            <div className="absolute inset-0 bg-[#4FD1C5]" />
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            <span className="relative text-[#00120F] flex items-center gap-2">
              Explore the Competition
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/timeline"
            id="hero-b-timeline"
            className="px-9 py-4 rounded-full text-sm font-bold text-white/70 border border-white/20 hover:text-white hover:border-[#4FD1C5]/50 transition-all bg-white/5 backdrop-blur-sm"
          >
            View Timeline
          </Link>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#4FD1C5]/20 bg-[#4FD1C5]/5 backdrop-blur-sm"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5]"
          />
          <span className="text-xs text-white/80 font-semibold">
            Applications closed for this cycle
          </span>
        </motion.div>
      </div>

      {/* ── Bottom marquee strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/5 bg-[#00120F]/80 backdrop-blur-md"
      >
        <div className="flex whitespace-nowrap py-3">
          <div className="marquee-track flex gap-8 pr-8">
            {[...Array(2)].map((_, rep) =>
              ['$245K PRIZE POOL', '130+ COUNTRIES', '50+ MENTORS', '6 PHASES', 'KFUPM × DTV', 'INTERNATIONAL COMPETITION', 'DEEP-TECH STARTUP', 'STUDENT FOUNDERS'].map((item) => (
                <span key={`${rep}-${item}`} className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 flex items-center gap-6">
                  {item}
                  <span className="text-[#4FD1C5]/40">·</span>
                </span>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
