'use client';

import { motion } from 'framer-motion';
import { Leaf, Recycle, Battery, Cpu } from 'lucide-react';

const pillars = [
  {
    id: '01',
    title: 'Decarbonization',
    icon: Leaf,
    description: 'Solutions reducing carbon footprint and promoting net-zero emissions.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    id: '02',
    title: 'Circular Economy',
    icon: Recycle,
    description: 'Innovations in waste reduction, recycling, and resource efficiency.',
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: '03',
    title: 'Energy Efficiency',
    icon: Battery,
    description: 'Technologies that optimize energy consumption across industries.',
    color: 'from-yellow-400 to-orange-600',
  },
  {
    id: '04',
    title: 'Process Optimization',
    icon: Cpu,
    description: 'AI and digital twins for smoother, more efficient industrial processes.',
    color: 'from-purple-400 to-fuchsia-600',
  },
];

export default function Pillars() {
  return (
    <section id="theme" className="py-24 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-vc-teal font-medium mb-2 block">The Theme</span>
            <h2 className="text-3xl md:text-5xl font-bold">Sustainable Energy</h2>
          </div>
          <p className="text-white/60 max-w-md text-right md:text-left">
            We are looking for breakthrough technologies in four key strategic pillars.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 md:p-12 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl font-bold">{pillar.id}</span>
              </div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <pillar.icon size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-white/60 text-lg">
                  {pillar.description}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
