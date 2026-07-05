'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AlliesSection() {
  return (
    <section className="relative py-20 overflow-hidden" style={{ background: '#00120F' }}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-0" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-bold">
            The Organizations Behind VentureCraft
          </span>
        </motion.div>

        {/* Organizers — minimal confident */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-14">
          {[
            { name: 'KFUPM', full: 'King Fahd University of Petroleum & Minerals', label: 'Organized by', primary: true },
            { name: 'DTV',   full: 'Dhahran Tech Valley',                           label: 'In collaboration with', primary: false },
          ].map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-[9px] uppercase tracking-[0.35em] text-white/40 font-bold mb-3">{org.label}</div>
              <div className={`text-4xl sm:text-5xl font-black mb-2 ${org.primary ? 'text-[#4FD1C5]' : 'text-white'}`}>
                {org.name}
              </div>
              <div className="text-xs text-white/50 font-medium">{org.full}</div>
            </motion.div>
          ))}
        </div>

        {/* Partner placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-10 text-center"
        >
          <p className="text-white/40 text-xs font-medium mb-3">
            Partner and sponsor announcements coming soon
          </p>
          <Link href="/contact" className="text-xs font-bold text-[#4FD1C5] hover:text-white transition-colors">
            Become a Partner →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
