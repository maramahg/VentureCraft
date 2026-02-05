"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./ui/globe").then(m => m.Globe), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-vc-mint/5 rounded-full blur-3xl animate-pulse" />
});

export function HeroScrollDemo() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-20 pb-24 md:pb-40 xl:pt-32 z-20 bg-transparent overflow-hidden">
      <div className="container px-6 sm:px-8 xl:px-16 mx-auto z-10 grid xl:grid-cols-2 gap-4 md:gap-8 xl:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center xl:text-left relative z-30 xl:pl-10 order-last xl:order-first xl:mt-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.5rem] font-bold tracking-tighter mb-4 font-poppins uppercase leading-[1.1] xl:leading-none"
          >
            <span className="block text-white xs:whitespace-nowrap">
              Venture Craft
            </span>
            <span className="block mt-2 text-xl sm:text-2xl md:text-3xl uppercase">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-vc-mint via-vc-mint to-vc-teal drop-shadow-[0_0_15px_rgba(79,209,197,0.3)] mr-2">
                100K
              </span>
              <span className="font-light tracking-[0.1em] text-white/40 ml-1">
                COMPETITION
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg text-white/50 mb-8 max-w-xl mx-auto xl:mx-0 leading-relaxed font-poppins"
          >
            An international deep-tech startup competition by{" "}
            <a
              href="https://www.kfupm.edu.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vc-mint font-bold underline hover:no-underline transition-all duration-300"
            >
              KFUPM
            </a>{" "}
            in collaboration with{" "}
            <a
              href="https://dtv.sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-vc-mint font-bold underline hover:no-underline transition-all duration-300"
            >
              DTV
            </a>
            {" "}— supporting student-led ventures building science and technology-based solutions with global impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center xl:justify-start mb-10 xl:mb-12 relative z-50"
          >
            <Link href="/apply" className="group relative px-8 py-3 sm:py-3.5 rounded-full text-base font-bold text-[#001D1B] transition-all duration-300 overflow-hidden shadow-[0_0_20px_rgba(79,209,197,0.3)] hover:scale-105 active:scale-95 w-full sm:w-auto hover:shadow-vc-mint/40 inline-block text-center cursor-pointer">
              <div className="absolute inset-0 bg-vc-mint transition-colors duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                Submit Your Idea <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>

            <Link
              href="/about"
              className="group relative p-[1.5px] rounded-full overflow-hidden w-full sm:w-auto transition-all duration-300 hover:scale-105 active:scale-95 inline-block cursor-pointer font-bold z-[100] pointer-events-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 opacity-70 group-hover:from-white/40 group-hover:to-white/10 transition-all duration-300" />
              <div className="relative px-8 py-2.5 sm:py-3 rounded-full bg-[#0D1B1A] flex items-center justify-center group-hover:bg-[#0D1B1A]/80 transition-all duration-300">
                <span className="text-base text-white group-hover:text-vc-mint transition-colors relative z-10">
                  Learn More
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center xl:justify-start gap-12 sm:gap-14 xl:ml-6"
          >
            <div className="relative group/stat">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-vc-mint rounded-full opacity-20 group-hover/stat:opacity-100 transition-opacity duration-500" />
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/40 group-hover/stat:text-white/60 transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-white mb-0.5">$245K</span>
                Prize Pool
              </div>
            </div>
            <div className="relative group/stat">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-vc-teal rounded-full opacity-20 group-hover/stat:opacity-100 transition-opacity duration-500" />
              <div className="text-xs sm:text-sm uppercase tracking-widest text-white/40 group-hover/stat:text-white/60 transition-colors">
                <span className="block text-xl sm:text-2xl font-black text-white mb-0.5">Global</span>
                Exposure
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-10 flex flex-col xl:items-start items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-medium pt-2">In Partnership With</span>
            <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Image src="/kfupm-logo.png" alt="KFUPM" width={128} height={32} className="h-7 md:h-8 w-auto object-contain" />
              <div className="w-px h-6 bg-white/30" />
              <Image src="/dtv-logo.png" alt="DTV" width={160} height={44} className="h-9 md:h-11 w-auto object-contain" />
            </div>
          </motion.div>
        </motion.div>

        {/* Globe Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[250px] sm:h-[400px] md:h-[500px] xl:h-[580px] w-full flex items-center justify-center"
        >
          {/* Light hue emanating from the globe */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-vc-mint/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />
          <Globe className="absolute inset-0 scale-[1.08] sm:scale-[1.18] md:scale-[1.28] xl:scale-[1.23]" />
        </motion.div>
      </div>
    </section>
  );
}
