'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, Handshake, Rocket, Target, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const objectives = [
  {
    icon: Globe,
    title: 'Global Hub',
    description: (
      <>
        Establish{" "}
        <a
          href="https://www.kfupm.edu.sa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-vc-mint font-bold underline underline-offset-4 decoration-vc-mint/30 hover:decoration-vc-mint transition-all duration-300 group"
        >
          KFUPM
          <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
        </a>{" "}
        &{" "}
        <a
          href="https://dtv.sa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-vc-mint font-bold underline underline-offset-4 decoration-vc-mint/30 hover:decoration-vc-mint transition-all duration-300 group"
        >
          DTV
          <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
        </a>{" "}
        as a leading Global Deep-Tech Hub.
      </>
    )
  },
  {
    icon: Sparkles,
    title: 'Talent',
    description: 'Attract and nurture high-potential early-stage talent.'
  },
  {
    icon: Handshake,
    title: 'Connection',
    description: 'Bridge the gap between academia and industry.'
  },
  {
    icon: Rocket,
    title: 'Pipeline',
    description: 'Foster a robust and sustainable global startup pipeline.'
  },
  {
    icon: Target,
    title: 'Impact',
    description: 'Enable measurable global impact through innovation.'
  }
];

export default function AboutObjectives() {
  const [currentStep, setCurrentStep] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextItem = () => {
    const nextStep = Math.min(currentStep + 1, objectives.length - itemsPerView);
    setCurrentStep(nextStep);
    if ((window as any).objectivesCarouselRef) {
      const el = (window as any).objectivesCarouselRef;
      const width = el.clientWidth;
      const itemWidth = width / itemsPerView;
      el.scrollTo({ left: nextStep * itemWidth, behavior: 'smooth' });
    }
  };

  const prevItem = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    if ((window as any).objectivesCarouselRef) {
      const el = (window as any).objectivesCarouselRef;
      const width = el.clientWidth;
      const itemWidth = width / itemsPerView;
      el.scrollTo({ left: prevStep * itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <section id="objectives" className="py-24 relative z-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20"
          >
            Objectives
          </motion.h2>
          <p className="text-vc-mint text-base md:text-lg font-bold mb-8 font-poppins uppercase tracking-[0.3em]">
            Empowering the next generation of deep-tech innovators
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative group/carousel px-4 md:px-12">
          {/* Navigation Buttons (Ambassadors Style) */}
          <div className="absolute inset-y-0 left-0 md:-left-6 flex items-center z-30 pointer-events-none hidden md:flex">
            <button
              onClick={prevItem}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center pointer-events-auto transition-all duration-500 hover:scale-110
                ${currentStep === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}
              `}
              style={{
                background: 'rgba(15, 115, 105, 0.4)',
                border: '1px solid rgba(79, 209, 197, 0.3)',
                color: '#4FD1C5'
              }}
              aria-label="Previous"
              disabled={currentStep === 0}
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 md:-right-6 flex items-center z-30 pointer-events-none hidden md:flex">
            <button
              onClick={nextItem}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center pointer-events-auto transition-all duration-500 hover:scale-110
                ${currentStep >= objectives.length - itemsPerView ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}
              `}
              style={{
                background: 'rgba(15, 115, 105, 0.4)',
                border: '1px solid rgba(79, 209, 197, 0.3)',
                color: '#4FD1C5'
              }}
              aria-label="Next"
              disabled={currentStep >= objectives.length - itemsPerView}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div
            className="overflow-x-auto pb-12 -mb-12 flex snap-x snap-mandatory no-scrollbar"
            ref={(el) => {
              if (el) {
                el.addEventListener('scroll', () => {
                  const scrollLeft = el.scrollLeft;
                  const width = el.clientWidth;
                  const itemWidth = width / itemsPerView;
                  const newStep = Math.round(scrollLeft / itemWidth);
                  if (newStep !== currentStep) {
                    setCurrentStep(newStep);
                  }
                });
                // Store ref for buttons
                (window as any).objectivesCarouselRef = el;
              }
            }}
          >
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="px-4 shrink-0 snap-center"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div
                  className="h-full p-10 rounded-[2.5rem] border transition-all duration-300 group hover:scale-[1.02] relative"
                  style={{
                    background: 'rgba(15, 115, 105, 0.6)',
                    borderColor: 'rgba(79, 209, 197, 0.2)'
                  }}
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/10 flex items-center justify-center text-vc-mint mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <objective.icon size={28} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 font-poppins text-white leading-tight uppercase tracking-tight">{objective.title}</h3>
                  <div className="text-white/60 text-lg leading-relaxed font-poppins">
                    {objective.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-16 md:hidden">
            {Array.from({ length: objectives.length - itemsPerView + 1 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-500 ${currentStep === idx ? 'w-10 bg-vc-mint' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
