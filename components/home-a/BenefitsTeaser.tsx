'use client';

import { motion } from 'framer-motion';
import { Users, Plane, Globe, Network, Award, BookOpen } from 'lucide-react';

const benefits = [
  { icon: Users,     title: 'Mentorship',     desc: '1:1 guidance from 50+ industry experts and researchers.' },
  { icon: Plane,     title: 'Travel Support', desc: 'Logistics support for finalists traveling to Dhahran.' },
  { icon: Globe,     title: 'Global Visibility', desc: 'Exposure across 130+ countries and partner networks.' },
  { icon: Network,   title: 'Networking',     desc: 'Connect with founders, investors, and ecosystem leaders.' },
  { icon: Award,     title: 'Recognition',    desc: 'Official certificates and public recognition for finalists.' },
  { icon: BookOpen,  title: 'Training',       desc: 'Structured bootcamps on venture building and pitching.' },
];

export default function BenefitsTeaser() {
  return (
    <section className="relative py-16 sm:py-20" style={{ background: '#0B2A24' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#4FD1C5] font-bold mb-3 block">
            Beyond the Prize
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Additional Benefits
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              viewport={{ once: true }}
              className="group flex flex-col items-center text-center rounded-2xl border border-white/6 hover:border-[#4FD1C5]/25 bg-white/[0.02] hover:bg-[#4FD1C5]/[0.04] transition-all duration-300 p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#4FD1C5]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <b.icon className="w-5 h-5 text-[#4FD1C5]" />
              </div>
              <span className="text-xs font-black text-white mb-1.5">{b.title}</span>
              <span className="text-[11px] text-white/35 leading-snug">{b.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
