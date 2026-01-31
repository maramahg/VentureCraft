'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pillars = [
    {
        id: 1,
        title: "Mission",
        content: "VentureCraft exists to inspire, equip, and accelerate emerging founders to reimagine how technology and industry operate. We provide a competitive, mentor-driven journey that bridges academia with industry—supporting teams from idea submission to validation, prototyping, and pitching—while holding every venture to clear, credible, and measurable impact standards."
    },
    {
        id: 2,
        title: "What is Venture Craft?",
        content: "Venture Craft is an elite deep-tech startup competition that bridges the gap between scientific innovation and market-ready ventures. We provide founders with the mentorship, resources, and platform needed to scale high-impact solutions for the world's most pressing challenges."
    },
    {
        id: 3,
        title: "Vision",
        content: "To become a globally recognized deep-tech hub where student-led innovation transforms science and engineering into scalable ventures—delivering measurable and sustainable real-world impact."
    },
];

export default function ThreePillarRow() {
    const [activeId, setActiveId] = useState(2);
    const [isMobile, setIsMobile] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className="relative z-20 py-10 md:py-20">
            <div className="w-full max-w-6xl mx-auto px-4">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight">Our Identity</h2>
                    <p className="text-vc-mint font-bold max-w-2xl mx-auto font-poppins">
                        The core pillars that define our purpose, our focus, and our future impact.
                    </p>
                </div>
                {/* Container: Stacks on mobile, Row on desktop */}
                <motion.div
                    animate={{
                        height: isMounted && isMobile
                            ? (activeId === 1 ? 650 : activeId === 2 ? 560 : 480)
                            : 350
                    }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="flex flex-col md:flex-row gap-4 md:!h-[350px]"
                >

                    {pillars.map((pillar) => {
                        const isActive = activeId === pillar.id;

                        return (
                            <motion.div
                                key={pillar.id}
                                onClick={() => setActiveId(pillar.id)}
                                layout
                                className={`
                  relative cursor-pointer overflow-hidden rounded-2xl border 
                  flex flex-col justify-start p-5 sm:p-6 md:p-8
                  glass-card transition-all duration-300
                  ${isActive
                                        // Active styles
                                        ? 'flex-[6] md:flex-[3] border-vc-teal/50 shadow-[0_0_30px_rgba(0,163,131,0.2)]'
                                        // Inactive styles
                                        : 'flex-[1] border-white/5 hover:border-vc-mint/30 hover:bg-white/5'
                                    }
                `}
                                style={{
                                    background: isActive
                                        ? 'rgba(0, 75, 68, 0.95)'
                                        : 'rgba(0, 75, 68, 0.4)',
                                    borderColor: isActive
                                        ? 'rgba(79, 209, 197, 0.5)'
                                        : 'rgba(79, 209, 197, 0.15)'
                                }}
                                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                            >
                                {/* Header Section */}
                                <motion.div layout="position" className="mb-4 md:mb-6 text-center relative z-10 w-full shrink-0">
                                    {/* Decorative line */}
                                    <motion.div
                                        layout
                                        className={`h-1 mx-auto mb-3 md:mb-4 rounded-full transition-colors duration-500
                        ${isActive ? 'w-16 bg-vc-mint' : 'w-8 bg-white/20 group-hover:bg-vc-mint/50'}
                    `}
                                    />
                                    <motion.h2
                                        layout="position"
                                        className={`text-xl md:text-2xl font-bold transition-colors duration-300 font-poppins uppercase
                        ${isActive ? 'text-white' : 'text-white/40 group-hover:text-vc-mint'}
                    `}
                                    >
                                        {pillar.title}
                                    </motion.h2>
                                </motion.div>

                                {/* Content Section */}
                                <div className="relative w-full flex-1 md:overflow-hidden">
                                    <AnimatePresence mode='wait'>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.4, delay: 0.1 }}
                                                className="w-full"
                                            >
                                                <div className="text-center leading-relaxed text-white/70 text-base md:text-lg max-w-2xl font-poppins mx-auto">
                                                    {pillar.content}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute bottom-1 md:bottom-auto md:top-2 w-full text-center"
                                        >
                                            <p className="md:hidden text-white/30 text-[10px] uppercase tracking-widest font-bold">Tap to show</p>
                                            <p className="hidden md:block text-white/30 text-[10px] uppercase tracking-widest font-bold">Click to view</p>
                                        </motion.div>
                                    )}
                                </div>

                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section >
    );
}
