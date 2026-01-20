'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Microscope, Briefcase } from 'lucide-react';

const audience = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: "Bachelor's, Master's, and PhD Students currently enrolled in academic programs."
  },
  {
    icon: Microscope,
    title: 'Researchers',
    description: "Post-doctoral researchers advancing frontiers in science and deep-tech."
  },
  {
    icon: Briefcase,
    title: 'Recent Grads',
    description: "Recent graduates (up to 5 years post-graduation) ready to launch."
  }
];

export default function AboutTargetAudience() {
  return (
    <section className="py-24 relative z-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Target Audience</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Open to innovators and visionaries at all stages of their academic and professional journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl group border border-white/5 hover:border-vc-teal/50 hover:shadow-[0_0_30px_rgba(0,163,131,0.2)] transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/10 flex items-center justify-center text-vc-mint mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
