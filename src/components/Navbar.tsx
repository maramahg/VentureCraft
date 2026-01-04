'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Our Team', href: '/team' },
    { name: 'Join Us', href: '/join' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            padding: '16px'
        }}>
            <nav style={{
                margin: '0 auto',
                maxWidth: '1100px',
                backgroundColor: 'rgba(57, 204, 137, 0.3)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(57, 204, 137, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '56px',
                    padding: '0 24px'
                }}>
                    {/* Left - Logo */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Link href="/" style={{ width: 'auto', height: '32px', display: 'block' }}>
                            <Image
                                src="/images/navbar-logo.png"
                                alt="Venture Craft"
                                width={128}
                                height={32}
                                className="object-contain"
                                style={{ width: 'auto', height: '100%' }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center - Navigation */}
                    <div style={{ alignItems: 'center', gap: '32px' }} className="hidden lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                style={{
                                    color: 'rgba(255, 255, 255, 0.85)',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right - User Icon & Mobile Toggle */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                        {/* User Icon (Desktop) */}
                        <Link
                            href="/profile"
                            className="hidden lg:flex"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255, 255, 255, 0.85)',
                                transition: 'all 0.2s'
                            }}
                        >
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden"
                            style={{ color: 'white', padding: '4px' }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden grid transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                >
                    <div className="overflow-hidden">
                        <div style={{
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '16px 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.85)',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '8px 0',
                                        textDecoration: 'none',
                                        textAlign: 'center',
                                        display: 'block'
                                    }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
