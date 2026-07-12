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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 font-poppins uppercase">
            Get Involved
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Venture Craft is built by a community. Find your role in the journey.
          </p>
        </motion.div>

        {/* Tab list */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-3 mb-10 sm:mb-16" role="tablist">
          {getInvolvedTabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 font-poppins border ${
                activeTab === tab.id
                  ? 'bg-[#4FD1C5] text-[#001A18] border-[#4FD1C5] shadow-[0_0_15px_rgba(79,209,197,0.3)] scale-105'
                  : 'text-white/40 border-white/8 bg-white/[0.02] hover:text-white hover:border-white/20 hover:bg-white/[0.05]'
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Content side */}
              <div className="flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.25em] text-[#4FD1C5] font-black mb-3 font-poppins block">
                  Role: {activeData.label}
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 font-poppins uppercase tracking-tight leading-none">
                  {activeData.label}
                </h3>
                <p className="text-white/80 text-base sm:text-lg font-bold mb-4 font-sans leading-relaxed">{activeData.who}</p>
                <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-6 font-sans">{activeData.why}</p>

                <ul className="space-y-3 mb-8">
                  {activeData.what.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#4FD1C5] mt-2.5 shrink-0" />
                      <span className="text-white/60 text-base sm:text-lg font-sans">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={activeData.ctaHref}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#4FD1C5] text-[#001A18] text-sm font-bold hover:bg-[#5ae0d4] transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,209,197,0.2)] group w-full sm:w-max"
                >
                  {activeData.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Image side */}
              <div className="relative h-64 sm:h-80 lg:h-[480px] rounded-[32px] overflow-hidden border border-[#4FD1C5]/20 shadow-2xl">
                {img && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#001A18]/80 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
