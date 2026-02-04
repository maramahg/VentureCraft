"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function CallToAction() {
  return (
    <section id="cta" className="py-32 px-6 text-center relative z-10">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal width="100%">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
            If you are a motivated university student with an interest in startups, technology, and sustainability, we invite you to join the Venture Craft Ambassadors Program.
          </p>
        </ScrollReveal>
        
        <ScrollReveal width="100%" delay={0.2}>
          <button className="group px-12 py-6 bg-transparent border-2 border-vc-mint text-vc-mint font-bold text-xl rounded-full transition-all hover:bg-vc-mint hover:text-[#0D2B2B] hover:shadow-[0_0_40px_rgba(57,204,137,0.3)]">
            Join the Movement
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
