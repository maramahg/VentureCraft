'use client';

import Footer from '@/components/Footer';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import CallToAction from "@/components/CallToAction";
import {
    Globe,
    Award,
    Users,
    ArrowRight,
    ArrowLeft,
    GraduationCap,
    Share2,
    CheckCircle2,
    Megaphone,
    Search,
    Heart,
    Star,
    Sparkles,
    Handshake,
    Target,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

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

const roleActivities = [
    {
        icon: <Share2 className="w-5 h-5" />,
        text: "Sharing content on personal social media platforms"
    },
    {
        icon: <Users className="w-5 h-5" />,
        text: "Introducing the challenge to peers, student communities, and professional networks"
    },
    {
        icon: <Target className="w-5 h-5" />,
        text: "Encouraging potential participants to engage and apply"
    },
    {
        icon: <Megaphone className="w-5 h-5" />,
        text: "Supporting selected physical marketing efforts (materials distribution, university activities)"
    },
    {
        icon: <Handshake className="w-5 h-5" />,
        text: "Facilitating collaborations with student clubs, organizations, and innovation entities"
    }
];

const benefits = [
    {
        icon: <Award className="w-6 h-6" />,
        title: "Official Certificate",
        description: "Receive a formal recognition of your role and contribution."
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: "Public Recognition",
        description: "Be highlighted across Venture Craft's official channels."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Networking Access",
        description: "Connect with industry leaders, investors, and elite researchers."
    },
    {
        icon: <Sparkles className="w-6 h-6" />,
        title: "Event Invitations",
        description: "Get exclusive access to premium deep-tech events."
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Exposure",
        description: "Expand your reach within the international startup ecosystem."
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: "Special Appreciation",
        description: "Additional rewards for outstanding ambassador engagement."
    }
];



export default function AmbassadorsPage() {
    const { scrollY } = useScroll();
    const [currentStep, setCurrentStep] = useState(0);
    const [benefitsPerView, setBenefitsPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setBenefitsPerView(1);
            } else if (window.innerWidth < 1024) {
                setBenefitsPerView(2);
            } else {
                setBenefitsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextBenefit = () => {
        setCurrentStep((prev) => (prev + 1) % (benefits.length - (benefitsPerView - 1)));
    };

    const prevBenefit = () => {
        setCurrentStep((prev) => (prev - 1 + (benefits.length - (benefitsPerView - 1))) % (benefits.length - (benefitsPerView - 1)));
    };
    return (
        <main className="relative flex flex-col overflow-hidden bg-[#001D1B]">
            {/* Background Decorations */}
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
                {/* Hero Section */}
                <section className="relative pt-16 pb-20">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10 py-10 md:py-16">
                        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                                className="w-full flex flex-col items-center"
                            >
                                <motion.div variants={fadeInUp} className="flex flex-col items-center mb-6 md:mb-10">
                                    <span className="text-vc-mint text-sm sm:text-base md:text-lg font-bold tracking-[0.3em] mb-4 uppercase font-poppins">
                                        JOIN THE GLOBAL MOVEMENT
                                    </span>
                                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase font-poppins tracking-tighter leading-tight">
                                        Ambassadors<br />Program
                                    </h1>
                                </motion.div>

                                <motion.div variants={fadeInUp} className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 font-poppins max-w-3xl mx-auto space-y-4">
                                    <p>
                                        The Venture Craft Ambassadors Program is a global initiative designed to engage passionate university students who actively promote innovation, entrepreneurship, and deep-tech solutions within their communities.
                                    </p>
                                    <p>
                                        Ambassadors play a key role in expanding the reach of the Venture Craft Challenge by raising awareness, encouraging participation, and representing the initiative across universities and student ecosystems worldwide.
                                    </p>
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <button className="group relative px-10 py-4 bg-vc-mint text-[#001D1B] font-bold text-lg rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(79,209,197,0.4)]">
                                        Apply Now
                                    </button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* VC Mission Section - Unique Feature Layout (Not a Duplicate) */}
                <section className="py-32 relative z-20 overflow-hidden border-t border-white/5 bg-[#157369]/05">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-6xl mx-auto">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                                className="flex flex-col lg:flex-row gap-16 items-center"
                            >
                                {/* Left Side: Bold Statement */}
                                <div className="lg:w-1/2 flex flex-col items-center text-center md:items-start md:text-left">
                                    <motion.h2
                                        variants={fadeInUp}
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20 w-full"
                                    >
                                        Ambassador Mission
                                    </motion.h2>
                                    <motion.p variants={fadeInUp} className="text-white/60 text-lg md:text-xl leading-relaxed font-poppins mb-10">
                                        Building a diverse global community united by ambition, innovation, and a shared passion for transforming deep-tech ideas into impactful solutions.
                                    </motion.p>
                                    <motion.p variants={fadeInUp} className="text-vc-mint/80 font-bold italic text-lg">
                                        Together, we are shaping the future of industrial technology and sustainable development.
                                    </motion.p>
                                </div>

                                {/* Right Side: Feature Stack in Glass Container */}
                                <div className="lg:w-1/2 w-full">
                                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                                        {/* Accent Glow */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-vc-mint/10 rounded-full blur-3xl" />

                                        <div className="space-y-12">
                                            {[
                                                { title: "Diversity & Community", text: "Building meaningful relationships with people who share ambition and passion for innovation.", icon: <Users className="w-5 h-5" /> },
                                                { title: "Partners in Success", text: "Striving for mutual growth, creating an environment that encourages progress.", icon: <Handshake className="w-5 h-5" /> },
                                                { title: "Shared Vision", text: "Ambition and vision remain constant, regardless of place or time.", icon: <Target className="w-5 h-5" /> }
                                            ].map((goal, i) => (
                                                <motion.div
                                                    key={i}
                                                    variants={fadeInUp}
                                                    className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left group"
                                                >
                                                    <div className="shrink-0 bg-vc-mint/10 w-12 h-12 rounded-xl flex items-center justify-center text-vc-mint border border-vc-mint/20 group-hover:bg-vc-mint group-hover:text-[#001D1B] transition-all duration-500">
                                                        {goal.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold text-lg mb-2 font-poppins uppercase tracking-wide">{goal.title}</h4>
                                                        <p className="text-white/50 text-sm leading-relaxed font-poppins">{goal.text}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Vision Quote Section (Shrunk Bridge Style) */}
                <section className="py-16 relative overflow-hidden group">
                    {/* The Ribbon Decoration */}
                    <div className="absolute inset-0 z-0 bg-vc-mint/15" />

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl mx-auto"
                        >
                            <h2 className="text-2xl md:text-4xl font-black text-white mb-6 font-poppins uppercase leading-tight tracking-tighter">
                                "<span className="text-vc-mint">Partners</span>, Not Just Promoters."
                            </h2>
                            <p className="text-white/50 text-base md:text-lg font-poppins max-w-2xl mx-auto leading-relaxed">
                                Building a diverse global community united by ambition, innovation, and collaboration.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* The Role Section */}
                <section className="py-24 relative z-20 overflow-hidden">
                    <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={staggerContainer}
                            >
                                <motion.h2
                                    variants={fadeInUp}
                                    className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20 text-center md:text-left"
                                >
                                    Ambassador Role
                                </motion.h2>

                                <motion.div variants={fadeInUp} className="space-y-8">
                                    <p className="text-white/60 text-lg md:text-xl leading-relaxed font-poppins text-center md:text-left">
                                        Ambassadors help expand the reach of the Venture Craft Challenge by promoting it to a wider audience and supporting its presence within their communities.
                                    </p>

                                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10">
                                        <p className="text-vc-mint font-bold italic mb-6">Optional activities based on availability and comfort:</p>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {roleActivities.map((activity, idx) => (
                                                <li key={idx} className="flex gap-4 items-start group">
                                                    <div className="mt-1 text-vc-mint group-hover:scale-110 transition-transform">{activity.icon}</div>
                                                    <span className="text-white/70 text-sm md:text-base font-poppins">{activity.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <p className="text-vc-mint/80 font-medium italic text-center text-sm md:text-base">
                                        Ambassadors play a key role in increasing awareness, engagement, participation, and meaningful connections.
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 relative z-20 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mb-20 text-center max-w-4xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold mb-8 font-poppins uppercase tracking-tighter leading-tight text-white pb-6 border-b border-vc-mint/20"
                            >
                                Ambassador Benefits
                            </motion.h2>
                            <p className="text-vc-mint text-base md:text-lg font-bold mb-8 font-poppins uppercase tracking-[0.3em]">
                                Unlock Exclusive Opportunities
                            </p>
                        </div>

                        <div className="max-w-6xl mx-auto relative group/carousel px-4 md:px-12">
                            {/* Navigation Buttons (Theme matched) - Hidden on Mobile */}
                            <div className="absolute inset-y-0 left-0 md:-left-6 flex items-center z-30 pointer-events-none hidden md:flex">
                                <button
                                    onClick={prevBenefit}
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
                                    onClick={nextBenefit}
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center pointer-events-auto transition-all duration-500 hover:scale-110
                                        ${currentStep >= benefits.length - benefitsPerView ? 'opacity-20 cursor-not-allowed' : 'opacity-100'}
                                    `}
                                    style={{
                                        background: 'rgba(15, 115, 105, 0.4)',
                                        border: '1px solid rgba(79, 209, 197, 0.3)',
                                        color: '#4FD1C5'
                                    }}
                                    aria-label="Next"
                                    disabled={currentStep >= benefits.length - benefitsPerView}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="overflow-hidden py-12 -my-12">
                                <motion.div
                                    className="flex"
                                    animate={{ x: `-${currentStep * (100 / benefitsPerView)}%` }}
                                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                                >
                                    {benefits.map((benefit, index) => (
                                        <div
                                            key={index}
                                            className="px-4 shrink-0"
                                            style={{ width: `${100 / benefitsPerView}%` }}
                                        >
                                            <div
                                                className="h-full p-10 rounded-[2.5rem] border transition-all duration-300 group hover:scale-[1.02] relative"
                                                style={{
                                                    background: 'rgba(15, 115, 105, 0.6)',
                                                    borderColor: 'rgba(79, 209, 197, 0.2)'
                                                }}
                                            >
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/10 flex items-center justify-center text-vc-mint mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                                    {benefit.icon}
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold mb-4 font-poppins text-white leading-tight uppercase tracking-tight">{benefit.title}</h3>
                                                <p className="text-white/60 text-lg leading-relaxed font-poppins">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            <div className="flex justify-center gap-3 mt-16 md:hidden">
                                {Array.from({ length: benefits.length - benefitsPerView + 1 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-2 rounded-full transition-all duration-500 ${currentStep === idx ? 'w-10 bg-vc-mint' : 'w-2 bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <p className="text-center mt-20 text-white/30 text-xs md:text-sm font-poppins italic">
                            *Selected active ambassadors may receive special appreciation
                        </p>
                    </div>
                </section>

                <CallToAction showOnlyRegister />
            </div>
            <Footer />
        </main>
    );
}
