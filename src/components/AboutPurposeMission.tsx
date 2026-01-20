import React from 'react';
import { ScrollReveal } from './ScrollReveal';

const AboutPurposeMission = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center section-pad">
    <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center">

        {/* 1. Header Animation */}
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-[#39cc89]" />
              <h2 className="text-[#39cc89] text-xs md:text-sm lg:text-base font-semibold tracking-[0.3em] uppercase">
                Our North Star
              </h2>
              <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-[#39cc89]" />
            </div>
            <h3 className="fluid-h2 font-bold text-white tracking-tight font-poppins">
              Purpose <span className="text-white/40">&</span> Mission
            </h3>
          </div>
        </ScrollReveal>

        <div className="spacer-md" />

        {/* 2. Mission Card Animation (with delay) */}
        <ScrollReveal delay={0.2}>
          <div className="flex justify-center items-center w-full">
            {/* Main card container */}
            <div
              className="glass-card p-10 md:p-14 rounded-3xl border border-white/5 hover:border-vc-teal/50 hover:shadow-[0_0_50px_rgba(0,163,131,0.15)] transition-all duration-300 w-full max-w-5xl mx-auto backdrop-blur-xl"
            >
              {/* Mission text container */}
              <div className="w-full mx-auto">
                <blockquote className="space-y-4 md:space-y-6">
                  <p className="text-[#9CA3AF] group-hover:text-white fluid-body-lg font-medium leading-normal tracking-wide text-center transition-colors duration-300 font-poppins">
                    Our mission is to{' '}
                    <span className="text-vc-mint font-semibold relative inline-block group/word">
                      inspire
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vc-mint/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                    </span>{' '}
                    and{' '}
                    <span className="text-vc-mint font-semibold relative inline-block group/word">
                      empower
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-vc-mint/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                    </span>{' '}
                    emerging founders to reimagine how energy and operate -{' '}
                    <span className="font-semibold">
                      making sustainability a driver of{' '}
                      <span className="relative inline-block whitespace-nowrap">
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-vc-teal to-vc-mint">innovation</span>
                        <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-vc-teal/50 to-vc-mint/50 rounded-full" />
                      </span>
                      , not a constraint
                    </span>.
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="h-32" />
      </div>
    </div>
  </section>
);

export default AboutPurposeMission;