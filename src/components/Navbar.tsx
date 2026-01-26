'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Registration', href: '/register' },
    { name: 'Ambassadors', href: '/team' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            setIsProfileDropdownOpen(false);
            router.push('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <nav style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: `translate(-50%, ${loading ? '-200%' : '0'})`,
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
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
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
                    {/* Sign In Button (Desktop) - Show skeleton when loading, content when loaded */}
                    {/* Sign In Button (Desktop) - Show generic avatar when loading */}
                    {/* Sign In Button (Desktop) */}
                    {user ? (
                        <div className="relative hidden lg:block" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 focus:outline-none group"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#39cc89] to-[#268c5e] flex items-center justify-center text-white font-semibold border-2 border-[#39cc89]/20 shadow-md group-hover:scale-105 transition-transform">
                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                </div>
                                <svg
                                    className={`w-4 h-4 text-white/80 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div
                                    className="absolute right-0 top-full mt-4 bg-[#0A1F1F] border border-[#39cc89]/20 rounded-2xl shadow-2xl backdrop-blur-xl animate-fade-in origin-top-right overflow-hidden z-50 ring-1 ring-white/5"
                                    style={{ width: '280px' }}
                                >
                                    {/* Header with Name */}
                                    <div className="border-b border-[#39cc89]/10" style={{ padding: '24px 32px' }}>
                                        <p className="text-white font-semibold text-xl truncate" style={{ fontFamily: 'var(--font-poppins)' }}>
                                            {user.displayName || 'User'}
                                        </p>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-4">
                                        <Link
                                            href="/profile"
                                            className="group flex items-center text-base text-white/80 hover:bg-[#39cc89]/10 hover:text-white transition-all duration-200"
                                            style={{ padding: '20px 32px' }}
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                        >
                                            <svg className="w-5 h-5 mr-5 text-[#39cc89]/70 group-hover:text-[#39cc89] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>
                                    </div>

                                    {/* Footer with Sign Out */}
                                    <div className="border-t border-[#39cc89]/10 py-4">
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left flex items-center text-base text-red-400/90 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                                            style={{ padding: '20px 32px' }}
                                        >
                                            <svg className="w-5 h-5 mr-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
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
                    )}

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

                        {user && (
                            <>
                                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '4px 0' }} />

                                <Link
                                    href="/profile"
                                    className="flex items-center justify-center text-white/85 hover:text-white transition-colors"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '8px 0',
                                        textDecoration: 'none'
                                    }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 mr-2 text-[#39cc89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    My Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center text-red-400/90 hover:text-red-400 transition-colors w-full"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        padding: '8px 0'
                                    }}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
