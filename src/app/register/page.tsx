'use client';

import Navbar from '@/components/Navbar';

export default function Register() {
    return (
        <>
            <Navbar />

            <main className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0A1F1F] via-[#0A1F1F] to-[#1a4d4d]">
                <div className="w-full max-w-4xl mx-auto px-6 text-center">

                    {/* Icon/Visual Element */}
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#39cc89]/20 flex items-center justify-center border-2 border-[#39cc89]/40 animate-pulse">
                            <svg className="w-10 h-10 text-[#39cc89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Registration Opens Soon
                    </h1>

                    {/* Date Highlight */}
                    <div className="mb-8 animate-fade-in-up delay-100 flex justify-center">
                        <div className="inline-block px-8 py-4 rounded-2xl bg-[#39cc89]/10 border border-[#39cc89]/30 backdrop-blur-sm">
                            <p className="text-[#39cc89] text-2xl md:text-4xl font-bold tracking-wide">
                                February 1, 2026
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex justify-center w-full mb-10">
                        <p className="text-[#9CA3AF] text-lg md:text-xl leading-relaxed max-w-2xl text-center animate-fade-in-up delay-200">
                            Get ready to join the <span className="text-[#39cc89] font-semibold">KFUPM VentureCraft Challenge</span> – an international deep-tech startup competition.
                            Registration opens soon!
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex items-center justify-center gap-3 animate-fade-in-up delay-300">
                        <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
                        <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
                        <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
                    </div>

                </div>

                {/* Background Accent */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[#39cc89]/5 blur-3xl" />
                    <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-[#39cc89]/5 blur-3xl" />
                </div>
            </main>
        </>
    );
}
