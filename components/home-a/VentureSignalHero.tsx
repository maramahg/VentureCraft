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
import { ArrowRight, ArrowDown, Sparkles, ExternalLink } from 'lucide-react';
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
        <div className="text-2xl font-black text-white leading-none tracking-tight font-poppins">
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
        <Globe className="w-full h-full scale-[0.52] sm:scale-[0.8] lg:scale-[0.88]" />
      </motion.div>
      </div>

      {/* ════ TEXT SIDE ════ */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative h-screen flex items-center z-20 w-full lg:w-[60%]"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="px-6 sm:px-10 lg:pl-16 lg:pr-4 xl:pl-20 xl:pr-6 max-w-2xl pt-10 md:pt-14 lg:pt-18"
        >

          {/* Title — clean blur/fade reveal, no scramble */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(14px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.5rem] font-bold tracking-tighter mb-4 font-poppins uppercase leading-[1.1] xl:leading-none -ml-1 md:-ml-2 lg:-ml-3 xl:-ml-4"
            aria-label="Venture Craft"
          >
            <span className="block text-white whitespace-nowrap">
              Venture Craft
            </span>
            <span className="block mt-2 text-xl sm:text-2xl md:text-3xl uppercase">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] via-[#4FD1C5] to-[#4FD1C5] mr-2 font-poppins">
                100K
              </span>
              <span className="font-light tracking-[0.1em] text-white/40 ml-1">
                COMPETITION
              </span>
            </span>
          </motion.h1>

          {/* Body */}
          <motion.p
            variants={item}
            className="text-base sm:text-lg text-white/50 mb-8 max-w-xl mx-auto xl:mx-0 leading-relaxed font-sans"
          >
            An international deep tech startup competition by{" "}
            <a
              href="https://www.kfupm.edu.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#4FD1C5] font-bold underline underline-offset-4 decoration-[#4FD1C5]/30 hover:decoration-[#4FD1C5] transition-all duration-300 group"
            >
              KFUPM
              <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>{" "}
            in collaboration with{" "}
            <a
              href="https://dtv.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#4FD1C5] font-bold underline underline-offset-4 decoration-[#4FD1C5]/30 hover:decoration-[#4FD1C5] transition-all duration-300 group"
            >
              DTV<ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
            {" "}, supporting student led ventures building science and technology based solutions with global impact.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center xl:justify-start mb-10 xl:mb-12 relative z-50"
          >
            {isRegistrationOpen ? (
              <Link
                href="/apply"
                className="group relative px-8 py-3.5 rounded-full text-base font-bold text-[#001D1B] transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(79,209,197,0.3)] hover:scale-105 active:scale-95 w-full sm:w-auto inline-flex items-center justify-center shrink-0"
              >
                <div className="absolute inset-0 bg-[#4FD1C5] transition-colors duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Submit Your Idea <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            ) : (
              <div className="group relative px-8 py-3 sm:py-3.5 rounded-full text-base font-bold text-[#001D1B] transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(79,209,197,0.1)] opacity-80 w-full sm:w-auto inline-flex items-center justify-center shrink-0 cursor-not-allowed">
                <div className="absolute inset-0 bg-[#4FD1C5]/50 transition-colors duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Registration Closed
                </span>
              </div>
            )}

            <Link
              href="/about"
              className="group relative p-[1.5px] rounded-full overflow-hidden w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center justify-center shrink-0 cursor-pointer font-bold z-[100] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-70 group-hover:from-white/40 group-hover:to-white/10 transition-all duration-300" />
              <div className="relative px-8 py-2.5 sm:py-3 rounded-full bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-all duration-300">
                <span className="text-base text-white group-hover:text-[#4FD1C5] transition-colors relative z-10">
                  Learn More
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="flex items-center justify-center xl:justify-start gap-12 sm:gap-14 xl:ml-6 mb-10"
          >
            <div className="relative group/stat">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#4FD1C5] rounded-full opacity-60 group-hover/stat:opacity-100 transition-opacity duration-500" />
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/40 group-hover/stat:text-white/60 transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-white mb-0.5 font-poppins">$245K</span>
                Prize Pool
              </div>
            </div>
            <div className="relative group/stat">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-[#4FD1C5] rounded-full opacity-20 group-hover/stat:opacity-100 transition-opacity duration-500" />
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/40 group-hover/stat:text-white/60 transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-white mb-0.5 font-poppins">Global</span>
                Exposure
              </div>
            </div>
          </motion.div>

          {/* Collaboration logos */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col xl:items-start items-center gap-2 animate-in fade-in duration-700"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium pt-2">In Collaboration With</span>
            <div className="flex items-center gap-8">
              <Link
                href="https://www.kfupm.edu.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="block grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500"
              >
                <Image src="/kfupm-logo.png" alt="KFUPM" width={128} height={32} className="h-7 md:h-8 w-auto object-contain" />
              </Link>
              <div className="w-px h-6 bg-white/30" />
              <Link
                href="https://dtv.sa/"
                target="_blank"
                rel="noopener noreferrer"
                className="block grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-500"
              >
                <Image src="/dtv-logo.png" alt="DTV" width={160} height={44} className="h-9 md:h-11 w-auto object-contain" />
              </Link>
            </div>
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
