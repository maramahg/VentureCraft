'use client';

import { motion } from 'framer-motion';

export default function Prizes() {
  return (
    <section id="prizes" className="py-16 relative z-20 bg-slate-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Prizes</h2>
          <p className="text-white/60">Competing for a total prize pool of over $200,000</p>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-6 max-w-4xl mx-auto">
          
          {/* 2nd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1 w-full md:w-1/3 glass-panel p-8 text-center border-t-4 border-t-gray-300 relative"
          >
            <div className="text-6xl mb-4">🥈</div>
            <h3 className="text-2xl font-bold mb-2">2nd Place</h3>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
              $60,000
            </div>
            <p className="text-white/40 text-sm">Cash Prize + Mentorship</p>
          </motion.div>

          {/* 1st Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 w-full md:w-1/3 glass-panel p-10 text-center border-t-4 border-t-yellow-400 relative z-20 shadow-[0_0_50px_rgba(250,204,21,0.2)] transform md:-translate-y-8"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm">
              CHAMPION
            </div>
            <div className="text-7xl mb-6">🏆</div>
            <h3 className="text-3xl font-bold mb-2">1st Place</h3>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 mb-4">
              $100,000
            </div>
            <p className="text-white/60 text-sm">Cash Prize + Incubation + Global Tour</p>
          </motion.div>

          {/* 3rd Place */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="order-3 w-full md:w-1/3 glass-panel p-8 text-center border-t-4 border-t-orange-700 relative"
          >
            <div className="text-6xl mb-4">🥉</div>
            <h3 className="text-2xl font-bold mb-2">3rd Place</h3>
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
              $40,000
            </div>
            <p className="text-white/40 text-sm">Cash Prize + Mentorship</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
