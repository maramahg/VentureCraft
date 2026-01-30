'use client';

import { motion, useScroll, useTransform, useSpring, MotionValue, useTime, AnimatePresence } from 'framer-motion';
import { Leaf, Recycle, Battery, Cpu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

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
                        <h3 className="text-2xl font-extrabold uppercase leading-none text-white mb-2 font-poppins tracking-tight">
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
                            <h3 className="text-xl font-bold text-white leading-tight uppercase font-poppins">{pillar.title}</h3>
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
        <section ref={containerRef} className="relative xl:h-[110vh] z-10 overflow-visible py-8 md:py-32 xl:py-0">
            {/* 
            Height: Auto on Mobile/Tablet (with padding), 120vh on Desktop (for scroll animation).
            Spacing: Uniform py-16/24 on non-desktop to match other sections.
            */}

            <div className="relative xl:sticky xl:top-0 xl:h-screen flex flex-col items-center justify-start md:justify-center xl:perspective-1000" style={{ perspective: '1500px' }}>

                <div className="relative xl:absolute xl:top-24 text-center z-20 px-4 mt-0 md:mt-8 xl:mt-0 max-w-4xl mx-auto pointer-events-none">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-2 md:mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-2 md:pb-6 border-b border-vc-mint/20">
                        Strategic Themes
                    </h2>
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins hidden xl:block">Scroll to explore strategic themes</p>
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins hidden md:block xl:hidden">Swipe to explore strategic themes</p>
                    <p className="text-vc-mint text-lg md:text-xl font-semibold mb-0 md:mb-8 font-poppins md:hidden">Tap card to explore</p>
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
                                <h3 className="text-lg font-bold text-white leading-tight uppercase font-poppins">{pillar.title}</h3>
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
                                    <h3 className="text-xl font-bold text-white leading-tight uppercase font-poppins">{pillar.title}</h3>
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
                <div className="md:hidden relative w-full -mt-20 mb-20">
                    <MobileStack pillars={pillars} />
                </div>

            </div>
        </section>
    );
}
