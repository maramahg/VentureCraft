'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorldMap from '@/components/WorldMap';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Home() {
  // Ensure page starts at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen">
        {/* Hero Section with gradient transition */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A1F1F] via-[#0A1F1F] to-[#1a4d4d]">
          {/* Geometric Background - CSS ONLY, NO IMAGES */}
          {/* Large angular shape left */}

          {/* Small accent shapes */}
          {/* Small accent shapes */}
          <div className="absolute right-[10%] top-[20%] w-20 h-20 rounded-full bg-[#39cc89]/10 animate-float" />
          <div className="absolute right-[25%] bottom-[30%] w-32 h-32 rounded-full bg-[#39cc89]/5 animate-float-slow delay-300" />
          <div className="absolute left-[40%] bottom-[10%] w-16 h-16 rounded-full bg-[#39cc89]/10 animate-float-fast delay-500" />
          <div className="absolute left-[15%] top-[15%] w-24 h-24 rounded-full bg-[#39cc89]/5 animate-float-slow delay-700" />
          <div className="absolute left-[5%] bottom-[40%] w-12 h-12 rounded-full bg-[#39cc89]/10 animate-float delay-200" />
          <div className="absolute right-[35%] top-[10%] w-14 h-14 rounded-full bg-[#39cc89]/5 animate-float-fast delay-100" />


          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center pt-20">

              {/* Main Title - Only element with hover animation */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-fade-in-up delay-100 tracking-tight transition-all duration-500 hover:text-[#39cc89] hover:scale-105 hover:drop-shadow-[0_0_30px_rgba(57,204,137,0.5)] cursor-default inline-block" style={{ fontFamily: 'var(--font-poppins)' }}>
                VENTURE CRAFT
              </h1>

              {/* Subtitle */}
              <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up delay-200">
                <span className="gradient-text text-2xl md:text-4xl font-bold">100K</span>
                <span className="text-white/80 text-2xl md:text-4xl font-light">COMPETITION</span>
              </div>

              {/* Description */}
              <p className="text-[#39cc89] text-lg md:text-xl font-medium tracking-widest mb-4 animate-fade-in-up delay-300">
                GLOBAL STARTUP COMPETITION
              </p>

              {/* Year */}
              <div className="flex items-center justify-center gap-3 mb-12 animate-fade-in-up delay-400">
                <span className="text-white/60 text-2xl md:text-3xl font-light tracking-[0.3em]">2 0 2 6</span>
              </div>

              {/* Dots indicator */}
              <div className="flex items-center justify-center gap-2 mb-12 animate-fade-in-up delay-400">
                <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
                <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
                <div className="w-2 h-2 rounded-full bg-[#39cc89]" />
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-500"
                style={{ marginTop: '80px' }}
              >
                <Link href="/register" className="btn-primary text-lg px-8 py-4">
                  Apply Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a href="#overview" className="btn-secondary text-lg">
                  Learn More
                </a>
              </div>


            </div>
          </div>






        </section >

        {/* About Section - Overview with World Map */}
        <section id="overview" className="min-h-[80vh] flex items-center bg-[#1a4d4d] py-12 lg:py-24 scroll-mt-[15vh]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

              {/* Left: Text Content */}
              <div className="space-y-8">
                <h2
                  className="text-3xl md:text-5xl font-bold tracking-wide text-left cursor-default inline-block gradient-text-hover"
                  style={{
                    marginBottom: '30px'
                  }}
                >
                  OVERVIEW
                </h2>
                <div className="space-y-6 text-[#9CA3AF] text-lg leading-relaxed text-left">
                  <p>
                    The KFUPM <span className="text-[#39cc89] font-semibold">VentureCraft Challenge</span> is an international deep-tech startup competition by King Fahad University of Petroleum & Minerals in collaboration with Dhahran Techno Valley (DTV).
                  </p>
                  <p>
                    It supports student-led startups developing science- and technology-based solutions with <span className="text-[#39cc89] font-semibold">global impact</span>.
                  </p>
                  <p>
                    Each year, it focuses on a theme aligned with <span className="text-[#39cc89] font-semibold">Saudi Arabia&apos;s innovation priorities</span> and global challenges, positioning KFUPM and DTV as a global hub for engineering innovation and technology transfer.
                  </p>
                </div>
              </div>

              {/* Right: World Map - Desktop Only */}
              <div className="hidden lg:block relative h-[500px] rounded-2xl bg-[#0A1F1F]/40 border border-[#39cc89]/20 p-4 backdrop-blur-sm">
                <WorldMap />
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
