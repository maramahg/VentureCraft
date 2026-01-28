"use client";
import React from "react";
import { Globe } from "./ui/globe";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroScrollDemo() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-12 xl:pt-32 xl:pb-16 z-20 bg-transparent overflow-hidden">
      <div className="container px-6 sm:px-8 xl:px-16 mx-auto z-10 grid xl:grid-cols-2 gap-4 md:gap-8 xl:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center xl:text-left relative z-30 xl:pl-10 order-last xl:order-first"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-[5rem] font-bold tracking-tighter mb-4 font-poppins uppercase leading-[1.1] xl:leading-none"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-vc-mint/50 xs:whitespace-nowrap">
              Venture Craft
            </span>
            <span className="block mt-2 text-xl sm:text-2xl md:text-3xl xl:text-4xl uppercase">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-vc-mint via-vc-mint to-vc-teal mr-3 sm:mr-4">
                100K
              </span>{" "}
              <span className="font-light tracking-[0.2em] text-white/60">
                COMPETITION
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/60 mb-8 max-w-xl mx-auto xl:mx-0 leading-relaxed font-poppins"
          >
            The global deep-tech startup competition powering sustainable energy innovation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center xl:justify-start mb-10 xl:mb-12 relative z-50"
          >
            <Link href="/registration" className="group relative px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold text-white transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(35,188,171,0.3)] hover:scale-105 active:scale-95 w-full sm:w-auto hover:shadow-vc-mint/40 hover:text-vc-green-dark inline-block text-center cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-[#23bcab] via-[#23bcab]/90 to-vc-teal group-hover:bg-vc-mint group-hover:bg-none transition-all duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Submit Your Idea <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <a
              href="#objectives"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('objectives')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative p-[1.5px] rounded-full overflow-hidden w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 inline-block cursor-pointer font-bold z-[100] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#23bcab] to-vc-teal opacity-70 group-hover:from-vc-mint/80 group-hover:to-vc-mint group-hover:opacity-100 transition-all duration-300" />
              <div className="relative px-8 py-3 sm:py-3.5 rounded-full bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-all duration-300">
                <span className="text-base sm:text-lg text-white group-hover:text-vc-mint transition-colors relative z-10">
                  Learn More
                </span>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center xl:justify-start gap-6 sm:gap-8 text-white/40 xl:ml-6"
          >
            <div className="text-xs sm:text-sm">
              <span className="block text-xl sm:text-2xl font-bold text-white mb-0.5">$200K+</span>
              Prize Pool
            </div>
            <div className="w-px h-10 sm:h-12 bg-white/10"></div>
            <div className="text-xs sm:text-sm">
              <span className="block text-xl sm:text-2xl font-bold text-white mb-0.5">Global</span>
              Exposure
            </div>
          </motion.div>
        </motion.div>

        {/* Globe Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[250px] sm:h-[400px] md:h-[500px] xl:h-[550px] w-full flex items-center justify-center"
        >
          {/* Light hue emanating from the globe */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-vc-mint/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
          <Globe className="absolute inset-0 scale-[1.1] sm:scale-[1.2] md:scale-[1.3] xl:scale-[1.1]" />
        </motion.div>
      </div>
    </section>
  );
}
