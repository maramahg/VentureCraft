"use client";
import React from "react";
import { Globe } from "@/components/ui/globe-feature-section";
import { motion } from "framer-motion";

export function HeroScrollDemo() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 z-20">
      {/* Background Gradient Splash */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vc-teal/20 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Top Section - Registration Badge */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vc-teal/10 border border-vc-teal/20 text-vc-teal text-sm font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vc-teal opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-vc-teal"></span>
          </span>
          Registration Open for 2026
        </div>
      </motion.div>
      
      <div className="container px-4 mx-auto z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left relative z-30"
        >
          {/* Simplified Lamp Effect */}
          <div className="relative w-full flex items-center justify-center lg:justify-start mb-8">
            <div className="relative flex items-center justify-center">
              {/* Light beam */}
              <motion.div
                initial={{ width: "2rem", opacity: 0.3 }}
                animate={{ width: "12rem", opacity: 0.6 }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-vc-teal to-transparent -translate-y-4"
              />
              
              {/* Central glow */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="absolute w-24 h-24 -translate-y-4 rounded-full bg-gradient-to-r from-vc-teal/30 via-vc-mint/15 to-transparent blur-xl"
              />
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-vc-mint/50">
              VentureCraft
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-vc-teal via-vc-mint to-white mt-2 drop-shadow-[0_0_15px_rgba(0,163,131,0.5)]">
              100K 
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            The global deep-tech startup competition powering sustainable energy innovation.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12"
          >
            <button className="bg-gradient-to-r from-vc-teal to-vc-teal/90 text-white font-semibold px-8 py-4 rounded-full text-lg w-full sm:w-auto hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-vc-teal/50">
              Submit Your Idea
            </button>
            <button className="bg-white/5 backdrop-blur-sm border border-vc-mint/30 text-vc-mint px-8 py-4 rounded-full text-lg w-full sm:w-auto hover:bg-vc-mint/10 hover:border-vc-mint hover:text-white transition-all duration-300">
              Learn More
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center lg:justify-start gap-8 text-white/40"
          >
            <div className="text-sm">
              <span className="block text-2xl font-bold text-white mb-1">$200K+</span>
              Prize Pool
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-sm">
              <span className="block text-2xl font-bold text-white mb-1">Global</span>
              Exposure
            </div>
          </motion.div>
        </motion.div>
        
        {/* Globe Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full order-first lg:order-last"
        >
          <Globe className="absolute inset-0 scale-75 md:scale-90 lg:scale-100" />
        </motion.div>
      </div>
    </section>
  );
}
