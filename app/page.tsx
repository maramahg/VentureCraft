'use client';

import Hero from "../components/Hero";
import ThemePillars from "../components/ThemePillars";
import Background3D from "../components/Background3D";
import Benefits from "../components/Benefits";
import Timeline from "../components/Timeline";
import Prizes from "../components/Prizes";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col">
      {/* 3D Innovation Lab Background - Fixed behind everything */}
      <Background3D />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <Hero />
        <Benefits />
        <ThemePillars />
        <Timeline />
        <Prizes />
        
        {/* Simple Footer */}
        <footer className="py-12 mt-20 text-center text-white/40 border-t border-white/5 backdrop-blur-sm bg-black/20">
          <p>© 2026 VentureCraft. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
