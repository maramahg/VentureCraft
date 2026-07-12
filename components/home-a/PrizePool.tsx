'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { use3DTilt } from '../../hooks/use3DTilt';
import { Award, Users, Plane, Globe, Network } from 'lucide-react';

const BENEFITS = [
  { text: 'Mentorship', icon: Users },
  { text: 'Travel Support', icon: Plane },
  { text: 'Visibility', icon: Globe },
  { text: 'Networking', icon: Network },
];

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

        <div className={`relative z-10 p-6 sm:p-8 ${isLarge ? 'lg:p-10' : ''}`}>
          {/* Rank + label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-black tracking-tight font-sans" style={{ color: prize.color }}>
              {prize.rank}
            </span>
            <div className="h-px flex-1 opacity-20" style={{ background: prize.color }} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/35 font-bold font-sans">
              {prize.label}
            </span>
          </div>

          {/* Amount count-up */}
          <div className={`font-black text-white tracking-tighter leading-none mb-4 font-poppins ${
            isLarge ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-3xl sm:text-4xl lg:text-5xl'
          }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {triggered ? formatted(count) : '$0K'}
          </div>

          {isLarge && (
            <p className="text-white/35 text-sm leading-relaxed font-sans">
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
      className="pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 relative overflow-hidden"
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
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black font-poppins uppercase tracking-tight text-white mb-4">
            Prizes & Awards
          </h2>
          <p className="text-[#4FD1C5] font-bold font-sans text-base md:text-lg max-w-2xl mx-auto mb-8">
            Rewarding excellence in deep tech innovation and sustainable solutions.
          </p>

          {/* Huge count-up total */}
          <motion.div
            className="text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-3 font-poppins mt-8"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <span style={{ filter: 'drop-shadow(0 0 40px rgba(79,209,197,0.25))' }}>
              ${isInView ? (totalCount / 1000).toFixed(0) : '0'}K
            </span>
          </motion.div>
          <p className="text-2xl sm:text-3xl font-bold text-white/55 mb-3 font-sans">Total Prize Pool</p>
          <p className="text-white/30 text-base font-sans">
            <span className="text-[#4FD1C5] font-bold font-sans">$100K Grand Prize</span>{' '}
            for the most impactful deep tech venture
          </p>
        </motion.div>

        {/* 3D tilt prize cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PRIZES.map((prize, i) => (
            <PrizeCard key={prize.rank} prize={prize} delay={i * 0.15} triggered={isInView} />
          ))}
        </div>

        {/* Corporate Special Awards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 px-4 mt-16"
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#4FD1C5]/20 bg-[#00A383]/5 backdrop-blur-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-[#00A383]/10 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#4FD1C5]/10 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,209,197,0.15)] border border-[#4FD1C5]/20">
                <Award className="w-8 h-8 text-[#4FD1C5]" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Corporate Special Awards</h3>
                <p className="text-white/40 text-xs sm:text-sm mt-2 max-w-md font-medium leading-relaxed">
                  Awarded for outstanding innovation in sustainability, energy transition, and deep tech alignment.
                </p>
              </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <div className="text-4xl md:text-5xl font-black text-white">$15,000</div>
              <div className="text-[#4FD1C5] font-black uppercase tracking-tighter text-sm mt-1">Per Award (X3)</div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-[#4FD1C5]/5 rounded-full blur-3xl pointer-events-none" />
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <div className="max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-xl md:text-2xl font-black text-[#4FD1C5] uppercase tracking-widest">Additional Benefits</h3>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="aspect-square flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl bg-white/3 border border-white/6 hover:border-[#4FD1C5]/20 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#4FD1C5]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-6 h-6 md:w-7 md:h-7 text-[#4FD1C5]" />
                </div>
                <span className="text-white/80 font-bold text-center text-sm md:text-lg leading-tight uppercase tracking-wider">
                  {benefit.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
