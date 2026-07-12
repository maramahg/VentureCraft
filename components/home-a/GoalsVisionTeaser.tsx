'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const goals = [
  { title: 'Global Hub',      desc: 'Establish KFUPM & DTV as a leading global deep tech hub.' },
  { title: 'Talent',          desc: 'Attract and nurture high potential early stage talent.' },
  { title: 'Connection',      desc: 'Bridge the gap between academia and industry.' },
  { title: 'Pipeline',        desc: 'Foster a robust and sustainable global startup pipeline.' },
  { title: 'Impact',          desc: 'Enable measurable global impact through innovation.' },
];

export default function GoalsVisionTeaser() {
  return (
    <section className="relative py-16 sm:py-20" style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #0a2520 100%)' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Left: vision statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:w-[40%] shrink-0"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-poppins uppercase tracking-tight text-white mb-4 leading-tight">
              Our Vision
            </h2>
            <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mb-4">
              Empowering the next generation of deep tech innovators.
            </p>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-6">
              Venture Craft exists to turn bold student ideas into global impact —
              connecting talent, research, and industry through one competition.
            </p>
            <Link
              href="/about/venture-craft"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/80 hover:text-[#4FD1C5] transition-colors group"
            >
              Learn more about Venture Craft
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: compact goal chips */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {goals.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 rounded-2xl border border-white/6 bg-white/[0.02] p-4"
              >
                <div className="w-7 h-7 rounded-lg bg-[#4FD1C5]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[11px] font-black text-[#4FD1C5]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white mb-1">{g.title}</h3>
                  <p className="text-[12px] text-white/40 leading-snug">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
