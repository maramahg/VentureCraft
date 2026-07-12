'use client';

import Footer from '@/components/Footer';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import CallToAction from '@/components/CallToAction';
import { ExternalLink } from 'lucide-react';
import { proofWallImages } from '@/lib/homepageImages';

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

export default function KfupmDtvAboutPage() {
    const kfupmSectionRef = useRef(null);
    const { scrollYProgress: kfupmProgress } = useScroll({
        target: kfupmSectionRef,
        offset: ["start end", "end start"]
    });

    const dtvSectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: dtvSectionRef,
        offset: ["start end", "center center"]
    });

    // Transform opacity for KFUPM background
    const kfupmBgOpacity = useTransform(kfupmProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Transform opacity for DTV background based on scroll
    const dtvBgOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

    return (
        <main
            className="relative flex flex-col overflow-hidden bg-[#001D1B]"
        >
            {/* --- Scrollytelling Backgrounds --- */}

            {/* Base Background: KFUPM Architectural Drawing */}
            <motion.div
                className="fixed inset-0 z-0"
                style={{ opacity: kfupmBgOpacity }}
            >
                <Image
                    src="/kfupm-bg.png"
                    alt="KFUPM Background"
                    fill
                    priority
                    className="object-contain object-center opacity-[0.15] invert"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#001D1B]/30 to-[#001D1B]" />
            </motion.div>

            {/* Overlay Background: DTV Blurred Photo */}
            <motion.div
                className="fixed inset-0 z-0"
                style={{ opacity: dtvBgOpacity }}
            >
                <Image
                    src="/kfupm-bg.png"
                    alt="DTV Background"
                    fill
                    className="object-cover object-center opacity-[0.25] invert blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00504A]/40 to-[#001D1B]/90 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001D1B] via-transparent to-[#001D1B]/50" />
            </motion.div>


            {/* Decorative Pattern - Top Left (Fixed) */}
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
                {/* KFUPM Section */}
                <section ref={kfupmSectionRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
                            <div className="text-center">
                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-12 md:mb-20 font-poppins uppercase tracking-tighter leading-tight text-white flex flex-col items-center"
                                >
                                    <span className="text-vc-mint text-sm sm:text-base md:text-lg font-bold tracking-[0.3em] mb-2">ABOUT</span>
                                    <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
                                        <a
                                            href="https://www.kfupm.edu.sa/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-vc-mint transition-colors duration-300"
                                        >
                                            KFUPM
                                        </a>
                                        {" & "}
                                        <a
                                            href="https://dtv.sa/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-vc-mint transition-colors duration-300"
                                        >
                                            DTV
                                        </a>
                                    </span>
                                </motion.h1>

                                {/* KFUPM Header */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20"
                                >
                                    King Fahd University of Petroleum & Minerals
                                </motion.h2>

                                {/* Rankings Cards */}
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-12 w-full max-w-4xl mx-auto"
                                >
                                    <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">67th</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">QS World University Rankings 2026</p>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">1st</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Middle East and Africa Rankings by THE</p>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">5th</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Petroleum Engineering Ranking by QS</p>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <p className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-6 font-poppins max-w-3xl mx-auto">
                                        <a
                                            href="https://www.kfupm.edu.sa/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-vc-mint font-bold underline underline-offset-4 decoration-vc-mint/30 hover:decoration-vc-mint transition-all duration-300 group"
                                        >
                                            KFUPM
                                            <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </a> is Saudi Arabia's leading research university, renowned for its excellence
                                        in science, engineering, and technology. As a global hub for innovation, KFUPM
                                        is committed to preparing leaders who drive economic transformation and sustainable
                                        development.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DTV Section */}
                <section ref={dtvSectionRef} className="relative min-h-screen flex items-center py-20 overflow-hidden border-t border-white/5">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
                            <div className="text-center">
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20"
                                >
                                    Dhahran Techno Valley
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-vc-mint text-lg md:text-xl font-semibold mb-8 font-poppins"
                                >
                                    The Global Hub of Choice for Technology & Innovation
                                </motion.p>

                                {/* Bento Grid Stats */}
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-6xl mx-auto mb-10 md:mb-12"
                                >
                                    <motion.div variants={fadeInUp} className="md:col-span-8 relative h-[250px] md:h-auto min-h-[250px] rounded-2xl md:rounded-3xl overflow-hidden group border border-white/10">
                                        <Image
                                            src="/kfupm-bg.png"
                                            alt="Dhahran Techno Valley"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 hover:opacity-80"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#001D1B] via-transparent to-transparent" />
                                        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10">
                                            <p className="text-white text-lg md:text-xl font-bold font-poppins">The Valley</p>
                                            <p className="text-vc-mint text-sm font-medium">Where Innovation Scales</p>
                                        </div>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-center">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">20+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Specialized R&D Centers</p>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-vc-mint/10 rounded-full blur-2xl group-hover:bg-vc-mint/20 transition-all" />
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">160+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Startups by 2027</p>
                                    </motion.div>
                                    <motion.div variants={fadeInUp} className="md:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-center">
                                        <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">520+</p>
                                        <p className="text-white/60 text-sm md:text-base font-poppins">Patents Claimed</p>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <p className="text-white/60 text-base sm:text-lg md:text-xl leading-relaxed mb-4 md:mb-6 font-poppins max-w-3xl mx-auto">
                                        <a
                                            href="https://dtv.sa/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-vc-mint font-bold underline underline-offset-4 decoration-vc-mint/30 hover:decoration-vc-mint transition-all duration-300 group"
                                        >
                                            Dhahran Techno Valley (DTV)
                                            <ExternalLink className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </a> is Saudi Arabia's leading hub for energy, sustainability, and
                                        innovation. In partnership with KFUPM and leading global corporations, DTV connects exceptional
                                        research talent with tailored startup programs, early stage funding, and a thriving innovation ecosystem.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Partnership Bridge Section */}
                <section className="relative min-h-[50vh] flex items-center py-12 overflow-hidden border-t border-white/5 bg-[#001D1B]/50">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20"
                            >
                                The Partnership Bridge
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-vc-mint/80 text-lg sm:text-lg md:text-xl leading-relaxed mb-10 font-poppins"
                            >
                                Venture Craft is more than a competition; it is a collaborative powerhouse linking
                                <span className="text-white font-bold"> Academia</span>,
                                <span className="text-white font-bold ml-1">Industry</span>, and
                                <span className="text-white font-bold ml-1">Government</span>.
                            </motion.p>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-vc-teal/50 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-vc-mint mb-2 font-poppins">University</h3>
                                    <p className="text-sm text-white/50 font-poppins">World-class research & talent pipeline from KFUPM.</p>
                                </motion.div>
                                <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-vc-teal/50 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-vc-mint mb-2 font-poppins">Industry</h3>
                                    <p className="text-sm text-white/50 font-poppins">Market access & mentorship from DTV partners.</p>
                                </motion.div>
                                <motion.div variants={fadeInUp} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-vc-teal/50 transition-all duration-300">
                                    <h3 className="text-xl font-bold text-vc-mint mb-2 font-poppins">Government</h3>
                                    <p className="text-sm text-white/50 font-poppins">Strategic alignment with Vision 2030 goals.</p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Gallery & Impact Section */}
                <section className="relative py-16 overflow-hidden border-t border-white/5">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-10"
                        >
                            <p className="text-vc-mint text-sm font-bold tracking-[0.3em] uppercase mb-2">The Competition</p>
                            <h2 className="text-2xl sm:text-3xl font-black font-poppins uppercase tracking-tighter text-white">Credibility in Action</h2>
                        </motion.div>

                        {/* Photo bento grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] mb-6"
                        >
                            {proofWallImages.map((img, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className={`relative overflow-hidden group border border-white/10 hover:border-vc-teal/50 transition-all duration-500 rounded-2xl md:rounded-3xl ${
                                        i === 0 ? 'col-span-2 row-span-1' :
                                        i === 2 ? 'col-span-1 row-span-2' : 'col-span-1'
                                    }`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001D1B]/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-bold bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                                            {img.caption}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Stat cards row */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { num: '130+', label: 'Countries Represented' },
                                { num: '50+',  label: 'Expert Mentors' },
                            ].map((s) => (
                                <motion.div
                                    key={s.num}
                                    variants={fadeInUp}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-vc-teal/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-center"
                                >
                                    <p className="text-4xl md:text-5xl font-bold text-vc-mint mb-2 font-poppins">{s.num}</p>
                                    <p className="text-white/60 text-sm md:text-base font-poppins">{s.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <CallToAction />
            </div >
            <Footer />
        </main >
    );
}
