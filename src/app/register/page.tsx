'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Register() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setLoading(false);
            } else {
                setLoading(false);
                router.push('/signin?redirect=/register');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[#0A1F1F]">
                <div className="w-12 h-12 border-4 border-[#39cc89]/30 border-t-[#39cc89] rounded-full animate-spin"></div>
            </main>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // Authenticated View: "Registration Opens Soon"
    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0A1F1F] via-[#0A1F1F] to-[#1a4d4d]">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f2873]/5 via-transparent to-[#39cc89]/5 pointer-events-none"></div>

            <Link href="/" className="absolute top-8 left-8 text-white/80 hover:text-[#39cc89] flex items-center gap-2 transition-colors z-20 group">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>Go Back</span>
            </Link>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="inline-block p-4 rounded-full bg-[#39cc89]/10 mb-4 border border-[#39cc89]/20">
                        <svg className="w-12 h-12 text-[#39cc89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Registration Opens <span className="text-white">Soon</span>
                    </h1>

                    <h2 className="text-2xl md:text-3xl font-medium text-[#39cc89] mt-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        February 1st, 2026
                    </h2>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mt-6">
                        Get ready to join the <span className="text-[#39cc89] font-medium">KFUPM VentureCraft Challenge</span> – an international deep-tech startup competition. Registration opens soon!
                    </p>

                    <div className="pt-8">
                        <Link href="/" className="btn-primary inline-flex items-center px-8 py-4 text-lg">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
