'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  MotionValue,
} from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight, ArrowDown, Sparkles } from 'lucide-react';
import { homepageStats } from '../../lib/homepageStats';
import { useRegistrationStatus } from '../../hooks/useRegistrationStatus';

// Lazy-load the globe so it doesn't block first paint
const Globe = dynamic(() => import('../ui/globe').then((m) => m.Globe), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-full bg-[#4FD1C5]/5 animate-pulse blur-3xl" />
  ),
});

// Cities the Venture Signal reaches
const SIGNAL_DESTINATIONS = [
  { lat: 40.71, lng: -74.0,   label: 'New York'    },
  { lat: 51.5,  lng: -0.12,   label: 'London'      },
  { lat: 1.35,  lng: 103.8,   label: 'Singapore'   },
  { lat: 35.68, lng: 139.69,  label: 'Tokyo'       },
  { lat: -33.86,lng: 151.2,   label: 'Sydney'      },
  { lat: 19.07, lng: 72.87,   label: 'Mumbai'      },
  { lat: -23.55,lng: -46.63,  label: 'São Paulo'   },
];

// Single floating stat card with mouse parallax
function StatCard({
  stat,
  className,
  delay,
  mouseX,
  mouseY,
  depth = 15,
}: {
  stat: (typeof homepageStats)[0];
  className: string;
  delay: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  depth?: number;
}) {
  const x = useTransform(mouseX, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-depth, depth]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.215, 0.61, 0.355, 1] }}
      style={{ x, y }}
      className={`absolute hidden xl:block ${className}`}
    >
      <div
        className="glass-card rounded-2xl px-4 py-3 border border-[#4FD1C5]/15 min-w-[120px] mint-glow"
        style={{ background: 'rgba(0,18,15,0.75)' }}
      >
        <div className="text-2xl font-black text-white leading-none tracking-tight">
          {stat.prefix || ''}{stat.value}{stat.suffix || ''}
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-1.5 font-semibold">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export function VentureSignalHero() {
  const containerRef = useRef<HTMLElement>(null);
  const isRegistrationOpen = useRegistrationStatus();

  // Scroll-driven exit animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const textY       = useTransform(scrollYProgress, [0, 0.8], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const globeScale  = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const globeOpacity= useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const arrowOpacity= useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Mouse parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 35, damping: 22 });
  const mouseY = useSpring(rawY, { stiffness: 35, damping: 22 });
  const globeMX = useTransform(mouseX, [-0.5, 0.5], [-18, 18]);
  const globeMY = useTransform(mouseY, [-0.5, 0.5], [-12, 12]);
  const globeRotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const globeRotateX = useTransform(mouseY, [-0.5, 0.5], [4, -4]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  }, [rawX, rawY]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);

  // Stagger variants
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const item = {
    hidden:  { opacity: 0, y: 28, filter: 'blur(10px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.85, ease: [0.215, 0.61, 0.355, 1] as const },
    },
  };

  return (
    <section ref={containerRef} className="relative h-[115svh] overflow-hidden" style={{ background: '#0B2A24' }}>

      {/* ── Background Image ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/dtv/hero.png"
          alt="Dhahran Techno Valley innovation ecosystem"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        {/* Gradient overlays to ensure text/globe legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A24] via-[#0B2A24]/90 to-[#0B2A24]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A24] via-transparent to-transparent" />
      </div>

      {/* ── Background grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(79,209,197,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,197,0.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* ── Radial ambient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(0,163,131,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Mobile-only shade to protect headline legibility over the globe ── */}
      <div
        className="absolute inset-x-0 top-0 h-[62%] sm:hidden pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #0B2A24 65%, transparent 100%)' }}
      />

      {/* ════ GLOBE SIDE ════ */}
      <div style={{ perspective: '1200px' }} className="absolute inset-x-0 bottom-0 h-[42%] opacity-50 sm:opacity-100 sm:h-[60%] lg:top-0 lg:right-0 lg:bottom-auto lg:inset-x-auto lg:w-[58%] lg:h-full pointer-events-none">
      <motion.div
        style={{ scale: globeScale, opacity: globeOpacity, x: globeMX, y: globeMY, rotateY: globeRotateY, rotateX: globeRotateX, transformStyle: 'preserve-3d' }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Teal halo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42vw] h-[42vw] max-w-[440px] max-h-[440px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,163,131,0.1) 0%, transparent 70%)' }}
        />

        {/* Orbit rings — animating in 3D (desktop only: heavy for mobile perf) */}
        <div className="hidden lg:contents">
          {[400, 500, 600].map((size, i) => (
            <motion.div
              key={size}
              animate={{ rotate: 360 }}
              transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
              style={{
                width: size,
                height: size,
                borderColor: `rgba(79,209,197,${0.07 - i * 0.018})`,
                transform: `translate(-50%, -50%) rotateX(${60 + i * 8}deg)`,
              }}
            />
          ))}
        </div>

        {/* Radar sweep (desktop only: heavy for mobile perf) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden pointer-events-none"
          style={{ width: 340, height: 340 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(79,209,197,0.07) 35deg, transparent 70deg)',
            }}
          />
        </motion.div>

        {/* Globe */}
        <Globe className="w-full h-full scale-[0.6] sm:scale-[0.9] lg:scale-[1.0]" />

        {/* Signal arcs — SVG overlay (desktop only: heavy for mobile perf) */}
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {SIGNAL_DESTINATIONS.map((dest, i) => {
            const cx = 50 + (dest.lng > 50 ? 22 : -22) * 0.38;
            const cy = 50 + (dest.lat > 26 ? -12 : 12) * 0.38;
            const qx = 50 + (i % 2 === 0 ? 18 : -18);
            const qy = 48 - i * 1.8;
            return (
              <motion.path
                key={dest.label}
                d={`M 50 50 Q ${qx} ${qy}, ${cx} ${cy}`}
                fill="none"
                stroke="rgba(79,209,197,0.25)"
                strokeWidth="0.18"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.7, 0.35] }}
                transition={{
                  pathLength: { duration: 1.8, delay: 1.6 + i * 0.18, ease: 'easeInOut' },
                  opacity:    { duration: 0.8, delay: 1.6 + i * 0.18 },
                }}
              />
            );
          })}
        </svg>

        {/* Dhahran origin pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {/* outer pulse ring */}
          <motion.div
            animate={{ scale: [1, 3.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
            className="w-4 h-4 rounded-full border-2 border-[#4FD1C5] absolute -translate-x-1/2 -translate-y-1/2"
          />
          {/* inner dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#4FD1C5] absolute -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(79,209,197,0.9)]" />
        </motion.div>

        {/* Destination pulsing nodes (desktop only: heavy for mobile perf) */}
        {SIGNAL_DESTINATIONS.slice(0, 5).map((dest, i) => (
          <motion.div
            key={dest.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2 + i * 0.18, duration: 0.4 }}
            className="hidden lg:block absolute pointer-events-none"
            style={{
              top: `calc(50% + ${(dest.lat > 26 ? -12 : 12) * 0.38 * 4}px)`,
              left: `calc(50% + ${(dest.lng > 50 ? 22 : -22) * 0.38 * 4}px)`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 2.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.3 }}
              className="w-2 h-2 rounded-full bg-[#4FD1C5]/60"
            />
          </motion.div>
        ))}
      </motion.div>
      </div>

      {/* ════ TEXT SIDE ════ */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative h-screen flex items-center z-20 lg:w-[50%]"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="px-6 sm:px-10 lg:px-16 xl:px-20 max-w-xl"
        >
          {/* Label */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4FD1C5]/20 bg-[#4FD1C5]/5 mb-8"
          >
            <motion.span
              animate={{ rotate: [0, 14, -14, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3 h-3 text-[#4FD1C5]" />
            </motion.span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4FD1C5] font-bold">
              KFUPM &amp; DTV Present
            </span>
          </motion.div>

          {/* Title — clean blur/fade reveal, no scramble */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.88] text-white mb-4"
            aria-label="VentureCraft"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#4FD1C5]/80">
              VentureCraft
            </span>
          </motion.h1>

          {/* Headline */}
          <motion.p
            variants={item}
            className="text-xl sm:text-2xl font-bold text-white/85 leading-snug mb-5"
          >
            Forge your deep-tech venture from{' '}
            <span className="text-[#4FD1C5]">Dhahran to the world.</span>
          </motion.p>

          {/* Body */}
          <motion.p
            variants={item}
            className="text-base sm:text-lg text-white/45 leading-relaxed mb-8 max-w-md"
          >
            An international startup competition for student-led science and technology
            ventures, powered by KFUPM and DTV.
          </motion.p>

          {/* Prize line */}
          <motion.div variants={item} className="flex items-center gap-3 mb-9">
            <div className="h-px w-6 bg-[#4FD1C5]/50" />
            <span className="text-sm font-bold text-[#4FD1C5]">$245K Prize Pool</span>
            <span className="text-white/20">•</span>
            <span className="text-sm font-semibold text-white/55">Up to $100K Grand Prize</span>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-7">
            <Link
              href="/apply"
              id="hero-cta-apply"
              className="group relative px-8 py-3.5 rounded-full text-[15px] font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-[#4FD1C5] group-hover:bg-[#5ae0d4] transition-colors duration-300" />
              {/* Shimmer */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
              <span className="relative text-[#001A18] flex items-center gap-2">
                {isRegistrationOpen ? 'Apply Now' : 'View Application Status'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href="/about"
              id="hero-cta-explore"
              className="px-8 py-3.5 rounded-full text-[15px] font-bold text-white/70 hover:text-white border border-white/12 hover:border-[#4FD1C5]/35 transition-all duration-300"
            >
              Explore the Competition
            </Link>
          </motion.div>

          {/* Status pill */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/8"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5]/60"
            />
            <span className="text-xs text-white/40 font-medium">
              {isRegistrationOpen ? 'Applications are open now' : 'Applications closed for this cycle'}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Floating stat cards (desktop only) ── */}
      <StatCard stat={homepageStats[0]} className="top-[16%] right-[7%]"   delay={1.2} mouseX={mouseX} mouseY={mouseY} depth={22} />
      <StatCard stat={homepageStats[2]} className="top-[36%] right-[2%]"   delay={1.4} mouseX={mouseX} mouseY={mouseY} depth={28} />
      <StatCard stat={homepageStats[3]} className="bottom-[30%] right-[9%]" delay={1.6} mouseX={mouseX} mouseY={mouseY} depth={20} />
      <StatCard stat={homepageStats[4]} className="bottom-[18%] right-[3%]" delay={1.8} mouseX={mouseX} mouseY={mouseY} depth={24} />

      {/* ── Scroll indicator ── */}
      <motion.div
        style={{ opacity: arrowOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-[#4FD1C5]/35" />
        </motion.div>
      </motion.div>
    </section>
  );
}
