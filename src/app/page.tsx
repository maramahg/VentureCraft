'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative z-20 bg-[#0A1F1F] min-h-screen shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1F1F]">
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

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 animate-fade-in-up delay-100 tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
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
                <a href="#overview" className="btn-secondary text-lg px-8 py-4">
                  Learn More
                </a>
              </div>


            </div>
          </div>


          {/* Partner Logos Strip */}
          <div className="absolute bottom-8 left-0 right-0 w-full px-4">
            <div className="flex justify-center items-center gap-4 md:gap-8 animate-fade-in-up delay-700 max-w-7xl mx-auto">
              {/* DTV Logo */}
              <div className="relative h-20 w-auto aspect-[3/1] opacity-90 hover:opacity-100 transition-opacity">
                <Image
                  src="/images/dtv-logo-v2.png"
                  alt="Dhahran Techno Valley"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* KFUPM Logo */}
              <div className="relative h-16 w-auto aspect-[3/1] opacity-90 hover:opacity-100 transition-opacity pl-8">
                <Image
                  src="/images/kfupm-logo-v2.png"
                  alt="KFUPM"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>

        </section>

        {/* About Section - Overview Only */}
        <section id="overview" className="min-h-[80vh] flex items-center bg-[#0D2B2B] py-24 scroll-mt-[15vh]">
          <div className="container mx-auto px-6 flex justify-center">
            <div className="max-w-3xl w-full">
              <h2
                className="text-3xl md:text-5xl font-bold text-white tracking-wide text-left"
                style={{ marginBottom: '50px' }}
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
          </div>
        </section>

      </main >

      {/* Spacer for Footer Reveal */}
      < div className="relative z-0 h-[250px] w-full" />

      <Footer />
    </>
  );
}
