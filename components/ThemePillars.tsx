'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue, useTime } from 'framer-motion';
import { Leaf, Recycle, Battery, Cpu } from 'lucide-react';
import { useState, useRef } from 'react';

const pillars = [
  {
    id: '01',
    title: 'DECARBONIZATION',
    subTitle: 'Decarbonization',
    icon: Leaf,
    points: ['Carbon Capture', 'Net-Zero Emissions', 'Hydrogen Tech', 'Greenhouse Gas Reduction'],
    color: '#00A383', // Teal
  },
  {
    id: '02',
    title: 'CIRCULAR ECONOMY',
    subTitle: 'Circular Economy',
    icon: Recycle,
    points: ['Waste Reduction', 'Material Recycling', 'Resource Efficiency', 'Sustainable Lifecycle'],
    color: '#4FD1C5', // Mint
  },
  {
    id: '03',
    title: 'ENERGY EFFICIENCY',
    subTitle: 'Energy Efficiency',
    icon: Battery,
    points: ['Industrial Optimization', 'Smart Grids', 'Power Management', 'Thermal Recovery'],
    color: '#34D399', // Emerald
  },
  {
    id: '04',
    title: 'PROCESS OPTIMIZATION',
    subTitle: 'Process Optimization',
    icon: Cpu,
    points: ['Advanced Engineering', 'Digital Twins', 'AI-Driven Industry', 'Automation'],
    color: '#2DD4BF', // Teal-400
  },
];

// Easing curve for realistic acceleration/deceleration (slow start, fast middle, slow end)
const easeInOutCubic = [0.65, 0, 0.35, 1]; 

// Subcomponent for individual card behavior to keep main component clean
function Card({ 
    pillar, 
    index, 
    progress, 
}: { 
    pillar: any, 
    index: number, 
    progress: MotionValue<number>, 
}) {
    // 1. Calculate Target Positions
    const finalX = (index - 1.5) * 310;
    const finalRotateY = (index - 1.5) * 5;
    
    // 2. Map Scroll Progress -> Animation Values with Easing
    const start = 0.15 + (index * 0.05); 
    const end = 0.85;

    // Use cubic-bezier easing for X and Rotate to give that "swing" feel
    const x = useTransform(progress, [start, end], [0, finalX], { ease: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 });
    const rotateY = useTransform(progress, [start, end], [180, finalRotateY], { ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }); 
    
    const rotateZ = useTransform(progress, [0, start], [ (Math.random() - 0.5) * 15, 0 ]); 
    const z = useTransform(progress, [start, end], [-index * 50, 0]); // Use standard Z spacing

    // Continuous Float Animation
    const floatDuration = 4 + Math.random() * 2; 
    const floatDelay = Math.random() * 2;

    return (
        <motion.div
            className="absolute w-[280px] h-[450px]"
            style={{
                x,
                z, 
                rotateX: useTransform(progress, [0, 0.5], [10, 0]),
                rotateY,
                rotateZ,
                transformStyle: 'preserve-3d',
                zIndex: 10 - Math.abs(index - 1.5), // Static Z-index
            }}
            animate={{
                y: [0, -15, 0], // Gentle bobbing
            }}
            transition={{
                y: {
                    duration: floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatDelay,
                }
            }}
        >
             {/* --- CARD BACK --- */}
             <div 
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.15)]"
                style={{ 
                    // Brighter background: Slightly lighter teal/green blend + glass effect
                    background: 'linear-gradient(135deg, #0f3d35 0%, #05201c 100%)',
                    border: '1px solid rgba(45, 212, 191, 0.4)', // Brighter border
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                }}
            >
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-32 h-32 border-4 border-vc-teal/50 rotate-45" />
                        <div className="absolute w-24 h-24 border-4 border-vc-mint/50 rotate-45" />
                    </div>
                    <div className="absolute bottom-8 left-0 w-full text-center text-vc-teal font-bold tracking-[0.3em] text-sm uppercase opacity-80">
                    VentureCraft
                    </div>
                    
                    {/* Stronger Gloss for brightness */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* --- CARD FRONT --- */}
            <div 
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.15)] transition-colors duration-500"
                style={{ 
                    background: 'linear-gradient(135deg, #0f3d35 0%, #05201c 100%)',
                    border: '2px solid rgba(45, 212, 191, 0.5)', // Brighter border
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden',
                }}
            >
                <div className="relative h-full flex flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-transparent z-10">
                    <div className="absolute -top-6 -right-6 text-[180px] font-black text-white/[0.03] select-none leading-none z-0">
                        {pillar.id}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-vc-teal/20 flex items-center justify-center">
                                <pillar.icon className="text-vc-teal" size={24} />
                            </div>
                            <span className="text-vc-mint font-bold tracking-widest text-sm uppercase">Pillar {pillar.id}</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-none text-white mb-2">
                            {pillar.title}
                        </h3>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 mt-4">
                        {pillar.points.map((point: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/70">
                                <div className="min-w-1.5 min-h-1.5 rounded-full bg-vc-mint" />
                                {point}
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 mt-4">
                        {pillar.points.map((point: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/70">
                                <div className="min-w-1.5 min-h-1.5 rounded-full bg-vc-mint" />
                                {point}
                            </div>
                        ))}
                    </div>

                    {/* Removed mirrored reflection text per user request */}
                </div>
            </div>
        </motion.div>
    );
}

export default function ThemePillars() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001
  });

  // Header Animation
  const headerOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(smoothProgress, [0, 0.2], [0, -50]);
  const headerScale = useTransform(smoothProgress, [0, 0.2], [1, 0.9]);

  // Deck Animation (Whole deck moving or scaling)
  // We can scale the whole deck slightly as it fans out
  const deckY = useTransform(smoothProgress, [0, 1], [100, -50]);

    return (
    <section ref={containerRef} className="relative h-[150vh] z-10 mb-10"> 
        {/* 
            Reduced height to 150vh to eliminate "Dead Zone" completely.
            Reduced mb-20 to mb-10 for tighter, more continuous flow.
        */}
        
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden perspective-1000" style={{ perspective: '1500px' }}>
            
            {/* Header */}
            <motion.div 
                className="absolute top-[10vh] text-center z-20 pointer-events-none px-4"
                style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
            >
                <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white mb-4">
                    The Pillars
                </h2>
                <p className="text-white/60 text-sm md:text-base">Scroll to explore strategic themes</p>
            </motion.div>

            {/* Desktop: Card Deck Animation */}
            <div className="hidden md:flex relative w-full max-w-7xl h-[500px] items-center justify-center preserve-3d">
                <motion.div 
                     className="relative w-full h-full flex items-center justify-center preserve-3d"
                     style={{ y: deckY }}
                >
                    {pillars.map((pillar, index) => (
                        <Card 
                            key={pillar.id}
                            pillar={pillar}
                            index={index}
                            progress={smoothProgress}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Mobile: Vertical Stack (Simplified) */}
            <div className="md:hidden w-full px-6 flex flex-col gap-6 items-center overflow-y-auto max-h-[70vh] pb-20 mt-20">
                 {/* 
                    On Mobile, we don't try to pin/fan because it breaks small screens.
                    We just show the cards in a clean stack.
                 */}
                  {pillars.map((pillar) => (
                    <div key={pillar.id} className="w-full bg-slate-900/80 backdrop-blur-md border border-vc-teal/20 rounded-xl p-6 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-4">
                             <div className="w-10 h-10 rounded-full bg-vc-teal/20 flex items-center justify-center">
                                 <pillar.icon className="text-vc-teal" size={20} />
                             </div>
                             <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                        </div>
                        <ul className="grid grid-cols-1 gap-2">
                            {pillar.points.map((p, i) => (
                                <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                                     <div className="w-1 h-1 bg-vc-mint rounded-full" /> {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                  ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 text-sm font-medium tracking-widest uppercase"
                style={{ opacity: useTransform(smoothProgress, [0.9, 1], [1, 0]) }}
            >
                Scroll to Explore
            </motion.div>
        
        </div>
    </section>
  );
}
