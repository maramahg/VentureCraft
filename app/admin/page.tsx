'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Rocket, CheckCircle, XCircle, Clock,
    Filter, Search, ChevronDown, Eye, Mail,
    Phone, Globe, Linkedin, Video, ArrowLeft,
    Check, X, AlertCircle, Shield, FileText, FileCode,
    User, Link as LinkIcon, Share2, GraduationCap, WifiOff
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, setDoc, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { countries as countriesList } from '@/lib/countries';

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
    coiDeclaration?: string;
    additionalLinks?: string;
    confirmations?: {
        ageConfirmed: boolean;
        educationConfirmed: boolean;
    };
}

interface AmbassadorApplication {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    nationality: string;
    university: string;
    major: string;
    degree: string;
    socialMedia: string;
    status: 'pending' | 'accepted' | 'rejected' | 'submitted';
    submittedAt: any;
    // legacy fields
    fullName?: string;
    location?: string;
    reason?: string;
    experience?: string;
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

const AdminDropdown = ({ options, value, onChange, placeholder }: {
    options: string[],
    value: string,
    onChange: (val: string) => void,
    placeholder: string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between hover:bg-white/10 transition-all text-left group"
            >
                <span className={`text-sm ${value !== 'all' ? 'text-white font-medium' : 'text-white/40'}`}>
                    {value === 'all' ? placeholder : value}
                </span>
                <ChevronDown className={`w-4 h-4 text-vc-mint/50 group-hover:text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[110] w-full mt-2 bg-[#0c1e1c] border border-vc-mint/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('all');
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-vc-mint/10 transition-colors group border-b border-white/5"
                            >
                                <span className={`text-sm ${value === 'all' ? 'text-vc-mint font-bold' : 'text-white/40'}`}>{placeholder}</span>
                            </button>
                            {options.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-vc-mint/10 transition-colors group"
                                >
                                    <span className={`text-sm ${value === opt ? 'text-vc-mint font-bold' : 'text-white/80 group-hover:text-white'}`}>{opt}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminFlagDropdown = ({ value, onChange, placeholder }: {
    value: string,
    onChange: (val: string) => void,
    placeholder: string
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = countriesList.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = countriesList.find(opt => opt.name === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between hover:bg-white/10 transition-all text-left group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {selectedOption ? (
                        <>
                            <img
                                src={`https://flagcdn.com/w40/${selectedOption.code.toLowerCase()}.png`}
                                alt={selectedOption.name}
                                className="w-4 h-auto rounded-[2px] shrink-0"
                            />
                            <span className="text-sm text-white font-medium truncate">{selectedOption.name}</span>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-white/20" />
                            <span className="text-sm text-white/40">{placeholder}</span>
                        </div>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-vc-mint/50 group-hover:text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-[110] w-full mt-2 bg-[#0c1e1c] border border-vc-mint/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        {/* Search Input */}
                        <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-vc-mint/60" />
                            <input
                                type="text"
                                placeholder="Search country..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 w-full"
                                autoFocus
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('all');
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                                className="w-full px-4 py-2.5 text-left hover:bg-vc-mint/10 transition-colors group border-b border-white/5"
                            >
                                <span className={`text-sm ${value === 'all' ? 'text-vc-mint font-bold' : 'text-white/40'}`}>{placeholder}</span>
                            </button>
                            {filteredOptions.map((opt) => (
                                <button
                                    key={opt.code}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.name);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className="w-full px-4 py-2.5 text-left hover:bg-vc-mint/10 transition-colors group flex items-center gap-3"
                                >
                                    <img
                                        src={`https://flagcdn.com/w40/${opt.code.toLowerCase()}.png`}
                                        alt={opt.name}
                                        className="w-4 h-auto rounded-[2px]"
                                    />
                                    <span className={`text-sm ${value === opt.name ? 'text-vc-mint font-bold' : 'text-white/80 group-hover:text-white'}`}>{opt.name}</span>
                                </button>
                            ))}
                            {filteredOptions.length === 0 && (
                                <p className="p-4 text-center text-xs text-white/20">No countries found</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


function AdminDashboardContent() {
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

    // We use the imported countriesList directly or map it if needed

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

    // Countries are imported from @/lib/countries

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
        const matchesNationality = nationalityFilter === 'all' ||
            app.leaderNationality === nationalityFilter ||
            app.teamMembers?.some(m => m.nationality === nationalityFilter);

        return matchesSearch && matchesStatus && matchesPillar && matchesStage && matchesTeamSize && matchesAge && matchesNationality;
    });

    const filteredAmbassadorApps = useMemo(() => {
        return ambassadorApps.filter(app => {
            const matchesSearch =
                (app.name?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (app.fullName?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (app.email?.toLowerCase().includes(ambSearchTerm.toLowerCase()));

            const matchesStatus = ambStatusFilter === 'all' || app.status === ambStatusFilter;
            const matchesNationality = ambNationalityFilter === 'all' || app.nationality === ambNationalityFilter || app.location === ambNationalityFilter;
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
        const isOffline = error.toLowerCase().includes('offline');
        return (
            <div className="min-h-screen bg-[#001311] flex items-center justify-center px-6">
                <div className="max-w-md w-full glass-panel p-10 text-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

                    {isOffline ? (
                        <WifiOff className="w-16 h-16 text-vc-teal mx-auto mb-8 animate-pulse" />
                    ) : (
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8" />
                    )}

                    <h2 className="text-2xl font-bold text-white mb-4 font-poppins">
                        {isOffline ? 'Connection Lost' : 'Configuration Required'}
                    </h2>

                    <p className="text-white/60 mb-10 leading-relaxed font-poppins">
                        {isOffline
                            ? "It looks like you're offline. Please check your internet connection and try again."
                            : error}
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-vc-mint text-vc-green-dark rounded-2xl font-bold hover:bg-vc-mint/90 transition-all active:scale-[0.98] shadow-lg shadow-vc-mint/10"
                        >
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="w-full py-2 text-white/30 hover:text-white transition-colors text-sm font-medium font-poppins"
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
                        <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-[10px]">
                            {activeTab === 'startups'
                                ? 'Manage and review Venture Craft startup applications'
                                : 'Review ambassador applications and manage the directory'
                            }
                        </p>

                        {/* Tab Switcher - Controlled via Navbar / URL */}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
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
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Apps</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorApps.length}</span>
                                </div>
                                <div className="bg-vc-teal/10 border border-vc-teal/20 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-vc-teal/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                    <span className="text-2xl font-bold text-vc-teal">{ambassadorApps.filter(a => a.status === 'pending').length}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Active</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorsList.length}</span>
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

                            <div className="space-y-6">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Search Partner / Email</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={activeTab === 'startups' ? searchTerm : ambSearchTerm}
                                            onChange={(e) => activeTab === 'startups' ? setSearchTerm(e.target.value) : setAmbSearchTerm(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Status Filter */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['all', 'pending', 'accepted', 'rejected'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => activeTab === 'startups' ? setStatusFilter(s) : setAmbStatusFilter(s)}
                                                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${(activeTab === 'startups' ? statusFilter : ambStatusFilter) === s ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                            >
                                                {s.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {activeTab === 'startups' ? (
                                    <>
                                        {/* Pillar Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Pillar</label>
                                            <AdminDropdown
                                                options={pillars}
                                                value={pillarFilter}
                                                onChange={setPillarFilter}
                                                placeholder="All Pillars"
                                            />
                                        </div>

                                        {/* Stage Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Stage</label>
                                            <AdminDropdown
                                                options={stages}
                                                value={stageFilter}
                                                onChange={setStageFilter}
                                                placeholder="All Stages"
                                            />
                                        </div>

                                        {/* Nationality Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Nationality</label>
                                            <AdminFlagDropdown
                                                value={nationalityFilter}
                                                onChange={setNationalityFilter}
                                                placeholder="Everywhere"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Ambassador Nationality Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Partner Nationality</label>
                                            <AdminFlagDropdown
                                                value={ambNationalityFilter}
                                                onChange={setAmbNationalityFilter}
                                                placeholder="All Countries"
                                            />
                                        </div>

                                        {/* Ambassador Degree Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Education Level</label>
                                            <AdminDropdown
                                                options={['Bachelor', 'Master', 'PhD', 'Other']}
                                                value={ambDegreeFilter}
                                                onChange={setAmbDegreeFilter}
                                                placeholder="All Degrees"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

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

                    {/* Main Content Area */}
                    <div className="space-y-4">
                        {activeTab === 'ambassadors' && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-8 bg-white/5 border border-white/10 p-2 rounded-2xl sm:rounded-[2.5rem] w-full sm:w-fit">
                                <button
                                    onClick={() => setAmbassadorSubTab('applications')}
                                    className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[2rem] font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center sm:justify-start gap-3 flex-1 sm:flex-initial ${ambassadorSubTab === 'applications' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <FileText className="w-4 h-4 sm:w-5 h-5" />
                                    <span>Applications</span>
                                    {ambassadorApps.filter(a => a.status === 'pending').length > 0 && (
                                        <span className="px-2 py-0.5 bg-vc-green-dark text-vc-mint rounded-lg text-[10px] font-black sm:ml-2">
                                            {ambassadorApps.filter(a => a.status === 'pending').length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setAmbassadorSubTab('directory')}
                                    className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-[2rem] font-bold text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center sm:justify-start gap-3 flex-1 sm:flex-initial ${ambassadorSubTab === 'directory' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Users className="w-4 h-4 sm:w-5 h-5" />
                                    <span>Directory</span>
                                    <span className={`sm:ml-2 text-[10px] sm:text-xs opacity-40`}>({ambassadorsList.length})</span>
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
                                            className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-vc-mint/30 transition-all cursor-pointer"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <div className="flex items-center gap-4 sm:gap-6">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                    <Rocket className="text-vc-mint w-5 h-5 sm:w-6 h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{app.leaderEmail}</h3>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {app.teamSize} Members</span>
                                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                <div className="hidden xl:block text-right">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">Pillar</span>
                                                    <span className="text-sm text-white/60">{app.pillar}</span>
                                                </div>

                                                <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                    app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                        'bg-vc-mint/10 border-vc-mint/20 text-vc-mint'
                                                    }`}>
                                                    {(app.status === 'submitted' ? 'pending' : app.status) || 'pending'}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'accepted'); }}
                                                        className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                        title="Accept"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(app.id, 'rejected'); }}
                                                        className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
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
                                                    className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-vc-mint/30 transition-all cursor-pointer"
                                                    onClick={() => setSelectedAmbassadorApp(app)}
                                                >
                                                    <div className="flex items-center gap-4 sm:gap-6">
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-teal/10 flex items-center justify-center shrink-0">
                                                            <Users className="text-vc-teal w-5 h-5 sm:w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-base sm:text-lg mb-1 truncate">{app.name || app.fullName}</h3>
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                                                                <span className="flex items-center gap-1.5 min-w-0 truncate max-w-[150px]"><Mail className="w-3 h-3" /> {app.email}</span>
                                                                <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {app.nationality || app.location}</span>
                                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                        <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                'bg-vc-teal/10 border-vc-teal/20 text-vc-teal'
                                                            }`}>
                                                            {app.status}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleAmbassadorStatusUpdate(app.id, app.userId, 'accepted'); }}
                                                                className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                                                title="Accept"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleAmbassadorStatusUpdate(app.id, app.userId, 'rejected'); }}
                                                                className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
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

                                {/* Modal Content - New 2-Column Layout */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                    <div className="grid lg:grid-cols-[1fr_360px] gap-8 md:gap-12">
                                        {/* Main Column: In-depth Details */}
                                        <div className="space-y-10">
                                            {/* Startup Profile Section */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                    <Rocket className="w-4 h-4" /> Startup Profile
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Venture Pillar</p>
                                                        <p className="text-lg font-medium text-white">{selectedApp.pillar}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Current Development Stage</p>
                                                        <p className="text-lg font-medium text-white">{selectedApp.stage}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Established over 5 Years ago?</p>
                                                        <p className="text-lg font-medium text-white">{selectedApp.isOlderThan5Years}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-10 pt-8 border-t border-white/5">
                                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Digital Presence & Pitch</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {selectedApp.website && (
                                                            <a href={selectedApp.website} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-vc-mint/50 transition-all text-sm">
                                                                <Globe className="w-4 h-4 text-vc-mint" /> Website
                                                            </a>
                                                        )}
                                                        {selectedApp.linkedin && (
                                                            <a href={selectedApp.linkedin} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-vc-mint/50 transition-all text-sm">
                                                                <Linkedin className="w-4 h-4 text-vc-mint" /> LinkedIn
                                                            </a>
                                                        )}
                                                        {selectedApp.additionalLinks && (
                                                            <a href={selectedApp.additionalLinks} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-vc-mint/50 transition-all text-sm">
                                                                <LinkIcon className="w-4 h-4 text-vc-mint" /> Additional Links
                                                            </a>
                                                        )}
                                                        {selectedApp.videoPitchUrl && (
                                                            <a href={selectedApp.videoPitchUrl} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint rounded-xl hover:bg-vc-mint hover:text-black transition-all text-sm font-bold">
                                                                <Video className="w-4 h-4" /> Watch Video Pitch
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Team Foundation Section */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                    <Users className="w-4 h-4" /> Team Foundation
                                                </h3>

                                                <div className="grid md:grid-cols-[1.2fr_1fr] gap-12">
                                                    <div className="space-y-6">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Breakdown ({selectedApp.teamSize} Member{selectedApp.teamSize > 1 ? 's' : ''})</p>
                                                        <div className="space-y-3">
                                                            {selectedApp.teamMembers.map((m, i) => (
                                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/[0.08]">
                                                                    <div className="w-8 h-8 rounded-lg bg-vc-mint/10 flex items-center justify-center text-[10px] font-bold text-vc-mint border border-vc-mint/20 shrink-0">
                                                                        {i + 1}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                                                                        <span className="font-bold text-sm text-white/90 truncate">{m.name || 'Anonymous Member'}</span>
                                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium whitespace-nowrap opacity-60">
                                                                            ({m.nationality})
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div className="space-y-4">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Leader Contact</p>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-vc-mint/5 border border-vc-mint/10">
                                                                    <Mail className="w-4 h-4 text-vc-mint" />
                                                                    <span className="font-medium underline decoration-vc-mint/30">{selectedApp.leaderEmail}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                                    <Phone className="w-4 h-4 text-white/40" />
                                                                    <span className="font-medium">{selectedApp.leaderPhone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                                    <Globe className="w-4 h-4 text-white/40" />
                                                                    <span className="font-medium">{selectedApp.leaderNationality}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Eligibility Status</p>
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-3 text-xs bg-white/5 border border-white/5 p-3 rounded-xl">
                                                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${selectedApp.confirmations?.ageConfirmed ? 'bg-vc-mint shadow-vc-mint/50' : 'bg-red-500 shadow-red-500/50'}`} />
                                                                    <span className="text-white/60">Age requirement (18+)</span>
                                                                    {selectedApp.confirmations?.ageConfirmed ? <Check className="w-3 h-3 text-vc-mint ml-auto" /> : <X className="w-3 h-3 text-red-500 ml-auto" />}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs bg-white/5 border border-white/5 p-3 rounded-xl">
                                                                    <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${selectedApp.confirmations?.educationConfirmed ? 'bg-vc-mint shadow-vc-mint/50' : 'bg-red-500 shadow-red-500/50'}`} />
                                                                    <span className="text-white/60">Education qualification</span>
                                                                    {selectedApp.confirmations?.educationConfirmed ? <Check className="w-3 h-3 text-vc-mint ml-auto" /> : <X className="w-3 h-3 text-red-500 ml-auto" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Context & Disclosure */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" /> Context & Disclosure
                                                </h3>
                                                <div className="p-6 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10">
                                                    <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest mb-3">Conflict of Interest Declaration</p>
                                                    <p className="text-sm text-white/70 leading-relaxed italic whitespace-pre-wrap">
                                                        {selectedApp.coiDeclaration || "No conflict of interest or organizational relationships declared by the team."}
                                                    </p>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Sidebar: Materials & Quick Actions */}
                                        <div className="space-y-8">
                                            {/* Submission Materials */}
                                            <section className="bg-[#0f2a27] border border-white/10 rounded-[2.5rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Required Materials
                                                </h3>
                                                <div className="space-y-3">
                                                    {[
                                                        { label: 'Pitch Deck', url: selectedApp.materials.pitchDeckUrl, icon: FileText },
                                                        { label: 'Exec Summary', url: selectedApp.materials.execSummaryUrl, icon: FileText },
                                                        { label: 'Supporting Data', url: selectedApp.materials.supportingDataUrl, icon: FileCode }
                                                    ].map((item, idx) => (
                                                        item.url ? (
                                                            <a
                                                                key={idx}
                                                                href={item.url}
                                                                target="_blank"
                                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-vc-mint/10 hover:border-vc-mint/30 group transition-all"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <item.icon className="text-vc-mint w-5 h-5" />
                                                                    <span className="text-sm font-medium">{item.label}</span>
                                                                </div>
                                                                <Eye className="w-4 h-4 text-white/20 group-hover:text-vc-mint transition-colors" />
                                                            </a>
                                                        ) : (
                                                            <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-white/2 border border-white/5 opacity-30 grayscale">
                                                                <item.icon className="w-5 h-5" />
                                                                <span className="text-sm font-medium">{item.label}</span>
                                                                <span className="ml-auto text-[8px] font-bold uppercase tracking-wider">Empty</span>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Take Action Center */}
                                            <section className="bg-vc-mint/10 border-2 border-vc-mint/20 rounded-[2.5rem] p-8 shadow-2xl shadow-vc-mint/5">
                                                <h3 className="text-vc-mint font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-center">
                                                    Review Decision
                                                </h3>
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                                                        className={`w-full py-5 rounded-[1.25rem] font-bold text-base transition-all duration-300 ${selectedApp.status === 'accepted'
                                                            ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20 scale-[1.02]'
                                                            : 'bg-white/5 text-vc-mint border border-vc-mint/20 hover:bg-vc-mint/20'
                                                            }`}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                                                        className={`w-full py-5 rounded-[1.25rem] font-bold text-base transition-all duration-300 ${selectedApp.status === 'rejected'
                                                            ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-[1.02]'
                                                            : 'bg-white/5 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                            }`}
                                                    >
                                                        Reject
                                                    </button>

                                                    {selectedApp.status !== 'pending' && (
                                                        <div className="pt-4 flex justify-center">
                                                            <button
                                                                onClick={() => handleStatusUpdate(selectedApp.id, 'pending')}
                                                                className="text-[10px] font-bold text-white/30 hover:text-vc-mint transition-colors uppercase tracking-[0.15em] border-b border-white/10 pb-0.5"
                                                            >
                                                                Reset Decision
                                                            </button>
                                                        </div>
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
                                <div className="p-6 md:p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-vc-teal/10 flex items-center justify-center">
                                            <Users className="text-vc-teal w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedAmbassadorApp.name || selectedAmbassadorApp.fullName}</h2>
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

                                {/* Modal Content - Ambassador Sidebar Layout */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                    <div className="grid lg:grid-cols-[1fr_360px] gap-8 md:gap-12">
                                        {/* Main Column: Profiles & Experience */}
                                        <div className="space-y-10">
                                            {/* Person Profile Section */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                <h3 className="text-vc-teal font-bold uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
                                                    <User className="w-4 h-4" /> Personal Profile
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Full Name</p>
                                                        <p className="text-lg font-medium text-white">{selectedAmbassadorApp.name || selectedAmbassadorApp.fullName}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Nationality / Location</p>
                                                        <p className="text-lg font-medium text-white">{selectedAmbassadorApp.nationality || selectedAmbassadorApp.location}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Contact Email</p>
                                                        <p className="text-lg font-medium text-white underline decoration-vc-teal/30">{selectedAmbassadorApp.email}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Phone Number</p>
                                                        <p className="text-lg font-medium text-white">{selectedAmbassadorApp.phone}</p>
                                                    </div>
                                                </div>

                                                {selectedAmbassadorApp.socialMedia && (
                                                    <div className="mt-10 pt-8 border-t border-white/5">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Digital Presence</p>
                                                        <div className="flex flex-wrap gap-3">
                                                            <a href={selectedAmbassadorApp.socialMedia} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-vc-teal/10 border border-vc-teal/20 text-vc-teal rounded-xl hover:bg-vc-teal hover:text-black transition-all text-sm font-bold">
                                                                <Share2 className="w-4 h-4" /> Social Media Profile
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}
                                            </section>

                                            {/* Education Section */}
                                            {(selectedAmbassadorApp.university || selectedAmbassadorApp.major) && (
                                                <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                    <h3 className="text-vc-teal font-bold uppercase tracking-[0.2em] text-[10px] mb-8 flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4" /> Academic Background
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">University</p>
                                                            <p className="text-lg font-medium text-white">{selectedAmbassadorApp.university}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Major / Field of Study</p>
                                                            <p className="text-lg font-medium text-white">{selectedAmbassadorApp.major}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Degree Level</p>
                                                            <p className="text-lg font-medium text-white">{selectedAmbassadorApp.degree}</p>
                                                        </div>
                                                    </div>
                                                </section>
                                            )}

                                            {/* Legacy Details if present */}
                                            {(selectedAmbassadorApp.reason || selectedAmbassadorApp.experience) && (
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    {selectedAmbassadorApp.reason && (
                                                        <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                            <h3 className="text-vc-teal font-bold uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-2">
                                                                <AlertCircle className="w-4 h-4" /> Why join?
                                                            </h3>
                                                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap italic">
                                                                "{selectedAmbassadorApp.reason}"
                                                            </p>
                                                        </section>
                                                    )}

                                                    {selectedAmbassadorApp.experience && (
                                                        <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                            <h3 className="text-vc-teal font-bold uppercase tracking-[0.2em] text-[10px] mb-6 flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4" /> Experience
                                                            </h3>
                                                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                                                {selectedAmbassadorApp.experience}
                                                            </p>
                                                        </section>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Sidebar: Decision Center */}
                                        <div className="space-y-8">
                                            <section className="bg-vc-teal/10 border-2 border-vc-teal/20 rounded-[2.5rem] p-8 shadow-2xl shadow-vc-teal/5">
                                                <h3 className="text-vc-teal font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-center">
                                                    Promotion decision
                                                </h3>
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'accepted')}
                                                        className={`w-full py-5 rounded-[1.25rem] font-bold text-base transition-all duration-300 ${selectedAmbassadorApp.status === 'accepted'
                                                            ? 'bg-vc-teal text-vc-green-dark shadow-xl shadow-vc-teal/20 scale-[1.02]'
                                                            : 'bg-white/5 text-vc-teal border border-vc-teal/20 hover:bg-vc-teal/20'
                                                            }`}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'rejected')}
                                                        className={`w-full py-5 rounded-[1.25rem] font-bold text-base transition-all duration-300 ${selectedAmbassadorApp.status === 'rejected'
                                                            ? 'bg-red-500 text-white shadow-xl shadow-red-500/20 scale-[1.02]'
                                                            : 'bg-white/5 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                            }`}
                                                    >
                                                        Reject
                                                    </button>

                                                    {selectedAmbassadorApp.status !== 'pending' && (
                                                        <div className="pt-4 flex justify-center">
                                                            <button
                                                                onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'pending')}
                                                                className="text-[10px] font-bold text-white/30 hover:text-vc-teal transition-colors uppercase tracking-[0.15em] border-b border-white/10 pb-0.5"
                                                            >
                                                                Reset Decision
                                                            </button>
                                                        </div>
                                                    )}
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
        </main>
    );
}

export default function AdminDashboard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AdminDashboardContent />
        </Suspense>
    );
}
