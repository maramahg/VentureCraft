'use client';

import ThemePillars from "../components/ThemePillars";
import { HeroScrollDemo } from "../components/HeroScrollDemo";
import ThreePillarRow from "@/src/components/ThreePillarRow";
import Timeline from "../components/Timeline";
import AboutObjectives from "@/src/components/AboutObjectives";
import AboutTargetAudience from "@/src/components/AboutTargetAudience";
import Footer from "../components/Footer";
import Prizes from "../components/Prizes";
import CallToAction from "../components/CallToAction";
import AnnualTheme from "../components/AnnualTheme";

import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";

export default function Home() {
  const { scrollY } = useScroll();
  // Darken significantly as we scroll past the first screen height (approx 800px)
  const bgOverlayOpacity = useTransform(scrollY, [0, 800], [0, 0.8]);

  return (
    <main className="min-h-screen relative flex flex-col overflow-x-hidden">
      {/* Dynamic Background Overlay for darkening on scroll */}
      <motion.div
        className="fixed inset-0 bg-[#001a18] pointer-events-none z-0"
        style={{ opacity: bgOverlayOpacity }}
      />

      {/* Decorative Pattern - Top Left (Fixed) */}
      <div className="fixed top-0 -left-20 md:-left-10 w-[200px] h-[400px] md:w-[300px] md:h-[600px] pointer-events-none z-0 opacity-[0.20] md:opacity-[0.35]">
        <Image
          src="/pattern-left-v2.png"
          alt=""
          width={300}
          height={620}
          className="object-contain w-full h-full"
          style={{ objectPosition: 'left top' }}
        />
      </div>

      {/* Decorative Pattern - Bottom Right (Fixed) */}
      <div className="fixed bottom-0 right-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px] overflow-hidden pointer-events-none z-0">
        <div className="relative w-full h-full opacity-[0.03] md:opacity-5">
          <div className="absolute bottom-0 right-0 translate-x-8 translate-y-8 md:translate-x-12 md:translate-y-12">
            <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-24 h-14 md:w-48 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-white" />
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-12 h-12 md:w-24 md:h-24 rounded-[0.75rem] md:rounded-[1.5rem] bg-vc-teal" />
            <div className="absolute bottom-20 right-2 md:bottom-40 md:right-4 w-10 h-8 md:w-20 md:h-14 rounded-[0.75rem] md:rounded-[1.5rem] bg-white/70" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">
        <HeroScrollDemo />
        <Prizes />
        <ThreePillarRow />
        <AnnualTheme />



        <Timeline />
        <CallToAction />

        <Footer />
      </div>
    </main>
  );
}
