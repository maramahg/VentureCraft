'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { use3DTilt } from '../../hooks/use3DTilt';

const PRIZES = [
  { rank: '1st', label: 'Grand Prize',  amount: 100000, prefix: '$', color: '#4FD1C5', size: 'large'  as const },
  { rank: '2nd', label: 'Second Place', amount: 60000,  prefix: '$', color: '#00A383', size: 'medium' as const },
  { rank: '3rd', label: 'Third Place',  amount: 40000,  prefix: '$', color: '#ccfbf1', size: 'medium' as const },
];

function useCountUp(target: number, triggered: boolean, duration = 2000) {
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

function PrizeCard({ prize, delay, triggered }: {
  prize: typeof PRIZES[0]; delay: number; triggered: boolean;
}) {
  const count = useCountUp(prize.amount, triggered, 2000);
  const formatted = (n: number) => `$${(n / 1000).toFixed(0)}K`;
  const isLarge = prize.size === 'large';
  const tilt = use3DTilt(isLarge ? 8 : 12);

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={triggered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.215, 0.61, 0.355, 1] as const }}
        style={tilt.style}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className={`relative rounded-3xl overflow-hidden border transition-colors duration-500 cursor-default ${
          isLarge ? 'border-[#4FD1C5]/30' : 'border-white/8'
        }`}
        whileHover={{ scale: 1.02 }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: isLarge
              ? 'linear-gradient(145deg, rgba(0,163,131,0.12) 0%, rgba(0,56,51,0.4) 100%)'
              : 'rgba(0,56,51,0.15)',
          }}
        />

        {/* Top accent bar */}
        <div className="h-1 w-full relative z-10" style={{ background: prize.color }} />

        <div className={`relative z-10 p-8 ${isLarge ? 'lg:p-10' : ''}`}>
          {/* Rank + label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black tracking-tight" style={{ color: prize.color }}>
              {prize.rank}
            </span>
            <div className="h-px flex-1 opacity-20" style={{ background: prize.color }} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-bold">
              {prize.label}
            </span>
          </div>

          {/* Amount count-up */}
          <div className={`font-black text-white tracking-tighter leading-none mb-4 ${
            isLarge ? 'text-6xl lg:text-7xl' : 'text-4xl lg:text-5xl'
          }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {triggered ? formatted(count) : '$0K'}
          </div>

          {isLarge && (
            <p className="text-white/35 text-sm leading-relaxed">
              Awarded to the venture with the strongest scientific foundation, market potential, and global impact.
            </p>
          )}
        </div>

        {/* 3D depth — inner glow on tilt */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-400"
          style={{ boxShadow: `inset 0 0 60px ${prize.color}10` }}
        />
      </motion.div>
    </div>
  );
}

export default function PrizePool() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const totalCount = useCountUp(245000, isInView, 2200);

  return (
    <section
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #123830 0%, #0B2A24 100%)' }}
    >
      {/* Animated ambient glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(79,209,197,0.07) 0%, transparent 60%)',
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-4 block">
            Prize Pool
          </span>

          {/* Huge count-up total */}
          <motion.div
            className="text-7xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-3"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <span style={{ filter: 'drop-shadow(0 0 40px rgba(79,209,197,0.25))' }}>
              ${isInView ? (totalCount / 1000).toFixed(0) : '0'}K
            </span>
          </motion.div>
          <p className="text-2xl sm:text-3xl font-bold text-white/55 mb-3">Total Prize Pool</p>
          <p className="text-white/30 text-base">
            Up to{' '}
            <span className="text-[#4FD1C5] font-bold">$100K Grand Prize</span>{' '}
            for the most impactful deep-tech venture
          </p>
        </motion.div>

        {/* 3D tilt prize cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PRIZES.map((prize, i) => (
            <PrizeCard key={prize.rank} prize={prize} delay={i * 0.15} triggered={isInView} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white/20 text-xs mt-10"
        >
          Additional category prizes and recognitions may be announced. Total prize pool: $245,000.
        </motion.p>
      </div>
    </section>
  );
}
