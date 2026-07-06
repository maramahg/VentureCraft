'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { proofWallImages } from '../../lib/homepageImages';

export default function ProofWall() {
  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #123830 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Credibility
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Built by KFUPM.{' '}
            <span className="text-[#4FD1C5]">Connected through DTV.</span>{' '}
            Open to the world.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[220px] sm:auto-rows-[180px]">
          {/* Organizer block — large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 rounded-3xl border border-[#4FD1C5]/15 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'rgba(0,163,131,0.07)' }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#4FD1C5] font-bold mb-2">Organized by</div>
              <div className="text-4xl font-black text-white mb-1">KFUPM</div>
              <div className="text-white/40 text-sm font-medium">King Fahd University of Petroleum & Minerals</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-2">In collaboration with</div>
              <div className="text-2xl font-black text-white/80">DTV</div>
              <div className="text-white/35 text-sm font-medium">Dhahran Tech Valley</div>
            </div>
            {/* Decorative circle */}
            <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-2 border-[#4FD1C5]/8 pointer-events-none" />
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full border border-[#4FD1C5]/5 pointer-events-none" />
          </motion.div>

          {/* Image cards */}
          {proofWallImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden group border border-white/5 hover:border-[#4FD1C5]/20 transition-all duration-500 ${
                i === 0 ? 'col-span-1 sm:col-span-2 row-span-1' :
                i === 2 ? 'col-span-1 row-span-1 sm:row-span-2' : 'col-span-1'
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A24]/80 via-transparent to-transparent" />
              {/* Caption */}
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                  {img.caption}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Stat cards */}
          {[
            { num: '130+', label: 'Countries Represented' },
            { num: '50+',  label: 'Expert Mentors' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/6 p-6 flex flex-col justify-center"
              style={{ background: 'rgba(0,40,35,0.3)' }}
            >
              <div className="text-3xl font-black text-[#4FD1C5] mb-1">{s.num}</div>
              <div className="text-xs text-white/35 font-semibold uppercase tracking-wide">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
