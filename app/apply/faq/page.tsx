'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StartupFAQ from '@/src/components/StartupFAQ';

export default function ApplyFAQPage() {
    return (
        <main className="min-h-screen bg-[#001311] selection:bg-vc-mint/30 selection:text-vc-mint relative overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[150px] pointer-events-none" />

            <Navbar />

            <div className="pt-32 pb-20 relative">
                <div className="container mx-auto px-4">

                    {/* Page Title & Icon */}
                    <div className="max-w-4xl mx-auto text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-4 rounded-2xl bg-vc-mint/10 border border-vc-mint/20 text-vc-mint mb-10"
                        >
                            <HelpCircle className="w-10 h-10" />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4"
                        >
                            VentureCraft <span className="text-vc-mint">FAQ</span>
                        </motion.h1>
                    </div>

                    <StartupFAQ />
                </div>
            </div>

            <Footer />
        </main>
    );
}
