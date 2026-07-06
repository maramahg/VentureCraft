'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getInvolvedTabs } from '../../lib/getInvolvedTabs';

// Compact, non-clickable-tabs teaser for the homepage.
// The full interactive tab experience (with images, detail lists, CTAs)
// lives on /about/venture-craft — this keeps the homepage light while
// still giving every "Get Involved" path visibility, per client feedback
// that access to these paths should not disappear from the homepage.
export default function GetInvolvedTeaser() {
  return (
    <section className="relative py-16 sm:py-20" style={{ background: '#0B2A24' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-3 block">
              Get Involved
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Find your role in the journey.
            </h2>
          </div>
          <Link
            href="/about/venture-craft"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/80 hover:text-[#4FD1C5] transition-colors group shrink-0"
          >
            Explore all paths
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {getInvolvedTabs.map((tab, i) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              viewport={{ once: true }}
            >
              <Link
                href={tab.ctaHref}
                className="group flex flex-col justify-between h-full rounded-2xl border border-white/8 hover:border-[#4FD1C5]/30 bg-white/[0.03] hover:bg-[#4FD1C5]/[0.06] transition-all duration-300 p-4"
              >
                <span className="text-sm font-black text-white group-hover:text-[#4FD1C5] transition-colors">
                  {tab.label}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/35 group-hover:text-white/60 transition-colors">
                  {tab.cta}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
