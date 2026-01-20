'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Registration', href: '/register' },
    { name: 'Ambassadors', href: '/team' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '1100px',
            backgroundColor: 'rgba(57, 204, 137, 0.3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(57, 204, 137, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            willChange: 'transform',
            isolation: 'isolate'
        } as React.CSSProperties}>
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

                {/* Right - Sign In Button & Mobile Toggle */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                    {/* Sign In Button (Desktop) */}
                    <Link
                        href="/signin"
                        className="hidden lg:block btn-secondary"
                        style={{
                            padding: '8px 20px',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        Sign in
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
    );
}
