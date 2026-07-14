'use client';

import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ThemePillars from "@/components/ThemePillars";
import AboutObjectives from "@/src/components/AboutObjectives";
import AboutTargetAudience from "@/src/components/AboutTargetAudience";

import VentureAreas from "@/components/home-a/VentureAreas";
import GetInvolvedTabs from "@/components/home-a/GetInvolvedTabs";
import { ExternalLink } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function VentureCraftAboutPage() {
    return (
        <main className="relative flex flex-col overflow-hidden bg-[#001D1B]">
            {/* Background Decorations (consistent with other about pages) */}
            <div className="fixed top-0 -left-20 md:-left-10 w-[200px] h-[400px] md:w-[300px] md:h-[600px] pointer-events-none z-0 opacity-[0.20] md:opacity-[0.35]">
                <Image
                    src="/pattern-left-v2.png"
                    alt=""
                    width={300}
                    height={620}
                    className="object-contain w-full h-full"
                    style={{ objectPosition: 'left top' }}
                />
            </div>

            {/* Decorative Pattern - Bottom Right (Fixed) */}
            <div className="fixed bottom-0 right-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px] overflow-hidden pointer-events-none z-0">
                <div className="relative w-full h-full opacity-[0.03] md:opacity-5">
                    <div className="absolute bottom-0 right-0 translate-x-8 translate-y-8 md:translate-x-12 md:translate-y-12">
                        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-24 h-14 md:w-48 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-white" />
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-12 h-12 md:w-24 md:h-24 rounded-[0.75rem] md:rounded-[1.5rem] bg-vc-teal" />
                        <div className="absolute bottom-20 right-2 md:bottom-40 md:right-4 w-10 h-8 md:w-20 md:h-14 rounded-[0.75rem] md:rounded-[1.5rem] bg-white/70" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col w-full">
                {/* Hero / Intro Section */}
                <section className="relative pt-16 pb-20">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 py-12 md:py-20">
                        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="text-center"
                            >
                                <motion.h1
                                    variants={fadeInUp}
                                    className="mb-12 md:mb-20 font-poppins uppercase tracking-tighter leading-tight text-white flex flex-col items-center"
                                >
                                    <span className="text-vc-mint text-sm sm:text-base md:text-lg font-bold tracking-[0.2em] mb-4">
                                        International Deep Tech Startup Competition
                                    </span>
                                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
                                        What is Venture Craft?
                                    </span>
                                </motion.h1>

                                <motion.p variants={fadeInUp} className="text-white/60 text-lg sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-6 font-poppins">
                                    Venture Craft is{" "}
                                    <a
                                        href="https://www.kfupm.edu.sa/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-vc-mint font-bold underline underline-offset-4 decoration-vc-mint/30 hover:decoration-vc-mint transition-all duration-300 group"
                                    >
                                        KFUPM&apos;s
                                        <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    </a>{" "}
                                    premier international deep tech startup competition,
                                    designed to inspire and empower the next generation of innovators. With a focus
                                    on sustainability and cutting edge technology, we bring together talented students,
                                    researchers, and recent graduates from around the world to transform bold ideas
                                    into impactful solutions.
                                </motion.p>

                                <motion.p variants={fadeInUp} className="text-white/60 text-lg sm:text-lg md:text-xl leading-relaxed font-poppins">
                                    Through a comprehensive program of mentorship, resources, and global exposure,
                                    Venture Craft provides participants with the tools they need to succeed in the
                                    competitive landscape of deep tech entrepreneurship. Join us and Build Your Venture.
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Objectives Section */}
                <AboutObjectives />

                {/* Target Audience Section */}
                <AboutTargetAudience />

                <ThemePillars />

                {/* Deep Tech Focus Areas — moved here from the homepage to reduce clutter */}
                <VentureAreas />

                {/* Get Involved — moved here from the homepage to reduce clutter */}
                <GetInvolvedTabs />


            </div>
            <Footer />
        </main>
    );
}
