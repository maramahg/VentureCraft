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
      {/* Decorative background shapes */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#4FD1C5]/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#23BCAB]/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-stretch">
          
          {/* Bento Item 1: Floating Vision Intro (No card wrapper for asymmetry) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-1 flex flex-col justify-center p-6 md:p-8"
          >
            {/* Elegant accent line */}
            <div className="w-12 h-1 bg-[#4FD1C5] rounded-full mb-6" />
            
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black font-poppins uppercase tracking-tight text-white mb-4 leading-tight">
              Our Vision
            </h2>
            <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg mb-4">
              Empowering the next generation of deep tech innovators.
            </p>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-6">
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

          {/* Goals Bento Cards */}
          {goals.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ 
                y: -6, 
                borderColor: 'rgba(79, 209, 197, 0.3)', 
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                boxShadow: '0 12px 30px -10px rgba(79, 209, 197, 0.08)' 
              }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              viewport={{ once: true }}
              className={`group flex flex-col justify-between rounded-[2rem] border border-white/5 bg-white/[0.015] p-8 transition-all duration-300 ${
                i === 4 ? 'md:col-span-2 lg:col-span-1' : 'col-span-1'
              }`}
            >
              {/* Card top row */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black tracking-widest text-[#4FD1C5] bg-[#4FD1C5]/10 px-3 py-1 rounded-full">
                  GOAL {g.id}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#4FD1C5]/30 group-hover:bg-[#4FD1C5] group-hover:shadow-[0_0_8px_rgba(79,209,197,0.8)] transition-all duration-300" />
              </div>

              {/* Card body */}
              <div className="mt-auto">
                <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight group-hover:text-[#4FD1C5] transition-colors duration-300">
                  {g.title}
                </h3>
                <p className="text-white/40 text-sm md:text-base leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                  {g.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
