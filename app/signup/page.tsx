'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        console.log('🖱️ SUBMIT CLICKED - Starting Sign Up process');
        // alert('Sign Up button clicked!'); // Uncomment if console is hard to see

        if (!fullName.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            setError('Password has to be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            console.log('Attempting to create user...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName
            });

            // 1. SEND EMAIL FIRST (Crucial)
            console.log('Sending verification link...');
            const response = await fetch('/api/send-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fullName }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Email API Error:', result.error);
                throw new Error(result.error || 'Failed to send verification email');
            }

            // 1. FIRESTORE (Must happen BEFORE signOut for permissions)
            try {
                console.log('Updating users database...');
                await setDoc(doc(db, 'users', user.uid), {
                    id: user.uid,
                    email: email.toLowerCase(),
                    displayName: fullName,
                    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=39cc89&color=fff`,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    role: 'user',
                    preferences: {
                        emailNotifications: true,
                        eventReminders: true
                    }
                });
                console.log('✅ Firestore updated.');
            } catch (dbErr: any) {
                console.error('Firestore Error:', dbErr.message);
                // We keep going so the email still sends, but we log the error
            }

            // 2. SIGN OUT (Security- crucial to prevent accidental login before verification)
            // This happens AFTER Firestore is safe
            await signOut(auth);
            console.log('✅ User signed out until verified.');

            setVerificationSent(true);

        } catch (err: any) {
            console.error('Sign Up Error:', err.message);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered.');
            } else {
                setError(err.message || 'Failed to sign up.');
            }
            setLoading(false); // Reset loading so they can try again if it failed
        }
    };

    return (
        <>
            <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#001311]">
                {/* Background Orbs */}
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

                <Link href="/" className="absolute top-6 left-4 md:left-8 text-white/80 hover:text-[#39cc89] flex items-center gap-2 transition-colors z-20 group">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>Go Back</span>
                </Link>

                <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex flex-col items-center">
                    <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl md:p-12 animate-fade-in-up shadow-2xl">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-10 mt-10">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {verificationSent ? 'Check Your Email' : 'Sign Up'}
                                </h1>
                                <p className="text-[#9CA3AF] text-base">
                                    {verificationSent
                                        ? `We've sent a verification link to ${email}. Please click it to activate your account.`
                                        : 'Create an account to join Venture Craft'}
                                </p>
                            </div>

                            {verificationSent ? (
                                <div className="space-y-6">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-full bg-vc-mint/20 flex items-center justify-center border border-vc-mint/30 shadow-[0_0_20px_rgba(79,209,197,0.2)]">
                                            <svg className="w-8 h-8 text-vc-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-center text-white/60 text-sm">
                                        Didn&apos;t receive the email? Check your spam folder or try signing in to resend it.
                                    </p>
                                    <Link
                                        href="/signin"
                                        className="w-full btn-primary block text-center !py-4 !rounded-2xl"
                                    >
                                        Go to Sign In
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-7">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-white/80 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                                            className="w-full py-3 rounded-xl bg-[#0A1F1F]/50 border border-[#39cc89]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39cc89] focus:ring-1 focus:ring-[#39cc89] transition-all duration-300"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                                            className="w-full py-3 rounded-xl bg-[#0A1F1F]/50 border border-[#39cc89]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39cc89] focus:ring-1 focus:ring-[#39cc89] transition-all duration-300"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
                                            className="w-full py-3 rounded-xl bg-[#0A1F1F]/50 border border-[#39cc89]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39cc89] focus:ring-1 focus:ring-[#39cc89] transition-all duration-300"
                                            placeholder="Enter your password"
                                            required
                                            minLength={6}
                                        />
                                        <p className="text-xs text-[#9CA3AF] mt-2">
                                            Password has to be at least 6 characters
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-primary justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-[#39cc89]/40 !py-4 !rounded-2xl"
                                    >
                                        {loading ? 'Signing Up...' : 'Sign Up'}
                                    </button>
                                    {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                                </form>
                            )}

                            <div className="mt-10 pt-6 border-t border-[#39cc89]/10 text-center text-sm text-[#9CA3AF]">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-[#39cc89] hover:text-[#2ECC71] font-semibold transition-colors">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Grid */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
                </div>
            </main>
        </>
    );
}
