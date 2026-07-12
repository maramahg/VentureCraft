'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useRegistrationStatus } from '../../hooks/useRegistrationStatus';

export default function FinalCTA() {
  const isRegistrationOpen = useRegistrationStatus();
  return (
    <section
      className="relative overflow-hidden py-16 sm:py-28"
      style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #123830 60%, #0B2A24 100%)' }}
    >

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(79,209,197,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
            Follow the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#00A383]">
              VentureCraft
            </span>{' '}
            journey.
          </h2>

          <p className="text-white/40 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {isRegistrationOpen
              ? 'Applications are open. Submit your venture and take the first step toward the $245K prize pool.'
              : 'Applications are closed for this cycle. Stay connected for finalist announcements, competition updates, and upcoming opportunities.'}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              href={isRegistrationOpen ? '/apply' : '/timeline'}
              className="group px-8 py-3.5 sm:py-4 rounded-full bg-[#4FD1C5] text-[#001A18] font-bold text-sm hover:bg-[#5ae0d4] transition-colors flex items-center justify-center gap-2"
            >
              {isRegistrationOpen ? 'Apply Now' : 'View Timeline'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 sm:py-4 rounded-full border border-white/12 text-white/70 font-bold text-sm hover:text-white hover:border-[#4FD1C5]/30 transition-all text-center"
            >
              Contact the Team
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 sm:py-4 rounded-full border border-[#4FD1C5]/15 text-[#4FD1C5]/80 font-bold text-sm hover:text-[#4FD1C5] hover:border-[#4FD1C5]/40 transition-all text-center"
            >
              Become a Mentor
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
