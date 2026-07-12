'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Recycle, Battery, Cpu, ChevronRight, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const pillars = [
    {
        id: '01',
        title: 'Decarbonization',
        icon: Leaf,
        color: '#00A383',
        points: ['Carbon Capture', 'Net-Zero Emissions', 'Hydrogen Tech', 'Renewable Energy'],
    },
    {
        id: '02',
        title: 'Circular Economy',
        icon: Recycle,
        color: '#4FD1C5',
        points: ['Waste Reduction', 'Material Recycling', 'Resource Efficiency', 'Sustainable Lifecycle'],
    },
    {
        id: '03',
        title: 'Energy Efficiency',
        icon: Battery,
        color: '#34D399',
        points: ['Industrial Optimization', 'Smart Grids', 'Power Management', 'Thermal Recovery'],
    },
    {
        id: '04',
        title: 'Process Optimization',
        icon: Cpu,
        color: '#2DD4BF',
        points: ['Advanced Engineering', 'Digital Twins', 'AI-Driven Industry', 'Automation'],
    },
];

export default function AnnualTheme() {
    const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

    const activePillar = pillars.find(p => p.id === selectedPillar);

    return (
        <section className="relative z-10 py-24 overflow-hidden text-center justify-center flex flex-col items-center">
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
                <div className="max-w-5xl mx-auto w-full">
                    <div className="flex flex-col items-center text-center space-y-8">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <span className="text-vc-mint font-bold tracking-[0.3em] uppercase text-sm md:text-base">
                                Competition Theme
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                2026 <span className="text-vc-mint">Theme</span>
                            </h2>
                        </motion.div>

                        {/* Theme Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="w-full glass-panel p-8 md:p-16 relative group overflow-hidden"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-vc-mint/5 rounded-full blur-3xl group-hover:bg-vc-mint/10 transition-colors" />

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
                                        Sustainable <br className="md:hidden" />
                                        <span className="text-vc-mint">Energy</span>
                                    </h3>

                                    <div className="h-px w-24 bg-vc-mint/30 mx-auto" />

                                    <p className="text-white/60 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                                        Each year, Venture Craft unites the world’s most ambitious founders under a <span className="text-white font-medium">singular global challenge</span>. This year, we focus on the frontier of <span className="text-vc-mint font-medium italic">Sustainable Energy</span>, accelerating deep-tech solutions that power the future responsibly.
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-vc-mint/10" />

                                {/* Interactive Pillars Container */}
                                <div className="space-y-8">
                                    {/* Pillars Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                        {pillars.map((pillar) => (
                                            <button
                                                key={pillar.id}
                                                onClick={() => setSelectedPillar(selectedPillar === pillar.id ? null : pillar.id)}
                                                className={`p-4 rounded-2xl flex flex-col items-center text-center space-y-3 transition-all duration-300 border ${selectedPillar === pillar.id
                                                    ? 'bg-vc-mint/10 border-vc-mint/40 shadow-[0_0_20px_rgba(45,212,191,0.1)]'
                                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${selectedPillar === pillar.id ? 'bg-vc-mint/20' : 'bg-white/5'
                                                    }`}>
                                                    <pillar.icon style={{ color: pillar.color }} size={20} />
                                                </div>
                                                <h4 className={`font-bold uppercase tracking-wider text-[10px] md:text-xs transition-colors ${selectedPillar === pillar.id ? 'text-vc-mint' : 'text-white/60'
                                                    }`}>
                                                    {pillar.title}
                                                </h4>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Details Area */}
                                    <AnimatePresence mode="wait">
                                        {activePillar ? (
                                            <motion.div
                                                key={activePillar.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-vc-mint/5 rounded-2xl p-6 md:p-8 border border-vc-mint/20 relative group text-left max-w-2xl mx-auto"
                                            >
                                                <button
                                                    onClick={() => setSelectedPillar(null)}
                                                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>

                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-12 h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center">
                                                        <activePillar.icon style={{ color: activePillar.color }} size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-vc-mint text-xs font-bold uppercase tracking-[0.2em]">Theme Focus</h4>
                                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{activePillar.title}</h3>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {activePillar.points.map((point, i) => (
                                                        <div key={i} className="flex items-center gap-3 text-white/70 group/item">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-vc-mint group-hover/item:scale-125 transition-transform" />
                                                            <span className="text-sm md:text-base font-medium">{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-white/40 text-sm italic"
                                            >
                                                Click a pillar to explore strategic focus areas
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Learn More Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="pt-8"
                                    >
                                        <Link
                                            href="/about/theme"
                                            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-vc-mint text-vc-green-dark hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(79,209,197,0.3)] shadow-vc-mint/20"
                                        >
                                            Explore 2026 Theme
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background highlights */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[500px] bg-vc-teal/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
