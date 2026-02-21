'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

function ResetPasswordContent() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(true);
    const [error, setError] = useState('');
    const [isInvalidLink, setIsInvalidLink] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (!oobCode) {
            setError('Invalid or expired password reset link.');
            setIsInvalidLink(true);
            setVerifyLoading(false);
            return;
        }

        // Verify the reset code and get the user's email
        verifyPasswordResetCode(auth, oobCode)
            .then((userEmail) => {
                setEmail(userEmail);
                setVerifyLoading(false);
            })
            .catch((err) => {
                console.error('Code Verification Error:', err);
                setError('This password reset link is invalid or has expired.');
                setIsInvalidLink(true);
                setVerifyLoading(false);
            });
    }, [oobCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password has to be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await confirmPasswordReset(auth, oobCode!, newPassword);
            setSuccess(true);
            setTimeout(() => {
                router.push('/signin');
            }, 3000);
        } catch (err: any) {
            console.error('Password Reset Error:', err);
            setError(getAuthErrorMessage(err.code));
        } finally {
            setLoading(false);
        }
    };

    if (verifyLoading) {
        return (
            <div className="min-h-screen bg-[#001311] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin mb-6" />
                <p className="text-white/40 font-poppins text-sm animate-pulse tracking-[0.2em] uppercase">Securing Connection...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#001311]">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex flex-col items-center">
                <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] animate-fade-in-up shadow-2xl">
                    {isInvalidLink ? (
                        <div className="text-center py-4">
                            <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-6">
                                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 font-poppins">Invalid Link</h3>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        {error || 'This password reset link is invalid or has expired.'}
                                    </p>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="flex items-center justify-center gap-2 text-vc-mint font-bold uppercase tracking-[0.2em] text-xs pt-4 hover:gap-4 transition-all"
                                >
                                    Request New Link <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ) : !success ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 bg-vc-mint/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Lock className="text-vc-mint w-8 h-8" />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-3 font-poppins">
                                    Set New Password
                                </h1>
                                <p className="text-white/40 text-sm leading-relaxed max-w-[280px] mx-auto">
                                    Resetting password for <span className="text-vc-mint font-medium">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="new-password" className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                                            New Password
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="new-password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full py-4 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-vc-mint focus:ring-1 focus:ring-vc-mint transition-all duration-300"
                                                placeholder="Enter your new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-vc-mint transition-colors"
                                            >
                                                {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-white/30 ml-1 mt-2">
                                            Password has to be at least 6 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="confirm-password" className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                                            Repeat Password
                                        </label>
                                        <div className="relative group">
                                            <input
                                                id="confirm-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full py-4 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-vc-mint focus:ring-1 focus:ring-vc-mint transition-all duration-300"
                                                placeholder="Repeat your new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-vc-mint transition-colors"
                                            >
                                                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !newPassword || !confirmPassword}
                                    className="w-full btn-primary !py-4 !rounded-2xl justify-center text-base font-bold uppercase tracking-widest shadow-xl shadow-vc-mint/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Updating Password...' : 'Update Password'}
                                </button>

                                {error && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-shake">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-red-500 text-xs font-medium leading-relaxed">{error}</p>
                                    </div>
                                )}
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="p-8 rounded-[2.5rem] bg-vc-mint/5 border border-vc-mint/10 space-y-6">
                                <div className="w-20 h-20 bg-vc-mint/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(57,204,137,0.2)]">
                                    <CheckCircle className="w-10 h-10 text-vc-mint" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2 font-poppins">Successfully Updated</h3>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        Your password has been reset. You'll be redirected to the sign in page in a few seconds.
                                    </p>
                                </div>
                                <Link
                                    href="/signin"
                                    className="flex items-center justify-center gap-2 text-vc-mint font-bold uppercase tracking-[0.2em] text-xs pt-4 hover:gap-4 transition-all"
                                >
                                    Sign In Now <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#39cc89_1px,transparent_1px)] [background-size:48px_48px]" />
            </div>
        </main>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#001311] flex items-center justify-center p-6">
                <div className="w-12 h-12 border-4 border-vc-mint border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
