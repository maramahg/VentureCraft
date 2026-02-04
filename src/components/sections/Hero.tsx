"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";
import { Link as ScrollLink } from "react-scroll";
import dynamic from "next/dynamic";

// Dynamically import the 3D component with no SSR to avoid hydration mismatches
const InteractiveAvatar = dynamic(() => import("@/components/3d/InteractiveAvatar"), { 
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center text-vc-mint/30">Loading Visual...</div>
});

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  const titleText = "VENTURE CRAFT";
  
  return (
    <section id="hero" className="relative flex flex-col justify-center min-h-screen px-6 overflow-hidden z-10 pt-24 lg:pt-0">
      <GradientOrb color="bg-vc-mint" size="w-[600px] h-[600px]" opacity="opacity-10" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <ScrollReveal width="100%" duration={0.8}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight">
                <span className="inline-block overflow-hidden">
                    {titleText.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{
                        delay: i * 0.05,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                        }}
                        className="bg-gradient-to-r from-white to-vc-mint bg-clip-text text-transparent inline-block"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                    ))}
                </span>
                <br />
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-white text-4xl md:text-6xl font-light tracking-wide block mt-2"
                >
                    AMBASSADORS
                </motion.span>
                </h1>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={1}>
                <p className="max-w-2xl text-lg md:text-xl text-gray-300 leading-relaxed mb-12 font-light">
                A global initiative designed to engage passionate university students who actively promote innovation, entrepreneurship, and deep-tech solutions.
                </p>
            </ScrollReveal>

            <ScrollReveal width="100%" delay={1.2}>
                <ScrollLink 
                    to="cta"
                    smooth={true}
                    duration={800}
                >
                <button className="group relative px-10 py-5 bg-gradient-to-r from-vc-mint to-[#2bb57a] text-[#0D2B2B] font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(57,204,137,0.4)]">
                    <span className="relative z-10 flex items-center gap-3">
                    Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                </ScrollLink>
            </ScrollReveal>
        </div>

        {/* Right Column: 3D Avatar */}
        <div className="h-[500px] lg:h-[800px] w-full flex items-center justify-center order-1 lg:order-2 perspective-1000">
             <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full"
             >
                <InteractiveAvatar />
             </motion.div>
        </div>

      </div>
    </section>
  );
}
