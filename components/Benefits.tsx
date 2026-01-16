'use client';

import { motion } from 'framer-motion';
import { Trophy, Globe, Zap, Users, Plane } from 'lucide-react';

const benefits = [
  {
    icon: Trophy,
    title: 'Massive Prize Pool',
    description: '$200,000+ total in cash prizes, with $100k reserved for the 1st place winner.',
  },
  {
    icon: Globe,
    title: 'Global Exposure',
    description: 'Position your startup in a global deep-tech hub at KFUPM & Dhahran Techno Valley.',
  },
  {
    icon: Zap,
    title: 'Expert Mentorship',
    description: 'Access a specialized Bootcamp & Acceleration program from April 5–12.',
  },
  {
    icon: Users,
    title: 'Industry Connection',
    description: 'Bridge the gap between academia and top-tier industrial partners in Saudi Arabia.',
  },
  {
    icon: Plane,
    title: 'Travel Support',
    description: 'Finalists receive full travel arrangement assistance for the final competition.',
  },
];

export default function Benefits() {
  return (
    <section className="py-24 relative z-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Participate?</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Join the world's most promising deep-tech startups and accelerate your impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group border border-white/5 hover:border-vc-teal/50 hover:shadow-[0_0_30px_rgba(0,163,131,0.2)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/10 flex items-center justify-center text-vc-mint mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <benefit.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
