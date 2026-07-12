'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRegistrationStatus } from '../../hooks/useRegistrationStatus';
import { getInvolvedTabs } from '../../lib/getInvolvedTabs';

export default function FinalCTA() {
  const isRegistrationOpen = useRegistrationStatus();

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-32"
      style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #123830 60%, #0B2A24 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(79,209,197,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Main headline */}
          <div className="max-w-3xl mx-auto mb-14">
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
              Follow the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#00A383]">
                VentureCraft
              </span>{' '}
              journey.
            </h2>

            <p className="text-white/40 text-lg sm:text-xl leading-relaxed">
              {isRegistrationOpen
                ? 'Applications are open. Submit your venture and take the first step toward the $245K prize pool.'
                : 'Applications are closed for this cycle. Stay connected for finalist announcements, competition updates, and upcoming opportunities.'}
            </p>
          </div>

          {/* Divider label */}
          <p className="text-[#4FD1C5] font-bold text-sm uppercase tracking-[0.25em] mb-6">
            Find your role in the journey
          </p>

          {/* Role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {getInvolvedTabs.map((tab, i) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link
                  href={tab.ctaHref}
                  className="group flex flex-col justify-between h-full rounded-2xl border border-white/8 hover:border-[#4FD1C5]/30 bg-white/[0.03] hover:bg-[#4FD1C5]/[0.06] transition-all duration-300 p-5 md:p-6 text-left"
                >
                  <span className="text-base md:text-lg font-black text-white group-hover:text-[#4FD1C5] transition-colors">
                    {tab.label}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/35 group-hover:text-white/60 transition-colors whitespace-nowrap">
                    {tab.cta}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
