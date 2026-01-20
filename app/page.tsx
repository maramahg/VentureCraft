'use client';

import ThemePillars from "../components/ThemePillars";
import { HeroScrollDemo } from "../components/HeroScrollDemo";
import ThreePillarRow from "@/src/components/ThreePillarRow";
import Benefits from "../components/Benefits";
import Timeline from "../components/Timeline";
import Prizes from "../components/Prizes";
import AboutObjectives from "@/src/components/AboutObjectives";
import AboutTargetAudience from "@/src/components/AboutTargetAudience";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <HeroScrollDemo />
        <ThreePillarRow />
        <AboutObjectives />
        <AboutTargetAudience />
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
