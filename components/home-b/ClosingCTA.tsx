'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ClosingCTA() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background image with cinematic overlay */}
      <div className="absolute inset-0">
        {/* Temporary stock image. Replace with official VentureCraft photography when available. */}
        <Image
          src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&q=80"
          alt="International startup competition stage"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,18,15,0.92)' }} />
        {/* Mint gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79,209,197,0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#4FD1C5 1px, transparent 1px), linear-gradient(90deg, #4FD1C5 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Status */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-10 shadow-lg shadow-[#4FD1C5]/5">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5]"
            />
            <span className="text-xs text-white/80 font-bold">Applications closed for this cycle</span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
            Follow the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#00A383]">journey.</span>
          </h2>

          <p className="text-white/60 font-medium text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Stay connected for finalist announcements, competition updates, and upcoming opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/timeline" className="group px-8 py-4 rounded-full bg-[#4FD1C5] text-[#00120F] font-bold text-sm hover:bg-[#3dbbb1] transition-colors flex items-center gap-2 shadow-xl shadow-[#4FD1C5]/20">
              View Timeline
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-full border border-white/15 text-white/70 font-bold text-sm hover:text-white hover:border-white/40 transition-all bg-white/5">
              Contact the Team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
