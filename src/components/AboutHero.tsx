import React from 'react';
import { ScrollReveal } from './ScrollReveal';

const prizes = [
  { place: '1st', amount: '100K' },
  { place: '2nd', amount: '50K' },
  { place: '3rd', amount: '30K' }
];

const AboutHero = () => (
  <ScrollReveal>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-pad-lg">
      <div className="container mx-auto px-6 relative z-10">
        <div className="w-full mx-auto text-center space-y-6">
          <h1 className="fluid-display font-bold text-white mb-6 tracking-tight text-center mx-auto font-poppins">
            About <span className="gradient-text inline">Venture Craft</span>
          </h1>
          <p className="text-[#9CA3AF] fluid-body-lg leading-relaxed font-poppins mb-12">
            Build Your Venture
          </p>

          {/* Prize Card */}
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center items-center w-full mt-12">
              <div className="relative group max-w-4xl w-full">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

                {/* Main card container */}
                <div
                  className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl hover:border-[#39cc89]/40 transition-all duration-300"
                  style={{ padding: '20px 40px' }}
                >
                  {/* Prize columns */}
                  <div className="grid grid-cols-3 gap-4 md:gap-8">
                    {prizes.map((prize, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-[#39cc89] font-bold text-2xl md:text-3xl lg:text-4xl mb-2 font-poppins">
                          {prize.amount}
                        </div>
                        <div className="text-[#9CA3AF] group-hover:text-white text-sm md:text-base font-medium transition-colors duration-300 font-poppins">
                          {prize.place} Place
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  </ScrollReveal>
);

export default AboutHero;
