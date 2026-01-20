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
            <div className="relative group max-w-4xl w-full">
              
              {/* Animated gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39cc89] to-[#2d8b6e] rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

              {/* Main card container */}
              <div 
                className="relative bg-[#0D2B2B]/50 backdrop-blur-sm border border-[#39cc89]/20 rounded-2xl hover:border-[#39cc89]/40 transition-all duration-300 flex justify-center items-center"
                style={{ padding: '20px 40px' }}
              >
                {/* Mission text container */}
                <div className="w-full max-w-3xl">
                  <blockquote className="space-y-4 md:space-y-6">
                    <p className="text-[#9CA3AF] group-hover:text-white fluid-body-lg font-medium leading-normal tracking-wide text-center transition-colors duration-300 font-poppins">
                        Our mission is to{' '}
                        <span className="text-[#39cc89] font-semibold relative inline-block group/word">
                          inspire
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39cc89]/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                        </span>{' '}
                        and{' '}
                        <span className="text-[#39cc89] font-semibold relative inline-block group/word">
                          empower
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#39cc89]/40 transform origin-left scale-x-0 group-hover/word:scale-x-100 transition-transform duration-300" />
                        </span>{' '}
                        emerging founders to reimagine how energy and operate -{' '}
                        <span className="font-semibold">
                          making sustainability a driver of{' '}
                          <span className="relative inline-block whitespace-nowrap">
                            <span className="gradient-text font-bold">innovation</span>
                            <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-[#0f2873] via-[#2d8b6e] to-[#39cc89] rounded-full" />
                          </span>
                          , not a constraint
                        </span>.
                    </p>
                  </blockquote>
                </div>
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