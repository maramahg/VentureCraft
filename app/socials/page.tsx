'use client';

import { motion } from 'framer-motion';
import { Twitter, Linkedin, Instagram, Globe, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const socials = [
    {
        name: 'Official Website',
        url: 'https://kfupm-venturecraft.org',
        icon: Globe,
        color: 'bg-vc-mint/20 hover:bg-vc-mint/30 text-vc-mint',
        description: 'Learn more & Register'
    },
    {
        name: 'X',
        url: 'https://x.com/venturecraft_sa?s=21',
        icon: () => (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        color: 'bg-white/5 hover:bg-white/10 text-white',
        description: 'Latest updates & announcements'
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/venturecraftsa/',
        icon: Linkedin,
        color: 'bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#0077b5]',
        description: 'Professional network & ecosystem growth'
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/venturecraft.sa?igsh=bHJmMjF6dGM2MXU1',
        icon: Instagram,
        color: 'bg-[#e4405f]/20 hover:bg-[#e4405f]/30 text-[#e4405f]',
        description: 'Event highlights & community stories'
    },
    {
        name: 'TikTok',
        url: 'https://www.tiktok.com/@venturecraft_sa?_r=1&_t=ZS-93h9rM2RRDu',
        icon: () => (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
            </svg>
        ),
        color: 'bg-white/5 hover:bg-white/10 text-white',
        description: 'Short & engaging content'
    }
];

export default function SocialsPage() {
    return (
        <main className="min-h-screen bg-[#000808] text-white selection:bg-vc-mint/30 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vc-mint/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vc-mint/10 rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-md z-10 space-y-8 text-center">
                {/* Logo & Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo.png"
                            alt="Venture Craft"
                            width={220}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                        Connect with <span className="text-vc-mint">VentureCraft</span>
                    </h1>
                    <p className="text-white/60 text-sm font-medium">
                        Follow us to stay updated on deep-tech innovation and startup opportunities.
                    </p>
                </motion.div>

                {/* Social Links Container */}
                <div className="space-y-4 pt-4">
                    {socials.map((social, index) => {
                        const Icon = social.icon;
                        return (
                            <motion.a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className={`group relative w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl ${social.color}`}
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h2 className="font-bold text-lg leading-none mb-1">{social.name}</h2>
                                    <p className="text-xs opacity-60 font-medium">{social.description}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity mr-2" />
                            </motion.a>
                        );
                    })}
                </div>

                {/* Footer Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="pt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest"
                >
                    © {new Date().getFullYear()} Venture Craft | Deep Tech Innovation
                </motion.div>
            </div>
        </main>
    );
}
