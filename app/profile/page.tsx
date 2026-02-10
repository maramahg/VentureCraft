'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User as UserIcon, Mail, Shield, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isJudge, setIsJudge] = useState(false);
    const [isAmbassadorLead, setIsAmbassadorLead] = useState(false);
    const [isAmbassador, setIsAmbassador] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push('/signin');
                return;
            }

            setUser(currentUser);
            setDisplayName(currentUser.displayName || '');
            setPhotoURL(currentUser.photoURL || '');

            try {
                // 1. Check Admin
                const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
                if (adminDoc.exists()) {
                    setIsAdmin(true);
                }

                // 2. Check Judge
                const judgeDoc = await getDoc(doc(db, 'judges', currentUser.uid));
                if (judgeDoc.exists()) {
                    setIsJudge(true);
                }

                // 3. Check Ambassador Lead
                const leadDoc = await getDoc(doc(db, 'ambassadors_lead', currentUser.uid));
                if (leadDoc.exists()) {
                    setIsAmbassadorLead(true);
                }

                // 4. Check Ambassador Status (from users collection)
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setIsAmbassador(userData.role === 'ambassador');
                }
            } catch (error) {
                console.error('Error checking role:', error);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            // Create a preview URL
            setPhotoURL(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            let newPhotoURL = user.photoURL;

            // 1. Upload new image if selected
            if (imageFile) {
                // Security check before upload
                const computeSHA256 = async (file: File) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                };

                const hash = await computeSHA256(imageFile);
                const checkRes = await fetch('/api/security-check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hash })
                });

                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.status === 'malicious' || checkData.status === 'suspicious') {
                        const detections = (checkData.stats?.malicious || 0) + (checkData.stats?.suspicious || 0);
                        throw new Error(`Security Alert: This image file has been flagged by ${detections} security engine${detections > 1 ? 's' : ''}. For safety, we cannot accept flagged files. Please use a different image.`);
                    }
                }

                const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                newPhotoURL = await getDownloadURL(storageRef);
            }

            // 2. Update Auth Profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: newPhotoURL
            });

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000); // Clear message after 3 seconds

            // Refresh local state ensuring persistence
            setUser({ ...user, displayName, photoURL: newPhotoURL });

            // Clear temporary file
            setImageFile(null);
            setIsEditing(false); // Exit edit mode on success

        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-32 pb-12 px-4">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold font-poppins">My Profile</h1>
                </div>

                <div className="glass-panel p-8 bg-[#0D1B1A] border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">

                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-vc-mint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#21428f]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <form onSubmit={handleSave} className="relative space-y-8">

                        {/* Profile Photo Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0D1B1A] ring-4 ring-white/10 shadow-xl bg-black/20 relative">
                                    {photoURL ? (
                                        <Image
                                            src={photoURL}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                            unoptimized // For blob/external URLs
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                                            <UserIcon className="w-12 h-12 text-white/30" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-2.5 rounded-full bg-vc-mint text-[#001311] shadow-lg hover:scale-110 hover:bg-white transition-all duration-300"
                                        >
                                            <Camera className="w-5 h-5" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </>
                                )}
                            </div>

                            <div className="text-center">
                                <div className="flex flex-wrap justify-center gap-2">
                                    {isAdmin && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-vc-mint/10 border-vc-mint/30 text-vc-mint">
                                            <Shield className="w-3 h-3" />
                                            Administrator
                                        </span>
                                    )}
                                    {isJudge && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-[#21428f]/10 border-[#21428f]/30 text-[#21428f]">
                                            <Shield className="w-3 h-3" />
                                            Judge
                                        </span>
                                    )}
                                    {isAmbassadorLead && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-vc-mint/10 border-vc-mint/30 text-vc-mint">
                                            <Shield className="w-3 h-3" />
                                            Ambassador Lead
                                        </span>
                                    )}
                                    {isAmbassador && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-vc-teal/10 border-vc-teal/30 text-vc-teal">
                                            <Shield className="w-3 h-3" />
                                            Ambassador
                                        </span>
                                    )}
                                    {!isAdmin && !isJudge && !isAmbassadorLead && !isAmbassador && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-white/5 border-white/10 text-white/50">
                                            <UserIcon className="w-3 h-3" />
                                            User
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Full Name</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full rounded-xl pl-12 pr-4 py-3.5 transition-all text-white placeholder-white/20 ${isEditing
                                            ? 'bg-black/20 border border-white/10 focus:outline-none focus:border-vc-mint focus:bg-white/5'
                                            : 'bg-transparent border border-transparent pl-12'
                                            }`}
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="email"
                                        value={user.email || ''}
                                        disabled
                                        className="w-full bg-transparent border border-transparent rounded-xl pl-12 pr-4 py-3.5 text-white/50 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Feedback Messages */}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                                {success}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-4">
                            {isEditing ? (
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full btn-primary !py-4 !rounded-xl text-lg font-bold flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Saving Changes...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditing(true);
                                    }}
                                    className="w-full py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
