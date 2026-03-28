'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, updateDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User as UserIcon, Mail, Shield, Camera, Save, Loader2, Trophy, Star, TrendingUp, CircleDollarSign, Link as LinkIcon, Edit2, Hash, Rocket } from 'lucide-react';
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
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [points, setPoints] = useState(0);
    const [rank, setRank] = useState<number | null>(null);
    const [totalAmbassadors, setTotalAmbassadors] = useState<number>(0);
    const [ambassadorId, setAmbassadorId] = useState<number | null>(null);
    const [isOutreach, setIsOutreach] = useState(false);
    const [outreachId, setOutreachId] = useState<number | null>(null);
    const [totalOutreach, setTotalOutreach] = useState<number>(0);
    const [pointHistory, setPointHistory] = useState<Array<{ points: number, reason: string, timestamp: any }>>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [showAllHistory, setShowAllHistory] = useState(false);

    // Application States
    const [application, setApplication] = useState<any>(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
    const [loadingApp, setLoadingApp] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Handle Authentication & Initial Loading
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                if (!loading) router.push('/signin');
                return;
            }

            setUser(currentUser);
            setDisplayName(currentUser.displayName || '');
            setPhotoURL(currentUser.photoURL || '');
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, [router]);

    // 2. Fetch User Profile Data & Application (Real-time)
    useEffect(() => {
        if (!user) return;

        let unsubscribeApp: () => void = () => { };
        let unsubscribeReg: () => void = () => { };

        const fetchProfileData = async () => {
            try {
                // Fetch profile links
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setLinkedin(data.linkedin || '');
                    setPortfolio(data.portfolio || '');
                }

                // Check Roles
                const [adminDoc, judgeDoc, leadDoc, uDoc, ambDoc, outDoc] = await Promise.all([
                    getDoc(doc(db, 'admins', user.uid)),
                    getDoc(doc(db, 'judges', user.uid)),
                    getDoc(doc(db, 'ambassadors_lead', user.uid)),
                    getDoc(doc(db, 'users', user.uid)),
                    getDoc(doc(db, 'ambassadors', user.uid)),
                    getDoc(doc(db, 'outreach_participants', user.uid))
                ]);

                if (adminDoc.exists()) setIsAdmin(true);
                if (judgeDoc.exists()) setIsJudge(true);
                if (leadDoc.exists()) setIsAmbassadorLead(true);

                let userIsAmbassador = false;
                let userIsOutreach = false;
                let userPoints = 0;

                if (uDoc.exists()) {
                    const userData = uDoc.data();
                    userIsAmbassador = userData.role === 'ambassador';
                    userIsOutreach = userData.role === 'outreach';
                    userPoints = userData.points || 0;
                    setAmbassadorId(userData.ambassadorId || null);
                    setOutreachId(userData.outreachId || null);
                }

                if (ambDoc.exists()) {
                    const ambData = ambDoc.data();
                    userIsAmbassador = true;
                    userPoints = ambData.points || 0;
                    setAmbassadorId(ambData.ambassadorId || null);
                } else if (userIsAmbassador) {
                    // Self-healing: if role says ambassador but document is missing, revert them.
                    userIsAmbassador = false;
                    try {
                        await updateDoc(doc(db, 'users', user.uid), { role: 'user', ambassadorId: null });
                    } catch (e) {
                        console.warn('Silent role reversion failed:', e);
                    }
                }

                if (outDoc.exists()) {
                    const outData = outDoc.data();
                    userIsOutreach = true;
                    userPoints = Math.max(userPoints, outData.points || 0);
                    setOutreachId(outData.outreachId || null);
                } else if (userIsOutreach) {
                    // Self-healing: if role says outreach but document is missing, revert them.
                    userIsOutreach = false;
                    try {
                        await updateDoc(doc(db, 'users', user.uid), { role: 'user', outreachId: null });
                    } catch (e) {
                        console.warn('Silent role reversion failed:', e);
                    }
                }

                setIsAmbassador(userIsAmbassador);
                setIsOutreach(userIsOutreach);
                setPoints(userPoints);

                // Update lastSeenPoints
                await updateDoc(doc(db, 'users', user.uid), {
                    lastSeenPoints: userPoints
                });

                if (userIsAmbassador || userIsOutreach) {
                    const collectionName = userIsAmbassador ? 'ambassadors' : 'outreach_participants';
                    const pointField = userIsAmbassador ? 'points' : 'points';
                    const idField = userIsAmbassador ? 'ambassadorId' : 'outreachId';

                    const snapshot = await getDocs(collection(db, collectionName));
                    const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                    const sortedDocs = allDocs.sort((a: any, b: any) => (b.points || 0) - (a.points || 0));

                    let userRank = null;
                    if (userPoints > 0) {
                        const foundIndex = sortedDocs.findIndex(doc => doc.id === user.uid);
                        if (foundIndex !== -1) userRank = foundIndex + 1;
                    }
                    setRank(userRank);
                    if (userIsAmbassador) setTotalAmbassadors(sortedDocs.length);
                    if (userIsOutreach) setTotalOutreach(sortedDocs.length);

                    const historyQuery = query(
                        collection(db, 'users', user.uid, 'point_history'),
                        orderBy('timestamp', 'desc')
                    );
                    const historySnapshot = await getDocs(historyQuery);
                    setPointHistory(historySnapshot.docs.map(d => ({
                        points: d.data().points,
                        reason: d.data().reason,
                        timestamp: d.data().timestamp
                    })));
                }

                // Real-time Subscriptions
                unsubscribeReg = onSnapshot(doc(db, 'settings', 'registration'), (snapshot) => {
                    if (snapshot.exists()) {
                        setIsRegistrationOpen(snapshot.data().isOpen ?? true);
                    }
                });

                unsubscribeApp = onSnapshot(doc(db, 'applications', user.uid), (snapshot) => {
                    if (snapshot.exists()) {
                        setApplication({ id: snapshot.id, ...snapshot.data() });
                    }
                    setLoadingApp(false);
                }, (err) => {
                    console.error('App listen error:', err);
                    setLoadingApp(false);
                });

            } catch (err) {
                console.error("Error fetching profile data:", err);
                setLoadingApp(false);
            }
        };

        fetchProfileData();

        return () => {
            unsubscribeReg();
            unsubscribeApp();
        };
    }, [user]);

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

                const storageRef = ref(storage, `profiles/${user.uid}/${Date.now()}-${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                newPhotoURL = await getDownloadURL(storageRef);
            }

            // 2. Update Auth Profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: displayName,
                    photoURL: newPhotoURL
                });
            }

            // 3. Update User Document with Profile Links
            await setDoc(doc(db, 'users', user.uid), {
                linkedin: linkedin,
                portfolio: portfolio
            }, { merge: true });

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
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border bg-vc-mint/5 border-vc-mint/20 text-vc-mint shadow-[0_0_20px_rgba(20,250,230,0.05)]">
                                            <Shield className="w-3.5 h-3.5 fill-vc-mint/20" />
                                            Ambassador
                                        </div>
                                    )}
                                    {isOutreach && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] border bg-vc-mint/5 border-vc-mint/20 text-vc-mint shadow-[0_0_20px_rgba(20,250,230,0.05)]">
                                            <Star className="w-3.5 h-3.5 fill-vc-mint/20" />
                                            Outreach Participant
                                        </div>
                                    )}
                                    {!isAdmin && !isJudge && !isAmbassadorLead && !isAmbassador && !isOutreach && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border bg-white/5 border-white/10 text-white/50">
                                            <UserIcon className="w-3 h-3" />
                                            User
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Application Card */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">My Startup Application</h3>
                                <Rocket className="w-4 h-4 text-vc-mint/30" />
                            </div>

                            {loadingApp ? (
                                <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-vc-mint/40" />
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">Checking status...</p>
                                </div>
                            ) : application ? (
                                <div className="group relative overflow-hidden rounded-2xl p-6 bg-white/5 border border-white/10 hover:border-vc-mint/30 transition-all duration-300">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold text-white mb-1">{application.startupName || 'Unnamed Startup'}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-vc-mint">Status: {application.status}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="text-[10px] uppercase tracking-widest font-medium text-white/30">
                                                    Submitted {application.submittedAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-vc-mint/10 border border-vc-mint/20 text-vc-mint">
                                            <Rocket className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {isRegistrationOpen ? (
                                        <Link
                                            href="/apply?step=1"
                                            className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-vc-mint text-[#001311] font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-vc-mint/10"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Maintain / Edit Application
                                        </Link>
                                    ) : (
                                        <div className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-white/5 border border-white/10 text-white/40 font-bold text-sm cursor-not-allowed">
                                            <Shield className="w-4 h-4" />
                                            Registration Closed - Screening Round
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-vc-mint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-vc-mint/10 mb-4 transition-colors" />
                                </div>
                            ) : (
                                <div className="p-10 rounded-2xl bg-white/0 border border-dashed border-white/10 text-center space-y-4">
                                    <p className="text-sm text-white/40 italic font-poppins px-8">You haven't submitted an application for the competition yet.</p>
                                    {isRegistrationOpen ? (
                                        <Link
                                            href="/apply"
                                            className="inline-flex items-center gap-2 text-vc-mint hover:underline font-bold text-sm uppercase tracking-widest"
                                        >
                                            Start Application Now
                                            <TrendingUp className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <p className="text-[10px] uppercase tracking-widest font-black text-white/20">Registration is currently closed</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Rewards Card (Ambassador or Outreach) */}
                        {(isAmbassador || isOutreach) && (
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative overflow-hidden rounded-3xl p-px bg-gradient-to-br from-vc-mint/40 via-vc-mint/5 to-transparent border border-white/10"
                                >
                                    <div className="bg-[#0a1b1a] rounded-[1.4rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex flex-col gap-1 items-center sm:items-start">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vc-mint/60">Venture Coins</span>
                                            <div className="flex items-center gap-2">
                                                <CircleDollarSign className="w-6 h-6 text-vc-mint" />
                                                <span className="text-2xl font-black text-white">{points} <span className="text-xs font-normal text-white/40 ml-1 uppercase">Venture Coins</span></span>
                                            </div>
                                        </div>

                                        <div className="hidden sm:block h-10 w-px bg-white/5" />

                                        <div className="flex flex-col gap-1 items-center sm:items-end">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-vc-mint/60">Your Rank</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-white">#{rank || '--'} <span className="text-[10px] font-normal text-white/40 ml-1 uppercase">out of {isAmbassador ? totalAmbassadors : totalOutreach || '--'}</span></span>
                                                {rank && rank <= 3 ? (
                                                    <Trophy className={`w-5 h-5 ${rank === 1 ? 'text-yellow-500 fill-yellow-500/20' :
                                                        rank === 2 ? 'text-slate-300 fill-slate-300/20' :
                                                            'text-amber-600 fill-amber-600/20'
                                                        }`} />
                                                ) : (
                                                    <TrendingUp className="w-5 h-5 text-vc-mint" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-vc-mint/10 rounded-full blur-2xl pointer-events-none" />
                                </motion.div>

                                {/* Reward History List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Contribution History</h3>
                                        <Star className="w-4 h-4 text-vc-mint/30" />
                                    </div>

                                    <div className="space-y-3">
                                        {loadingHistory ? (
                                            <div className="py-8 flex flex-col items-center justify-center gap-3 text-white/20">
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <p className="text-[10px] uppercase tracking-widest font-bold">Loading history...</p>
                                            </div>
                                        ) : pointHistory.length === 0 ? (
                                            <div className="py-12 px-6 rounded-2xl bg-white/0 border border-dashed border-white/10 text-center">
                                                <p className="text-xs text-white/30 italic font-poppins">No rewards logged yet. Keep up the great work!</p>
                                            </div>
                                        ) : (
                                            <>
                                                {(showAllHistory ? pointHistory : pointHistory.slice(0, 3)).map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 group hover:bg-white/[0.07] transition-all"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-white/80 font-medium truncate font-poppins mb-1">{item.reason}</p>
                                                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">
                                                                {item.timestamp?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent'}
                                                            </p>
                                                        </div>
                                                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${item.points > 0 ? 'bg-vc-mint/10 border-vc-mint/20 text-vc-mint' : 'bg-red-500/10 border-red-500/20 text-red-400'
                                                            }`}>
                                                            {item.points > 0 ? '+' : ''}{item.points}
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {pointHistory.length > 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAllHistory(!showAllHistory)}
                                                        className="w-full py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        {showAllHistory ? 'Show Less' : 'Show More'}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="h-4" /> {/* Spacer */}
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="space-y-6">
                            {(isAmbassador || isOutreach) && (ambassadorId || outreachId) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">
                                        {isAmbassador ? 'Ambassador ID' : 'Outreach ID'}
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vc-mint/40" />
                                        <div className="w-full rounded-xl pl-12 pr-4 py-3.5 bg-vc-mint/5 border border-vc-mint/20 text-vc-mint font-black tracking-widest text-sm">
                                            #{isAmbassador ? ambassadorId : outreachId}
                                        </div>
                                    </div>
                                </div>
                            )}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">LinkedIn</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="url"
                                            value={linkedin}
                                            onChange={(e) => setLinkedin(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full rounded-xl pl-12 pr-4 py-3.5 transition-all text-white placeholder-white/20 ${isEditing
                                                ? 'bg-black/20 border border-white/10 focus:outline-none focus:border-vc-mint focus:bg-white/5'
                                                : 'bg-transparent border border-transparent pl-12'
                                                }`}
                                            placeholder="https://linkedin.com/in/..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-1">Portfolio</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                        <input
                                            type="url"
                                            value={portfolio}
                                            onChange={(e) => setPortfolio(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full rounded-xl pl-12 pr-4 py-3.5 transition-all text-white placeholder-white/20 ${isEditing
                                                ? 'bg-black/20 border border-white/10 focus:outline-none focus:border-vc-mint focus:bg-white/5'
                                                : 'bg-transparent border border-transparent pl-12'
                                                }`}
                                            placeholder="https://yourportfolio.com"
                                        />
                                    </div>
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
