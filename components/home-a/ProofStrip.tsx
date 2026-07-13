'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { homepageStats } from '../../lib/homepageStats';

// Count-up hook
function useCountUp(target: number, triggered: boolean, duration = 1800) {
  const [count, setCount] = require('react').useState(0);

  require('react').useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target, duration]);

  return count;
}

function StatItem({ stat, triggered }: { stat: (typeof homepageStats)[0]; triggered: boolean }) {
  const raw = useCountUp(stat.numericValue, triggered);

  const format = (n: number) => {
    if (n >= 1000) return `${Math.floor(n / 1000)}K`;
    return `${n}`;
  };

  return (
    <div className="flex flex-col items-center text-center px-3 sm:px-6 py-6 transition-all duration-300 hover:scale-105 group cursor-default">
      <div className="text-2xl sm:text-4xl font-black font-poppins tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#23BCAB] drop-shadow-[0_0_12px_rgba(79,209,197,0.15)] group-hover:from-white group-hover:to-[#4FD1C5] transition-all duration-300">
        {stat.prefix || ''}
        {triggered ? format(raw) : '0'}
        {stat.suffix || ''}
      </div>
      <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-white/40 font-bold font-poppins mt-2 group-hover:text-white/60 transition-colors duration-300">
        {stat.label}
      </div>
    </div>
  );
}

export default function ProofStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative z-10 overflow-hidden backdrop-blur-md border-y border-white/5 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
      style={{
        background: 'linear-gradient(180deg, rgba(2,12,10,0.82) 0%, rgba(1,6,5,0.88) 100%)',
      }}
    >
      {/* Ambient background glow inside the ribbon */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(79,209,197,0.05) 0%, transparent 60%)',
          animationDuration: '6s'
        }}
      />

      {/* Mint top border line with glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4FD1C5]/30 to-transparent shadow-[0_0_8px_rgba(79,209,197,0.3)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 items-center justify-items-center w-full divide-x divide-white/[0.04] sm:divide-x-0 md:divide-x md:divide-white/[0.04]">
          {homepageStats.map((stat, i) => (
            <div 
              key={stat.label} 
              className={i === 4 ? "col-span-2 sm:col-span-4 md:col-span-1 w-full" : "w-full"}
            >
              <StatItem stat={stat} triggered={isInView} />
            </div>
          ))}
        </div>
      </div>

      {/* Mint bottom border line with glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4FD1C5]/20 to-transparent shadow-[0_0_6px_rgba(79,209,197,0.2)]" />
    </section>
  );
}
