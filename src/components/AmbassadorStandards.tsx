'use client';

import { motion, Variants } from 'framer-motion';
import { GraduationCap, Globe, Clock, MessageSquare, Rocket } from 'lucide-react';

const standards = [
    {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "University Student or Fresh Graduate",
        description: "Currently enrolled in a university or a recent graduate with a passion for development."
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Strong Network & Connections",
        description: "Established access to student communities, academic clubs, or professional networks within your university."
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Availability & Commitment",
        description: "Sufficient weekly availability to actively promote the challenge and complete assigned ambassador tasks."
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Professional Communication",
        description: "The ability to communicate professionally and represent Venture Craft positively within your ecosystem."
    },
    {
        icon: <Rocket className="w-6 h-6" />,
        title: "Innovation & Entrepreneurship",
        description: "A genuine interest in startups, deep-tech research, and sustainable industrial solutions."
    }
];

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function AmbassadorStandards() {
    return (
        <section className="py-20 relative z-20 overflow-hidden bg-white/[0.01]">
            <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-12 xl:gap-24 lg:items-center">

                    {/* Left Side: Sticky Heading */}
                    <div className="lg:w-[40%] xl:w-1/3">
                        <div className="lg:sticky lg:top-32 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-black text-white uppercase tracking-tighter leading-tight font-poppins"
                            >
                                Ambassador <br />
                                <span className="text-vc-mint">Standards</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-white/50 text-sm md:text-base lg:text-xl leading-relaxed font-poppins max-w-md"
                            >
                                We identify and empower the next generation of academic leaders and tech advocates.
                                Our standards ensure a high-impact community.
                            </motion.p>
                        </div>
                    </div>

                    {/* Right Side: Threaded List */}
                    <div className="lg:w-[60%] xl:w-2/3">
                        <div className="space-y-12 relative">
                            {/* Continuous Vertical Line behind cards */}
                            <div className="absolute left-1/2 -translate-x-1/2 md:left-[23.5px] md:translate-x-0 top-12 bottom-12 md:top-6 md:bottom-6 w-[1px] bg-vc-mint/20 z-0" />

                            {standards.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeInUp}
                                    className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start relative group bg-white/5 md:bg-transparent border border-white/10 md:border-none p-6 md:p-0 rounded-2xl md:rounded-none z-10 backdrop-blur-sm md:backdrop-blur-none"
                                >

                                    {/* Icon Hub */}
                                    <div className="relative shrink-0 z-10">
                                        <div className="w-12 h-12 rounded-xl bg-[#002A26] border border-vc-mint/20 flex items-center justify-center text-vc-mint group-hover:border-vc-mint transition-all duration-700">
                                            {item.icon}
                                        </div>
                                    </div>

                                    {/* Text Stack */}
                                    <div className="flex-1 space-y-3 pt-0.5 text-center md:text-left flex flex-col items-center md:items-start">
                                        <h3 className="text-xl md:text-2xl font-bold text-white font-poppins uppercase tracking-tight group-hover:text-vc-mint transition-colors duration-500">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/60 text-base md:text-lg leading-relaxed font-poppins max-w-2xl">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                                            <div className="h-[1px] w-6 group-hover:w-12 bg-vc-mint/30 transition-all duration-700" />
                                            <span className="text-[9px] text-vc-mint/50 font-bold tracking-widest uppercase">Criteria 0{index + 1}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
