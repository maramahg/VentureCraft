'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ventureAreas, ventureAreaDisclaimer } from '../../lib/ventureAreas';
import { ventureAreaImages } from '../../lib/homepageImages';
import { Sun, Leaf, Battery, Cpu, Factory, FlaskConical, Bot, LucideIcon } from 'lucide-react';

const areaIcons: Record<string, LucideIcon> = {
  'sustainable-energy': Sun,
  'decarbonization': Leaf,
  'energy-storage': Battery,
  'ai-data': Cpu,
  'industrial-innovation': Factory,
  'advanced-materials': FlaskConical,
  'robotics': Bot,
};

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
          <span className="text-[12px] sm:text-sm uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block font-poppins">
            2026 Theme: Sustainable Energy
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 font-poppins uppercase">
            Deep Tech Focus Areas
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto font-sans">{ventureAreaDisclaimer}</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-14">
          {ventureAreas.map((area, i) => {
            const img = area.imageKey ? ventureAreaImages[area.imageKey] : null;
            const IconComponent = areaIcons[area.id];
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                viewport={{ once: true }}
                className={`group relative rounded-2xl overflow-hidden border border-white/7 hover:border-[#4FD1C5]/25 transition-all duration-500 cursor-pointer flex flex-col min-h-[220px] sm:min-h-[250px] ${
                  area.featured && i === 0
                    ? 'sm:col-span-2'
                    : i === 6
                    ? 'lg:col-span-2 xl:col-span-1'
                    : ''
                }`}
                style={{
                  background: 'rgba(0,40,35,0.3)',
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

                <div className="relative p-6 sm:p-8 flex-1 flex flex-col justify-between z-10">
                  <div>
                    {/* Mint Blue Icon */}
                    <div className="mb-5">
                      {IconComponent ? (
                        <IconComponent size={36} strokeWidth={1.5} className="text-[#4FD1C5]" />
                      ) : (
                        <div className="text-3xl">{area.icon}</div>
                      )}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-[#4FD1C5] transition-colors duration-300 font-poppins uppercase tracking-tight">
                      {area.title}
                    </h3>
                    <p className="text-white/50 text-sm sm:text-base leading-relaxed font-poppins">
                      {area.description}
                    </p>
                  </div>
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
