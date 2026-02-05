'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Rocket, CheckCircle, XCircle, Clock,
    Filter, Search, ChevronDown, Eye, Mail,
    Phone, Globe, Linkedin, Video, ArrowLeft,
    Check, X, AlertCircle, Shield, FileText, FileCode,
    User
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Application {
    id: string;
    userId: string;
    status: 'pending' | 'accepted' | 'rejected' | 'submitted';
    submittedAt: any;
    teamSize: number;
    teamMembers: Array<{ name: string; nationality: string }>;
    leaderEmail: string;
    leaderPhone: string;
    leaderNationality: string;
    pillar: string;
    stage: string;
    isOlderThan5Years: string;
    website: string;
    linkedin: string;
    videoPitchUrl: string;
    materials: {
        pitchDeckName?: string;
        pitchDeckUrl?: string;
        execSummaryName?: string;
        execSummaryUrl?: string;
        supportingDataName?: string;
        supportingDataUrl?: string;
    };
}

interface AmbassadorApplication {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    nationality?: string;
    degree?: string;
    reason: string;
    experience: string;
    status: 'pending' | 'accepted' | 'rejected' | 'submitted';
    submittedAt: any;
}

interface UserProfile {
    id: string;
    displayName: string;
    email: string;
    role: string;
    photoURL?: string;
    location?: string;
    createdAt?: any;
}

export default function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pillarFilter, setPillarFilter] = useState<string>('all');
    const [stageFilter, setStageFilter] = useState<string>('all');
    const [teamSizeFilter, setTeamSizeFilter] = useState<string>('all');
    const [ageFilter, setAgeFilter] = useState<string>('all');
    const [nationalityFilter, setNationalityFilter] = useState<string>('all');
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
    const [updatingReg, setUpdatingReg] = useState(false);

    // Tab Management
    const [activeTab, setActiveTab] = useState<'startups' | 'ambassadors'>('startups');
    const [ambassadorSubTab, setAmbassadorSubTab] = useState<'applications' | 'directory'>('applications');

    // Ambassador Data
    const [ambassadorApps, setAmbassadorApps] = useState<AmbassadorApplication[]>([]);
    const [ambassadorsList, setAmbassadorsList] = useState<UserProfile[]>([]);
    const [selectedAmbassadorApp, setSelectedAmbassadorApp] = useState<AmbassadorApplication | null>(null);

    // Ambassador Filters State
    const [ambSearchTerm, setAmbSearchTerm] = useState('');
    const [ambStatusFilter, setAmbStatusFilter] = useState<string>('all');
    const [ambNationalityFilter, setAmbNationalityFilter] = useState<string>('all');
    const [ambDegreeFilter, setAmbDegreeFilter] = useState<string>('all');
    const [countries, setCountries] = useState<any[]>([]);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'ambassadors' && activeTab !== 'ambassadors') {
            setActiveTab('ambassadors');
        } else if (tab === 'startups' && activeTab !== 'startups') {
            setActiveTab('startups');
        } else if (!tab && activeTab !== 'startups') {
            setActiveTab('startups');
        }
    }, [searchParams, activeTab]);

    useEffect(() => {
        console.log('Admin Status:', isAdmin);
        console.log('Active Tab:', activeTab);
    }, [isAdmin, activeTab]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/signin?redirect=/admin');
                return;
            }

            try {
                // Simple Admin Check: Check if user document in 'admins' collection exists
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                if (adminDoc.exists()) {
                    setIsAdmin(true);
                } else {
                    setError('Access Denied: You do not have admin privileges. If you just applied for access, please wait for activation.');
                    router.push('/');
                }
            } catch (err: any) {
                console.error('Error checking admin status:', err);
                if (err.code === 'permission-denied') {
                    setError('Firebase Permission Error: Please ensure your Firestore Security Rules allow admins to read the "admins" collection.');
                } else {
                    setError('Database Error: ' + err.message);
                }
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    // Load Countries
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/countries.json');
                const data = await res.json();
                const names = data.features.map((f: any) => f.properties.NAME).sort();
                setCountries(names);
            } catch (err) {
                console.error('Error loading countries:', err);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        const fetchRegStatus = async () => {
            const regDoc = await getDoc(doc(db, 'settings', 'registration'));
            if (regDoc.exists()) {
                setIsRegistrationOpen(regDoc.data().isOpen ?? true);
            }
        };
        fetchRegStatus();
    }, [isAdmin]);

    const toggleRegistration = async () => {
        setUpdatingReg(true);
        try {
            const newStatus = !isRegistrationOpen;
            await setDoc(doc(db, 'settings', 'registration'), {
                isOpen: newStatus
            }, { merge: true });
            setIsRegistrationOpen(newStatus);
        } catch (error) {
            console.error("Error toggling registration:", error);
            alert("Failed to update registration status. Please try again.");
        } finally {
            setUpdatingReg(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) return;

        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('Fetched startups:', snapshot.size);
            const appsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];
            setApplications(appsData);
            setLoading(false);
        }, (error) => {
            console.error('FIREBASE_PERMISSION_ERROR: Startup Applications Fetch failed', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

    // Fetch Ambassador Applications
    useEffect(() => {
        if (!isAdmin || activeTab !== 'ambassadors') return;

        console.log('FETCHING: ambassador_applications...');
        const q = query(collection(db, 'ambassador_applications'), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('SUCCESS: ambassador_applications fetched', snapshot.size);
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AmbassadorApplication[];
            setAmbassadorApps(apps);
        }, (error) => {
            console.error('FIREBASE_PERMISSION_ERROR: Ambassador Applications Fetch failed', error);
            console.log('Action Item: Ensure "ambassador_applications" collection has rules for admins.');
        });

        return () => unsubscribe();
    }, [isAdmin, activeTab]);

    // Fetch Current Ambassadors
    useEffect(() => {
        if (!isAdmin || activeTab !== 'ambassadors') return;

        console.log('FETCHING: ambassadors (users role == ambassador)...');
        const q = query(collection(db, 'users'), where('role', '==', 'ambassador'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('SUCCESS: ambassadors fetched', snapshot.size);
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserProfile[];
            setAmbassadorsList(users);
        }, (error) => {
            console.error('FIREBASE_PERMISSION_ERROR: Ambassadors (users) Fetch failed', error);
            console.log('Action Item: Ensure "users" collection has rules for admins.');
        });

        return () => unsubscribe();
    }, [isAdmin, activeTab]);

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'applications', appId), {
                status: newStatus
            });
            if (selectedApp?.id === appId) {
                setSelectedApp({ ...selectedApp, status: newStatus as any });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };

    const handleAmbassadorStatusUpdate = async (appId: string, userId: string, newStatus: string) => {
        try {
            // Update application status
            await updateDoc(doc(db, 'ambassador_applications', appId), {
                status: newStatus
            });

            // If accepted, update user role
            if (newStatus === 'accepted') {
                await updateDoc(doc(db, 'users', userId), {
                    role: 'ambassador'
                });
            } else if (newStatus === 'rejected') {
                // If rejected, ensure role is 'user' (optional, but good for consistency)
                await updateDoc(doc(db, 'users', userId), {
                    role: 'user'
                });
            }

            if (selectedAmbassadorApp?.id === appId) {
                setSelectedAmbassadorApp({ ...selectedAmbassadorApp, status: newStatus as any });
            }
            alert(`Application ${newStatus} successfully!`);
        } catch (error) {
            console.error('Error updating ambassador status:', error);
            alert('Failed to update status.');
        }
    };

    const handleRemoveAmbassador = async (userId: string) => {
        if (!window.confirm('Are you sure you want to remove this user from the Ambassadors?')) return;
        try {
            await updateDoc(doc(db, 'users', userId), {
                role: 'user'
            });
            alert('User removed from Ambassadors.');
        } catch (error) {
            console.error('Error removing ambassador:', error);
            alert('Failed to remove ambassador.');
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch =
            (app.leaderEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.pillar?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesPillar = pillarFilter === 'all' || app.pillar === pillarFilter;
        const matchesStage = stageFilter === 'all' || app.stage === stageFilter;
        const matchesTeamSize = teamSizeFilter === 'all' ||
            (teamSizeFilter === '6+' ? app.teamSize >= 6 : app.teamSize.toString() === teamSizeFilter);
        const matchesAge = ageFilter === 'all' ||
            (ageFilter === 'old' ? app.isOlderThan5Years === 'Yes' : app.isOlderThan5Years === 'No');
        const matchesNationality = nationalityFilter === 'all' || app.leaderNationality === nationalityFilter;

        return matchesSearch && matchesStatus && matchesPillar && matchesStage && matchesTeamSize && matchesAge && matchesNationality;
    });

    const filteredAmbassadorApps = useMemo(() => {
        return ambassadorApps.filter(app => {
            const matchesSearch =
                (app.fullName?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (app.email?.toLowerCase().includes(ambSearchTerm.toLowerCase()));

            const matchesStatus = ambStatusFilter === 'all' || app.status === ambStatusFilter;
            const matchesNationality = ambNationalityFilter === 'all' || app.location === ambNationalityFilter || app.nationality === ambNationalityFilter;
            const matchesDegree = ambDegreeFilter === 'all' || app.degree === ambDegreeFilter;

            return matchesSearch && matchesStatus && matchesNationality && matchesDegree;
        });
    }, [ambassadorApps, ambSearchTerm, ambStatusFilter, ambNationalityFilter, ambDegreeFilter]);

    const pillars = [
        'Decarbonization Technologies',
        'Circular Economy & Resource Efficiency',
        'Energy Efficiency',
        'Process Optimization & Advanced Engineering'
    ];

    const stages = ['Ideation', 'Pre-Seed', 'Seed', 'Post-Seed'];

    const uniqueNationalities = useMemo(() => {
        const nationalities = new Set<string>();
        applications.forEach(app => {
            if (app.leaderNationality) {
                nationalities.add(app.leaderNationality);
            }
        });
        return Array.from(nationalities).sort();
    }, [applications]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
                    <p className="text-white/40 text-sm font-poppins animate-pulse">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#001311] flex items-center justify-center px-6">
                <div className="max-w-md w-full glass-panel p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Configuration Required</h2>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        {error}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 bg-vc-mint text-vc-green-dark rounded-xl font-bold hover:bg-vc-mint/90 transition-colors"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="w-full py-3 text-white/40 hover:text-white transition-colors text-sm font-medium"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-32 pb-12">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-poppins mb-2">
                            {activeTab === 'startups' ? 'Admin Dashboard' : 'Ambassadors Management'}
                        </h1>
                        <p className="text-white/50 mb-6">
                            {activeTab === 'startups'
                                ? 'Manage and review Venture Craft startup applications'
                                : 'Review ambassador applications and manage the directory'
                            }
                        </p>

                        {/* Tab Switcher Removed - Accessible via Navbar */}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {activeTab === 'startups' && (
                            <button
                                onClick={toggleRegistration}
                                disabled={updatingReg}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-3 border shadow-xl ${isRegistrationOpen
                                    ? 'bg-vc-mint text-vc-green-dark border-vc-mint shadow-vc-mint/20'
                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}
                            >
                                {isRegistrationOpen ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                <span>Registration: {isRegistrationOpen ? 'OPEN' : 'CLOSED'}</span>
                            </button>
                        )}

                        {activeTab === 'startups' ? (
                            <>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Total</span>
                                    <span className="text-2xl font-bold text-white">{applications.length}</span>
                                </div>
                                <div className="bg-vc-mint/10 border border-vc-mint/20 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-vc-mint/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Accepted</span>
                                    <span className="text-2xl font-bold text-vc-mint">{applications.filter(a => a.status === 'accepted').length}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                    <span className="text-2xl font-bold text-white">{applications.filter(a => !a.status || a.status === 'pending' || a.status === 'submitted').length}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Total Apps</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorApps.length}</span>
                                </div>
                                <div className="bg-vc-teal/10 border border-vc-teal/20 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-vc-teal/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Ambassadors</span>
                                    <span className="text-2xl font-bold text-vc-teal">{ambassadorsList.length}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Pending Apps</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorApps.filter(a => a.status === 'pending').length}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>



                <div className="grid lg:grid-cols-[300px_1fr] gap-12">
                    {/* Sidebar Filters */}
                    <div className="space-y-8">
                        <div className="glass-panel p-6 space-y-6">
                            <div className="flex items-center gap-2 text-vc-mint">
                                <Filter className="w-5 h-5" />
                                <h2 className="font-bold uppercase tracking-widest text-sm">Advanced Filters</h2>
                            </div>

                            {activeTab === 'startups' ? (
                                <div className="space-y-6">
                                    {/* Search */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Search Partner / Email</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-white/40 uppercase">Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['all', 'pending', 'accepted', 'rejected'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setStatusFilter(s)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${statusFilter === s ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                                >
                                                    {s.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pillar Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Pillar</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                            value={pillarFilter}
                                            onChange={(e) => setPillarFilter(e.target.value)}
                                        >
                                            <option value="all">All Pillars</option>
                                            {pillars.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>

                                    {/* Stage Filter */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Stage</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                            value={stageFilter}
                                            onChange={(e) => setStageFilter(e.target.value)}
                                        >
                                            <option value="all">All Stages</option>
                                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Ambassador Filter Group */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Search Ambassador</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                            <input
                                                type="text"
                                                placeholder="Name or email..."
                                                value={ambSearchTerm}
                                                onChange={(e) => setAmbSearchTerm(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-white/40 uppercase">App Status</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['all', 'pending', 'accepted', 'rejected'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => setAmbStatusFilter(s)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${ambStatusFilter === s ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                                >
                                                    {s.toUpperCase()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Nationality</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                            value={ambNationalityFilter}
                                            onChange={(e) => setAmbNationalityFilter(e.target.value)}
                                        >
                                            <option value="all">Everywhere</option>
                                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/40 uppercase">Degree</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                            value={ambDegreeFilter}
                                            onChange={(e) => setAmbDegreeFilter(e.target.value)}
                                        >
                                            <option value="all">Any Degree</option>
                                            {['Bachelor', 'Master', 'PhD', 'Other'].map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (activeTab === 'startups') {
                                        setSearchTerm('');
                                        setStatusFilter('all');
                                        setPillarFilter('all');
                                        setStageFilter('all');
                                        setTeamSizeFilter('all');
                                        setAgeFilter('all');
                                        setNationalityFilter('all');
                                    } else {
                                        setAmbSearchTerm('');
                                        setAmbStatusFilter('all');
                                        setAmbNationalityFilter('all');
                                        setAmbDegreeFilter('all');
                                    }
                                }}
                                className="w-full py-3 text-xs font-bold text-white/40 hover:text-vc-mint transition-colors border border-white/5 hover:border-vc-mint/20 rounded-xl uppercase tracking-widest mt-4"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="space-y-4">
                        {activeTab === 'ambassadors' && (
                            <div className="flex items-center gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-[2.5rem] w-fit">
                                <button
                                    onClick={() => setAmbassadorSubTab('applications')}
                                    className={`px-8 py-4 rounded-[2rem] font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 ${ambassadorSubTab === 'applications' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <FileText className="w-5 h-5" />
                                    <span>Applications</span>
                                    {ambassadorApps.filter(a => a.status === 'pending').length > 0 && (
                                        <span className="px-2 py-0.5 bg-vc-green-dark text-vc-mint rounded-lg text-[10px] font-black ml-2">
                                            {ambassadorApps.filter(a => a.status === 'pending').length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setAmbassadorSubTab('directory')}
                                    className={`px-8 py-4 rounded-[2rem] font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-3 ${ambassadorSubTab === 'directory' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Current Ambassadors</span>
                                    <span className={`ml-2 text-xs opacity-40`}>({ambassadorsList.length})</span>
                                </button>
                            </div>
                        )}
                        {activeTab === 'startups' ? (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white/40">Showing {filteredApps.length} startup applications</span>
                                </div>

                                <div className="grid gap-4">
                                    {filteredApps.map((app) => (
                                        <motion.div
                                            layout
                                            key={app.id}
                                            className="glass-panel p-6 flex items-center justify-between group hover:border-vc-mint/30 transition-all cursor-pointer"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center">
                                                    <Rocket className="text-vc-mint w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">{app.leaderEmail}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-white/40">
                                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {app.teamSize} Members</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="hidden xl:block text-right">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">Pillar</span>
                                                    <span className="text-sm text-white/60">{app.pillar}</span>
                                                </div>

                                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                        'bg-vc-mint/10 border-vc-mint/20 text-vc-mint'
                                                    }`}>
                                                    {(app.status === 'submitted' ? 'pending' : app.status) || 'pending'}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'accepted'); }}
                                                        className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                        title="Accept"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'rejected'); }}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {filteredApps.length === 0 && (
                                        <div className="text-center py-24 glass-panel bg-white/0 border-dashed">
                                            <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                            <p className="text-white/40">No startup applications found</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {ambassadorSubTab === 'applications' ? (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-white/40">Showing {filteredAmbassadorApps.length} ambassador applications</span>
                                        </div>
                                        <div className="grid gap-4">
                                            {filteredAmbassadorApps.map((app) => (
                                                <motion.div
                                                    layout
                                                    key={app.id}
                                                    className="glass-panel p-6 flex items-center justify-between group hover:border-vc-mint/30 transition-all cursor-pointer"
                                                    onClick={() => setSelectedAmbassadorApp(app)}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-xl bg-vc-teal/10 flex items-center justify-center">
                                                            <Users className="text-vc-teal w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg mb-1">{app.fullName}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-white/40">
                                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {app.email}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8">
                                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                'bg-vc-teal/10 border-vc-teal/20 text-vc-teal'
                                                            }`}>
                                                            {app.status}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleAmbassadorStatusUpdate(app.id, app.userId, 'accepted'); }}
                                                                className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                                title="Accept"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleAmbassadorStatusUpdate(app.id, app.userId, 'rejected'); }}
                                                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {filteredAmbassadorApps.length === 0 && (
                                                <div className="text-center py-24 glass-panel bg-white/0 border-dashed">
                                                    <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                                    <p className="text-white/40">No ambassador applications found</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-white/40">Showing {ambassadorsList.length} active ambassadors</span>
                                        </div>
                                        <div className="grid gap-4">
                                            {ambassadorsList.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="glass-panel p-6 flex items-center justify-between group hover:border-vc-mint/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                                                            {user.photoURL ? (
                                                                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-6 h-6 text-white/20" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg mb-1">{user.displayName}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-white/40">
                                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                                                {user.location && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {user.location}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveAmbassador(user.id)}
                                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 text-xs font-bold uppercase tracking-widest"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                            {ambassadorsList.length === 0 && (
                                                <div className="text-center py-24 glass-panel bg-white/0 border-dashed">
                                                    <AlertCircle className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                                    <p className="text-white/40">No active ambassadors yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Application Details Modal */}
                <AnimatePresence>
                    {selectedApp && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#001311]/95 backdrop-blur-xl"
                                onClick={() => setSelectedApp(null)}
                            />

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative w-full max-w-6xl max-h-[90vh] bg-[#0c1e1c] border border-vc-mint/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-vc-mint/10 flex items-center justify-center">
                                            <Rocket className="text-vc-mint w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedApp.leaderEmail}</h2>
                                            <span className="text-white/40 text-sm">Submitted on {selectedApp.submittedAt?.toDate().toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                        {/* Left Column: Team & Contact */}
                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <Users className="w-4 h-4" /> Team Breakdown
                                                </h3>
                                                <div className="space-y-4">
                                                    {selectedApp.teamMembers.map((m, i) => (
                                                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                            <p className="font-bold text-white mb-1">{m.name || 'Member ' + (i + 1)}</p>
                                                            <p className="text-xs text-white/40 flex items-center gap-2">
                                                                <Globe className="w-3 h-3" /> {m.nationality}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <Users className="w-4 h-4" /> Team Leader
                                                </h3>
                                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Email</p>
                                                        <p className="font-bold flex items-center gap-2 underline decoration-vc-mint/30"><Mail className="w-3 h-3 text-vc-mint" /> {selectedApp.leaderEmail}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Phone</p>
                                                        <p className="font-bold flex items-center gap-2"><Phone className="w-3 h-3 text-vc-mint" /> {selectedApp.leaderPhone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Nationality</p>
                                                        <p className="font-bold flex items-center gap-2"><Globe className="w-3 h-3 text-vc-mint" /> {selectedApp.leaderNationality}</p>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Center Column: Startup Details */}
                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <Rocket className="w-4 h-4" /> Venture Details
                                                </h3>
                                                <div className="grid gap-6 text-sm">
                                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                                        <span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Pillar</span>
                                                        <span className="text-base font-medium">{selectedApp.pillar}</span>
                                                    </div>
                                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                                        <span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Current Stage</span>
                                                        <span className="text-base font-medium">{selectedApp.stage}</span>
                                                    </div>
                                                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                                        <span className="text-white/30 block mb-1 uppercase text-[10px] font-bold">Older than 5 Years</span>
                                                        <span className="text-base font-medium">{selectedApp.isOlderThan5Years}</span>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <Globe className="w-4 h-4" /> Digital Presence
                                                </h3>
                                                <div className="flex flex-wrap gap-4 text-sm font-medium">
                                                    {selectedApp.website && (
                                                        <a href={selectedApp.website} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl hover:border-vc-mint transition-all">
                                                            <Globe className="w-4 h-4" /> Website
                                                        </a>
                                                    )}
                                                    {selectedApp.linkedin && (
                                                        <a href={selectedApp.linkedin} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/5 rounded-2xl hover:border-vc-mint transition-all">
                                                            <Linkedin className="w-4 h-4" /> LinkedIn
                                                        </a>
                                                    )}
                                                    {selectedApp.videoPitchUrl && (
                                                        <a href={selectedApp.videoPitchUrl} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint rounded-2xl hover:bg-vc-mint hover:text-black transition-all">
                                                            <Video className="w-4 h-4" /> Video Pitch
                                                        </a>
                                                    )}
                                                </div>
                                            </section>
                                        </div>

                                        {/* Right Column: Downloads & Decisions */}
                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Submission Materials
                                                </h3>
                                                <div className="grid gap-3">
                                                    {selectedApp.materials.pitchDeckUrl ? (
                                                        <a
                                                            href={selectedApp.materials.pitchDeckUrl}
                                                            target="_blank"
                                                            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-vc-mint/10 group transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="text-vc-mint w-5 h-5" />
                                                                <span className="text-sm">Pitch Deck</span>
                                                            </div>
                                                            <span className="text-[10px] px-2 py-1 bg-vc-mint/10 text-vc-mint font-bold rounded group-hover:bg-vc-mint group-hover:text-black transition-colors">VIEW</span>
                                                        </a>
                                                    ) : (
                                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50 flex items-center gap-3">
                                                            <FileText className="w-5 h-5 text-white/20" />
                                                            <span className="text-sm text-white/40">Pitch Deck Not Provided</span>
                                                        </div>
                                                    )}

                                                    {selectedApp.materials.execSummaryUrl ? (
                                                        <a
                                                            href={selectedApp.materials.execSummaryUrl}
                                                            target="_blank"
                                                            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-vc-mint/10 group transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="text-vc-mint w-5 h-5" />
                                                                <span className="text-sm">Exec Summary</span>
                                                            </div>
                                                            <span className="text-[10px] px-2 py-1 bg-vc-mint/10 text-vc-mint font-bold rounded group-hover:bg-vc-mint group-hover:text-black transition-colors">VIEW</span>
                                                        </a>
                                                    ) : (
                                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50 flex items-center gap-3">
                                                            <FileText className="w-5 h-5 text-white/20" />
                                                            <span className="text-sm text-white/40">Exec Summary Not Provided</span>
                                                        </div>
                                                    )}

                                                    {selectedApp.materials.supportingDataUrl && (
                                                        <a
                                                            href={selectedApp.materials.supportingDataUrl}
                                                            target="_blank"
                                                            className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-vc-mint/10 group transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileCode className="text-vc-mint w-5 h-5" />
                                                                <span className="text-sm">Supporting Data</span>
                                                            </div>
                                                            <span className="text-[10px] px-2 py-1 bg-vc-mint/10 text-vc-mint font-bold rounded group-hover:bg-vc-mint group-hover:text-black transition-colors">VIEW</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </section>

                                            <section className="bg-vc-mint/5 border border-vc-mint/10 rounded-3xl p-8 space-y-6">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Take Action
                                                </h3>
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${selectedApp.status === 'accepted' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                                    >
                                                        <Check className="w-5 h-5" /> Accept Startup
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${selectedApp.status === 'rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                                    >
                                                        <X className="w-5 h-5" /> Reject Application
                                                    </button>
                                                    {selectedApp.status !== 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(selectedApp.id, 'pending')}
                                                            className="w-full py-4 rounded-2xl font-bold text-white/40 hover:text-white transition-all text-xs uppercase underline decoration-white/10"
                                                        >
                                                            Reset to Pending
                                                        </button>
                                                    )}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {/* Ambassador Application Modal */}
                    {selectedAmbassadorApp && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedAmbassadorApp(null)}
                                className="absolute inset-0 bg-vc-green-dark/95 backdrop-blur-2xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-4xl bg-[#0c1e1c] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            >
                                {/* Modal Header */}
                                <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-vc-teal/10 flex items-center justify-center">
                                            <Users className="text-vc-teal w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedAmbassadorApp.fullName}</h2>
                                            <span className="text-white/40 text-sm">Ambassador Application • {selectedAmbassadorApp.submittedAt?.toDate().toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedAmbassadorApp(null)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Content */}
                                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-vc-teal font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" /> Contact Information
                                                </h3>
                                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Email</p>
                                                        <p className="font-bold flex items-center gap-2 text-white">{selectedAmbassadorApp.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Phone</p>
                                                        <p className="font-bold flex items-center gap-2 text-white">{selectedAmbassadorApp.phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Location</p>
                                                        <p className="font-bold flex items-center gap-2 text-white">{selectedAmbassadorApp.location}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-vc-teal font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" /> Why join?
                                                </h3>
                                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                                                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{selectedAmbassadorApp.reason}</p>
                                                </div>
                                            </section>
                                        </div>

                                        <div className="space-y-10">
                                            <section>
                                                <h3 className="text-vc-teal font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Experience
                                                </h3>
                                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                                    {selectedAmbassadorApp.experience}
                                                </div>
                                            </section>

                                            <section className="bg-vc-teal/5 border border-vc-teal/10 rounded-3xl p-8 space-y-6">
                                                <h3 className="text-vc-teal font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> Promotion decision
                                                </h3>
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'accepted')}
                                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${selectedAmbassadorApp.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                                    >
                                                        <Check className="w-5 h-5" /> Accept as Ambassador
                                                    </button>
                                                    <button
                                                        onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'rejected')}
                                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${selectedAmbassadorApp.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                                    >
                                                        <X className="w-5 h-5" /> Reject Application
                                                    </button>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main >
    );
}
