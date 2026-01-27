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
    <section id="objectives" className="py-24 md:py-40 relative z-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight">Objectives</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Empowering the next generation of deep-tech innovators to solve global challenges.
          </p>
        </div>

        {/* Mobile Horizontal Scroll Container / Desktop Flex-wrap */}
        <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {objectives.map((objective, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl group border transition-all duration-300 shrink-0 w-[85vw] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.3333%-1.5rem)] shadow-[0_10px_35px_rgba(0,0,0,0.3)] snap-center"
              style={{
                background: 'rgba(15, 115, 105, 0.6)',
                borderColor: 'rgba(79, 209, 197, 0.2)'
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
