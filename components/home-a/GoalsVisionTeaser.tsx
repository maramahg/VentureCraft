'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const goals = [
  { title: 'Global Hub',  desc: 'Establish KFUPM & DTV as a leading global deep tech hub.' },
  { title: 'Talent',      desc: 'Attract and nurture high potential early stage talent.' },
  { title: 'Connection',  desc: 'Bridge the gap between academia and industry.' },
  { title: 'Pipeline',    desc: 'Foster a robust and sustainable global startup pipeline.' },
  { title: 'Impact',      desc: 'Enable measurable global impact through innovation.' },
];

export default function GoalsVisionTeaser() {
  return (
    <section
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #0a2520 100%)' }}
    >
      {/* Ambient glow — top left behind the heading */}
      <div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,209,197,0.07) 0%, transparent 70%)' }}
      />
      {/* Ambient glow — bottom right */}
      <div
        className="absolute -bottom-20 -right-10 w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,209,197,0.05) 0%, transparent 70%)' }}
      />

      {/* Decorative large number watermark */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[22rem] font-black font-poppins text-white/[0.018] select-none pointer-none leading-none tracking-tighter pr-4"
        aria-hidden
      >
        VC
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

          {/* Left: vision statement */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:w-[38%] shrink-0"
          >
            {/* Teal accent bar */}
            <div className="w-10 h-1 rounded-full bg-[#4FD1C5] mb-5" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-poppins uppercase tracking-tight text-white mb-4 leading-tight">
              Our Vision
            </h2>
            <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mb-4">
              Empowering the next generation of deep tech innovators.
            </p>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8">
              VentureCraft exists to turn bold student ideas into global impact —
              connecting talent, research, and industry through one competition.
            </p>
            <Link
              href="/about/venture-craft"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/80 hover:text-[#4FD1C5] transition-colors group"
            >
              Learn more about VentureCraft
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right: goal cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {goals.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group flex items-start gap-4 rounded-2xl border border-white/6 bg-white/[0.02] p-5
                           hover:border-[#4FD1C5]/20 hover:bg-white/[0.04]
                           hover:shadow-[0_0_24px_rgba(79,209,197,0.06)]
                           transition-all duration-300 cursor-default"
              >
                {/* Number badge with ring glow on hover */}
                <div
                  className="w-8 h-8 rounded-xl bg-[#4FD1C5]/10 flex items-center justify-center shrink-0 mt-0.5
                             group-hover:bg-[#4FD1C5]/20 group-hover:shadow-[0_0_12px_rgba(79,209,197,0.25)]
                             transition-all duration-300"
                >
                  <span className="text-[11px] font-black text-[#4FD1C5]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white mb-1 group-hover:text-white transition-colors">{g.title}</h3>
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
