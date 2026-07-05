'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { competitionPhases } from '../../lib/competitionPhases';

const Globe = dynamic(() => import('../ui/globe').then((m) => m.Globe), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-full bg-[#4FD1C5]/5 animate-pulse" />,
});

const statusColors: Record<string, string> = {
  completed: '#4FD1C5',
  active:    '#00A383',
  upcoming:  'rgba(255,255,255,0.2)',
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

  return (
    <section
      className="relative section-padding"
      style={{ background: 'linear-gradient(180deg, #00120F 0%, #001a15 100%)' }}
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
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Competition Roadmap
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Six Phases. One Destination.
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            From idea submission to the final stage — every phase designed to push your venture further.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* ── Globe (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-24 lg:w-[42%] flex flex-col items-center gap-6">
            <div className="relative w-full aspect-square max-w-md">
              {/* Halo */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,163,131,0.12) 0%, transparent 65%)',
                }}
              />
              {/* Orbit rings */}
              {[90, 94, 98].map((size, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
                  style={{
                    width: `${size}%`, height: `${size}%`,
                    borderColor: `rgba(79,209,197,${0.07 - i * 0.02})`,
                  }}
                />
              ))}
              <Globe className="w-full h-full" />
            </div>

            {/* Active phase indicator */}
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">
                Current Focus
              </div>
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-black text-white"
              >
                {competitionPhases[activePhase - 1]?.title}
              </motion.div>
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
              <div className="relative w-px flex-1 bg-white/8">
                <motion.div
                  style={{ height: progressHeight }}
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#4FD1C5] to-[#00A383] origin-top"
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
                    onViewportEnter={() => setActivePhase(phase.id)}
                    className={`relative rounded-2xl p-6 border transition-all duration-500 ${
                      isActive
                        ? 'border-[#4FD1C5]/40 bg-[#4FD1C5]/5 mint-glow'
                        : isCompleted
                        ? 'border-[#4FD1C5]/15 bg-white/3'
                        : 'border-white/6 bg-white/2'
                    }`}
                  >
                    {/* Phase number + status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border"
                          style={{
                            borderColor: statusColors[phase.status],
                            color: isActive ? '#00120F' : statusColors[phase.status],
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

                    <h3 className="text-xl font-black text-white mb-2">{phase.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-4">{phase.description}</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-white/30 uppercase tracking-wide">
                        {phase.dateText}
                      </div>
                      <div className="text-xs text-[#4FD1C5]/70 font-semibold">
                        → {phase.participantAction}
                      </div>
                    </div>

                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-[#4FD1C5]/60 to-transparent" />
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
