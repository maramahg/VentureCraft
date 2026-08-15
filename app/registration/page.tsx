'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AnnualTheme from '@/components/AnnualTheme';

export default function RegistrationPage() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Not signed in, redirect to sign in page
                router.push('/signin');
            } else {
                // Signed in
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
                    <p className="text-vc-mint/60 font-medium animate-pulse">Checking authentication...</p>
                </div>
            </main>
        );
    }


    return (
        <main className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden bg-[#001311]">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            {/* Go Back Arrow */}
            <Link
                href="/"
                className="absolute top-8 left-8 p-3 rounded-full glass-panel hover:bg-white/10 transition-all duration-300 group z-50 focus:outline-none focus:ring-2 focus:ring-vc-mint/50 flex items-center gap-2"
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
                        <Clock className="w-10 h-10 text-vc-mint" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-extrabold mb-6 font-poppins tracking-tighter text-white"
                >
                    Registration Opens Soon
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Get ready to join the <span className="text-vc-mint">KFUPM Venture Craft</span> Challenge – an international deep tech startup competition. Registration opens soon!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="glass-panel px-6 py-3 rounded-2xl border border-vc-mint/20 bg-white/5 backdrop-blur-xl inline-flex items-center mb-12"
                >
                    <p className="text-xl md:text-2xl font-bold text-white tracking-wide">Announcing Soon</p>
                </motion.div>

                <div className="mt-12 w-full max-w-4xl mx-auto px-4 relative z-20">
                    <AnnualTheme />
                </div>

                {/* Decorative Grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
                </div>
            </div>
        </main>
    );
}
