'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ventureAreas, ventureAreaDisclaimer } from '../../lib/ventureAreas';
import { ventureAreaImages } from '../../lib/homepageImages';

export default function VentureAreas() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#0B2A24' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-5"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            2026 Theme — Sustainable Energy
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            Deep Tech Focus Areas
          </h2>
          <p className="text-white/40 text-base max-w-lg mx-auto">{ventureAreaDisclaimer}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-14">
          {ventureAreas.map((area, i) => {
            const img = area.imageKey ? ventureAreaImages[area.imageKey] : null;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl overflow-hidden border border-white/7 hover:border-[#4FD1C5]/25 transition-all duration-500 cursor-pointer"
                style={{
                  background: 'rgba(0,40,35,0.3)',
                  gridColumn: area.featured && i === 0 ? 'span 2' : undefined,
                }}
              >
                {/* Background image if available */}
                {img && (
                  <div className="absolute inset-0">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-105 group-hover:scale-110 transition-transform"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A24] via-[#0B2A24]/70 to-transparent" />
                  </div>
                )}

                <div className="relative p-6">
                  <div className="text-3xl mb-4">{area.icon}</div>
                  <h3 className="text-base font-black text-white mb-2 group-hover:text-[#4FD1C5] transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {area.description}
                  </p>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 30px rgba(79,209,197,0.05)' }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
