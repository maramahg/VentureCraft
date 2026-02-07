'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Info, UserPlus } from 'lucide-react';

interface CallToActionProps {
    showOnlyRegister?: boolean;
    title?: string;
    description?: string;
    registerHref?: string;
    onRegisterClick?: (e: React.MouseEvent) => void;
}

export default function CallToAction({
    showOnlyRegister = false,
    title = "Want to register?",
    description = "Take the first step towards transforming your deep-tech idea into a global solution.",
    registerHref = "/apply",
    onRegisterClick
}: CallToActionProps) {
    return (
        <section className="relative z-30 pt-12 pb-24 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className={`grid grid-cols-1 ${showOnlyRegister ? 'max-w-2xl' : 'md:grid-cols-2 max-w-5xl'} gap-8 mx-auto`}>

                    {/* Learn More Card */}
                    {!showOnlyRegister && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative group h-full overflow-hidden rounded-3xl border border-white/10 bg-[#003330] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-vc-mint/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="w-16 h-16 rounded-2xl bg-vc-mint/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Info className="w-8 h-8 text-vc-mint" />
                            </div>

                            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 font-poppins text-balance">
                                Want to learn more?
                            </h3>
                            <p className="text-white/70 mb-8 font-poppins text-lg text-balance">
                                Discover our mission, vision, and the impact we aim to create in the deep-tech ecosystem.
                            </p>

                            <Link
                                href="/about/venture-craft"
                                className="mt-auto relative z-40 inline-flex items-center gap-2 px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 group/btn border border-white/10"
                            >
                                Learn More
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    )}

                    {/* Register Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group h-full overflow-hidden rounded-3xl border border-vc-teal/30 bg-[#003330] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-vc-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="w-16 h-16 rounded-2xl bg-vc-teal/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                            <UserPlus className="w-8 h-8 text-vc-teal" />
                        </div>

                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 font-poppins text-balance">
                            {title}
                        </h3>
                        <p className="text-white/70 mb-8 font-poppins text-lg text-balance">
                            {description}
                        </p>

                        <Link
                            href={registerHref}
                            onClick={onRegisterClick}
                            className="mt-auto relative z-40 inline-flex items-center gap-2 px-10 py-4 bg-vc-teal text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-vc-teal/30 group/btn"
                        >
                            Register Now
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
