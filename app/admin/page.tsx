'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Rocket, CheckCircle, XCircle, Clock,
    Filter, Search, ChevronDown, Eye, Mail,
    Phone, Globe, Linkedin, Video, ArrowLeft,
    Check, X, AlertCircle, Shield, FileText, FileCode,
    User, Link as LinkIcon, Share2, ExternalLink, GraduationCap, WifiOff, QrCode, Download, MoreVertical, Calendar, Hash, Trash2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Toast, ToastType } from '@/components/ui/Toast';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, setDoc, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { countries as countriesList } from '@/lib/countries';

interface Application {
    id: string;
    userId: string;
    startupName?: string;
    location?: string;
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
    screening?: {
        round1?: {
            scores: {
                problemClarity: number; // 30%
                solutionInnovation: number; // 30%
                earlyBusinessLogic: number; // 20%
                communicationConviction: number; // 20%
            };
            totalScore: number; // Weighted 0-100
            evaluatorId: string;
            evaluatedAt: any; // Timestamp
            feedback?: string;
            isCompleted: boolean;
        };
        round2?: {
            status: 'locked' | 'pending' | 'completed';
        };
    };
}

const RUBRICS = [
    {
        id: 'problemClarity',
        label: 'Problem & Market Clarity',
        weight: 0.3,
        maxPoints: 10,
        description: 'Assesses whether the problem is clearly defined, significant, and grounded in a real, identifiable need. The team should articulate who experiences the problem, why it matters, and why it is worth solving now.'
    },
    {
        id: 'solutionInnovation',
        label: 'Solution & Innovation',
        weight: 0.3,
        maxPoints: 10,
        description: 'Evaluates the novelty and originality of the proposed solution, including whether it is grounded in credible science or technology and meaningfully differentiated from existing approaches.'
    },
    {
        id: 'earlyBusinessLogic',
        label: 'Early Business Logic',
        weight: 0.2,
        maxPoints: 10,
        description: 'Assesses whether the team demonstrates a basic understanding of how the innovation creates value, including intended users, use cases, and high-level revenue logic.'
    },
    {
        id: 'communicationConviction',
        label: 'Communication & Conviction',
        weight: 0.2,
        maxPoints: 10,
        description: 'Evaluates clarity, coherence, and persuasiveness of the pitch deck and the video pitch, including the team’s ability to explain the problem and solution clearly and confidently.'
    },
];

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
    const [isJudge, setIsJudge] = useState(false);
    const [isAmbassadorLead, setIsAmbassadorLead] = useState(false);
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
    const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
    const [screeningFilter, setScreeningFilter] = useState<'all' | 'pending' | 'scored'>('all');

    // Screening State
    const [currentScores, setCurrentScores] = useState({
        problemClarity: 0,
        solutionInnovation: 0,
        earlyBusinessLogic: 0,
        communicationConviction: 0
    });
    const [savingScore, setSavingScore] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [securityStatus, setSecurityStatus] = useState<Record<string, { status: string, reportUrl: string, stats?: any }>>({});

    // Tab Management
    const [activeTab, setActiveTab] = useState<'startups' | 'ambassadors' | 'qr'>('startups');
    const [ambassadorSubTab, setAmbassadorSubTab] = useState<'applications' | 'directory'>('applications');

    // Ambassador Data
    const [ambassadorApps, setAmbassadorApps] = useState<AmbassadorApplication[]>([]);
    const [ambassadorsList, setAmbassadorsList] = useState<UserProfile[]>([]);
    const [selectedAmbassadorApp, setSelectedAmbassadorApp] = useState<AmbassadorApplication | null>(null);

    // Ambassador Filters State
    const [ambSearchTerm, setAmbSearchTerm] = useState('');
    const [ambStatusFilter, setAmbStatusFilter] = useState<string>('all');
    const [ambNationalityFilter, setAmbNationalityFilter] = useState<string>('all');
    const [ambLocationFilter, setAmbLocationFilter] = useState<string>('all');
    const [ambDegreeFilter, setAmbDegreeFilter] = useState<string>('all');

    // Decision Modal State
    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [processingDecision, setProcessingDecision] = useState(false);
    const [decisionConfig, setDecisionConfig] = useState<{
        appId: string;
        userId: string;
        userName: string;
        userEmail: string;
        status: 'accepted' | 'rejected' | 'pending';
        location?: string;
    } | null>(null);

    // Removal Modal State
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState<{ id: string, name: string } | null>(null);
    const [processingRemoval, setProcessingRemoval] = useState(false);

    // Application Deletion State
    const [showDeleteAppModal, setShowDeleteAppModal] = useState(false);
    const [appToDelete, setAppToDelete] = useState<{ id: string, name: string } | null>(null);
    const [processingAppDeletion, setProcessingAppDeletion] = useState(false);

    // We use the imported countriesList directly or map it if needed

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (isJudge) {
            setActiveTab('startups');
            return;
        }
        if (isAmbassadorLead) {
            setActiveTab('ambassadors');
            return;
        }

        if (tab === 'ambassadors' && activeTab !== 'ambassadors') {
            setActiveTab('ambassadors');
        } else if (tab === 'startups' && activeTab !== 'startups') {
            setActiveTab('startups');
        } else if (tab === 'qr' && activeTab !== 'qr') {
            setActiveTab('qr');
        } else if (!tab && activeTab !== 'startups') {
            setActiveTab('startups');
        }
    }, [searchParams, activeTab, isJudge, isAmbassadorLead]);


    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push('/signin?redirect=/admin');
                return;
            }

            try {
                const uid = user.uid;
                // Check roles in order: Admin -> Judge -> Ambassador Lead
                const adminDoc = await getDoc(doc(db, 'admins', uid));
                if (adminDoc.exists()) {
                    setIsAdmin(true);
                    setLoading(false);
                    return;
                }

                const judgeDoc = await getDoc(doc(db, 'judges', uid));
                if (judgeDoc.exists()) {
                    setIsJudge(true);
                    setActiveTab('startups');
                    setLoading(false);
                    return;
                }

                const leadDoc = await getDoc(doc(db, 'ambassadors_lead', uid));
                if (leadDoc.exists()) {
                    setIsAmbassadorLead(true);
                    setActiveTab('ambassadors');
                    setLoading(false);
                    return;
                }

                // If no role found
                setError('Access Denied: You do not have admin or evaluator privileges.');
                router.push('/');
            } catch (err: any) {
                console.error('Error checking admin status:', err);
                if (err.code === 'permission-denied') {
                    setError('Access Denied: You do not have sufficient permissions to view this page. Please ensure you are authorized in the Firebase console.');
                } else {
                    setError('Database Error: ' + err.message);
                }
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    // Security Scanning Logic
    const refreshScans = async () => {
        if (!selectedApp && !selectedAmbassadorApp) return;

        const filesToScan = selectedApp ? [
            { id: 'pitchDeck', url: selectedApp.materials.pitchDeckUrl },
            { id: 'execSummary', url: selectedApp.materials.execSummaryUrl },
            { id: 'supportingData', url: selectedApp.materials.supportingDataUrl }
        ].filter(f => f.url) : []; // No security scan for ambassadors

        filesToScan.forEach(async (file) => {
            try {
                const res = await fetch('/api/security-check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileUrl: file.url })
                });
                if (res.ok) {
                    const data = await res.json();
                    setSecurityStatus(prev => ({
                        ...prev,
                        [file.id]: {
                            status: data.status,
                            reportUrl: data.reportUrl,
                            stats: data.stats
                        }
                    }));
                }
            } catch (err) {
                console.error('Scan failed for', file.id, err);
            }
        });
    };

    useEffect(() => {
        if (!selectedApp) {
            setSecurityStatus({});
            return;
        }
        refreshScans();
    }, [selectedApp]);

    // Countries are imported from @/lib/countries

    useEffect(() => {
        if (!isAdmin && !isJudge) return;
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
            setToast({ message: "Failed to update registration status.", type: 'error' });
        } finally {
            setUpdatingReg(false);
        }
    };

    useEffect(() => {
        if (selectedApp?.screening?.round1?.scores) {
            setCurrentScores(selectedApp.screening.round1.scores);
        } else {
            setCurrentScores({
                problemClarity: 0,
                solutionInnovation: 0,
                earlyBusinessLogic: 0,
                communicationConviction: 0
            });
        }
    }, [selectedApp]);

    useEffect(() => {
        if (!isAdmin && !isJudge) return;

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
    }, [isAdmin, isJudge]);

    // Fetch Ambassador Applications
    useEffect(() => {
        if (!(isAdmin || isAmbassadorLead) || activeTab !== 'ambassadors') return;

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
    }, [isAdmin, isAmbassadorLead, activeTab]);

    // Fetch Current Ambassadors
    useEffect(() => {
        if (!(isAdmin || isAmbassadorLead) || activeTab !== 'ambassadors') return;

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
    }, [isAdmin, isAmbassadorLead, activeTab]);


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
            setToast({ message: 'Failed to update status.', type: 'error' });
        }
    };

    const handleSaveScreening = async () => {
        if (!selectedApp) return;
        setSavingScore(true);

        const totalScore = RUBRICS.reduce((acc, rubric) => {
            return acc + (currentScores[rubric.id as keyof typeof currentScores] * (rubric.weight * 10)); // Scale to 100
        }, 0);

        const screeningData = {
            round1: {
                scores: currentScores,
                totalScore: Math.round(totalScore),
                evaluatorId: auth.currentUser?.uid || 'admin',
                evaluatedAt: new Date(),
                isCompleted: true
            }
        };

        try {
            await updateDoc(doc(db, 'applications', selectedApp.id), {
                screening: {
                    ...selectedApp.screening,
                    ...screeningData
                }
            });

            // Update local state
            setSelectedApp({
                ...selectedApp,
                screening: {
                    ...selectedApp.screening,
                    ...screeningData
                }
            });

            setToast({ message: 'Screening evaluation saved successfully!', type: 'success' });
        } catch (error) {
            console.error('Error saving screening:', error);
            setToast({ message: 'Failed to save screening evaluation.', type: 'error' });
        } finally {
            setSavingScore(false);
        }
    };

    const handleAmbassadorStatusUpdate = (appId: string, userId: string | undefined, newStatus: string) => {
        const app = ambassadorApps.find(a => a.id === appId);
        if (!app) return;

        setDecisionConfig({
            appId,
            userId: userId || appId, // Fallback to appId since for ambassador_applications, the doc ID is the user's UID
            userName: app.name || app.fullName || 'Applicant',
            userEmail: app.email,
            status: newStatus as any,
            location: app.location || app.nationality || ''
        });
        setShowDecisionModal(true);
    };

    const executeAmbassadorDecision = async () => {
        if (!decisionConfig) return;
        setProcessingDecision(true);

        const { appId, userId, userName, userEmail, status } = decisionConfig;

        try {
            // 1. Update application status
            await updateDoc(doc(db, 'ambassador_applications', appId), {
                status: status
            });

            // 2. If accepted/rejected, update user role AND sync to 'ambassadors' collection
            if (status === 'accepted') {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    role: 'ambassador'
                });

                // Add to ambassadors collection
                const userSnap = await getDoc(userRef);
                const userData = userSnap.data();

                await setDoc(doc(db, 'ambassadors', userId), {
                    userId: userId,
                    name: userName,
                    email: userEmail,
                    location: decisionConfig.location || '',
                    joinedAt: serverTimestamp(),
                    ...(userData || {}) // Copy other user data like photoURL
                });

            } else if (status === 'rejected' || status === 'pending') {
                await updateDoc(doc(db, 'users', userId), {
                    role: 'user'
                });

                // Remove from ambassadors collection
                await deleteDoc(doc(db, 'ambassadors', userId));
            }

            // 3. Send Email (only for accept/reject)
            if (status === 'accepted' || status === 'rejected') {
                try {
                    await fetch('/api/send-ambassador-decision', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: userEmail,
                            name: userName,
                            status: status,
                            location: decisionConfig.location
                        })
                    });
                } catch (emailErr) {
                    console.error('Failed to send decision email:', emailErr);
                    // We don't block the UI for email failure, but we log it
                }
            }

            if (selectedAmbassadorApp?.id === appId) {
                setSelectedAmbassadorApp({ ...selectedAmbassadorApp, status: status as any });
            }

            setToast({
                message: `Application ${status} successfully! Confirmation email sent.`,
                type: 'success'
            });

            setShowDecisionModal(false);
            setDecisionConfig(null);
        } catch (error: any) {
            console.error('Error updating ambassador status:', error);
            let userMessage = error.message || 'Unknown error';

            if (error.code === 'permission-denied' || error.message?.includes('permission-denied')) {
                userMessage = "Action denied. This usually happens if you manually deleted the document in Firebase or don't have update permissions. Please refresh and try again.";
            } else if (error.code === 'not-found' || error.message?.includes('not-found')) {
                userMessage = "Document not found. It may have been already deleted from Firebase.";
            }

            setToast({ message: `Failed to update status: ${userMessage}`, type: 'error' });
        } finally {
            setProcessingDecision(false);
        }
    };

    const handleRemoveAmbassador = (userId: string, userName: string) => {
        setUserToRemove({ id: userId, name: userName });
        setShowRemoveModal(true);
    };

    const confirmRemoveAmbassador = async () => {
        if (!userToRemove) return;
        setProcessingRemoval(true);
        try {
            await updateDoc(doc(db, 'users', userToRemove.id), {
                role: 'user'
            });
            // Also remove from 'ambassadors' collection
            await deleteDoc(doc(db, 'ambassadors', userToRemove.id));

            setToast({ message: `${userToRemove.name} has been removed from ambassadors.`, type: 'success' });
            setShowRemoveModal(false);
            setUserToRemove(null);
        } catch (error) {
            console.error('Error removing ambassador:', error);
            setToast({ message: 'Failed to remove ambassador.', type: 'error' });
        } finally {
            setProcessingRemoval(false);
        }
    };

    const handleDeleteApplication = (appId: string, applicantName: string) => {
        setAppToDelete({ id: appId, name: applicantName });
        setShowDeleteAppModal(true);
    };

    const confirmDeleteApplication = async () => {
        if (!appToDelete) return;
        setProcessingAppDeletion(true);
        try {
            await deleteDoc(doc(db, 'ambassador_applications', appToDelete.id));
            setToast({ message: `Application for ${appToDelete.name} deleted successfully.`, type: 'success' });
            setShowDeleteAppModal(false);
            setAppToDelete(null);
        } catch (error: any) {
            console.error('Error deleting application:', error);
            let errorMessage = error.message || 'Unknown error';
            if (error.code === 'permission-denied') {
                errorMessage = "Permission denied. Please ensure you have admin rights and refresh the page.";
            } else if (error.code === 'not-found') {
                errorMessage = "Document not found. It may have already been deleted.";
            }
            setToast({ message: `Failed to delete application: ${errorMessage}`, type: 'error' });
        } finally {
            setProcessingAppDeletion(false);
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

        const matchesScreening = screeningFilter === 'all' ||
            (screeningFilter === 'scored' ? app.screening?.round1?.isCompleted : !app.screening?.round1?.isCompleted);

        return matchesSearch && matchesStatus && matchesPillar && matchesStage && matchesTeamSize && matchesAge && matchesNationality && matchesScreening;
    }).sort((a, b) => {
        if (sortBy === 'score') {
            const scoreA = a.screening?.round1?.totalScore || 0;
            const scoreB = b.screening?.round1?.totalScore || 0;
            return scoreB - scoreA;
        }
        return 0; // Default matches query order (date desc)
    });

    const filteredAmbassadorApps = useMemo(() => {
        return ambassadorApps.filter(app => {
            const matchesSearch =
                (app.name?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (app.fullName?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (app.email?.toLowerCase().includes(ambSearchTerm.toLowerCase()));

            const matchesStatus = ambStatusFilter === 'all' || app.status === ambStatusFilter;
            const matchesNationality = ambNationalityFilter === 'all' || app.nationality === ambNationalityFilter;
            const matchesLocation = ambLocationFilter === 'all' || app.location === ambLocationFilter;
            const matchesDegree = ambDegreeFilter === 'all' || app.degree === ambDegreeFilter;

            return matchesSearch && matchesStatus && matchesNationality && matchesLocation && matchesDegree;
        });
    }, [ambassadorApps, ambSearchTerm, ambStatusFilter, ambNationalityFilter, ambLocationFilter, ambDegreeFilter]);


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
                        <WifiOff className="w-16 h-16 text-vc-mint mx-auto mb-8 animate-pulse" />
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

    if (!isAdmin && !isJudge && !isAmbassadorLead) return null;

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-32 pb-12">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold font-poppins mb-2 text-white">
                            Admin Dashboard
                        </h1>
                        <p className="text-white/40 uppercase tracking-[0.3em] font-bold text-[10px]">
                            {activeTab === 'startups'
                                ? 'Manage and review Venture Craft startup applications'
                                : activeTab === 'ambassadors'
                                    ? 'Manage and review Venture Craft ambassador applications'
                                    : 'Generate and download official persistent QR codes'
                            }
                        </p>

                        {/* Tab Switcher - Controlled via Navbar / URL */}
                    </div>


                    <div className="flex flex-wrap items-center gap-4">
                        {isAdmin && (
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
                                    <span className="text-vc-mint/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Scored</span>
                                    <span className="text-2xl font-bold text-vc-mint">{applications.filter(a => a.screening?.round1?.isCompleted).length}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                    <span className="text-2xl font-bold text-white">{applications.filter(a => !a.screening?.round1?.isCompleted).length}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Total</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorApps.length}</span>
                                </div>
                                <div className="bg-vc-mint/10 border border-vc-mint/20 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-vc-mint/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Accepted</span>
                                    <span className="text-2xl font-bold text-vc-mint">{ambassadorApps.filter(a => a.status === 'accepted').length}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 min-w-[100px]">
                                    <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                    <span className="text-2xl font-bold text-white">{ambassadorApps.filter(a => a.status === 'pending').length}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>



                <div className="grid lg:grid-cols-[300px_1fr] gap-12">
                    {/* Sidebar Filters */}
                    <div className="space-y-8 max-w-xl mx-auto lg:max-w-none lg:mx-0">
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

                                {/* Status Filter (Only for Ambassadors) */}
                                {activeTab !== 'startups' && (
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Status</label>
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
                                )}

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
                                                placeholder="All Nationalities"
                                            />
                                        </div>

                                        {/* Ambassador Location Filter */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Current Location</label>
                                            <AdminFlagDropdown
                                                value={ambLocationFilter}
                                                onChange={setAmbLocationFilter}
                                                placeholder="All Locations"
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
                                    setNationalityFilter('all');
                                    setSortBy('date');
                                } else {
                                    setAmbSearchTerm('');
                                    setAmbStatusFilter('all');
                                    setAmbNationalityFilter('all');
                                    setAmbLocationFilter('all');
                                    setAmbDegreeFilter('all');
                                    setScreeningFilter('all');
                                }
                            }}
                            className="w-full py-3 text-xs font-bold text-white/40 hover:text-vc-mint transition-colors border border-white/5 hover:border-vc-mint/20 rounded-xl uppercase tracking-widest mt-4"
                        >
                            Reset Filters
                        </button>

                        {activeTab === 'startups' && (
                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <div>
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Screening Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setScreeningFilter(screeningFilter === 'pending' ? 'all' : 'pending')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-2 ${screeningFilter === 'pending' ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                        >
                                            <Clock className="w-3 h-3" /> PENDING
                                        </button>
                                        <button
                                            onClick={() => setScreeningFilter(screeningFilter === 'scored' ? 'all' : 'scored')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-2 ${screeningFilter === 'scored' ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                        >
                                            <CheckCircle className="w-3 h-3" /> SCORED
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Sort By</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setSortBy('date')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${sortBy === 'date' ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                        >
                                            DATE
                                        </button>
                                        <button
                                            onClick={() => setSortBy('score')}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${sortBy === 'score' ? 'bg-vc-mint/10 border-vc-mint text-vc-mint' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}
                                        >
                                            SCORE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                        {activeTab === 'qr' && (
                            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px] relative overflow-hidden">
                                <div className="absolute inset-0 bg-vc-mint/5 pointer-events-none" />

                                <div className="relative z-10 max-w-xl">
                                    <h2 className="text-3xl font-bold mb-4 font-poppins">Persistent QR Generator</h2>
                                    <p className="text-white/40 text-sm mb-12">
                                        This QR code points to <span className="text-vc-mint">kfupm-venturecraft.org</span>.
                                        When you migrate to the university domain, we will set up a redirect so this QR remains valid.
                                    </p>

                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl mx-auto w-fit mb-8 border-[12px] border-vc-mint/20">
                                        <QRCodeSVG
                                            id="admin-qr-code-svg"
                                            value="https://kfupm-venturecraft.org/"
                                            size={300}
                                            level="H"
                                            includeMargin={false}
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
                                            const svg = document.getElementById('admin-qr-code-svg');
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
                                            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
                                        }}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-vc-mint text-vc-green-dark font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-vc-mint/20"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download High-Res PNG
                                    </button>
                                </div>
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
                                            className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-vc-mint/30 transition-all cursor-pointer items-center md:items-start text-center md:text-left"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                    <Rocket className="text-vc-mint w-5 h-5 sm:w-6 h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-base sm:text-lg mb-1 truncate text-vc-mint">
                                                        {isAdmin ? (app.teamMembers?.[0]?.name || 'Leader') : (app.startupName || 'Startup Application')}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                                                        {app.startupName && isAdmin && (
                                                            <span className="flex items-center gap-1.5 text-vc-mint/60 font-bold"><Rocket className="w-3 h-3" /> {app.startupName}</span>
                                                        )}
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {isAdmin ? app.leaderEmail : 'Applicant Email'}</span>
                                                        <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {app.teamSize} Members</span>
                                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleString() || 'N/A'}</span>
                                                        {!isAdmin && (
                                                            <span className="flex items-center gap-1.5 opacity-50"><User className="w-3 h-3" /> Anonymous Applicant</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto">
                                                <div className="hidden xl:block text-right">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">Pillar</span>
                                                    <span className="text-sm text-white/60">{app.pillar}</span>
                                                </div>

                                                {app.screening?.round1?.totalScore !== undefined && (
                                                    <div className="hidden lg:flex flex-col items-end">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-vc-mint/60">Score</span>
                                                        <span className="text-xl font-black text-vc-mint">{app.screening.round1.totalScore}</span>
                                                    </div>
                                                )}

                                                <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-colors ${app.screening?.round1?.isCompleted ? 'bg-vc-mint text-vc-green-dark border-vc-mint' :
                                                    app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                        app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                            'bg-vc-mint/10 border-vc-mint/20 text-vc-mint'
                                                    }`}>
                                                    {app.screening?.round1?.isCompleted ? 'SCORED' : (app.status === 'submitted' ? 'pending' : app.status) || 'pending'}
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
                                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                            <Users className="text-vc-mint w-5 h-5 sm:w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-base sm:text-lg mb-1 truncate text-vc-mint">{app.email}</h3>
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest">
                                                                <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {app.name || app.fullName}</span>
                                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleString() || 'N/A'}</span>
                                                                {app.location && <span className="flex items-center gap-1.5 font-bold text-vc-mint/60"><Globe className="w-3 h-3" /> {app.location}</span>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                                                        <div className="hidden xl:block text-right">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">Education</span>
                                                            <span className="text-sm text-white/60">{app.degree}</span>
                                                        </div>

                                                        <div className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                            app.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                'bg-vc-mint/10 border-vc-mint/20 text-vc-mint'
                                                            }`}>
                                                            {app.status || 'pending'}
                                                        </div>
                                                        <div className="flex items-center gap-2 relative z-10">
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
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app.id, app.name || app.fullName || 'Applicant'); }}
                                                                className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-red-400 transition-all border border-white/10 hover:border-red-500/30"
                                                                title="Delete Application"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                                                        onClick={() => handleRemoveAmbassador(user.id, user.displayName)}
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
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
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
                                            <h2 className="text-2xl font-bold">{selectedApp.startupName || selectedApp.pillar}</h2>
                                            <div className="flex items-center gap-4 text-white/40 text-sm mt-1">
                                                <span>Submitted on {selectedApp.submittedAt?.toDate().toLocaleString()}</span>
                                                {selectedApp.location && (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                        <Globe className="w-3 h-3" /> {selectedApp.location}
                                                    </span>
                                                )}
                                            </div>
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
                                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
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
                                                    {selectedApp.location && (
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Primary Location</p>
                                                            <p className="text-lg font-medium text-white">{selectedApp.location}</p>
                                                        </div>
                                                    )}
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

                                                <div className="flex flex-col gap-8">
                                                    <div className="space-y-6">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Breakdown ({selectedApp.teamSize} Member{selectedApp.teamSize > 1 ? 's' : ''})</p>
                                                        <div className="space-y-3">
                                                            {selectedApp.teamMembers.map((m, i) => (
                                                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/[0.08]">
                                                                    <div className="w-8 h-8 rounded-lg bg-vc-mint/10 flex items-center justify-center text-[10px] font-bold text-vc-mint border border-vc-mint/20 shrink-0">
                                                                        {i + 1}
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                                                                        <span className="font-bold text-sm text-white/90 truncate">{isAdmin ? (m.name || 'Anonymous Member') : 'Anonymous Member'}</span>
                                                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium whitespace-nowrap opacity-60">
                                                                            ({isAdmin ? m.nationality : 'Hidden'})
                                                                        </span>
                                                                        {i === 0 && (
                                                                            <span className="ml-2 px-2 py-0.5 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint text-[9px] font-black uppercase tracking-widest rounded-md">
                                                                                Team Leader
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid lg:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Leader Contact</p>
                                                            <div className="space-y-3 text-sm">
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-vc-mint/5 border border-vc-mint/10">
                                                                    <Mail className="w-4 h-4 text-vc-mint" />
                                                                    <span className="font-medium underline decoration-vc-mint/30 truncate" title={selectedApp.leaderEmail}>{isAdmin ? selectedApp.leaderEmail : 'Applicant Email'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                                    <Phone className="w-4 h-4 text-white/40" />
                                                                    <span className="font-medium truncate">{isAdmin ? selectedApp.leaderPhone : 'Hidden'}</span>
                                                                </div>
                                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                                    <Globe className="w-4 h-4 text-white/40" />
                                                                    <span className="font-medium truncate">{isAdmin ? selectedApp.leaderNationality : 'Hidden'}</span>
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

                                            {/* Submission Materials */}
                                            <section className="bg-[#0f2a27] border border-white/10 rounded-[2.5rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" /> Required Materials
                                                </h3>
                                                <div className="mb-6 p-4 rounded-2xl bg-vc-mint/5 border border-vc-mint/10 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-vc-mint/10 flex items-center justify-center shrink-0 border border-vc-mint/20">
                                                        <Shield className="w-5 h-5 text-vc-mint" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <p className="text-[10px] font-bold text-vc-mint uppercase tracking-widest">Security Filtering Active</p>
                                                            <button
                                                                onClick={refreshScans}
                                                                className="text-[9px] font-black uppercase tracking-tighter text-vc-mint/60 hover:text-vc-mint transition-colors underline"
                                                            >
                                                                Refresh
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-white/40 leading-relaxed">
                                                            All materials are automatically scanned. {isAdmin && "Reports provided via VirusTotal."}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {[
                                                        { id: 'pitchDeck', label: 'Pitch Deck', url: selectedApp.materials.pitchDeckUrl, icon: FileText },
                                                        { id: 'execSummary', label: 'Exec Summary', url: selectedApp.materials.execSummaryUrl, icon: FileText },
                                                        { id: 'supportingData', label: 'Supporting Data', url: selectedApp.materials.supportingDataUrl, icon: FileCode }
                                                    ].map((item, idx) => (
                                                        item.url ? (
                                                            <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-vc-mint/10 hover:border-vc-mint/30 group transition-all">
                                                                <div className="flex items-center justify-between w-full">
                                                                    <div className="flex items-center gap-3">
                                                                        <item.icon className="text-vc-mint w-5 h-5" />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-sm font-medium">{item.label}</span>
                                                                            {(!isAdmin && (securityStatus[item.id]?.status === 'malicious' || securityStatus[item.id]?.status === 'suspicious')) ? (
                                                                                <span className="text-[10px] text-red-400/60 font-medium italic">Access restricted for safety</span>
                                                                            ) : (
                                                                                <a
                                                                                    href={item.url}
                                                                                    target="_blank"
                                                                                    className="text-[10px] text-vc-mint/60 hover:text-vc-mint transition-colors underline decoration-vc-mint/20 underline-offset-2"
                                                                                >
                                                                                    Open File
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-2">
                                                                        {securityStatus[item.id] ? (
                                                                            <div className={`flex items-center gap-1.5 px-2 py-1 border rounded-md ${securityStatus[item.id].status === 'clean' ? 'bg-vc-mint/10 border-vc-mint/20 text-vc-mint' :
                                                                                securityStatus[item.id].status === 'malicious' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                                                    'bg-white/5 border-white/10 text-white/40'
                                                                                }`}>
                                                                                <Shield className="w-3 h-3" />
                                                                                <span className="text-[9px] font-bold uppercase tracking-widest">
                                                                                    {securityStatus[item.id].status === 'clean' ? 'Safe' :
                                                                                        securityStatus[item.id].status === 'malicious' ?
                                                                                            (isAdmin ? `Flagged (${securityStatus[item.id].stats?.malicious || 1} alert${(securityStatus[item.id].stats?.malicious || 1) > 1 ? 's' : ''})` : 'Flagged') :
                                                                                            securityStatus[item.id].status === 'suspicious' ?
                                                                                                (isAdmin ? `Suspicious (${securityStatus[item.id].stats?.suspicious || 1} flag${(securityStatus[item.id].stats?.suspicious || 1) > 1 ? 's' : ''})` : 'Suspicious') :
                                                                                                securityStatus[item.id].status === 'pending_submission' ? 'Analysis Started' :
                                                                                                    'Scanning...'}
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 text-white/20 rounded-md animate-pulse">
                                                                                <Shield className="w-3 h-3" />
                                                                                <span className="text-[9px] font-bold uppercase tracking-widest">Verifying</span>
                                                                            </div>
                                                                        )}
                                                                        {isAdmin && (
                                                                            <a
                                                                                href={securityStatus[item.id]?.reportUrl || `https://www.virustotal.com/gui/search/${encodeURIComponent(item.url)}`}
                                                                                target="_blank"
                                                                                className="p-1 px-2 rounded-md bg-white/5 hover:bg-white/10 text-[9px] font-bold text-white/40 hover:text-vc-mint transition-all"
                                                                                title="View VirusTotal Report"
                                                                            >
                                                                                REPORT
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
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


                                        </div>




                                        {/* Right Column: Scoring */}
                                        <div className="space-y-8">
                                            {/* Screening & Scoring Section */}
                                            <section className="bg-[#0f2a27]/50 border border-vc-mint/20 rounded-[2rem] p-8 relative overflow-hidden">


                                                <div className="flex items-center justify-between mb-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                        <Shield className="w-4 h-4" /> Screening Round 1
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs uppercase tracking-widest font-bold text-white/60">Total Score</span>
                                                        <span className="text-4xl font-black text-vc-mint">
                                                            {Math.round(RUBRICS.reduce((acc, r) => acc + (currentScores[r.id as keyof typeof currentScores] * (r.weight * 10)), 0))}
                                                            <span className="text-base font-bold text-white/30 ml-2">/ 100</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    {RUBRICS.map((rubric) => (
                                                        <div key={rubric.id} className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="space-y-1">
                                                                    <label className="text-base font-bold text-white flex items-center gap-2">
                                                                        {rubric.label}
                                                                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60 font-normal">
                                                                            {rubric.weight * 100}% Weight
                                                                        </span>
                                                                    </label>
                                                                    <p className="text-sm text-white/60 max-w-lg leading-relaxed">{rubric.description}</p>
                                                                </div>
                                                                <span className="text-2xl font-bold text-vc-mint w-12 text-right">
                                                                    {currentScores[rubric.id as keyof typeof currentScores]}
                                                                </span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="10"
                                                                step="1"
                                                                value={currentScores[rubric.id as keyof typeof currentScores]}
                                                                onChange={(e) => setCurrentScores({
                                                                    ...currentScores,
                                                                    [rubric.id]: parseInt(e.target.value)
                                                                })}
                                                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-vc-mint"
                                                            />
                                                            <div className="flex justify-between text-xs uppercase font-bold text-white/50 tracking-widest">
                                                                <span>Poor (0)</span>
                                                                <span>Excellent (10)</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
                                                    <button
                                                        onClick={handleSaveScreening}
                                                        disabled={savingScore}
                                                        className="px-6 py-3 bg-vc-mint text-vc-green-dark rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {savingScore ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-vc-green-dark border-t-transparent rounded-full animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-5 h-5" /> Save Evaluation
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </section>

                                            {/* Round 2 Placeholder */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 opacity-50 grayscale select-none cursor-not-allowed relative">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                                        <Shield className="w-4 h-4 text-white/40" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-white/60">Round 2 Locked</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> Screening Round 2
                                                </h3>
                                                <div className="h-40"></div>
                                            </section>


                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
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
                                className="relative w-full max-w-6xl max-h-[90vh] bg-[#0c1e1c] border border-vc-mint/20 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                            >
                                {/* Modal Header */}
                                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-vc-mint/10 flex items-center justify-center">
                                            <Users className="text-vc-mint w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{selectedAmbassadorApp.email}</h2>
                                            <span className="text-white/40 text-sm">Submitted on {selectedAmbassadorApp.submittedAt?.toDate().toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedAmbassadorApp(null)}
                                        className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Modal Content - Synced with Startup Layout */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                                    <div className="grid lg:grid-cols-[1fr_360px] gap-8 md:gap-12">
                                        {/* Main Column: Profiles & Experience */}
                                        <div className="space-y-10">
                                            {/* Person Profile Section */}
                                            <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                    <User className="w-4 h-4" /> Personal Profile
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Full Name</p>
                                                        <p className="text-lg font-bold text-white/90">{selectedAmbassadorApp.name || selectedAmbassadorApp.fullName}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Nationality</p>
                                                        <p className="text-lg font-bold text-white/90">{selectedAmbassadorApp.nationality}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Current Location</p>
                                                        <p className="text-lg font-bold text-white/90">{selectedAmbassadorApp.location}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            {/* Education Section */}
                                            {(selectedAmbassadorApp.university || selectedAmbassadorApp.major) && (
                                                <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
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
                                                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-vc-mint/10 border border-vc-mint/20 text-vc-mint text-[10px] font-black uppercase tracking-widest">
                                                                {selectedAmbassadorApp.degree}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            )}

                                            {/* Experience & Motivation */}
                                            {(selectedAmbassadorApp.reason || selectedAmbassadorApp.experience) && (
                                                <section className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4" /> Context & Motivation
                                                    </h3>
                                                    <div className="space-y-6">
                                                        {selectedAmbassadorApp.reason && (
                                                            <div className="p-6 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10">
                                                                <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest mb-3">Why join?</p>
                                                                <p className="text-sm text-white/70 leading-relaxed italic whitespace-pre-wrap">
                                                                    "{selectedAmbassadorApp.reason}"
                                                                </p>
                                                            </div>
                                                        )}
                                                        {selectedAmbassadorApp.experience && (
                                                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Relevant Experience</p>
                                                                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                                                    {selectedAmbassadorApp.experience}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </section>
                                            )}
                                        </div>

                                        {/* Sidebar: Contact & Decision */}
                                        <div className="space-y-8">
                                            {/* Contact & Digital Presence */}
                                            <section className="bg-[#0f2a27] border border-white/10 rounded-[2.5rem] p-8">
                                                <h3 className="text-vc-mint font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" /> Contact & Social
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Email Address</p>
                                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-vc-mint/5 border border-vc-mint/10 text-vc-mint text-sm truncate">
                                                            <Mail className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{selectedAmbassadorApp.email}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Phone Number</p>
                                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-white/70 text-sm">
                                                            <Phone className="w-4 h-4 shrink-0" />
                                                            <span>{selectedAmbassadorApp.phone}</span>
                                                        </div>
                                                    </div>
                                                    {selectedAmbassadorApp.socialMedia && (
                                                        <div className="pt-4 border-t border-white/5 space-y-3">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className="text-[9px] font-bold text-vc-mint/40 uppercase tracking-widest">Digital Presence</p>
                                                            </div>
                                                            <a
                                                                href={selectedAmbassadorApp.socialMedia}
                                                                target="_blank"
                                                                className="flex items-center gap-4 p-5 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10 hover:bg-vc-mint/10 hover:border-vc-mint/30 group transition-all"
                                                            >
                                                                <div className="w-10 h-10 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0 border border-vc-mint/20 group-hover:scale-110 transition-transform">
                                                                    <Share2 className="text-vc-mint w-5 h-5" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-bold text-white/90 mb-0.5">Social Profile</p>
                                                                    <p className="text-[10px] text-vc-mint/60 underline decoration-vc-mint/20 truncate">
                                                                        {selectedAmbassadorApp.socialMedia}
                                                                    </p>
                                                                </div>
                                                                <ExternalLink className="w-4 h-4 text-vc-mint/40 group-hover:text-vc-mint transition-colors" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </section>

                                            {/* Review Decision Center */}
                                            <section className="bg-vc-mint/10 border-2 border-vc-mint/20 rounded-[2.5rem] p-8 shadow-2xl shadow-vc-mint/5">
                                                <h3 className="text-vc-mint font-black uppercase tracking-[0.2em] text-[10px] mb-8 text-center">
                                                    Review Decision
                                                </h3>
                                                <div className="space-y-4">
                                                    <button
                                                        onClick={() => handleAmbassadorStatusUpdate(selectedAmbassadorApp.id, selectedAmbassadorApp.userId, 'accepted')}
                                                        className={`w-full py-5 rounded-[1.25rem] font-bold text-base transition-all duration-300 ${selectedAmbassadorApp.status === 'accepted'
                                                            ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20 scale-[1.02]'
                                                            : 'bg-white/5 text-vc-mint border border-vc-mint/20 hover:bg-vc-mint/20'
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
                    )
                    }
                </AnimatePresence >
            </div >

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <AnimatePresence>
                {showDecisionModal && decisionConfig && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !processingDecision && setShowDecisionModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0c1e1c] border border-vc-mint/20 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            {/* Abstract Glow Background */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-vc-mint/10 rounded-full blur-[60px] pointer-events-none" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${decisionConfig.status === 'accepted' ? 'bg-vc-mint/20 text-vc-mint' : 'bg-red-500/20 text-red-500'}`}>
                                    {decisionConfig.status === 'accepted' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Confirm Decision</h3>
                                    <p className="text-white/60 text-sm leading-relaxed px-4">
                                        Are you sure you want to <span className={`font-bold ${decisionConfig.status === 'accepted' ? 'text-vc-mint' : decisionConfig.status === 'rejected' ? 'text-red-400' : 'text-white/80'}`}>
                                            {decisionConfig.status === 'accepted' ? 'accept' : decisionConfig.status === 'rejected' ? 'reject' : 'reset'}
                                        </span> the application for <span className="text-white font-medium">{decisionConfig.userName}</span>?
                                    </p>
                                </div>

                                <div className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="p-2 rounded-lg bg-vc-mint/10 mt-1">
                                            <Mail className="w-4 h-4 text-vc-mint" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-vc-mint/60 uppercase tracking-widest">Notification Flow</p>
                                            <p className="text-xs text-white/50 leading-relaxed">
                                                An official {decisionConfig.status === 'accepted' ? 'acceptance' : 'rejection'} email will be sent automatically to <span className="text-white/80">{decisionConfig.userEmail}</span>.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <button
                                        onClick={() => setShowDecisionModal(false)}
                                        disabled={processingDecision}
                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={executeAmbassadorDecision}
                                        disabled={processingDecision}
                                        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${decisionConfig.status === 'accepted'
                                            ? 'bg-vc-mint text-vc-green-dark hover:bg-white'
                                            : 'bg-red-500 text-white hover:bg-red-400'
                                            } disabled:opacity-50 shadow-xl ${decisionConfig.status === 'accepted' ? 'shadow-vc-mint/10' : 'shadow-red-500/10'}`}
                                    >
                                        {processingDecision ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Confirm'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showRemoveModal && userToRemove && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !processingRemoval && setShowRemoveModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0c1e1c] border border-red-500/20 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            {/* Abstract Glow Background */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-500/20 text-red-500">
                                    <XCircle className="w-8 h-8" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold">Remove Ambassador?</h3>
                                    <p className="text-white/60 text-sm leading-relaxed px-4">
                                        Are you sure you want to remove <span className="text-white font-medium">{userToRemove.name}</span> from the Ambassadors? This will revert their role to 'User'.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <button
                                        onClick={() => setShowRemoveModal(false)}
                                        disabled={processingRemoval}
                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmRemoveAmbassador}
                                        disabled={processingRemoval}
                                        className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-red-500/10"
                                    >
                                        {processingRemoval ? (
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            'Confirm Removal'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main >
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
