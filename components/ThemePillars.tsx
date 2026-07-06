'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue, useTime, AnimatePresence } from 'framer-motion';
import { Leaf, Recycle, Battery, Cpu, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const pillars = [
    {
        id: '01',
        title: 'DECARBONIZATION',
        subTitle: 'Decarbonization',
        icon: Leaf,
        points: ['Carbon Capture', 'Net-Zero Emissions', 'Hydrogen Tech', 'Renewable Energy'],
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
    const start = index * 0.05;
    const end = 0.8; // Complete animation much later (80% of smooth scroll)

    // Use cubic-bezier easing for X and Rotate to give that "swing" feel
    const x = useTransform(progress, [start, end], [0, finalX], { ease: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 });
    const rotateY = useTransform(progress, [start, end], [180, finalRotateY], { ease: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t });

    const rotateZ = useTransform(progress, [0, start], [(index - 1.5) * 3, 0]);
    const z = useTransform(progress, [start, end], [-index * 50, 0]); // Use standard Z spacing

    // Continuous Float Animation - use deterministic values based on index
    const floatDuration = 4 + (index * 0.5);
    const floatDelay = index * 0.5;

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
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
                style={{
                    background: 'rgba(0, 75, 68, 0.85)',
                    border: `1px solid ${pillar.color}66`,
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="VentureCraft"
                        width={180}
                        height={45}
                        className="w-[70%] h-auto opacity-100 transition-opacity"
                    />
                </div>
            </div>

            {/* --- CARD FRONT --- */}
            <div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-500"
                style={{
                    background: 'rgba(0, 75, 68, 0.85)',
                    border: `1px solid ${pillar.color}88`,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                }}
            >
                <div className="relative h-full flex flex-col justify-start gap-8 p-8 z-10">


                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <pillar.icon style={{ color: pillar.color }} size={32} />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase leading-none text-white mb-2 font-poppins tracking-tighter">
                            {pillar.title}
                        </h3>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3 mt-4">
                        {pillar.points.map((point: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/70 font-poppins">
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

function MobileStack({ pillars }: { pillars: any[] }) {
    const [stack, setStack] = useState(pillars);
    const [hasInteracted, setHasInteracted] = useState(false);

    const handleCycle = () => {
        setHasInteracted(true);
        setStack((prev) => [...prev.slice(1), prev[0]]);
    };

    return (
        <div className="relative w-full flex justify-center cursor-pointer min-h-[400px]" onClick={handleCycle}>
            {stack.map((pillar, index) => {
                // Only show top 3 cards for performance and visual clarity
                const isHidden = index > 2;

                return (
                    <motion.div
                        key={pillar.id}
                        className="absolute w-[85vw] max-w-[320px] h-[350px] sm:h-[400px] rounded-3xl p-8 flex flex-col justify-start gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border backdrop-blur-xl bg-[#004b44]/90 border-white/10"
                        style={{
                            borderColor: `${pillar.color}44`,
                            zIndex: pillars.length - index,
                        }}
                        initial={false}
                        animate={{
                            scale: index === 0 && !hasInteracted ? [1, 1.02, 1] : 1 - index * 0.05,
                            y: index * 12,
                            opacity: isHidden ? 0 : 1,
                            pointerEvents: index === 0 ? 'auto' : 'none',
                        }}
                        transition={index === 0 && !hasInteracted ? {
                            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                            default: { type: 'spring', stiffness: 300, damping: 30 }
                        } : {
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <pillar.icon style={{ color: pillar.color }} size={24} />
                            </div>
                            <h3 className="text-xl font-black text-white leading-tight uppercase font-poppins tracking-tighter">{pillar.title}</h3>
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            {pillar.points.map((point: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-vc-mint" />
                                    {point}
                                </div>
                            ))}

                            {index === 0 && !hasInteracted && (
                                <motion.div
                                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 pointer-events-none"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.8, 1.2, 1.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                >
                                    <div className="w-16 h-16 rounded-full border-2 border-vc-mint/40 bg-vc-mint/5" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function ThemePillars() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.2", "end end"]
    });

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });


    // Deck Animation (Whole deck moving or scaling)
    // We can scale the whole deck slightly as it fans out
    const deckY = useTransform(smoothProgress, [0, 1], [500, 100]);

    return (
        <section id="pillars" ref={containerRef} className="relative xl:h-[110vh] z-10 overflow-visible py-12 md:py-32 xl:py-0">
            {/* 
            Height: Auto on Mobile/Tablet (with padding), 120vh on Desktop (for scroll animation).
            Spacing: Uniform py-16/24 on non-desktop to match other sections.
            */}

            <div className="relative xl:sticky xl:top-0 xl:h-screen flex flex-col items-center justify-start md:justify-center perspective-1000" style={{ perspective: '1500px' }}>

                <div className="relative xl:absolute xl:top-16 text-center z-30 px-4 mt-8 xl:mt-0 max-w-4xl mx-auto pointer-events-none">
                    <div className="flex flex-col items-center mb-12">
                        {/* Highlighted theme banner */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="pointer-events-auto mb-5 inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-[#4FD1C5]/30 bg-[#4FD1C5]/8 backdrop-blur-sm"
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] text-[#4FD1C5]/60 font-bold">2026 Theme</span>
                            <span className="w-px h-4 bg-[#4FD1C5]/20" />
                            <span className="text-lg sm:text-xl font-black text-[#4FD1C5] tracking-tight" style={{ textShadow: '0 0 20px rgba(79,209,197,0.4)' }}>
                                Sustainable Energy
                            </span>
                        </motion.div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold font-poppins uppercase tracking-tighter leading-tight text-white mb-4">
                            Theme Pillars
                        </h2>

                        <div className="pointer-events-auto mt-6">
                            <Link
                                href="/about/theme"
                                className="group inline-flex items-center gap-2 px-6 py-2 rounded-full bg-vc-mint/5 border border-vc-mint/20 text-vc-mint text-[10px] font-black uppercase tracking-[0.3em] hover:bg-vc-mint/20 hover:border-vc-mint/40 transition-all duration-300"
                            >
                                <span>Detailed Guidelines</span>
                                <ArrowRight className="w-3.2 h-3.2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* XL+: Scroll Deck */}
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins hidden xl:block">
                        Scroll to explore strategic themes
                    </p>

                    {/* LG: Grid View - No instruction needed or static text */}
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins hidden lg:block xl:hidden">
                        The core strategic pillars of our mission
                    </p>

                    {/* MD: Horizontal Scroll */}
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins hidden md:block lg:hidden">
                        Swipe to explore strategic themes
                    </p>

                    {/* SM: Mobile Stack */}
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins md:hidden">
                        Tap card to cycle
                    </p>
                </div>

                {/* Desktop: Card Deck Animation (XL and up) */}
                <div className="hidden xl:flex relative w-full max-w-7xl h-[500px] items-center justify-center preserve-3d">
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

                {/* iPad Pro / Small Laptop: 2x2 Grid (LG to XL) - 1024px+ */}
                <div className="hidden lg:grid xl:hidden relative w-full grid-cols-2 gap-6 mt-8 px-8 max-w-4xl mx-auto">
                    {pillars.map((pillar) => (
                        <div
                            key={pillar.id}
                            className="w-full relative rounded-3xl p-6 flex flex-col justify-start gap-4 shadow-2xl border backdrop-blur-xl bg-[#004b44]/90 border-white/10"
                            style={{
                                borderColor: `${pillar.color}44`,
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <pillar.icon style={{ color: pillar.color }} size={20} />
                                </div>
                                <h3 className="text-lg font-black text-white leading-tight uppercase font-poppins tracking-tighter">{pillar.title}</h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                {pillar.points.map((point: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-xs text-white/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-vc-mint" />
                                        {point}
                                    </div>
                                ))}
                            </div>


                        </div>
                    ))}
                </div>

                {/* Tablet: Horizontal Scroll (MD to LG) - iPADS ONLY */}
                <div className="hidden md:flex lg:hidden relative w-full flex items-center justify-center mt-8 px-8">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 w-full pb-8 no-scrollbar">
                        {pillars.map((pillar) => (
                            <div
                                key={pillar.id}
                                className="snap-center shrink-0 w-[40vw] min-w-[320px] max-w-[400px] relative rounded-3xl p-8 flex flex-col justify-start gap-6 shadow-2xl border backdrop-blur-xl bg-[#004b44]/90 border-white/10"
                                style={{
                                    borderColor: `${pillar.color}44`,
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                        <pillar.icon style={{ color: pillar.color }} size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-white leading-tight uppercase font-poppins tracking-tighter">{pillar.title}</h3>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {pillar.points.map((point: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                                            <div className="w-1.5 h-1.5 rounded-full bg-vc-mint" />
                                            {point}
                                        </div>
                                    ))}
                                </div>


                            </div>
                        ))}
                        {/* Spacer for right padding */}
                        <div className="w-4 shrink-0" />
                    </div>
                </div>

                {/* Phone: Vertical Mobile Stack (Hidden on MD+) - PHONES ONLY */}
                <div className="md:hidden relative w-full h-[450px] flex items-center justify-center mt-12">
                    <MobileStack pillars={pillars} />
                </div>
            </div>
        </section>
    );
}
