'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence, MotionValue } from 'framer-motion';
import { competitionPhases, CompetitionPhase } from '../../lib/competitionPhases';

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
  const [isDesktop, setIsDesktop] = useState(false);
  const [phases, setPhases] = useState<CompetitionPhase[]>(competitionPhases);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);

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

    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const phaseCount = phases.length;
  const activePhaseMotion = useTransform(scrollYProgress, (v) => {
    const segment = 1 / phaseCount;
    const idx = Math.floor(v / segment);
    const localProgress = (v - idx * segment) / segment;
    if (localProgress < 0.7) return Math.min(phaseCount, idx + 1);
    return Math.min(phaseCount, idx + 1 + (localProgress - 0.7) / 0.3);
  });
  useMotionValueEvent(activePhaseMotion, 'change', (latest) => {
    setActivePhase(Math.min(phaseCount, Math.max(1, Math.round(latest))));
  });

  // Continuous rotation for the dial: 0deg at phase 1, 360deg once all phases are passed.
  const dialRotation = useTransform(activePhaseMotion, (v) => ((v - 1) / phaseCount) * 360);

  const currentPhase = phases[activePhase - 1];

  return (
    <section
      className="relative pt-20 sm:pt-28 lg:pt-32 pb-12"
      style={{ background: 'linear-gradient(180deg, #072828 0%, #003E51 100%)' }}
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-6 sm:px-10"
        style={{ minHeight: isDesktop ? `${phaseCount * 70}vh` : undefined }}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start lg:sticky lg:top-24">

          {/* ── Left: phase summary ── */}
          <div className="lg:w-[40%] flex flex-col gap-6 w-full">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold">
              VentureCraft
            </span>
            <div>
              <h2 className="text-3xl sm:text-5xl font-black font-poppins uppercase tracking-tight text-white leading-[1.1] sm:leading-[1.05]">
                Seven Phases.<br />One Destination.
              </h2>
              <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mt-3 sm:mt-4 max-w-sm">
                Every phase is designed to push your venture further — from first submission to the global stage.
              </p>
            </div>

            {/* Compact mobile phase indicator */}
            <div className="lg:hidden flex items-center gap-3 px-4 py-3 rounded-xl border border-[#23BCAB]/15 bg-[#F5FAFA]/[0.03]">
              <span className="text-2xl font-black text-[#23BCAB] tracking-tighter leading-none">
                {String(activePhase).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#F5FAFA]/40 font-bold">
                of {String(phaseCount).padStart(2, '0')} Phases
              </span>
              <div className="flex-1 flex items-center gap-1.5 justify-end">
                {phases.map((p) => (
                  <div key={p.id} className="h-1 rounded-full transition-all duration-500"
                    style={{ width: p.id === activePhase ? 16 : 5, background: p.id === activePhase ? '#23BCAB' : 'rgba(245,250,250,0.15)' }} />
                ))}
              </div>
            </div>

            {/* Circular progress indicator — rotating dial (desktop only) */}
            <div className="hidden lg:flex relative w-44 h-44 items-center justify-center my-2">
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(35,188,171,0.12) 0%, transparent 65%)' }}
              />
              {[88, 94, 100].map((s, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                  style={{ width: `${s}%`, height: `${s}%`, borderColor: `rgba(35,188,171,${0.1 - i * 0.025})` }} />
              ))}

              {/* Rotating dial: ticks + marker sweep around the ring as the phase advances */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ rotate: dialRotation }}
              >
                {Array.from({ length: phaseCount }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${(360 / phaseCount) * i}deg)` }}
                  >
                    <div
                      className="absolute left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        top: 2,
                        width: i === 0 ? 8 : 4,
                        height: i === 0 ? 8 : 4,
                        background: i === 0 ? '#23BCAB' : 'rgba(245,250,250,0.25)',
                        boxShadow: i === 0 ? '0 0 10px rgba(35,188,171,0.9)' : 'none',
                      }}
                    />
                  </div>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div key={activePhase}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(8px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex flex-col items-center">
                  <span className="text-[64px] font-black leading-none tracking-tighter"
                    style={{ background: 'linear-gradient(135deg, #23BCAB 0%, #F5FAFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {String(activePhase).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#F5FAFA]/30 font-bold mt-1">
                    of {String(phaseCount).padStart(2, '0')}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop progress dots */}
            <div className="hidden lg:flex items-center gap-2 mt-4 ml-2">
              {phases.map((p) => (
                <div key={p.id} className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: p.id === activePhase ? 24 : 8, background: p.id === activePhase ? '#23BCAB' : 'rgba(245,250,250,0.15)' }} />
              ))}
            </div>

            {/* Current phase details (desktop only — mobile phase list below already shows full detail for the active phase) */}
            <div className="hidden lg:block border-t border-[#F5FAFA]/8 pt-5">
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#F5FAFA]/30 font-bold mb-2">
                Current Phase
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activePhase}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}>
                  <div className="text-xl font-black text-[#F5FAFA]">{currentPhase?.title}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: statusColors[currentPhase?.status] }}>
                    {statusLabels[currentPhase?.status]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: rotating semi-circle arc of phase cards ── */}
          <div className="flex-1 relative w-full">
            {/* Subtle radial glow behind active card area */}
            <div className="hidden lg:block absolute pointer-events-none"
              style={{
                top: '50%', left: '10%', width: 420, height: 320, transform: 'translateY(-50%)',
                background: 'radial-gradient(ellipse, rgba(35,188,171,0.1) 0%, transparent 70%)',
              }} />

            {/* Desktop: rotating arc carousel */}
            <div className="hidden lg:block relative h-[560px]">
              {phases.map((phase) => (
                <ArcPhaseCard
                  key={phase.id}
                  phase={phase}
                  activePhaseMotion={activePhaseMotion}
                />
              ))}
            </div>

            {/* Mobile/tablet: simple vertical stack, no arc */}
            <div className="flex flex-col gap-4 lg:hidden">
              {phases.map((phase) => {
                const isActive = phase.id === activePhase;
                const isCompleted = phase.status === 'completed';
                return (
                  <div
                    key={phase.id}
                    className={`relative rounded-2xl border transition-all duration-500 ${
                      isActive
                        ? 'border-[#23BCAB]/40 bg-[#23BCAB]/8 mint-glow p-6'
                        : isCompleted
                        ? 'border-[#23BCAB]/15 bg-[#F5FAFA]/3 p-5'
                        : 'border-[#F5FAFA]/6 bg-[#F5FAFA]/2 p-5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
                          style={{
                            borderColor: statusColors[phase.status],
                            color: isActive ? '#072828' : statusColors[phase.status],
                            background: isActive ? statusColors[phase.status] : 'transparent',
                          }}>
                          {phase.id}
                        </div>
                        <span className="text-lg">{phase.icon}</span>
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

                    <h3 className={`font-black text-[#F5FAFA] mb-2 ${isActive ? 'text-xl' : 'text-base'}`}>
                      {phase.title}
                    </h3>
                    {isActive && (
                      <p className="text-[#F5FAFA]/45 text-sm leading-relaxed mb-4">{phase.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[10px] font-semibold text-[#F5FAFA]/30 uppercase tracking-wide">
                        {phase.dateText}
                      </div>
                      {!isActive && (
                        <div className="text-xs text-[#23BCAB]/60 font-semibold">→ {phase.participantAction}</div>
                      )}
                    </div>
                    {isActive && (
                      <>
                        <div className="text-xs text-[#23BCAB]/70 font-semibold mt-2">→ {phase.participantAction}</div>
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#23BCAB]/60 to-transparent" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/**
 * A single phase card positioned on a semi-circle arc, centered in its
 * parent. Cards fan outward and rotate away from the active card as the
 * distance (phase.id - activePhaseMotion) grows, mimicking a rolodex/fan
 * rotating in sync with page scroll.
 */
function ArcPhaseCard({
  phase,
  activePhaseMotion,
}: {
  phase: CompetitionPhase;
  activePhaseMotion: MotionValue<number>;
}) {
  const relative = useTransform(activePhaseMotion, (v) => phase.id - v);

  const y = useTransform(relative, (r) => r * 118);
  const x = useTransform(relative, (r) => Math.sin(r * 0.4) * 90);
  const rotate = useTransform(relative, (r) => r * 7);
  const scale = useTransform(relative, (r) => Math.max(0.72, 1 - Math.abs(r) * 0.14));
  const opacity = useTransform(relative, (r) => Math.max(0, 1 - Math.abs(r) * 0.4));
  const blur = useTransform(relative, (r) => `blur(${Math.min(6, Math.abs(r) * 2.5)}px)`);
  const zIndex = useTransform(relative, (r) => Math.round(100 - Math.abs(r) * 10));

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[92%] sm:w-[420px] -translate-x-1/2 -translate-y-1/2"
      style={{ x, y, rotate, scale, opacity, filter: blur, zIndex }}
    >
      <PhaseCardBody phase={phase} activePhaseMotion={activePhaseMotion} />
    </motion.div>
  );
}

function PhaseCardBody({
  phase,
  activePhaseMotion,
}: {
  phase: CompetitionPhase;
  activePhaseMotion: MotionValue<number>;
}) {
  const [isActive, setIsActive] = useState(false);
  useMotionValueEvent(activePhaseMotion, 'change', (latest) => {
    setIsActive(Math.round(latest) === phase.id);
  });
  const isCompleted = phase.status === 'completed';

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-500 ${
        isActive
          ? 'border-[#23BCAB]/40 bg-[#072828]/95 mint-glow p-6'
          : isCompleted
          ? 'border-[#23BCAB]/15 bg-[#072828]/90 p-5'
          : 'border-[#F5FAFA]/6 bg-[#072828]/90 p-5'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
            style={{
              borderColor: statusColors[phase.status],
              color: isActive ? '#072828' : statusColors[phase.status],
              background: isActive ? statusColors[phase.status] : 'transparent',
            }}>
            {phase.id}
          </div>
          <span className="text-lg">{phase.icon}</span>
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

      <h3 className={`font-black text-[#F5FAFA] mb-2 ${isActive ? 'text-xl' : 'text-base'}`}>
        {phase.title}
      </h3>
      {isActive && (
        <p className="text-[#F5FAFA]/45 text-sm leading-relaxed mb-4">{phase.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-semibold text-[#F5FAFA]/30 uppercase tracking-wide">
          {phase.dateText}
        </div>
        {!isActive && (
          <div className="text-xs text-[#23BCAB]/60 font-semibold">→ {phase.participantAction}</div>
        )}
      </div>
      {isActive && (
        <>
          <div className="text-xs text-[#23BCAB]/70 font-semibold mt-2">→ {phase.participantAction}</div>
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#23BCAB]/60 to-transparent" />
        </>
      )}
    </div>
  );
}
