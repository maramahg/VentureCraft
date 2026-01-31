'use client';

import { motion } from 'framer-motion';

export default function AnnualTheme() {
    return (
        <section className="relative z-10 py-24 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
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
                            className="w-full glass-panel p-8 md:p-16 relative group"
                        >
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-vc-mint/5 rounded-full blur-3xl group-hover:bg-vc-mint/10 transition-colors" />

                            <div className="relative z-10 space-y-6">
                                <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase">
                                    Sustainable <br className="md:hidden" />
                                    <span className="text-vc-mint">Energy</span>
                                </h3>

                                <div className="h-px w-24 bg-vc-mint/30 mx-auto" />

                                <p className="text-white/60 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                                    Each year, Venture Craft unites the world’s most ambitious founders under a <span className="text-white font-medium">singular global challenge</span>. This year, we focus on the frontier of <span className="text-vc-mint font-medium italic">Sustainable Energy</span>, accelerating deep-tech solutions that power the future responsibly.
                                </p>
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
