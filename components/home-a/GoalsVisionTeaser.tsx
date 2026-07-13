'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const goals = [
  { 
    id: '01',
    title: 'Global Hub',      
    desc: 'Establish KFUPM & DTV as a leading global deep tech hub.' 
  },
  { 
    id: '02',
    title: 'Talent',          
    desc: 'Attract and nurture high potential early stage talent.' 
  },
  { 
    id: '03',
    title: 'Connection',      
    desc: 'Bridge the gap between academia and industry.' 
  },
  { 
    id: '04',
    title: 'Pipeline',        
    desc: 'Foster a robust and sustainable global startup pipeline.' 
  },
  { 
    id: '05',
    title: 'Impact',          
    desc: 'Enable measurable global impact through innovation.' 
  },
];

export default function GoalsVisionTeaser() {
  return (
    <section 
      className="relative py-20 sm:py-28 overflow-hidden" 
      style={{ background: 'linear-gradient(180deg, #0B2A24 0%, #0a2520 100%)' }}
    >
      {/* Subtle ambient backlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4FD1C5]/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#23BCAB]/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Vision Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:w-[40%] shrink-0"
          >

            
            <h2 className="text-4xl md:text-5xl font-black font-poppins uppercase tracking-tight text-white mb-4 leading-tight">
              Our Vision
            </h2>
            <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mb-4">
              Empowering the next generation of deep tech innovators.
            </p>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8">
              Venture Craft exists to turn bold student ideas into global impact,
              connecting talent, research, and industry through one competition.
            </p>
            <Link
              href="/about/venture-craft"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#4FD1C5]/80 hover:text-[#4FD1C5] transition-colors group w-fit"
            >
              Learn more about Venture Craft
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Column: Clean Balanced Grid Cards with Objectives subheader */}
          <div className="flex-1 w-full flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#4FD1C5] font-black text-center lg:text-left font-poppins mb-1">
              Objectives
            </span>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {goals.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -4,
                    borderColor: 'rgba(79, 209, 197, 0.35)',
                    backgroundColor: 'rgba(255, 255, 255, 0.035)',
                    boxShadow: '0 12px 24px -10px rgba(79, 209, 197, 0.08)'
                  }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className={`group flex flex-col items-center text-center gap-3.5 rounded-2xl border border-white/5 bg-white/[0.015] p-4 sm:p-5 md:p-6 transition-all duration-300 cursor-default ${
                    i === 4 ? 'col-span-2' : 'col-span-1'
                  }`}
                >
                  {/* Outlined index square */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#4FD1C5]/10 border border-[#4FD1C5]/20 flex items-center justify-center shrink-0 text-xs font-black text-[#4FD1C5] group-hover:bg-[#4FD1C5]/20 group-hover:shadow-[0_0_10px_rgba(79,209,197,0.3)] transition-all duration-300">
                    {g.id}
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col items-center">
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white mb-1 group-hover:text-[#4FD1C5] transition-colors duration-300 font-poppins">
                      {g.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/40 leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                      {g.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
