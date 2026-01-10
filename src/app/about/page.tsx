'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useEffect } from 'react';

export default function AboutPage() {
    const missionRef = useScrollAnimation(0.2);

    // Ensure page starts at top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />

            <main className="relative min-h-screen bg-gradient-to-b from-[#0A1F1F] to-[#000000]">
                {/* Hero Header */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1F1F] via-[#0D2B2B] to-transparent">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute left-[5%] top-[20%] w-64 h-64 rounded-full bg-[#39cc89]/5 blur-3xl animate-float-slow" />
                        <div className="absolute right-[10%] top-[40%] w-96 h-96 rounded-full bg-[#2d8b6e]/5 blur-3xl animate-float delay-300" />
                        <div className="absolute left-[20%] bottom-[10%] w-80 h-80 rounded-full bg-[#1e5a8e]/5 blur-3xl animate-float-fast delay-500" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="w-full mx-auto text-center space-y-6">
                            <h1
                                className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight text-center mx-auto"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                About <span className="gradient-text inline">Venture Craft</span>
                            </h1>
                            <p className="text-[#9CA3AF] text-lg md:text-xl leading-relaxed animate-fade-in-up delay-300">
                                Pioneering the future of sustainable innovation
                            </p>
                        </div>
                    </div>
                </section>

                {/* Purpose and Mission Section */}
                <section className="relative py-12 lg:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div
                            ref={missionRef.ref}
                            className={`max-w-6xl mx-auto scroll-fade-in ${missionRef.isVisible ? 'visible' : ''}`}
                        >
                            {/* Section Header */}
                            <div className="text-center mb-10 md:mb-16">
                                <div className="inline-flex items-center gap-3 mb-4">
                                    <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-[#39cc89]" />
                                    <h2 className="text-[#39cc89] text-xs md:text-sm lg:text-base font-semibold tracking-[0.3em] uppercase">
                                        Our North Star
                                    </h2>
                                    <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-[#39cc89]" />
                                </div>
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                    Purpose <span className="text-white/40">&</span> Mission
                                </h3>
                            </div>

                            <div className="h-4 md:h-8" />

                            {/* Mission Statement Card */}
                            <div className="flex justify-center w-full">
                                <div className="relative group max-w-4xl w-full">
                                    {/* Animated gradient border */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0f2873] via-[#2d8b6e] to-[#39cc89] rounded-3xl opacity-30 group-hover:opacity-50 blur transition duration-500 animate-gradient" />

                                    {/* Main card */}
                                    <div className="relative bg-gradient-to-br from-[#0D2B2B]/90 to-[#0A1F1F]/90 backdrop-blur-xl border border-[#39cc89]/20 rounded-2xl md:rounded-3xl px-6 py-12 md:p-16 lg:p-20 min-h-[240px] md:min-h-[260px] flex items-center">
                                        {/* Quote icon - Top Left - Hidden on Mobile */}
                                        <svg
                                            className="hidden md:block absolute top-6 left-6 md:top-8 md:left-8 w-6 h-6 md:w-8 md:h-8 text-[#39cc89]/30"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>

                                        {/* Mission text - centered container */}
                                        <div className="flex justify-center w-full">
                                            <div className="max-w-2xl w-[85%] md:w-full mx-auto md:px-0">
                                                <blockquote className="space-y-4 md:space-y-6">
                                                    <p
                                                        className="text-[#9CA3AF] text-xl md:text-2xl lg:text-3xl font-medium leading-normal tracking-wide text-left"
                                                        style={{ fontFamily: 'var(--font-poppins)' }}
                                                    >
                                                        Our mission is to{' '}
                                                        <span className="text-[#39cc89] font-semibold relative inline-block group/word">
                                                            inspire
                                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39cc89]/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                                                        </span>{' '}
                                                        and{' '}
                                                        <span className="text-[#39cc89] font-semibold relative inline-block group/word">
                                                            empower
                                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39cc89]/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                                                        </span>{' '}
                                                        emerging founders to reimagine how energy and operate -{' '}
                                                        <span className="text-[#9CA3AF] font-semibold">
                                                            making sustainability a driver of{' '}
                                                            <span className="relative inline-block whitespace-nowrap">
                                                                <span className="gradient-text font-bold">innovation</span>
                                                                <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-[#0f2873] via-[#2d8b6e] to-[#39cc89] rounded-full" />
                                                            </span>
                                                            , not a constraint
                                                        </span>.
                                                    </p>
                                                </blockquote>
                                            </div>
                                        </div>

                                        {/* Quote icon - Bottom Right - Hidden on Mobile */}
                                        <svg
                                            className="hidden md:block absolute bottom-6 right-6 md:bottom-8 md:right-8 w-6 h-6 md:w-8 md:h-8 text-[#39cc89]/30 transform rotate-180"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="h-24" />



                        </div>
                    </div>


                </section>

                {/* More sections can be added here */}

            </main>

            <Footer />
        </>
    );
}
