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
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight">Theme</h2>
                    <p className="text-white/60 max-w-2xl mx-auto font-poppins">
                        This year, we unite under a singular and powerful competition theme: <span className="text-vc-mint font-extrabold uppercase tracking-widest ml-1">Sustainability</span>.
                    </p>
                </div>
                {/* Container: Stacks on mobile, Row on desktop */}
                <div className="flex flex-col md:flex-row gap-4 h-[580px] md:h-[350px]">

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
                  glass-card transition-all duration-300
                  ${isActive
                                        // Active styles
                                        ? 'flex-[5] md:flex-[3] border-vc-teal/50 shadow-[0_0_30px_rgba(0,163,131,0.2)]'
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
                                <motion.div layout="position" className="mb-6 text-center relative z-10 w-full shrink-0">
                                    {/* Decorative line */}
                                    <motion.div
                                        layout
                                        className={`h-1 mx-auto mb-4 rounded-full transition-colors duration-500
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
                                                <p className="text-center leading-relaxed text-white/70 text-base md:text-lg max-w-2xl font-poppins mx-auto">
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
