'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getInvolvedTabs } from '../../lib/getInvolvedTabs';
import { involvedImages } from '../../lib/homepageImages';

export default function GetInvolvedTabs() {
  const [activeTab, setActiveTab] = useState(getInvolvedTabs[0].id);
  const activeData = getInvolvedTabs.find((t) => t.id === activeTab)!;
  const img = involvedImages[activeData.imageKey as keyof typeof involvedImages];

  return (
    <section className="section-padding relative" style={{ background: '#0B2A24' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Hult Prize — Inspired
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5">
            Get Involved
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Venture Craft is built by a community. Find your role in the journey.
          </p>
        </motion.div>

        {/* Tab list */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8 sm:mb-12" role="tablist">
          {getInvolvedTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#4FD1C5] text-[#001A18]'
                  : 'text-white/50 border border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[480px]" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center"
            >
              {/* Content side */}
              <div>
                <h3 className="text-3xl sm:text-4xl font-black text-white mb-3">
                  {activeData.label}
                </h3>
                <p className="text-[#4FD1C5] text-base font-semibold mb-4">{activeData.who}</p>
                <p className="text-white/45 text-base leading-relaxed mb-6">{activeData.why}</p>

                <ul className="space-y-3 mb-8">
                  {activeData.what.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5] mt-2 shrink-0" />
                      <span className="text-white/60 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={activeData.ctaHref}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#4FD1C5] text-[#001A18] text-sm font-bold hover:bg-[#5ae0d4] transition-colors group"
                >
                  {activeData.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Image side */}
              <div className="relative h-52 sm:h-72 lg:h-96 rounded-3xl overflow-hidden border border-white/6">
                {img && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#001A18]/70 to-transparent" />
                {img && (
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 font-bold bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                      {img.caption}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
