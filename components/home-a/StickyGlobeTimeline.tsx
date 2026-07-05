'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { competitionPhases } from '../../lib/competitionPhases';

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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const phaseCount = competitionPhases.length;
  const activePhaseMotion = useTransform(scrollYProgress, (v) => {
    const segment = 1 / phaseCount;
    const idx = Math.floor(v / segment);
    const localProgress = (v - idx * segment) / segment;
    // Hold at current phase for 70% of segment, then transition in last 30%
    if (localProgress < 0.7) {
      return Math.min(phaseCount, idx + 1);
    }
    return Math.min(phaseCount, idx + 1 + (localProgress - 0.7) / 0.3);
  });
  useMotionValueEvent(activePhaseMotion, 'change', (latest) => {
    const phase = Math.min(phaseCount, Math.max(1, Math.round(latest)));
    setActivePhase(phase);
  });

  return (
    <section
      className="relative section-padding"
      style={{ background: 'linear-gradient(180deg, #072828 0%, #003E51 100%)' }}
    >
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#23BCAB] font-bold mb-4 block">
            Competition Roadmap
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F5FAFA] tracking-tight mb-5">
            Six Phases. One Destination.
          </h2>
          <p className="text-[#F5FAFA]/45 text-lg max-w-xl mx-auto">
            Every phase is designed to push your venture further — from first submission to the global stage.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ── Branded phase indicator (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-24 lg:w-[42%] flex flex-col items-center justify-center gap-8">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              {/* Brand gradient halo */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(35,188,171,0.15) 0%, transparent 65%)',
                }}
              />
              {/* Concentric brand rings */}
              {[88, 94, 100].map((size, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                  style={{
                    width: `${size}%`, height: `${size}%`,
                    borderColor: `rgba(35,188,171,${0.12 - i * 0.03})`,
                  }}
                />
              ))}

              {/* Large phase number */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <span
                    className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter"
                    style={{
                      background: 'linear-gradient(135deg, #23BCAB 0%, #F5FAFA 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {String(activePhase).padStart(2, '0')}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Phase count indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {competitionPhases.map((p) => (
                  <div
                    key={p.id}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: p.id === activePhase ? 24 : 8,
                      background: p.id === activePhase ? '#23BCAB' : 'rgba(245,250,250,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Active phase label */}
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#F5FAFA]/30 font-bold mb-2">
                Current Phase
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-black text-[#F5FAFA]"
                >
                  {competitionPhases[activePhase - 1]?.title}
                </motion.div>
              </AnimatePresence>
              <div
                className="text-xs font-bold mt-1"
                style={{ color: statusColors[competitionPhases[activePhase - 1]?.status] }}
              >
                {statusLabels[competitionPhases[activePhase - 1]?.status]}
              </div>
            </div>
          </div>

          {/* ── Phase cards (scrollable) ── */}
          <div className="flex-1 flex gap-6">
            {/* Progress track */}
            <div className="hidden lg:flex flex-col items-center gap-0 pt-2">
              <div className="relative w-px flex-1 bg-[#F5FAFA]/8">
                <motion.div
                  style={{ height: progressHeight }}
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#23BCAB] to-[#23BCAB]/60 origin-top"
                />
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 flex flex-col gap-5">
              {competitionPhases.map((phase, i) => {
                const isActive = phase.status === 'active';
                const isCompleted = phase.status === 'completed';
                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    viewport={{ once: true, margin: '-10%' }}
                    className={`relative rounded-2xl p-6 border transition-all duration-500 ${
                      isActive
                        ? 'border-[#23BCAB]/40 bg-[#23BCAB]/5 mint-glow'
                        : isCompleted
                        ? 'border-[#23BCAB]/15 bg-[#F5FAFA]/3'
                        : 'border-[#F5FAFA]/6 bg-[#F5FAFA]/2'
                    }`}
                  >
                    {/* Phase number + status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
                          style={{
                            borderColor: statusColors[phase.status],
                            color: isActive ? '#072828' : statusColors[phase.status],
                            background: isActive ? statusColors[phase.status] : 'transparent',
                          }}
                        >
                          {phase.id}
                        </div>
                        <span className="text-lg">{phase.icon}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
                        style={{
                          color: statusColors[phase.status],
                          borderColor: `${statusColors[phase.status]}40`,
                          background: `${statusColors[phase.status]}10`,
                        }}
                      >
                        {statusLabels[phase.status]}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#F5FAFA] mb-2">{phase.title}</h3>
                    <p className="text-[#F5FAFA]/45 text-sm leading-relaxed mb-4">{phase.description}</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-[#F5FAFA]/30 uppercase tracking-wide">
                        {phase.dateText}
                      </div>
                      <div className="text-xs text-[#23BCAB]/70 font-semibold">
                        → {phase.participantAction}
                      </div>
                    </div>

                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#23BCAB]/60 to-transparent" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
