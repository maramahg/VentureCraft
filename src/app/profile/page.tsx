'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/signin');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) return null;

    return (
        <>
            <Navbar />
            <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0A1F1F] via-[#0A1F1F] to-[#1a4d4d] pt-24">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f2873]/5 via-transparent to-[#39cc89]/5 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
                        My Profile
                    </h1>

                    <div className="max-w-md mx-auto glass p-8 rounded-3xl border border-[#39cc89]/20 text-center">
                        <div className="w-20 h-20 bg-[#39cc89]/20 rounded-full mx-auto flex items-center justify-center mb-6 border border-[#39cc89]">
                            <span className="text-3xl text-[#39cc89] font-bold">
                                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <h2 className="text-2xl text-white font-semibold mb-2">{user?.displayName || 'User'}</h2>
                        <p className="text-[#9CA3AF] mb-6">{user?.email}</p>

                        <div className="p-4 bg-[#0A1F1F]/50 rounded-xl border border-[#39cc89]/10">
                            <p className="text-sm text-[#39cc89]">Profile management coming soon</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
