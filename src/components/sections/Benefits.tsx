"use client";

import { 
  Globe, 
  Award, 
  Users, 
  Zap, 
  Megaphone
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

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

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal width="100%" className="mb-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-center text-white mb-6">
            Why Become an Ambassador?
          </h2>
          <div className="w-24 h-1.5 bg-vc-mint mx-auto" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="group h-full p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-md hover:border-vc-mint/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,204,137,0.1)] flex flex-col gap-6 hover:-translate-y-2">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-vc-mint/20 to-vc-teal/20 flex items-center justify-center text-vc-mint group-hover:scale-110 transition-transform duration-300 shadow-inner shadow-vc-mint/10">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white group-hover:text-vc-mint transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
