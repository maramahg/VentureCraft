'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your email address...');

    const verifyStarted = typeof window !== 'undefined' ? (window as any)._verifyStarted : false;

    useEffect(() => {
        const oobCode = searchParams.get('oobCode');
        const mode = searchParams.get('mode');

        if (mode === 'verifyEmail' && oobCode) {
            // Prevent double-execution in dev mode
            if (!(window as any)._verifyStarted) {
                (window as any)._verifyStarted = true;
                handleVerification(oobCode);
            }
        } else {
            setStatus('error');
            setMessage('Invalid verification link or missing code.');
        }

        return () => {
            // Cleanup on unmount if needed
        };
    }, [searchParams]);

    const handleVerification = async (oobCode: string) => {
        try {
            await applyActionCode(auth, oobCode);
            setStatus('success');
            setMessage('Your email has been successfully verified! You can now access all features.');
        } catch (err: any) {
            console.error('Verification error:', err);
            setStatus('error');
            setMessage(err.message || 'The link may have expired or already been used.');
        }
    };

    return (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl md:p-12 animate-fade-in-up shadow-2xl relative z-10 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
            >
                {status === 'verifying' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-16 h-16 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
                        <h1 className="text-2xl font-bold text-white">Verifying...</h1>
                        <p className="text-white/60">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-vc-mint/20 flex items-center justify-center border border-vc-mint/30 shadow-[0_0_30px_rgba(79,209,197,0.3)]">
                            <svg className="w-10 h-10 text-vc-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Email Verified!</h1>
                        <p className="text-white/70 leading-relaxed">{message}</p>
                        <Link
                            href="/signin"
                            className="w-full btn-primary block !py-4 !rounded-2xl text-lg shadow-lg hover:shadow-vc-mint/40 transition-all font-semibold"
                        >
                            Sign In to Your Account
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Verification Failed</h1>
                        <p className="text-red-400/80 leading-relaxed">{message}</p>
                        <div className="w-full space-y-4">
                            <Link
                                href="/signup"
                                className="w-full btn-primary block !py-4 !rounded-2xl text-lg font-semibold"
                            >
                                Try Signing Up Again
                            </Link>
                            <Link
                                href="/"
                                className="block text-white/40 hover:text-white transition-colors text-sm"
                            >
                                Go Back to Home
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#001311] px-4">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-vc-mint/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[50%] h-[50%] bg-vc-teal/15 rounded-full blur-[150px] pointer-events-none" />

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px] opacity-20 -z-10" />

            <Suspense fallback={
                <div className="w-16 h-16 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
            }>
                <VerifyEmailContent />
            </Suspense>
        </main>
    );
}
