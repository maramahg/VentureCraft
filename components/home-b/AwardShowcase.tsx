'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

function useCountUp(target: number, triggered: boolean, duration = 2200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setVal(Math.floor(eased * target));
      if (t < 1) requestAnimationFrame(animate);
      else setVal(target);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);
  return val;
}

const TIERS = [
  { rank: '01', label: 'Grand Prize',  amount: 100000, accent: '#4FD1C5' },
  { rank: '02', label: 'Second Place', amount: 60000,  accent: '#00A383' },
  { rank: '03', label: 'Third Place',  amount: 40000,  accent: 'rgba(255,255,255,0.4)' },
];

export default function AwardShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const totalCount = useCountUp(245000, isInView);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: '#00120F' }}
    >
      {/* Animated spotlight behind headline */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(79,209,197,0.1) 0%, transparent 70%)',
        }}
      />

      <div ref={ref} className="max-w-6xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-6 block">
            Prize Pool
          </span>

          {/* Main number — full width dramatic */}
          <div
            className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-white tracking-tighter leading-none mb-2"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            ${isInView ? (totalCount / 1000).toFixed(0) : '0'}K
          </div>
          <p className="text-2xl text-white/50 font-bold mb-3">Total Prize Pool</p>
          <p className="text-base text-[#4FD1C5] font-bold">
            The most competitive prize in regional deep-tech innovation
          </p>
        </motion.div>

        {/* Prize tiers — horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-xl shadow-[#4FD1C5]/5">
          {TIERS.map((tier, i) => {
            const count = useCountUp(tier.amount, isInView, 2400 + i * 200);
            return (
              <motion.div
                key={tier.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                className="relative p-8 sm:p-10 text-center group cursor-default transition-all duration-400 hover:bg-[#001A18]"
                style={{ background: 'rgba(0,18,15,0.6)' }}
              >
                <div className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-bold mb-6">
                  {tier.label}
                </div>
                <div
                  className="text-5xl sm:text-6xl font-black tracking-tighter mb-4"
                  style={{ color: tier.accent }}
                >
                  ${isInView ? (count / 1000).toFixed(0) : '0'}K
                </div>
                <div className="text-xs text-white/30 font-bold uppercase tracking-widest">
                  {tier.rank}
                </div>

                {/* Top accent */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1"
                  style={{ background: tier.accent }}
                />
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center text-white/40 font-medium text-xs mt-8"
        >
          Additional category prizes may be announced. Total pool: $245,000.
        </motion.p>
      </div>
    </section>
  );
}
