'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, MotionValue, useSpring, useMotionValue, animate } from 'framer-motion';
import { competitionPhases, CompetitionPhase } from '../../lib/competitionPhases';
import { Lightbulb, Search, BadgeCheck, Rocket, Plane, Zap, Trophy, LucideIcon } from 'lucide-react';

const phaseIcons: Record<string, LucideIcon> = {
  Lightbulb,
  Search,
  BadgeCheck,
  Rocket,
  Plane,
  Zap,
  Trophy,
};

function PhaseIcon({ name }: { name: string }) {
  const Icon = phaseIcons[name];
  if (!Icon) return null;
  return <Icon className="w-5 h-5 text-[#23BCAB]" />;
}

const statusColors: Record<string, string> = {
  completed: '#23BCAB',
  active:    '#23BCAB',
  upcoming:  'rgba(245,250,250,0.2)',
};
const statusLabels: Record<string, string> = {
  completed: 'Completed',
  active:    'In Progress',
  upcoming:  'Upcoming',
};

export default function StickyGlobeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState(1);
  const [mobileActivePhase, setMobileActivePhase] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [phases, setPhases] = useState<CompetitionPhase[]>(competitionPhases);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const update = () => setIsMobile(mq.matches || touchQuery.matches);
    update();
    mq.addEventListener('change', update);
    touchQuery.addEventListener('change', update);

    // Dynamically calculate phase statuses based on dates
    const now = new Date();
    const updated = competitionPhases.map(phase => {
      if (!phase.startDate || !phase.endDate) return phase;
      const start = new Date(phase.startDate);
      const end = new Date(phase.endDate);
      let status: 'completed' | 'active' | 'upcoming' = 'upcoming';
      if (now >= start && now <= end) {
        status = 'active';
      } else if (now > end) {
        status = 'completed';
      }
      return { ...phase, status };
    });
    setPhases(updated);

    return () => {
      mq.removeEventListener('change', update);
      touchQuery.removeEventListener('change', update);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 110,
    mass: 0.2,
    restDelta: 0.001
  });

  const phaseCount = phases.length;

  // Writable MotionValue representing the current animated active phase (starts at 1)
  const activePhaseMotion = useMotionValue(1);

  // Desktop scroll progress mapping
  const desktopPhaseProgress = useTransform(smoothScrollProgress, (v) => {
    const segment = 1 / phaseCount;
    const idx = Math.floor(v / segment);
    const localProgress = (v - idx * segment) / segment;
    if (localProgress < 0.7) return Math.min(phaseCount, idx + 1);
    return Math.min(phaseCount, idx + 1 + (localProgress - 0.7) / 0.3);
  });

  // Track desktop scroll values and set activePhaseMotion
  useMotionValueEvent(desktopPhaseProgress, 'change', (latest) => {
    if (!isMobile) {
      activePhaseMotion.set(latest);
    }
  });

  // Track mobile clicks/taps and animate activePhaseMotion smoothly
  useEffect(() => {
    if (isMobile) {
      animate(activePhaseMotion, mobileActivePhase, {
        type: 'spring',
        damping: 25,
        stiffness: 110,
        mass: 0.2,
      });
    }
  }, [mobileActivePhase, isMobile, activePhaseMotion]);

  // Keep the numeric activePhase state synchronized for indicators
  useMotionValueEvent(activePhaseMotion, 'change', (latest) => {
    setActivePhase(Math.min(phaseCount, Math.max(1, Math.round(latest))));
  });



  const circumference = 2 * Math.PI * 70; // ~439.82
  const activeProgress = (activePhase - 1) / (phaseCount - 1);
  const currentOffset = circumference * (1 - activeProgress);
  const currentPhase = phases[activePhase - 1];

  return (
    <section
      className="relative pt-20 sm:pt-28 lg:pt-32 pb-44"
      style={{ background: 'linear-gradient(180deg, #072828 0%, #003E51 100%)' }}
    >
      {/* Top transition ribbon */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #0B2A24 0%, transparent 100%)' }}
      />
      {/* Bottom transition ribbon */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0B2A24 0%, transparent 100%)' }}
      />

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-6 sm:px-10"
        style={{ minHeight: isMobile ? 'auto' : `${phaseCount * 70}vh` }}
      >
        <div className="sticky top-20 sm:top-24 flex flex-col lg:flex-row gap-8 lg:gap-8 items-stretch lg:items-start w-full">

          {/* ── Left: phase summary ── */}
          <div className="lg:w-[40%] flex flex-col gap-5 w-full shrink-0">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold">
              Timeline
            </span>
            <div>
              <h2 className="text-3xl sm:text-5xl font-black font-poppins uppercase tracking-tight text-white leading-[1.1] sm:leading-[1.05]">
                Seven Phases.<br />One Destination.
              </h2>
              <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mt-3 sm:mt-4 max-w-sm">
                Every phase is designed to push your venture further, from first submission to the global stage.
              </p>
            </div>

            {/* Compact mobile phase indicator */}
            <div className="lg:hidden flex items-center gap-3 px-4 py-3 rounded-xl border border-[#23BCAB]/15 bg-[#F5FAFA]/[0.03]">
              <span className="text-2xl font-black text-[#23BCAB] tracking-tighter leading-none font-poppins">
                {String(activePhase).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5FAFA]/40 font-bold font-poppins">
                of {String(phaseCount).padStart(2, '0')} Phases
              </span>
            </div>

            {/* Circular progress indicator — rotating dial (desktop only) */}
            <div className="hidden lg:flex relative w-44 h-44 items-center justify-center my-2">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(35,188,171,0.08) 0%, transparent 65%)' }}
              />
              <svg className="absolute w-44 h-44 -rotate-90 transform pointer-events-none" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" className="stroke-white/10 fill-none" strokeWidth="2" />
                <motion.circle
                  cx="80" cy="80" r="70" className="stroke-[#23BCAB] fill-none" strokeWidth="3" strokeLinecap="round"
                  animate={{ strokeDashoffset: currentOffset }} transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference, filter: 'drop-shadow(0 0 4px rgba(35, 188, 171, 0.4))' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10 text-center">
                <AnimatePresence mode="wait">
                  <motion.div key={activePhase}
                    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.15 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-[64px] font-black leading-none tracking-tighter text-[#23BCAB] font-poppins block py-1">
                      {String(activePhase).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5FAFA]/30 font-bold font-poppins mt-1 block">
                      of {String(phaseCount).padStart(2, '0')}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop only active phase label */}
            <div className="hidden lg:block">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#F5FAFA]/30 font-bold font-poppins block mb-2">Current Phase</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-black text-[#F5FAFA] font-poppins leading-none mb-1.5 uppercase">
                    {currentPhase?.title}
                  </h3>
                  <span className="text-xs font-bold text-[#23BCAB] uppercase tracking-wider block font-poppins">
                    {currentPhase?.status === 'active' ? 'IN PROGRESS' : currentPhase?.status.toUpperCase()}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: rotating semi-circle arc of phase cards (desktop & mobile) ── */}
          <div className="flex-1 relative w-full mt-4 lg:mt-0">
            {/* Subtle radial glow behind active card area */}
            <div className="hidden lg:block absolute pointer-events-none"
              style={{
                top: '50%', left: '10%', width: 420, height: 320, transform: 'translateY(-50%)',
                background: 'radial-gradient(ellipse, rgba(35,188,171,0.1) 0%, transparent 70%)',
              }} />

            {/* Rotating arc carousel — rendered on all screens */}
            <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[560px] overflow-visible">
              {phases.map((phase) => (
                <ArcPhaseCard
                  key={phase.id}
                  phase={phase}
                  activePhaseMotion={activePhaseMotion}
                  isMobile={isMobile}
                  onCardClick={() => {
                    if (isMobile) {
                      setMobileActivePhase((prev) => (prev < phaseCount ? prev + 1 : 1));
                    }
                  }}
                />
              ))}
            </div>

            {/* Mobile tap prompt and navigation buttons */}
            {isMobile && (
              <div className="relative z-30 flex flex-col items-center gap-3 mt-8">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#23BCAB] font-black bg-[#23BCAB]/10 px-3 py-1.5 rounded-full font-poppins">
                  Tap Card to Next Phase
                </span>
                <div className="flex items-center gap-6 mt-1">
                  <button
                    onClick={() => setMobileActivePhase((prev) => Math.max(1, prev - 1))}
                    disabled={mobileActivePhase === 1}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 disabled:opacity-20 active:bg-white/5 font-bold transition-all"
                  >
                    ←
                  </button>
                  <span className="text-xs font-bold text-white/60 font-poppins">
                    {mobileActivePhase} / {phaseCount}
                  </span>
                  <button
                    onClick={() => setMobileActivePhase((prev) => Math.min(phaseCount, prev + 1))}
                    disabled={mobileActivePhase === phaseCount}
                    className="w-10 h-10 rounded-full border border-[#23BCAB]/25 flex items-center justify-center text-[#23BCAB] disabled:opacity-20 active:bg-[#23BCAB]/10 font-bold transition-all"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function ArcPhaseCard({
  phase,
  activePhaseMotion,
  isMobile,
  onCardClick,
}: {
  phase: CompetitionPhase;
  activePhaseMotion: MotionValue<number>;
  isMobile: boolean;
  onCardClick?: () => void;
}) {
  const relative = useTransform(activePhaseMotion, (v) => phase.id - v);
  const [isActive, setIsActive] = useState(() => {
    return Math.round(activePhaseMotion.get()) === phase.id;
  });
  useMotionValueEvent(activePhaseMotion, 'change', (latest) => {
    setIsActive(Math.round(latest) === phase.id);
  });

  const y = useTransform(relative, (r) => (r * (isMobile ? 80 : 118)) - (isMobile ? 25 : 0));
  const x = useTransform(relative, (r) => isMobile ? 0 : Math.sin(r * 0.4) * 90);
  const rotate = useTransform(relative, (r) => isMobile ? 0 : r * 7);
  const scale = useTransform(relative, (r) => Math.max(0.72, 1 - Math.abs(r) * 0.14));
  const opacity = useTransform(relative, (r) => Math.max(0, 1 - Math.abs(r) * 0.4));
  const blur = useTransform(relative, (r) => isMobile ? 'none' : `blur(${Math.min(6, Math.abs(r) * 2.5)}px)`);
  const zIndex = useTransform(relative, (r) => Math.round(100 - Math.abs(r) * 10));

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 w-[92%] sm:w-[420px] -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
        isMobile && !isActive ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{ x, y, rotate, scale, opacity, filter: blur, zIndex }}
      onClick={onCardClick}
    >
      <PhaseCardBody phase={phase} isActiveCard={isActive} />
    </motion.div>
  );
}

function PhaseCardBody({
  phase,
  isActiveCard,
}: {
  phase: CompetitionPhase;
  isActiveCard: boolean;
}) {
  const isCompleted = phase.status === 'completed';

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-500 ${
        isActiveCard
          ? 'border-[#23BCAB]/40 bg-[#072828]/95 mint-glow p-5 sm:p-6 shadow-xl'
          : isCompleted
          ? 'border-[#23BCAB]/15 bg-[#072828]/90 p-4 sm:p-5'
          : 'border-[#F5FAFA]/6 bg-[#072828]/90 p-4 sm:p-5'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
            style={{
              borderColor: statusColors[phase.status],
              color: isActiveCard ? '#072828' : statusColors[phase.status],
              background: isActiveCard ? statusColors[phase.status] : 'transparent',
            }}>
            {phase.id}
          </div>
          <PhaseIcon name={phase.icon} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
          style={{
            color: statusColors[phase.status],
            borderColor: `${statusColors[phase.status]}40`,
            background: `${statusColors[phase.status]}10`,
          }}>
          {statusLabels[phase.status]}
        </span>
      </div>

      <h3 className={`font-black text-[#F5FAFA] mb-1.5 sm:mb-2 font-poppins ${isActiveCard ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
        {phase.title}
      </h3>
      {isActiveCard && (
        <p className="text-[#F5FAFA]/45 text-xs sm:text-sm leading-relaxed mb-3.5 sm:mb-4">{phase.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] sm:text-xs font-bold text-[#23BCAB] uppercase tracking-wide">
          {phase.dateText}
        </div>
        {!isActiveCard && (
          <div className="text-[10px] sm:text-xs text-[#23BCAB]/60 font-semibold">→ {phase.participantAction}</div>
        )}
      </div>
      {isActiveCard && (
        <>
          <div className="text-[10px] sm:text-xs text-[#23BCAB]/70 font-semibold mt-1.5">→ {phase.participantAction}</div>
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#23BCAB]/60 to-transparent" />
        </>
      )}
    </div>
  );
}
