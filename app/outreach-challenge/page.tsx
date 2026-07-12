'use client';

import Footer from '@/components/Footer';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, runTransaction, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { countries } from '@/lib/countries';
import { useRef } from 'react';
import {
    Trophy,
    Target,
    Users,
    Share2,
    Zap,
    Star,
    Rocket,
    ChevronRight,
    ChevronDown,
    Award,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Megaphone,
    Search,
    Heart,
    Flame,
    Gem,
    Lightbulb,
    Mail,
    Shield,
    Coins,
    UserPlus,
    MessageCircle,
    UserCheck,
    QrCode,
    TrendingUp,
    CircleDollarSign,
    Globe,
    Hash,
    Copy,
    ExternalLink,
    Loader2,
    AlertCircle,
    HelpCircle
} from "lucide-react";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

// Custom Dropdown Component
function FlagDropdown({
    options,
    value,
    onChange,
    label,
    description,
    placeholder = "Select...",
    type = 'country'
}: {
    options: typeof countries,
    value: string,
    onChange: (val: string) => void,
    label?: string,
    description?: string,
    placeholder?: string,
    type?: 'country' | 'phone'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase()) ||
        opt.dialCode.includes(search)
    );

    const selectedOption = options.find(opt =>
        type === 'country' ? opt.name === value : opt.dialCode === value
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-4 relative w-full" ref={dropdownRef}>
            {label && (
                <label className="block text-base font-medium text-white/70">
                    {label.includes('*') ? (
                        <>
                            {label.replace('*', '').trim()} <span className="text-vc-mint">*</span>
                        </>
                    ) : label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-6 flex items-center gap-2 hover:bg-white/10 transition-all text-left shadow-inner group/btn ${isOpen ? 'border-vc-mint/50 bg-white/10' : ''}`}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {selectedOption ? (
                        <>
                            <img
                                src={`https://flagcdn.com/w40/${selectedOption.code.toLowerCase()}.png`}
                                alt={selectedOption.name}
                                className="w-6 h-auto rounded-sm shrink-0 shadow-sm"
                            />
                            <span className="text-white text-lg font-bold truncate">
                                {selectedOption.name}
                            </span>
                        </>
                    ) : (
                        <span className="text-white/20 text-lg font-bold truncate">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {description && (
                <p className="text-xs text-vc-mint italic ml-1 mt-1">
                    {description}
                </p>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 w-full min-w-[200px] mt-2 bg-[#001D1B] border border-vc-mint/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                    >
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <Search className="w-5 h-5 text-vc-mint/60" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search countries..."
                                className="bg-transparent border-none outline-none text-lg w-full text-white placeholder:text-white/20 font-medium"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.code}
                                        type="button"
                                        onClick={() => {
                                            onChange(type === 'country' ? opt.name : opt.dialCode);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-vc-mint/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://flagcdn.com/w40/${opt.code.toLowerCase()}.png`}
                                                alt={opt.name}
                                                className="w-6 h-auto rounded-xs shadow-sm"
                                            />
                                            <span className="text-lg text-white/80 group-hover:text-white font-bold truncate max-w-[150px]">{opt.name}</span>
                                        </div>
                                        <span className="text-sm text-vc-mint/40 group-hover:text-vc-mint font-medium">{opt.dialCode}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-white/40 text-lg font-bold">No results found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const steps = [
    {
        icon: <Users className="w-10 h-10" />,
        title: "Sign-Up",
        description: "Enlist in the Outreach Challenge and receive your Venture ID.",
        bg: "bg-vc-mint/10",
        color: "text-vc-mint"
    },
    {
        icon: <Hash className="w-10 h-10" />,
        title: "Venture ID",
        description: "An ID will be allocated to you to track your contributions.",
        bg: "bg-purple-500/10",
        color: "text-purple-400"
    },
    {
        icon: <Rocket className="w-10 h-10" />,
        title: "Invite Teams",
        description: "Encourage startups to apply using your Venture ID.",
        bg: "bg-blue-500/10",
        color: "text-blue-400"
    },
    {
        icon: <HelpCircle className="w-10 h-10" />,
        title: "Earn Coins",
        description: "Accumulate 10 Venture Coins for every successful referral.",
        bg: "bg-vc-teal/10",
        color: "text-vc-teal"
    }
];

const expectations = [
    {
        title: "Social Media Sharing",
        text: "Sharing official Venture Craft content and your journey on your personal social media platforms to reach a wider audience.",
        icon: <Share2 className="w-6 h-6" />
    },
    {
        title: "Community Introduction",
        text: "Introducing the challenge to your peers, student organizations, and professional networks to identify high potential startups.",
        icon: <Users className="w-6 h-6" />
    },
    {
        title: "Participant Engagement",
        text: "Encouraging potential participants and startup founders to engage with the system and complete their applications.",
        icon: <UserPlus className="w-6 h-6" />
    }
];

export default function OutreachChallengePage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        university: '',
        country: 'Saudi Arabia'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [regData, setRegData] = useState<any>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [copied, setCopied] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check if already registered
                try {
                    const docSnap = await getDoc(doc(db, 'outreach_participants', user.uid));
                    if (docSnap.exists()) {
                        setRegData(docSnap.data());
                        setIsRegistered(true);
                    }
                } catch (err) {
                    console.error("Error checking registration:", err);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const user = auth.currentUser;
        if (!user) {
            router.push(`/signin?redirect=${window.location.pathname}`);
            return;
        }

        try {
            const response = await fetch('/api/outreach-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.fullName,
                    university: formData.university,
                    country: formData.country,
                    userId: user.uid
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to register.");
            }

            setRegData({
                outreachId: result.outreachId,
                displayName: formData.fullName,
                email: formData.email
            });

            setIsRegistered(true);
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.message || "Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyReferralId = () => {
        if (!regData?.outreachId) return;
        // In the startup app, it's just the ID (e.g. #64)
        navigator.clipboard.writeText(`#${regData.outreachId}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="relative flex flex-col overflow-hidden bg-[#001D1B]">
            {/* MATTE BACKGROUND - AMBASSADORS STYLE (Glows Removed) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Ambassadors-style corner pattern (Top Left) */}
                <div className="absolute top-0 -left-20 md:-left-10 w-[200px] h-[400px] md:w-[300px] md:h-[600px] opacity-[0.15] md:opacity-[0.35]">
                    <Image
                        src="/pattern-left-v2.png"
                        alt=""
                        width={300}
                        height={620}
                        className="object-contain w-full h-full"
                        style={{ objectPosition: 'left top' }}
                    />
                </div>

                {/* Ambassadors-style geometric pattern (Bottom Right) */}
                <div className="absolute bottom-0 right-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px] overflow-hidden opacity-[0.03] md:opacity-5">
                    <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12">
                        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-24 h-14 md:w-48 md:h-28 rounded-[1.5rem] md:rounded-[2rem] bg-vc-mint/40" />
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-12 h-12 md:w-24 md:h-24 rounded-[0.75rem] md:rounded-[1.5rem] bg-vc-teal" />
                        <div className="absolute bottom-20 right-2 md:bottom-40 md:right-4 w-10 h-8 md:w-20 md:h-14 rounded-[0.75rem] md:rounded-[1.5rem] bg-vc-mint/20" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full">
                {/* Hero Section */}
                <section className="relative pt-28 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-6 lg:px-20">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-5xl mx-auto text-center"
                        >
                            <motion.div variants={fadeInUp} className="mb-8 flex flex-col items-center">
                                <span className="text-vc-mint text-sm sm:text-base md:text-lg font-bold tracking-[0.3em] mb-8 uppercase font-poppins">
                                    JOIN THE GLOBAL COMMUNITY
                                </span>

                                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-tight font-poppins mb-6 md:mb-8">
                                    Outreach Challenge
                                </h1>

                                <h1 className="sr-only">Venture Craft Outreach Challenge</h1>

                                <p className="text-white/70 text-base md:text-xl font-poppins max-w-2xl mx-auto leading-relaxed font-light text-center">
                                    Help us drive innovation globally by identifying high potential startups and supporting their journey into the Venture Craft ecosystem.
                                </p>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 md:mt-12">
                                <button
                                    onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group relative w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-vc-mint text-[#001D1B] font-bold text-base md:text-lg rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(79,209,197,0.4)] inline-flex justify-center"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        REGISTER NOW <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </span>
                                </button>
                                <button
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-white/5 border border-white/10 text-white font-bold text-base md:text-lg rounded-xl transition-all hover:bg-white/10 backdrop-blur-xl"
                                >
                                    LEARN MORE
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Ribbon Divider 1 */}
                <section className="py-10 md:py-16 relative overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-vc-mint/15" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="max-w-5xl mx-auto"
                        >
                            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white py-2 font-poppins uppercase leading-tight tracking-tighter whitespace-normal md:whitespace-nowrap">
                                Driving <span className="text-vc-mint">Innovation</span>, One Referral at a Time!
                            </h2>
                        </motion.div>
                    </div>
                </section>

                {/* What is it? Section */}
                <section id="about" className="py-16 md:py-24 relative overflow-hidden border-t border-white/5 bg-[#157369]/[0.05]">
                    <div className="container mx-auto px-4 md:px-6 lg:px-20">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-black mb-8 font-poppins uppercase tracking-tight leading-tight text-white"
                            >
                                What is the Outreach Challenge?
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <p className="text-white/60 text-lg md:text-xl leading-relaxed font-poppins text-center">
                                    The Outreach Challenge is a global initiative for <span className="text-blue-400 font-medium">every student</span> to assist in discovering innovative startups and guiding them through the application process.
                                    Participants engage in identifying and supporting startups as they join our ecosystem. At the end of the season, the top <span className="text-vc-mint font-bold italic">three contributors</span> will be officially recognized with a grand prize.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Venture Coins Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-7 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-vc-mint/30 hover:bg-white/[0.05] transition-all flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-vc-mint/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                <div className="w-16 h-16 rounded-2xl bg-vc-mint/10 border border-vc-mint/20 flex items-center justify-center text-vc-mint mb-8 group-hover:scale-110 group-hover:bg-vc-mint/20 transition-all duration-500">
                                    <CircleDollarSign className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 font-poppins uppercase tracking-wide">Venture Coins</h3>
                                <p className="text-white/50 text-sm leading-relaxed font-poppins">Earned for every startup referral</p>
                            </motion.div>

                            {/* Top 3 Winners Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="p-7 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-blue-400/30 hover:bg-white/[0.05] transition-all flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-400/20 transition-all duration-500">
                                    <Trophy className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 font-poppins uppercase tracking-wide">Top 3 Winners</h3>
                                <p className="text-white/50 text-sm leading-relaxed font-poppins">Official Venture Craft Recognition</p>
                            </motion.div>

                            {/* Grand Prize Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="p-7 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-purple-500/30 hover:bg-white/[0.05] transition-all flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[40px] -translate-y-1/2 translate-x-1/2" />
                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2 font-poppins uppercase tracking-wide">Grand Prize</h3>
                                <p className="text-white/50 text-sm leading-relaxed font-poppins">For the season's top contributor</p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Participant Expectations Section */}
                <section className="py-16 md:py-24 relative z-20 overflow-hidden border-t border-white/5">
                    <div className="container mx-auto px-4 md:px-6 lg:px-20">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-black mb-16 font-poppins uppercase tracking-tight leading-tight text-white text-center">
                                Participant Expectations
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {expectations.map((exp, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-vc-mint/20 transition-all text-center group shadow-2xl"
                                    >
                                        <div className="w-12 h-12 shrink-0 bg-vc-mint mx-auto rounded-xl flex items-center justify-center text-[#001D1B] mb-8 group-hover:bg-vc-mint/10 group-hover:text-vc-mint transition-all duration-500">
                                            {exp.icon}
                                        </div>
                                        <h4 className="text-white font-bold text-lg mb-4 font-poppins uppercase tracking-wide">{exp.title}</h4>
                                        <p className="text-white/50 text-sm leading-relaxed font-poppins">{exp.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps Section */}
                <section className="py-16 md:py-24 relative overflow-hidden border-t border-white/5 bg-[#157369]/[0.05]">
                    <div className="container mx-auto px-4 md:px-6 lg:px-20">
                        <div className="text-center mb-12 md:mb-24">
                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-black mb-8 font-poppins uppercase tracking-tight leading-tight text-white">Participation Process</h2>
                            <p className="text-white/60 text-lg md:text-xl leading-relaxed font-poppins">Four steps to complete the outreach cycle</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    <div className={`w-24 h-24 rounded-[1.5rem] ${step.bg} flex items-center justify-center ${step.color} mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl border border-white/5 relative z-10`}>
                                        <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-[#001D1B] font-black text-sm flex items-center justify-center shadow-lg">
                                            {idx + 1}
                                        </div>
                                        {step.icon}
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-2 font-poppins uppercase tracking-wide group-hover:text-vc-mint transition-colors">{step.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed font-poppins px-6">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Enrollment Section */}
                <section id="register" className="py-16 md:py-24 relative border-t border-white/5">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-purple-500 via-blue-500 to-vc-mint p-[1.5px] shadow-2xl group relative">
                            <div className="bg-[#001D1B] rounded-[3rem] p-6 md:p-16 relative">
                                {/* Decorative Blobs */}
                                <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-vc-mint/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                                </div>

                                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="text-center lg:text-left">
                                        <h2 className="text-3xl md:text-[2.75rem] font-black text-white uppercase tracking-tight leading-tight font-poppins mb-6">
                                            Register <span className="text-vc-mint">Now</span>
                                        </h2>
                                        <p className="text-white/60 font-poppins text-lg leading-relaxed mb-6 max-w-xs mx-auto lg:mx-0">
                                            Complete the registration form to receive your dedicated Outreach ID and begin your contribution.
                                        </p>

                                        <div className="text-vc-mint text-center lg:text-left mt-8">
                                            <span className="text-xl md:text-2xl font-black uppercase tracking-widest font-poppins whitespace-normal sm:whitespace-nowrap">Open For All Students!</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6 w-full">
                                        {isRegistered ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-vc-mint/10 border border-vc-mint/20 rounded-[2rem] p-6 md:p-8 text-center space-y-6"
                                            >
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-vc-mint rounded-full flex items-center justify-center mx-auto shadow-lg shadow-vc-mint/20">
                                                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[#001D1B]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">Registration Complete</h3>
                                                    <p className="text-white/60 text-sm md:text-base">Welcome to the Outreach Challenge! Here is your unique Venture ID:</p>
                                                    <p className="text-vc-mint text-[10px] md:text-xs font-bold mt-2 uppercase tracking-wide md:tracking-widest flex items-center justify-center gap-1">
                                                        <Mail className="w-3 h-3" /> A confirmation email was sent!
                                                    </p>
                                                </div>

                                                <div className="bg-[#001D1B] border border-white/10 rounded-2xl p-5 md:p-6 relative group overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-vc-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                                                        <div className="text-center sm:text-left flex-1 min-w-0">
                                                            <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest md:tracking-[0.2em] mb-1">Your Referral ID</p>
                                                            <p className="text-3xl sm:text-4xl font-black text-white tracking-tighter">#{regData?.outreachId}</p>
                                                        </div>
                                                        <button
                                                            onClick={copyReferralId}
                                                            className="p-3 md:p-4 bg-white/5 hover:bg-vc-mint hover:text-[#001D1B] rounded-xl transition-all duration-300 group/copy shrink-0 flex items-center gap-2"
                                                        >
                                                            {copied ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : <Copy className="w-5 h-5 md:w-6 md:h-6" />}
                                                            <span className="text-xs font-bold uppercase sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-white/40 italic">
                                                    Share this ID with startups to have them include it in their application form.
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleRegister} className="space-y-6">
                                                <div className="space-y-5">
                                                    <div className="relative group/input">
                                                        <input
                                                            type="text"
                                                            value={formData.fullName}
                                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                            placeholder="Full Name"
                                                            required
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white placeholder-white/20 font-bold focus:outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all shadow-inner"
                                                        />
                                                    </div>
                                                    <div className="relative group/input">
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="Personal Email"
                                                            required
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white placeholder-white/20 font-bold focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all shadow-inner"
                                                        />
                                                    </div>
                                                    <div className="relative group/input">
                                                        <input
                                                            type="text"
                                                            value={formData.university}
                                                            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                                            placeholder="University Name"
                                                            required
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white placeholder-white/20 font-bold focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all shadow-inner"
                                                        />
                                                    </div>
                                                    <div className="relative group/input">
                                                        <FlagDropdown
                                                            options={countries}
                                                            value={formData.country}
                                                            onChange={(val) => setFormData({ ...formData, country: val })}
                                                            placeholder="Select Country"
                                                        />
                                                    </div>
                                                </div>

                                                {error && (
                                                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm font-bold">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {error}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full py-4 md:py-6 bg-vc-mint text-[#001D1B] font-bold text-base md:text-2xl uppercase tracking-wider md:tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="w-6 h-6 animate-spin" />
                                                            REGISTERING...
                                                        </>
                                                    ) : "GET MY ID"}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}

