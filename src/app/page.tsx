"use client";

import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Hero from "@/components/sections/Hero";
import Role from "@/components/sections/Role";
import Benefits from "@/components/sections/Benefits";
import Vision from "@/components/sections/Vision";
import CallToAction from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D2B2B] overflow-x-hidden text-white selection:bg-vc-mint selection:text-[#0D2B2B]">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10 flex flex-col gap-0">
        <Hero />
        <Role />
        <Benefits />
        <Vision />
        <CallToAction />
      </div>
    </main>
  );
}
