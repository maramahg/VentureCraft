'use client';

import ThemePillars from "../components/ThemePillars";
import { HeroScrollDemo } from "../components/HeroScrollDemo";
import ThreePillarRow from "@/src/components/ThreePillarRow";
import Timeline from "../components/Timeline";
import AboutObjectives from "@/src/components/AboutObjectives";
import AboutTargetAudience from "@/src/components/AboutTargetAudience";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <HeroScrollDemo />
        <AboutObjectives />
        <AboutTargetAudience />
        <ThreePillarRow />
        <ThemePillars />
        <Timeline />

        <Footer />
      </div>
    </main>
  );
}
