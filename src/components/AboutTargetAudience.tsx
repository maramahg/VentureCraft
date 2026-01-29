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
    title: 'Recent Graduates',
    description: "Recent graduates (up to 5 years post-graduation) ready to launch."
  }
];

export default function AboutTargetAudience() {
  return (
    <section className="py-24 relative z-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight">Target Audience</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Open to innovators and visionaries at all stages of their academic and professional journey.
          </p>
        </div>

        {/* Mobile Horizontal Scroll Container / Desktop Grid */}
        <div className="flex flex-nowrap lg:grid lg:grid-cols-3 gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {audience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl group border transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.3)] shrink-0 w-[85vw] lg:w-auto snap-center"
              style={{
                background: 'rgba(0, 75, 68, 0.85)',
                borderColor: 'rgba(79, 209, 197, 0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(79, 209, 197, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 163, 131, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(79, 209, 197, 0.15)';
                e.currentTarget.style.boxShadow = '0_10px_35px_rgba(0,0,0,0.3)';
              }}
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
