'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const pillars = [
    {
        id: 1,
        title: "Mission",
        content: "Our mission is to inspire and empower emerging founders to reimagine how energy and industry operate — making sustainability a driver of innovation, not a constraint."
    },
    {
        id: 2,
        title: "Theme",
        content: "The theme is intentionally broad enough to welcome early-stage startups across disciplines such as AI, hardware, clean tech, yet structured enough to maintain focus."
    },
    {
        id: 3,
        title: "Goal",
        content: "This competition centers on entrepreneurship that accelerates sustainability and efficiency across the energy and industrial sectors — from digital tools to physical technologies."
    },
];

export default function ThreePillarRow() {
    const [activeId, setActiveId] = useState(2);

    return (
        <section className="relative z-20 py-10 md:py-20">
            <div className="w-full max-w-6xl mx-auto px-4">
                {/* Container: Stacks on mobile, Row on desktop */}
                <div className="flex flex-col md:flex-row gap-4 h-[500px] md:h-[300px]">

                    {pillars.map((pillar) => {
                        const isActive = activeId === pillar.id;

                        return (
                            <motion.div
                                key={pillar.id}
                                onClick={() => setActiveId(pillar.id)}
                                layout
                                className={`
                  relative cursor-pointer overflow-hidden rounded-2xl border 
                  flex flex-col justify-start p-6 md:p-8
                  glass-card
                  ${isActive
                                        // Active styles
                                        ? 'flex-[3] border-vc-teal/50 shadow-[0_0_30px_rgba(0,163,131,0.2)]'
                                        // Inactive styles
                                        : 'flex-[1] border-white/5 hover:border-vc-mint/30 hover:bg-white/5'
                                    }
                `}
                                style={{
                                    // Subtle background gradient for active state
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(0, 163, 131, 0.15) 0%, rgba(0, 32, 29, 0.6) 100%)'
                                        : 'rgba(255, 255, 255, 0.02)'
                                }}
                                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                            >
                                {/* Header Section */}
                                <motion.div layout="position" className="mb-4 text-center relative z-10 w-full">
                                    {/* Decorative line */}
                                    <motion.div
                                        layout
                                        className={`h-1 mx-auto mb-4 rounded-full transition-colors duration-500
                        ${isActive ? 'w-16 bg-vc-mint' : 'w-8 bg-white/20 group-hover:bg-vc-mint/50'}
                    `}
                                    />
                                    <motion.h2
                                        layout="position"
                                        className={`text-xl font-bold transition-colors duration-300 font-poppins
                        ${isActive ? 'text-white' : 'text-white/40 group-hover:text-vc-mint'}
                    `}
                                    >
                                        {pillar.title}
                                    </motion.h2>
                                </motion.div>

                                {/* Content Section */}
                                <div className="relative w-full flex-1 overflow-hidden">
                                    <AnimatePresence mode='wait'>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.4, delay: 0.2 }}
                                                className="absolute inset-x-0 top-0 flex items-center justify-center p-2"
                                            >
                                                <p className="text-center leading-relaxed text-white/60 text-base md:text-lg max-w-2xl font-poppins">
                                                    {pillar.content}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                            </motion.div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}
