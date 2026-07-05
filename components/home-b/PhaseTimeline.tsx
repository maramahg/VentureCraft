'use client';

import { motion } from 'framer-motion';
import { competitionPhases } from '../../lib/competitionPhases';

const statusDot: Record<string, string> = {
  completed: '#00A383',
  active:    '#4FD1C5',
  upcoming:  'rgba(255,255,255,0.15)',
};

export default function PhaseTimeline() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: '#00120F' }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Competition Roadmap
          </span>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9]">
              6 Phases.
            </h2>
            <p className="text-white/50 text-lg max-w-sm font-medium">
              A structured journey from idea to international stage.
            </p>
          </div>
        </motion.div>

        {/* Phase grid — 3 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitionPhases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-6 rounded-2xl border transition-all duration-400 group ${
                phase.status === 'active'
                  ? 'border-[#4FD1C5]/30 bg-[#4FD1C5]/5 shadow-xl shadow-[#4FD1C5]/5 scale-[1.02] z-10'
                  : phase.status === 'completed'
                  ? 'border-white/10 bg-white/5 shadow-sm'
                  : 'border-white/5 bg-transparent'
              }`}
            >
              {/* Phase number */}
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-black"
                  style={{
                    borderColor: statusDot[phase.status],
                    color: phase.status === 'active' ? '#00120F' : statusDot[phase.status],
                    background: phase.status === 'active' ? statusDot[phase.status] : 'transparent',
                  }}
                >
                  {phase.id}
                </div>
                <span className="text-2xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">{phase.icon}</span>
              </div>

              <h3 className="text-lg font-black text-white mb-2">{phase.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{phase.description}</p>

              <div className="border-t border-white/5 pt-4 mt-auto">
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">
                  {phase.dateText}
                </div>
                <div className="text-xs text-[#4FD1C5] font-bold">
                  → {phase.participantAction}
                </div>
              </div>

              {phase.status === 'active' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A383] to-[#4FD1C5] rounded-t-2xl" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
