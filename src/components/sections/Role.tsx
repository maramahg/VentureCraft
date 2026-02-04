"use client";

import ScrollReveal from "@/components/ScrollReveal";
import GradientOrb from "@/components/GradientOrb";

export default function Role() {
  return (
    <section id="role" className="py-32 px-6 md:px-12 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 relative">
           <GradientOrb color="bg-vc-teal" size="w-96 h-96" opacity="opacity-20" className="-left-20 top-0" />
           <ScrollReveal direction="right">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white uppercase tracking-wider relative z-10">
                The Role
              </h2>
              <div className="w-32 h-2 bg-vc-mint mb-8" />
           </ScrollReveal>
        </div>
        
        <div className="flex-1">
          <ScrollReveal direction="left" delay={0.2}>
            <div className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                  Ambassadors play a key role in expanding the reach of the <strong className="text-vc-mint font-semibold">Venture Craft Challenge</strong> by raising awareness, encouraging participation, and representing the initiative across <strong className="text-vc-mint font-semibold">universities</strong> and <strong className="text-vc-mint font-semibold">student ecosystems</strong> worldwide.
                </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
