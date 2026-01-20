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
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

                                    {/* Main card */}
                                    <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl hover:border-[#39cc89]/40 transition-all duration-300 px-6 py-12 md:p-16 lg:p-20 min-h-[240px] md:min-h-[260px] flex items-center">
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
                                                        className="text-[#9CA3AF] group-hover:text-white text-xl md:text-2xl lg:text-3xl font-medium leading-normal tracking-wide text-left transition-colors duration-300"
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
                                                        <span className="font-semibold">
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

                            <div className="h-32" />



                        </div>
                    </div>


                </section>

                {/* Objectives Section */}
                <section className="relative pt-20 lg:pt-32 pb-48 lg:pb-64">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-7xl mx-auto">
                            {/* Section Header */}
                            <div className="mb-16 text-center flex flex-col items-center gap-6">
                                <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                                    style={{ fontFamily: 'var(--font-poppins)' }}>
                                    Objectives
                                </h2>
                                <div className="h-1 w-full max-w-md bg-gradient-to-r from-transparent via-[#39cc89] to-transparent rounded-full" />
                            </div>

                            {/* Spacer */}
                            <div className="h-12" />

                            {/* Objectives Grid */}
                            <div className="flex flex-col gap-4 md:hidden">
                                {/* Mobile: All 5 objectives in single column with equal spacing */}
                                {[1, 2, 3, 4, 5].map((num) => {
                                    const objectives = [
                                        "Position KFUPM & DTV as a Global Deep-Tech Hub",
                                        "Attract and Nurture Early-Stage Talent",
                                        "Bridge Academia and Industry",
                                        "Foster a Global Startup Pipeline",
                                        "Enable Measurable Global Impact"
                                    ];
                                    return (
                                        <div key={num} className="group relative">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                            <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-5 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className="relative w-10 h-10">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                            <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#39cc89]">{num}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>{objectives[num - 1]}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tablet and Desktop: Grid layout */}
                            <div className="hidden md:flex md:flex-col md:gap-6">
                                {/* First 4 objectives - 2x2 on tablet, 3+1 on desktop */}
                                <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                                    {/* Objective 1 */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                        <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-8 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="relative w-12 h-12">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                        <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#39cc89]">1</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>Position KFUPM & DTV as a Global Deep-Tech Hub</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Objective 2 */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                        <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-8 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="relative w-12 h-12">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                        <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#39cc89]">2</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>Attract and Nurture Early-Stage Talent</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Objective 3 */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                        <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-8 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="relative w-12 h-12">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                        <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#39cc89]">3</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>Bridge Academia and Industry</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Objective 4 */}
                                    <div className="group relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                        <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-8 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="relative w-12 h-12">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                        <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#39cc89]">4</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>Foster a Global Startup Pipeline</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Objective 5 - Centered below on tablet, normal flow on desktop */}
                                <div className="flex justify-center">
                                    <div className="group relative w-full md:max-w-md xl:max-w-md">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
                                        <div className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl p-8 hover:border-[#39cc89]/40 transition-all duration-300 h-full">
                                            <div className="flex items-start gap-5">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="relative w-12 h-12">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
                                                        <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
                                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#39cc89]">5</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300" style={{ fontFamily: 'var(--font-poppins)' }}>Enable Measurable Global Impact</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Spacer between Objectives and Footer */}
                <div style={{ height: '12rem' }} className="w-full" />

                {/* More sections can be added here */}

            </main>

            <Footer />
        </>
    );
}
