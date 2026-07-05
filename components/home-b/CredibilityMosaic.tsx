'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { mosaicImages } from '../../lib/homepageImages';
import { statCards } from '../../lib/homepageStats';

export default function CredibilityMosaic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  
  // Parallax for the main image
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="section-padding relative overflow-hidden" style={{ background: '#00120F' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Global Credibility
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight max-w-3xl mx-auto">
            Backed by the region's leading tech ecosystem.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[600px]">
          
          {/* Main Cinematic Image (Spans 8 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#001A18] h-80 lg:h-full border border-white/5"
          >
            <motion.div style={{ y }} className="absolute inset-0 scale-110">
              <Image
                src={mosaicImages.main.src}
                alt={mosaicImages.main.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </motion.div>
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-8">
              <p className="text-white/90 font-bold text-lg max-w-md drop-shadow-lg">
                Fostering the next generation of Saudi deep-tech founders.
              </p>
            </div>
          </motion.div>

          {/* Press Kit / Stats Grid (Spans 4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 grid-rows-2 gap-4 h-full">
            {statCards.slice(0, 2).map((stat, i) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl p-8 bg-white/5 border border-white/10 flex flex-col justify-center overflow-hidden shadow-xl shadow-black/20 group hover:border-[#4FD1C5]/40 transition-colors"
              >
                {/* Accent glow on hover */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#4FD1C5]/10 rounded-full blur-2xl group-hover:bg-[#4FD1C5]/20 transition-colors" />

                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-3 relative z-10">
                  {stat.title}
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2 relative z-10">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-[#4FD1C5] relative z-10">
                  {stat.subtitle}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
