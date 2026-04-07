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
                const [adminDoc, superAdminDoc] = await Promise.all([
                    getDoc(doc(db, 'admins', user.uid)),
                    getDoc(doc(db, 'super_admins', user.uid))
                ]);
                
                if (superAdminDoc.exists()) {
                    setIsAdmin(true); // Reusing 'isAdmin' state name but check is for Super Admin
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
                className="relative z-10 text-center max-w-5xl mt-24 md:mt-32 w-full px-4"
            >
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-poppins uppercase tracking-tighter">
                        Venture Craft <span className="text-vc-mint">QR</span> Panel
                    </h1>
                    <p className="text-white/60 font-poppins max-w-2xl mx-auto">
                        Official persistent QR codes for VentureCraft. These codes will never expire and point to our official platforms.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Website QR */}
                    <div className="glass-panel p-8 md:p-10 relative group">
                        <div className="absolute inset-0 bg-vc-mint/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Main Website</h3>
                            <p className="text-white/40 text-sm">kfupm-venturecraft.org</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] shadow-2xl mx-auto w-fit mb-8">
                            <QRCodeSVG
                                id="qr-main-website"
                                value="https://kfupm-venturecraft.org/"
                                size={300}
                                level="H"
                                includeMargin={false}
                                className="w-full h-auto max-w-[300px]"
                                imageSettings={{
                                    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                                    height: 80,
                                    width: 80,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <button
                            onClick={() => {
                                const svg = document.getElementById('qr-main-website');
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
                                        downloadLink.download = 'VentureCraft-Official-QR.png';
                                        downloadLink.href = pngFile;
                                        downloadLink.click();
                                    }
                                };
                                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-vc-mint text-vc-green-dark font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-vc-mint/20"
                        >
                            <Download className="w-5 h-5" />
                            Download Website QR
                        </button>
                    </div>

                    {/* Socials Linktree QR */}
                    <div className="glass-panel p-8 md:p-10 relative group">
                        <div className="absolute inset-0 bg-vc-teal/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Socials Linktree</h3>
                            <p className="text-white/40 text-sm">kfupm-venturecraft.org/socials</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] shadow-2xl mx-auto w-fit mb-8">
                            <QRCodeSVG
                                id="qr-socials-linktree"
                                value="https://kfupm-venturecraft.org/socials"
                                size={300}
                                level="H"
                                includeMargin={false}
                                className="w-full h-auto max-w-[300px]"
                                imageSettings={{
                                    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                                    height: 80,
                                    width: 80,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <button
                            onClick={() => {
                                const svg = document.getElementById('qr-socials-linktree');
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
                                        downloadLink.download = 'VentureCraft-Socials-QR.png';
                                        downloadLink.href = pngFile;
                                        downloadLink.click();
                                    }
                                };
                                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-vc-teal text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-vc-teal/20"
                        >
                            <Download className="w-5 h-5" />
                            Download Socials QR
                        </button>
                    </div>

                    {/* Outreach Challenge QR */}
                    <div className="glass-panel p-8 md:p-10 relative group">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Outreach Challenge</h3>
                            <p className="text-white/40 text-sm">kfupm-venturecraft.org/outreach-challenge</p>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] shadow-2xl mx-auto w-fit mb-8">
                            <QRCodeSVG
                                id="qr-outreach-challenge"
                                value="https://kfupm-venturecraft.org/outreach-challenge"
                                size={300}
                                level="H"
                                includeMargin={false}
                                className="w-full h-auto max-w-[300px]"
                                imageSettings={{
                                    src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
                                    height: 80,
                                    width: 80,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <button
                            onClick={() => {
                                const svg = document.getElementById('qr-outreach-challenge');
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
                                        downloadLink.download = 'VentureCraft-Outreach-Challenge-QR.png';
                                        downloadLink.href = pngFile;
                                        downloadLink.click();
                                    }
                                };
                                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Download className="w-5 h-5" />
                            Download Challenge QR
                        </button>
                    </div>
                </div>
            </motion.div>
        </main >
    );
}
