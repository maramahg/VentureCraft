'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function AmbassadorsPage() {
    return (
        <main className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden bg-[#001311]">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            {/* Go Back Arrow */}
            <Link
                href="/"
                className="absolute top-40 left-20 p-3 rounded-full glass-panel hover:bg-white/10 transition-all duration-300 group z-50 focus:outline-none focus:ring-2 focus:ring-vc-mint/50 flex items-center gap-2"
            >
                <ArrowLeft className="w-5 h-5 text-vc-mint group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-medium pr-2 text-vc-mint/80 group-hover:text-vc-mint transition-colors">Go Back</span>
            </Link>

            {/* Main Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 flex justify-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/20 flex items-center justify-center border border-vc-mint/30 shadow-[0_0_30px_rgba(79,209,197,0.2)]">
                        <Users className="w-10 h-10 text-vc-mint" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold mb-6 font-poppins tracking-tighter text-white"
                >
                    Ambassadors Program <br /> <span className="text-vc-mint">Coming Soon</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Join the Venture Craft elite as a brand ambassador. Help us spread innovation and empower the next generation of tech leaders.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="glass-panel px-8 py-4 rounded-2xl border border-vc-mint/20 bg-white/5 backdrop-blur-xl inline-flex items-center gap-3"
                >
                    <span className="w-2 h-2 rounded-full bg-vc-mint animate-ping" />
                    <p className="text-lg font-medium text-white tracking-wide italic">More coming soon!</p>
                </motion.div>

                {/* Decorative Grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
                </div>
            </div>
        </main>
    );
}
