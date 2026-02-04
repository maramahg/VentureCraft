"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Award, 
  Users, 
  Zap, 
  Megaphone, 
  ArrowRight 
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0D2B2B] overflow-x-hidden text-white selection:bg-vc-mint selection:text-[#0D2B2B]">
      <AnimatedBackground />
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden z-10">
        
        <ScrollReveal width="100%" duration={0.8}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 mt-16">
            <span className="bg-gradient-to-r from-white to-vc-mint bg-clip-text text-transparent">
              VENTURE CRAFT
            </span>
            <br />
            <span className="text-white">AMBASSADORS</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal width="100%" delay={0.2}>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            A global initiative designed to engage passionate university students who actively promote innovation, entrepreneurship, and deep-tech solutions.
          </p>
        </ScrollReveal>

        <ScrollReveal width="100%" delay={0.4}>
          <button className="group relative px-8 py-4 bg-gradient-to-r from-vc-mint to-[#2bb57a] text-[#0D2B2B] font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(57,204,137,0.4)]">
            <span className="relative z-10 flex items-center gap-2">
              Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </ScrollReveal>
      </section>

      {/* 2. The Role (Overview) */}
      <section className="py-24 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 relative">
             <ScrollReveal direction="right">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white uppercase tracking-wider">
                  The Role
                </h2>
                <div className="w-24 h-1 bg-vc-mint mb-8" />
             </ScrollReveal>
          </div>
          
          <div className="flex-1">
            <ScrollReveal direction="left" delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                Ambassadors play a key role in expanding the reach of the <strong className="text-vc-mint font-semibold">Venture Craft Challenge</strong> by raising awareness, encouraging participation, and representing the initiative across <strong className="text-vc-mint font-semibold">universities</strong> and <strong className="text-vc-mint font-semibold">student ecosystems</strong> worldwide.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Benefits Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal width="100%" className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-center text-white mb-4">
              Why Become an Ambassador?
            </h2>
            <div className="w-20 h-1 bg-vc-mint mx-auto" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="group h-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-vc-mint/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,204,137,0.15)] flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vc-mint/20 to-vc-teal/20 flex items-center justify-center text-vc-mint group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-vc-mint transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vision Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-[#0D2B2B]">
           <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-vc-mint/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-vc-teal/20 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <ScrollReveal width="100%">
            <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-8 font-poppins">
              "Partners, Not Just Promoters."
            </h2>
          </ScrollReveal>
          
          <ScrollReveal width="100%" delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light font-poppins">
              Our vision is to build a diverse, global community of students united by ambition, innovation, and collaboration. Through the ambassadors program, we aim to foster mutual growth, shared success, and long-term impact, empowering students to actively shape the future of innovation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Call to Action (Footer Area) */}
      <section className="py-24 px-6 text-center relative">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal width="100%">
            <p className="text-lg md:text-xl text-gray-400 mb-10">
              If you are a motivated university student with an interest in startups, technology, and sustainability, we invite you to join the Venture Craft Ambassadors Program and be part of a global movement driving innovation forward.
            </p>
          </ScrollReveal>
          
          <ScrollReveal width="100%" delay={0.2}>
            <button className="group px-10 py-5 bg-transparent border-2 border-vc-mint text-vc-mint font-bold text-lg rounded-full transition-all hover:bg-vc-mint hover:text-[#0D2B2B] hover:shadow-[0_0_40px_rgba(57,204,137,0.3)]">
              Join the Movement
            </button>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

const benefits = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Reach",
    description: "Represent a prestigious global innovation initiative and connect with peers worldwide."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Recognition",
    description: "Gain official recognition and certification for your contributions to the ecosystem."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Network",
    description: "Expand your professional and entrepreneurial network with industry leaders."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Impact",
    description: "Contribute to student-led innovation and drive real community impact."
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Exposure",
    description: "Receive global exposure through Venture Craft platforms and events."
  }
];
