'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function QRPage() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/signin?redirect=/qr');
                return;
            }

            try {
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                if (adminDoc.exists()) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const downloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = 1000;
            canvas.height = 1000;
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 1000, 1000);
                const pngFile = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.download = 'VentureCraft-QR.png';
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-[#001D1B] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <main className="min-h-screen bg-[#001D1B] flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="w-20 h-20 text-red-500 mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4 font-poppins">Access Denied</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    You do not have the necessary permissions to access this page. Please contact an administrator if you believe this is an error.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                >
                    Return Home
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#001D1B] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-vc-mint/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[120px]" />
            </div>



            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center max-w-xl mt-24 md:mt-32"
            >
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins uppercase tracking-tighter">
                    Venture Craft <span className="text-vc-mint">QR</span>
                </h1>
                <p className="text-white/60 mb-12 font-poppins">
                    This is a static QR code. It will never expire. The center is emptied so you can place your logo there in any design tool.
                </p>

                <div className="glass-panel p-8 md:p-12 max-w-2xl mx-auto w-full mb-12 relative group">
                    <div className="absolute inset-0 bg-vc-mint/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl mx-auto w-fit">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value="https://kfupm-venturecraft.org/"
                            size={300}
                            level="H"
                            includeMargin={false}
                            className="w-full h-auto max-w-[250px] md:max-w-[300px]"
                            imageSettings={{
                                src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                                height: 80,
                                width: 80,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
                        <button
                            onClick={downloadQR}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-vc-mint text-vc-green-dark font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-vc-mint/20 text-sm md:text-base whitespace-nowrap"
                        >
                            <Download className="w-5 h-5" />
                            Download PNG
                        </button>
                    </div>
                </div>
            </motion.div>
        </main >
    );
}
