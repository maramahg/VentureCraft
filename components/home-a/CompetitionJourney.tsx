'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { competitionJourneyStages } from '../../lib/competitionPhases';
import { use3DTilt } from '../../hooks/use3DTilt';
import { useRegistrationStatus } from '../../hooks/useRegistrationStatus';

function JourneyCard({ stage, i, className = '' }: { stage: typeof competitionJourneyStages[0]; i: number; className?: string }) {
  const tilt = use3DTilt(10);

  return (
    <div style={{ perspective: '900px' }} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, delay: i * 0.18, ease: [0.215, 0.61, 0.355, 1] as const }}
        viewport={{ once: true }}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative rounded-3xl overflow-hidden border border-white/6 hover:border-[#4FD1C5]/25 transition-all duration-500 cursor-default"
      >
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,56,51,0.18)' }}
        />

        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={stage.image}
            alt={stage.imageAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A24] via-[#0B2A24]/50 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#4FD1C5]/70 font-bold bg-[#0B2A24]/60 backdrop-blur-sm px-2 py-1 rounded">
              {stage.imageCaption}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-black text-[#4FD1C5]/50 tracking-widest">
              {stage.number}
            </span>
            <div className="h-px flex-1 bg-white/6" />
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-[#4FD1C5] border border-[#4FD1C5]/20 bg-[#4FD1C5]/5">
              {stage.label}
            </span>
          </div>

          <h3 className="text-xl font-black text-white mb-3">{stage.headline}</h3>
          <p className="text-white/40 text-sm leading-relaxed mb-5">{stage.description}</p>

          <div className="flex flex-wrap gap-2">
            {stage.phases.map((phase) => (
              <span
                key={phase}
                className="text-[10px] font-semibold text-white/30 bg-white/4 px-2.5 py-1 rounded-full border border-white/6"
              >
                {phase}
              </span>
            ))}
          </div>
        </div>

        {/* 3D glow layer */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 50px rgba(79,209,197,0.05)' }} />
      </motion.div>
    </div>
  );
}

export default function CompetitionJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.7], ['0%', '100%']);
  const isRegistrationOpen = useRegistrationStatus();

  // Track which card is centered in the mobile swipe carousel to drive the pagination dots.
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    const cards = Array.from(container.children) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveCard(idx);
          }
        });
      },
      { root: container, threshold: [0.6] }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#0B2A24' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,163,131,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            MIT 100K — Inspired
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Your Competition Journey
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Three stages. One mission. Build a deep-tech venture that changes the world.
          </p>
        </motion.div>

        {/* Animated connector line */}
        <div ref={ref} className="hidden lg:block relative mb-12">
          <div className="absolute top-1/2 left-[16.6%] right-[16.6%] h-px bg-white/8" />
          <motion.div
            style={{ width: lineWidth }}
            className="absolute top-1/2 left-[16.6%] h-px bg-gradient-to-r from-[#4FD1C5] to-[#00A383] origin-left"
          />
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 300 }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#4FD1C5] bg-[#0B2A24]"
              style={{ left: `calc(${16.6 + i * 33.3}% - 8px)` }}
            >
              <div className="absolute inset-1 rounded-full bg-[#4FD1C5]" />
            </motion.div>
          ))}
        </div>

        {/* Mobile/tablet: swipeable snap carousel */}
        <div
          ref={carouselRef}
          className="lg:hidden -mx-6 px-6 sm:-mx-10 sm:px-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {competitionJourneyStages.map((stage, i) => (
            <JourneyCard
              key={stage.id}
              stage={stage}
              i={i}
              className="min-w-[85%] sm:min-w-[55%] shrink-0 snap-center"
            />
          ))}
        </div>

        {/* Pagination dots synced to the active card */}
        <div className="lg:hidden flex items-center justify-center gap-2 mt-4">
          {competitionJourneyStages.map((stage, i) => (
            <div
              key={stage.id}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeCard ? 20 : 6,
                background: i === activeCard ? '#4FD1C5' : 'rgba(245,250,250,0.15)',
              }}
            />
          ))}
        </div>
        <p className="lg:hidden text-center text-white/25 text-[11px] uppercase tracking-[0.2em] font-semibold mt-2">
          Swipe to explore →
        </p>

        {/* Desktop: 3D tilt grid */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {competitionJourneyStages.map((stage, i) => (
            <JourneyCard key={stage.id} stage={stage} i={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 mt-14"
        >
          <Link
            href="/apply"
            className="group relative px-8 py-3.5 rounded-full text-[15px] font-bold overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-[#4FD1C5] group-hover:bg-[#5ae0d4] transition-colors duration-300" />
            <span className="relative text-[#001A18] flex items-center gap-2">
              {isRegistrationOpen ? 'Apply Now' : 'View Application Status'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link href="/apply" className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/70 hover:text-[#4FD1C5] transition-colors group">
            View full competition details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/timeline" className="inline-flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white/70 transition-colors group">
            View full 6-phase journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
