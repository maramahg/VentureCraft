'use client';

import { motion } from 'framer-motion';
import { Globe, Sparkles, Handshake, Rocket, Target } from 'lucide-react';

const objectives = [
  {
    icon: Globe,
    title: 'Global Hub',
    description: 'Establish KFUPM & DTV as a leading Global Deep-Tech Hub.'
  },
  {
    icon: Sparkles,
    title: 'Talent',
    description: 'Attract and nurture high-potential early-stage talent.'
  },
  {
    icon: Handshake,
    title: 'Connection',
    description: 'Bridge the gap between academia and industry.'
  },
  {
    icon: Rocket,
    title: 'Pipeline',
    description: 'Foster a robust and sustainable global startup pipeline.'
  },
  {
    icon: Target,
    title: 'Impact',
    description: 'Enable measurable global impact through innovation.'
  }
];

export default function AboutObjectives() {
  return (
    <section className="py-24 relative z-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Objectives</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Empowering the next generation of deep-tech innovators to solve global challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((objective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group border border-white/5 hover:border-vc-teal/50 hover:shadow-[0_0_30px_rgba(0,163,131,0.2)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/10 flex items-center justify-center text-vc-mint mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <objective.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{objective.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {objective.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
