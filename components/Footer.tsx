'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#0A1F1F] border-t border-[#39cc89]/20">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-28" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center text-center">

                    {/* Logo & Description */}
                    <div className="space-y-8 flex flex-col items-center">
                        <div className="flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Venture Craft Logo"
                                width={200}
                                height={60}
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-vc-mint font-black text-[10px] uppercase tracking-[0.3em] mb-2">Build Your Venture</p>
                            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-xs mx-auto">
                                KFUPM's international deep-tech startup competition supporting innovation and global impact.
                            </p>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex gap-4 pt-8 justify-center" style={{ marginTop: '2rem' }}>
                            <a
                                href="https://x.com/venturecraft_sa?s=21"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1a4d4d] flex items-center justify-center text-[#39cc89] hover:bg-[#39cc89] hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="X"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            <a
                                href="https://www.linkedin.com/company/venturecraftsa/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1a4d4d] flex items-center justify-center text-[#39cc89] hover:bg-[#39cc89] hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>

                            <a
                                href="https://www.instagram.com/venturecraft.sa?igsh=bHJmMjF6dGM2MXU1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1a4d4d] flex items-center justify-center text-[#39cc89] hover:bg-[#39cc89] hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>

                            <a
                                href="https://www.tiktok.com/@venturecraft_sa?_r=1&_t=ZS-93h9rM2RRDu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#1a4d4d] flex items-center justify-center text-[#39cc89] hover:bg-[#39cc89] hover:text-white transition-all duration-300 hover:scale-110"
                                aria-label="TikTok"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center">
                        <h4 className="text-white font-semibold text-lg mb-6" style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                        <ul className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <li>
                                <Link href="/" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about/venture-craft" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/ambassadors" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    Ambassadors
                                </Link>
                            </li>
                            <li>
                                <Link href="/outreach-challenge" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    Outreach Challenge
                                </Link>
                            </li>
                            <li>
                                <Link href="/apply" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/apply/faq" className="text-[#9CA3AF] hover:text-[#39cc89] transition-colors duration-300 text-sm">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center">
                        <h4 className="text-white font-semibold text-lg mb-12" style={{ marginBottom: '1.5rem' }}>Contact</h4>
                        <ul className="space-y-6 text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <li className="flex items-center gap-2 text-[#9CA3AF]">
                                <svg className="w-5 h-5 text-[#39cc89] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>KFUPM, Dhahran, Saudi Arabia</span>
                            </li>
                            <li className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Inquiries & Questions</span>
                                <div className="flex items-center gap-2 text-[#9CA3AF]">
                                    <svg className="w-4 h-4 text-[#39cc89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:info.venturecraft@kfupm.edu.sa" className="hover:text-[#39cc89] transition-colors duration-300">
                                        info.venturecraft@kfupm.edu.sa
                                    </a>
                                </div>
                            </li>
                            <li className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Official & Corporate</span>
                                <div className="flex items-center gap-2 text-[#9CA3AF]">
                                    <svg className="w-4 h-4 text-[#39cc89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <a href="mailto:venture-craft@kfupm.edu.sa" className="hover:text-[#39cc89] transition-colors duration-300">
                                        venture-craft@kfupm.edu.sa
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#39cc89]/20 bg-[#0D2B2B]/50">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <p className="text-[#9CA3AF] text-sm">
                            © {new Date().getFullYear()} Venture Craft. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
