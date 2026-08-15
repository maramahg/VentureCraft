'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 z-20">
      {/* Background Gradient Splash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vc-teal/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 mx-auto z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left relative z-30"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vc-teal/10 border border-vc-teal/20 text-vc-teal text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vc-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-vc-teal"></span>
            </span>
            Registration Opening Soon
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-vc-mint/50">
              Venture Craft
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vc-teal via-vc-mint to-white mt-2 drop-shadow-[0_0_15px_rgba(0,163,131,0.5)]">
              100K
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The global deep tech startup competition powering sustainable energy innovation.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button className="bg-gradient-to-r from-vc-teal to-vc-teal/90 text-white font-semibold px-8 py-4 rounded-full text-lg w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-vc-mint/50 hover:bg-vc-mint hover:text-vc-green-dark hover:from-transparent hover:to-transparent">
              Submit Your Idea
            </button>
            <button className="bg-white/5 backdrop-blur-sm border border-vc-mint/30 text-vc-mint px-8 py-4 rounded-full text-lg w-full sm:w-auto hover:bg-vc-mint/10 hover:border-vc-mint hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-white/40">
            <div className="text-sm">
              <span className="block text-xl font-bold text-vc-mint mb-1">Announcing Soon</span>
              Deadline
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-sm">
              <span className="block text-2xl font-bold text-white mb-1">$200K+</span>
              Prize Pool
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-sm">
              <span className="block text-2xl font-bold text-white mb-1">Global</span>
              Exposure
            </div>
          </div>
        </motion.div>

        {/* The 3D scene sits behind/around this, but we keep this side open for visual balance if needed */}
        <div className="hidden lg:block"></div>
      </div>
    </section>
  );
}
