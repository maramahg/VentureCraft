'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { organizers } from '../../lib/partners';

// Compact organizer/partner strip for the homepage. The full institutional
// credibility section (descriptions, sponsor tiers) lives on /sponsors —
// this keeps the homepage light while preserving visible access to it,
// per client feedback that organizers/partners should not disappear.
export default function PartnersTeaser() {
  return (
    <section
      className="relative py-14 sm:py-16 border-t border-b border-white/6"
      style={{ background: 'rgba(0,20,17,0.5)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-6 sm:gap-8 flex-wrap justify-center"
        >
          {organizers.map((org) => (
            <div key={org.id} className="flex flex-col items-center sm:items-start">
              <span className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-bold mb-1">
                {org.role === 'organizer' ? 'Organized by' : 'In collaboration with'}
              </span>
              <span className="text-xl font-black text-white/85 tracking-tight">{org.name}</span>
            </div>
          ))}
        </motion.div>

        <Link
          href="/sponsors"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/80 hover:text-[#4FD1C5] transition-colors group shrink-0"
        >
          Meet our partners & organizers
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
