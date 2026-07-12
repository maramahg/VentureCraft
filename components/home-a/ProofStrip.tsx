'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
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
    <div className="flex flex-col items-center text-center px-3 sm:px-6 py-5">
      <div className="text-xl sm:text-3xl font-black text-white tracking-tight leading-none">
        {stat.prefix || ''}
        {triggered ? format(raw) : '0'}
        {stat.suffix || ''}
      </div>
      <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.22em] text-white/40 font-semibold mt-2">
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
      className="relative z-10 overflow-hidden"
      style={{ background: 'rgba(0,12,10,0.95)' }}
    >
      {/* Mint top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4FD1C5]/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap items-center justify-items-center lg:justify-center w-full">
          {homepageStats.map((stat) => (
            <StatItem key={stat.label} stat={stat} triggered={isInView} />
          ))}
        </div>
      </div>

      {/* Mint bottom border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#4FD1C5]/15 to-transparent" />
    </section>
  );
}
