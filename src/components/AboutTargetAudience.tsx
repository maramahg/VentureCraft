import React from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

const targetAudience = [
  "Bachelor's, Master's, and PhD Students",
  "Post-doctoral researchers",
  "Recent graduates (up to 5 years post-graduation)"
];

// 1. Extract the Card UI
const AudienceCard = ({ text, index }: { text: string, index: number }) => (
  <div className="group relative h-full">
    {/* Background Glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
    
    {/* Card Content */}
    <div 
      className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl hover:border-[#39cc89]/40 transition-all duration-300 h-full" 
      style={{ padding: '18px' }}
    >
      <div className="flex items-center gap-4 md:gap-5">
        <div className="flex-shrink-0">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
            <div className="absolute inset-0 bg-gradient-to-br from-[#39cc89] to-[#2d8b6e] opacity-20 rotate-45 rounded-lg" />
            <div className="absolute inset-0 border-2 border-[#39cc89] rotate-45 rounded-lg" />
            <span className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-bold text-[#39cc89]">
              {index + 1}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="fluid-body-lg font-semibold text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors duration-300 font-poppins">
            {text}
          </h3>
        </div>
      </div>
    </div>
  </div>
);

const AboutTargetAudience = () => {
  return (
    <section className="relative section-pad-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <ScrollReveal>
            <div className="mb-16 text-center flex flex-col items-center gap-6">
              <h2 className="fluid-h2 font-bold text-white tracking-tight font-poppins">
                Target Audience
              </h2>
              <div className="h-1 w-full max-w-md bg-gradient-to-r from-transparent via-[#39cc89] to-transparent rounded-full" />
            </div>
          </ScrollReveal>

          {/* Spacer */}
          <div className="spacer-md" />

          {/* Target Audience Grid - Mobile Layout */}
          <div className="flex flex-col gap-4 md:hidden">
            {targetAudience.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <AudienceCard text={item} index={i} />
              </ScrollReveal>
            ))}
          </div>

          {/* Tablet and Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {targetAudience.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <AudienceCard text={item} index={i} />
              </ScrollReveal>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutTargetAudience;