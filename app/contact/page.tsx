'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Instagram, MapPin, ExternalLink, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const emails = [
    {
        label: 'Inquiries & Questions',
        email: 'info.venturecraft@kfupm.edu.sa',
        description: 'For general competition inquiries, eligibility, and materials.'
    },
    {
        label: 'Official & Corporate',
        email: 'venture-craft@kfupm.edu.sa',
        description: 'For corporate partnerships, media, and institutional relations.'
    }
];

const socials = [
    {
        name: 'X',
        url: 'https://x.com/venturecraft_sa?s=21',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        color: 'hover:text-white hover:bg-white/10'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/venturecraftsa/',
        icon: Linkedin,
        color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/10'
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/venturecraft.sa?igsh=bHJmMjF6dGM2MXU1',
        icon: Instagram,
        color: 'hover:text-[#e4405f] hover:bg-[#e4405f]/10'
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@venturecraft_sa?_r=1&_t=ZS-93h9rM2RRDu',
        icon: ({ className }: { className?: string }) => (
            <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
        ),
        color: 'hover:text-white hover:bg-white/10'
    }
];

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#000d0d] text-white selection:bg-vc-mint/30 relative overflow-hidden">
            {/* Optimized Background Layer */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(circle at 70% 20%, rgba(57, 204, 137, 0.08), transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(33, 66, 143, 0.12), transparent 50%)
                    `
                }}
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

            <div className="container mx-auto px-6 pt-44 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header Section */}
                    <div className="text-center space-y-6 mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex p-3 rounded-2xl bg-vc-mint/10 border border-vc-mint/20 text-vc-mint mb-2"
                        >
                            <Mail className="w-8 h-8" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
                        >
                            Let's <span className="text-vc-mint">Connect</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/40 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                        >
                            Reach out to our team for competition support, partnerships, or community inquiries.
                        </motion.p>
                    </div>

                    {/* Social Media - Now at Top & Full Width */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-10 bg-[#0a1a1a]/40 border-white/5 space-y-10"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-vc-mint">Follow Our Journey</h2>
                            <p className="text-sm text-white/40 font-medium leading-relaxed">Stay updated with our latest deep-tech insights and announcements.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {socials.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center justify-center p-10 rounded-3xl bg-white/[0.03] border border-white/5 transition-all duration-500 group ${social.color} hover:border-vc-mint/30 hover:shadow-2xl hover:shadow-vc-mint/5`}
                                    >
                                        <Icon className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Contact Channels Grid - Now Below Socials */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {emails.map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={`mailto:${item.email}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 hover:border-vc-mint/40 transition-all duration-500 hover:bg-white/[0.04] overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-10 text-vc-mint transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    <ArrowRight className="w-6 h-6 opacity-40 group-hover:opacity-100" />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vc-mint/60">{item.label}</span>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-vc-mint transition-colors">{item.email}</h3>
                                    <p className="text-sm text-white/30 leading-relaxed font-medium">{item.description}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                </div>
            </div>
        </main>
    );
}
