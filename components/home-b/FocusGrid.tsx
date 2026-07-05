'use client';

import { motion } from 'framer-motion';
import { ventureAreas } from '../../lib/ventureAreas';

export default function FocusGrid() {
  return (
    <section className="section-padding relative overflow-hidden" style={{ background: '#00120F' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Venture Categories
          </span>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[0.9] max-w-lg">
              Areas of Focus
            </h2>
            <p className="text-white/50 text-sm max-w-sm border-l border-[#4FD1C5]/30 pl-4 py-1">
              We are looking for breakthrough technologies addressing the world's most critical challenges.
            </p>
          </div>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ventureAreas.map((area, i) => {
            // Make the first item larger (span 2 cols, 2 rows)
            const isLarge = i === 0;
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative p-6 sm:p-8 rounded-2xl overflow-hidden border border-white/5 bg-white/5 transition-all duration-400 hover:border-[#4FD1C5]/40 hover:bg-white/10 ${
                  isLarge ? 'sm:col-span-2 lg:col-span-2 sm:row-span-2' : ''
                }`}
              >
                {/* Background graphic */}
                <div className="absolute -bottom-8 -right-8 text-8xl text-white/[0.02] group-hover:text-[#4FD1C5]/[0.08] transition-colors duration-500 font-black tracking-tighter select-none pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full border border-[#4FD1C5]/20 bg-[#4FD1C5]/5 flex items-center justify-center text-xl mb-6">
                    {area.icon}
                  </div>

                  <h3 className={`font-black text-white mb-3 ${isLarge ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
                    {area.title}
                  </h3>
                  
                  <p className={`text-white/60 leading-relaxed flex-1 ${isLarge ? 'text-base sm:text-lg max-w-md' : 'text-sm'}`}>
                    {area.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
