'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/api/send-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Password Reset Request Error:', err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center relative overflow-hidden bg-[#001311]">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            {/* Back Button */}
            <Link href="/signin" className="absolute top-6 left-4 md:left-8 text-white/80 hover:text-vc-mint flex items-center gap-2 transition-colors z-20 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium font-poppins text-sm uppercase tracking-widest">Back to Sign In</span>
            </Link>

            <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex flex-col items-center">
                <div className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] animate-fade-in-up shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-vc-mint/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail className="text-vc-mint w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3 font-poppins">
                            Forgot Password
                        </h1>
                        <p className="text-white/40 text-sm leading-relaxed max-w-[280px] mx-auto">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-xs font-bold text-white/40 uppercase tracking-widest ml-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-4 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-vc-mint focus:ring-1 focus:ring-vc-mint transition-all duration-300"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                    <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within:text-vc-mint transition-colors" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full btn-primary !py-4 !rounded-2xl justify-center text-base font-bold uppercase tracking-widest shadow-xl shadow-vc-mint/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-vc-green-dark/30 border-t-vc-green-dark rounded-full animate-spin" />
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-shake">
                                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <p className="text-red-500 text-xs font-medium leading-relaxed">{error}</p>
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="text-center space-y-8 py-4">
                            <div className="p-6 rounded-[2rem] bg-vc-mint/5 border border-vc-mint/10">
                                <CheckCircle className="w-12 h-12 text-vc-mint mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2 font-poppins">Check Your Email</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    A password reset link has been sent to <span className="text-vc-mint font-medium">{email}</span>.
                                </p>
                            </div>

                            <p className="text-white/30 text-xs leading-relaxed">
                                Didn't receive the email? Check your spam folder or wait a few minutes before trying again.
                            </p>

                            <button
                                onClick={() => setSuccess(false)}
                                className="text-vc-mint hover:text-vc-mint/80 font-bold uppercase tracking-widest text-[10px] pb-1 border-b border-vc-mint/20 transition-all"
                            >
                                Try another email
                            </button>
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
