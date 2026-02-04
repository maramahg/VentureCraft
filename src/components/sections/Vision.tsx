"use client";

import ScrollReveal from "@/components/ScrollReveal";

export default function Vision() {
  return (
    <section id="vision" className="py-32 px-6 relative overflow-hidden z-10">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-vc-mint/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-vc-teal/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <ScrollReveal width="100%">
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-10 font-poppins leading-tight">
            "Partners, Not Just Promoters."
          </h2>
        </ScrollReveal>
        
        <ScrollReveal width="100%" delay={0.2}>
          <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light font-poppins italic opacity-90">
            Our vision is to build a diverse, global community of students united by ambition, innovation, and collaboration.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
