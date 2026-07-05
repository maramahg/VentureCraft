'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { competitionJourneyStages } from '../../lib/competitionPhases';
import { use3DTilt } from '../../hooks/use3DTilt';

function PathCard({ stage, isEven }: { stage: typeof competitionJourneyStages[0], isEven: boolean }) {
  const tilt = use3DTilt(8);

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
      viewport={{ once: true }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
        !isEven ? 'lg:grid-flow-dense' : ''
      }`}
    >
      {/* Image with 3D tilt */}
      <div style={{ perspective: '1000px' }} className={`relative h-80 sm:h-96 ${!isEven ? 'lg:col-start-2' : ''}`}>
        <motion.div
          style={{ ...tilt.style, transformStyle: 'preserve-3d' }}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          className="w-full h-full rounded-3xl overflow-hidden group shadow-2xl shadow-black/50 border border-white/5"
        >
          <Image
            src={stage.image}
            alt={stage.imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00120F]/80 to-transparent" />
          
          {/* Number overlay */}
          <div className="absolute top-6 left-6" style={{ transform: 'translateZ(30px)' }}>
            <span className="text-8xl font-black text-white/90 leading-none select-none drop-shadow-lg">
              {stage.number}
            </span>
          </div>
          
          {/* Caption */}
          <div className="absolute bottom-5 right-5" style={{ transform: 'translateZ(20px)' }}>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#4FD1C5]/80 font-bold bg-[#00120F]/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
              {stage.imageCaption}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}>
        {/* Step badge */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl border border-[#4FD1C5]/20 bg-[#4FD1C5]/5 flex items-center justify-center">
            <span className="text-xl font-black text-[#4FD1C5]">{stage.number}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full border border-[#4FD1C5]/20 bg-[#4FD1C5]/5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4FD1C5]">{stage.label}</span>
          </div>
        </div>

        <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
          {stage.headline}
        </h3>

        <p className="text-white/60 text-lg leading-relaxed mb-6">{stage.description}</p>

        {/* Related phases */}
        <div className="flex flex-wrap gap-2 mb-8">
          {stage.phases.map((phase) => (
            <span key={phase} className="text-[11px] font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {phase}
            </span>
          ))}
        </div>

        {/* Teal horizontal line */}
        <div className="h-px w-16 bg-gradient-to-r from-[#4FD1C5] to-transparent" />
      </div>
    </motion.div>
  );
}

export default function CompetitionPath() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#00120F' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Competition Structure
          </span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] max-w-2xl">
            Your path to{' '}
            <span className="text-[#4FD1C5]">
              launch.
            </span>
          </h2>
        </motion.div>

        {/* Alternating layout */}
        <div className="flex flex-col gap-24">
          {competitionJourneyStages.map((stage, i) => (
            <PathCard key={stage.id} stage={stage} isEven={i % 2 === 0} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5] hover:text-white transition-colors group"
          >
            View full competition details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
