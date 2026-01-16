'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    date: 'Feb 1, 2026',
    title: 'Idea Submission Opens',
    description: 'Submit your deep-tech startup concept via the online portal.',
  },
  {
    date: 'Mar 15, 2026',
    title: 'Submission Deadline',
    description: 'Last day to submit your application for review.',
  },
  {
    date: 'Apr 1, 2026',
    title: 'Semi-Finalists Announced',
    description: 'Top 30 startups selected to proceed to the next round.',
  },
  {
    date: 'Apr 5 - 12, 2026',
    title: 'Bootcamp & Acceleration',
    description: 'Intensive mentorship program for finalists.',
  },
  {
    date: 'Apr 15, 2026',
    title: 'The Final Competition',
    description: 'Live pitching event and winner announcement at KFUPM.',
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="py-24 relative z-20 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Competition Timeline</h2>
          <p className="text-white/60">Mark these critical dates on your calendar.</p>
        </div>

        <div className="relative">
          {/* Vertical Line for Mobile / Horizontal for Desktop could be done, sticking to vertical for cleaner responsivness or simple horizontal list */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-vc-teal/20 -translate-y-1/2" />

          <div className="grid md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-4 h-4 rounded-full bg-vc-teal border-4 border-vc-green-dark z-10 mb-6 group-hover:scale-150 transition-transform shadow-[0_0_20px_rgba(0,163,131,0.5)]" />
                
                <div className="glass-panel p-6 w-full h-full hover:border-vc-teal/50 transition-colors">
                  <span className="text-vc-teal font-bold text-sm mb-2 block">
                    {step.date}
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-white/50">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
