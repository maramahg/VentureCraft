'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getInvolvedTabs } from '../../lib/getInvolvedTabs';
import { involvedImages } from '../../lib/homepageImages';
import { use3DTilt } from '../../hooks/use3DTilt';

function InvolvementCard({ tab, i }: { tab: (typeof getInvolvedTabs)[0]; i: number }) {
  const img = involvedImages[tab.imageKey as keyof typeof involvedImages];
  const tilt = use3DTilt(8);

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: i * 0.08 }}
        viewport={{ once: true }}
        style={{ ...tilt.style, transformStyle: 'preserve-3d' }}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="group relative h-96 rounded-2xl overflow-hidden bg-[#00120F]/50 border border-white/5 hover:border-[#4FD1C5]/40 hover:shadow-2xl hover:shadow-[#4FD1C5]/10 transition-all duration-500 cursor-default"
        whileHover={{ scale: 1.02 }}
      >
        {/* Background image */}
        {img && (
          <>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 1024px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00120F] via-[#00120F]/80 to-transparent" />
          </>
        )}

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end" style={{ transform: 'translateZ(20px)' }}>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-2">
            {String(i + 1).padStart(2, '0')}
          </div>
          <h3 className="text-xl font-black text-white mb-3 group-hover:text-[#4FD1C5] transition-colors duration-300">
            {tab.label}
          </h3>

          {/* Hover reveal */}
          <div className="max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-500">
            <p className="text-white/60 font-medium text-xs leading-relaxed mb-4">{tab.who}</p>
            <Link
              href={tab.ctaHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4FD1C5] hover:text-white hover:gap-3 transition-all duration-300"
            >
              {tab.cta}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4FD1C5]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </motion.div>
    </div>
  );
}

export default function InvolvementCards() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: '#00120F' }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Join the Community
          </span>
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9]">
            Get Involved
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {getInvolvedTabs.map((tab, i) => (
            <InvolvementCard key={tab.id} tab={tab} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
