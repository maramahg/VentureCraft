'use client';

import { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Rocket, CheckCircle, XCircle, Clock,
    Filter, Search, ChevronDown, Eye, Mail,
    Phone, Globe, Linkedin, Video, ArrowLeft,
    Check, X, AlertCircle, Shield, FileText, FileCode, Edit2, History, UserMinus,
    User, Link as LinkIcon, Share2, ExternalLink, GraduationCap, WifiOff, QrCode, Download, MoreVertical, Calendar, Hash, Trash2, Trophy, Star, CircleDollarSign, Loader2, FileSpreadsheet, BarChart, BarChart3, Paperclip, CheckCircle2,
    AlignLeft, AlignCenter, AlignRight, Type
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';
import { Toast, ToastType } from '@/components/ui/Toast';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, setDoc, where, deleteDoc, serverTimestamp, addDoc, getDocs, runTransaction, getCountFromServer } from 'firebase/firestore';
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
    isEdited?: boolean;
    assignedTeam?: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    submittedAt: any;
    updatedAt?: any;
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
        eligibilityProofName?: string;
        eligibilityProofUrl?: string;
    };
    audienceCategory?: string;
    coiDeclaration?: string;
    additionalLinks?: string;
    confirmations?: {
        ageConfirmed: boolean;
        educationConfirmed: boolean;
    };
    screening?: {
        round1?: {
            scores: {
                problemClarity: number;
                solutionInnovation: number;
                earlyBusinessLogic: number;
                communicationConviction: number;
            };
            totalScore: number;
            evaluatorId: string;
            evaluatedAt: any;
            feedback?: string;
            isCompleted: boolean;
        };
        round2?: {
            status: 'locked' | 'pending' | 'completed';
            scores?: {
                technicalFeasibility: number;
                scientificRigor: number;
                commercialLogic: number;
                scalability: number;
                impactAlignment: number;
                communicationQuality: number;
            };
            totalScore?: number;
            evaluatorId?: string;
            evaluatedAt?: any;
            feedback?: string;
            isCompleted: boolean;
        };
    };
    referral?: {
        source: string;
        platform?: string | null;
        ambassadorId?: string | null;
        ambassadorName?: string | null;
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

const RUBRICS_ROUND2 = [
    {
        id: 'technicalFeasibility',
        label: 'Technical Feasibility & Validation',
        weight: 0.25,
        maxPoints: 10,
        description: 'Assesses whether the solution is technically feasible based on evidence provided (experimental, simulated, calculated, or well-reasoned theoretical).'
    },
    {
        id: 'scientificRigor',
        label: 'Scientific Rigor & Reasoning',
        weight: 0.2,
        maxPoints: 10,
        description: 'Evaluates the soundness of scientific or engineering logic, clarity of assumptions, grounding in first principles, and acknowledgment of limitations.'
    },
    {
        id: 'commercialLogic',
        label: 'Commercial Logic & Credibility',
        weight: 0.2,
        maxPoints: 10,
        description: 'Assesses whether the team demonstrates a realistic understanding of the target market, customer value, and adoption pathway.'
    },
    {
        id: 'scalability',
        label: 'Scalability & Roadmap',
        weight: 0.2,
        maxPoints: 10,
        description: 'Evaluates whether the team presents a logical roadmap from current concept to scalable implementation, including technical and commercial milestones.'
    },
    {
        id: 'impactAlignment',
        label: 'Impact & Sustainability',
        weight: 0.1,
        maxPoints: 10,
        description: 'Considers environmental, social, or economic impact and alignment with sustainability or strategic priorities.'
    },
    {
        id: 'communicationQuality',
        label: 'Communication Quality',
        weight: 0.05,
        maxPoints: 10,
        description: 'Evaluates how clearly technical concepts, assumptions, business logic, and next steps are communicated.'
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
    points?: number;
    ambassadorId?: number;
    joinedAt?: any;
    createdAt?: any;
}

interface JudgeMember {
    id: string;
    team: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    role: 'ultimate' | 'team_judge' | 'supervisor';
    displayName?: string;
    email?: string;
    phoneNumber?: string;
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
    const [judgeTeam, setJudgeTeam] = useState<string | null>(null);
    const [isUltimateJudge, setIsUltimateJudge] = useState(false);
    const [isSupervisor, setIsSupervisor] = useState(false);
    const [isTeamJudgeOnly, setIsTeamJudgeOnly] = useState(false);
    const [isAmbassadorLead, setIsAmbassadorLead] = useState(false);
    const [allJudges, setAllJudges] = useState<JudgeMember[]>([]);
    const [judgeNames, setJudgeNames] = useState<Record<string, string>>({});
    const [judgeContacts, setJudgeContacts] = useState<Record<string, { name: string; email: string }>>({});
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pillarFilter, setPillarFilter] = useState<string>('all');
    const [stageFilter, setStageFilter] = useState<string>('all');
    const [teamSizeFilter, setTeamSizeFilter] = useState<string>('all');
    const [ageFilter, setAgeFilter] = useState<string>('all');
    const [nationalityFilter, setNationalityFilter] = useState<string>('all');
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
    const [isEditingAllowed, setIsEditingAllowed] = useState<boolean>(true);
    const [isScreeningRound2Open, setIsScreeningRound2Open] = useState<boolean>(false);
    const [updatingReg, setUpdatingReg] = useState(false);
    const [updatingEditing, setUpdatingEditing] = useState(false);
    const [updatingScreening2, setUpdatingScreening2] = useState(false);

    const canScore = isAdmin || (isTeamJudgeOnly && selectedApp?.assignedTeam === judgeTeam);

    const handleRedistributeTeams = async (appsToFix: Application[]) => {
        if ((!isAdmin && !isUltimateJudge) || appsToFix.length === 0) return;

        console.log(`AUTO_MIGRATION: Redistributing ${appsToFix.length} applications across 5 teams...`);
        try {
            const teams = ['A', 'B', 'C', 'D', 'E'];
            const batchSize = 10;

            const updates = appsToFix.map((app, idx) => ({
                id: app.id,
                team: teams[idx % 5]
            }));

            for (let i = 0; i < updates.length; i += batchSize) {
                const batch = updates.slice(i, i + batchSize);
                await Promise.all(batch.map(item =>
                    updateDoc(doc(db, 'applications', item.id), { assignedTeam: item.team })
                ));
            }
            console.log('AUTO_MIGRATION: Success');
            setToast({ message: `Successfully distributed ${appsToFix.length} applications across 5 teams.`, type: 'success' });
        } catch (error) {
            console.error('AUTO_MIGRATION: Failed', error);
        }
    };

    // Automatic Background Migration Effect
    useEffect(() => {
        if ((!isAdmin && !isUltimateJudge) || loading || applications.length === 0) return;

        const unassigned = applications.filter(app => !app.assignedTeam);
        const teamEApps = applications.filter(a => a.assignedTeam === 'E');
        const idealPerTeam = applications.length / 5;

        // Trigger rebalance if:
        // 1. There are unassigned apps
        // 2. OR Team E is significantly under-populated (indicates a failed/partial migrate from 4 teams)
        if (unassigned.length > 0) {
            handleRedistributeTeams(unassigned);
        } else if (teamEApps.length < idealPerTeam - 5) { // Use a small buffer to avoid jitter
            console.log(`REBALANCE: Distribution is unbalanced (Team E has only ${teamEApps.length} apps). Redistributing all ${applications.length} apps...`);
            handleRedistributeTeams(applications);
        }
    }, [isAdmin, loading, applications]);
    const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
    const [screeningFilter, setScreeningFilter] = useState<'all' | 'pending' | 'scored'>('all');
    const [totalUsers, setTotalUsers] = useState(0);

    // Screening State
    const [currentScores, setCurrentScores] = useState({
        problemClarity: 0,
        solutionInnovation: 0,
        earlyBusinessLogic: 0,
        communicationConviction: 0
    });

    const [currentScoresRound2, setCurrentScoresRound2] = useState({
        technicalFeasibility: 0,
        scientificRigor: 0,
        commercialLogic: 0,
        scalability: 0,
        impactAlignment: 0,
        communicationQuality: 0
    });
    const [savingScore, setSavingScore] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // Tab Management
    const [activeTab, setActiveTab] = useState<'startups' | 'ambassadors' | 'qr' | 'broadcast' | 'teams'>('startups');
    const [ambassadorSubTab, setAmbassadorSubTab] = useState<'applications' | 'directory'>('applications');
    const [showOversight, setShowOversight] = useState(false);
    const [selectedOversightTeam, setSelectedOversightTeam] = useState<string | null>(null);

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
    const [ambAppTypeFilter, setAmbAppTypeFilter] = useState<'all' | 'local' | 'global'>('all');
    const [ambDirTypeFilter, setAmbDirTypeFilter] = useState<'all' | 'local' | 'global'>('all');

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
        ambassadorType?: 'local' | 'global';
    } | null>(null);

    // Removal Modal State
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState<{ id: string, name: string } | null>(null);
    const [processingRemoval, setProcessingRemoval] = useState(false);

    // QR Download Helper
    const downloadQR = (elementId: string, fileName: string) => {
        const svg = document.getElementById(elementId);
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
                downloadLink.download = `${fileName}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
            }
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    // Application Deletion State (Ambassadors)
    const [showDeleteAppModal, setShowDeleteAppModal] = useState(false);
    const [appToDelete, setAppToDelete] = useState<{ id: string, name: string } | null>(null);
    const [processingAppDeletion, setProcessingAppDeletion] = useState(false);

    // Startup Deletion State
    const [showDeleteStartupModal, setShowDeleteStartupModal] = useState(false);
    const [startupToDelete, setStartupToDelete] = useState<{ id: string, name: string } | null>(null);
    const [processingStartupDeletion, setProcessingStartupDeletion] = useState(false);

    // Reward System State
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [rewardUser, setRewardUser] = useState<{ id: string, name: string, currentPoints: number } | null>(null);
    const [pointsToAdd, setPointsToAdd] = useState<string>('');
    const [rewardReason, setRewardReason] = useState<string>('');
    const [processingReward, setProcessingReward] = useState(false);

    // History Modal State
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyUser, setHistoryUser] = useState<{ id: string, name: string } | null>(null);
    const [userHistory, setUserHistory] = useState<Array<{ points: number, reason: string, timestamp: any }>>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);


    // We use the imported countriesList directly or map it if needed

    const router = useRouter();
    const searchParams = useSearchParams();

    // Announcement State
    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastHeadline, setBroadcastHeadline] = useState('');
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [sendToEmail, setSendToEmail] = useState('');
    const [sendingBroadcast, setSendingBroadcast] = useState(false);
    const [broadcastShowButton, setBroadcastShowButton] = useState(true);
    const [broadcastButtonText, setBroadcastButtonText] = useState('');
    const [broadcastButtonUrl, setBroadcastButtonUrl] = useState('');
    const [broadcastAttachments, setBroadcastAttachments] = useState<Array<{ name: string; content: string; type: string }>>([]);

    const handleBroadcastFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const maxTotalSize = 10 * 1024 * 1024; // 10MB limit for Resend
        let currentTotalSize = broadcastAttachments.reduce((acc, att) => acc + (att.content.length * 0.75), 0);

        Array.from(files).forEach(file => {
            if (file.size > maxTotalSize) {
                setToast({ message: `File ${file.name} is too large (max 10MB)`, type: 'error' });
                return;
            }

            if (currentTotalSize + file.size > maxTotalSize) {
                setToast({ message: `Total attachments size exceeds 10MB limit.`, type: 'error' });
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                const base64 = result.split(',')[1];
                setBroadcastAttachments(prev => [
                    ...prev,
                    { name: file.name, content: base64, type: file.type }
                ]);
            };
            reader.readAsDataURL(file);
            currentTotalSize += file.size;
        });

        // Reset input
        e.target.value = '';
    };

    const removeBroadcastAttachment = (index: number) => {
        setBroadcastAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const broadcastTextareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (startTag: string, endTag: string) => {
        const textarea = broadcastTextareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + startTag + selected + endTag + after;
        setBroadcastMessage(newText);

        setTimeout(() => {
            textarea.focus();
            const newPos = start + startTag.length + selected.length + endTag.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const handleSendTestBroadcast = async () => {
        if (!sendToEmail) {
            setToast({ message: 'Please enter a test email address.', type: 'error' });
            return;
        }
        setSendingBroadcast(true);
        try {
            const res = await fetch('/api/broadcast-announcement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: sendToEmail,
                    subject: broadcastSubject,
                    headline: broadcastHeadline,
                    message: broadcastMessage,
                    showButton: broadcastShowButton,
                    buttonText: broadcastButtonText,
                    buttonUrl: broadcastButtonUrl,
                    attachments: broadcastAttachments
                })
            });
            const data = await res.json();
            if (data.success) {
                setToast({ message: 'Test email sent successfully!', type: 'success' });
            } else {
                setToast({ message: `Error: ${data.error}`, type: 'error' });
            }
        } catch (err) {
            setToast({ message: 'Failed to send test email.', type: 'error' });
        } finally {
            setSendingBroadcast(false);
        }
    };

    const handleBroadcastAll = async () => {
        const confirmSend = window.confirm("⚠️ ATTENTION: This will send this email to ALL registered users. Are you absolutely sure?");
        if (!confirmSend) return;

        setSendingBroadcast(true);
        try {
            // First, fetch all users from Firebase
            const usersSnap = await getDocs(collection(db, 'users'));
            const emails = usersSnap.docs.map(doc => doc.data().email).filter(e => e);

            if (emails.length === 0) {
                setToast({ message: 'No users found to send to.', type: 'error' });
                return;
            }

            const res = await fetch('/api/broadcast-announcement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emails: emails,
                    subject: broadcastSubject,
                    headline: broadcastHeadline,
                    message: broadcastMessage,
                    showButton: broadcastShowButton,
                    buttonText: broadcastButtonText,
                    buttonUrl: broadcastButtonUrl,
                    attachments: broadcastAttachments
                })
            });
            const data = await res.json();
            if (data.success) {
                setToast({ message: `Broadcast sent successfully to ${data.count} users!`, type: 'success' });
            } else {
                setToast({ message: `Error: ${data.error}`, type: 'error' });
            }
        } catch (err) {
            console.error('Broadcast error:', err);
            setToast({ message: 'Failed to send broadcast.', type: 'error' });
        } finally {
            setSendingBroadcast(false);
        }
    };

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
        } else if (tab === 'broadcast' && activeTab !== 'broadcast') {
            setActiveTab('broadcast');

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
                    const judgeData = judgeDoc.data();
                    setIsJudge(true);
                    setJudgeTeam(judgeData.team || null);

                    const role = (judgeData.role || 'team_judge').toLowerCase();
                    setIsUltimateJudge(role === 'ultimate' || !judgeData.team);
                    setIsSupervisor(role === 'supervisor');
                    setIsTeamJudgeOnly(role === 'team_judge' && !!judgeData.team);

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

    // Countries are imported from @/lib/countries

    useEffect(() => {
        if (!isAdmin && !isJudge) return;
        const fetchRegStatus = async () => {
            const regDoc = await getDoc(doc(db, 'settings', 'registration'));
            if (regDoc.exists()) {
                setIsRegistrationOpen(regDoc.data().isOpen ?? regDoc.data().isAllowed ?? true);
            }
            const editingDoc = await getDoc(doc(db, 'settings', 'editing'));
            if (editingDoc.exists()) {
                setIsEditingAllowed(editingDoc.data().isAllowed ?? editingDoc.data().isOpen ?? true);
            }
            const screening2Doc = await getDoc(doc(db, 'settings', 'screeningRound2'));
            if (screening2Doc.exists()) {
                setIsScreeningRound2Open(screening2Doc.data().isOpen ?? false);
            }
        };
        fetchRegStatus();
    }, [isAdmin, isJudge]);

    const toggleRegistration = async () => {
        setUpdatingReg(true);
        try {
            const newStatus = !isRegistrationOpen;
            await setDoc(doc(db, 'settings', 'registration'), {
                isOpen: newStatus
            }, { merge: true });
            setIsRegistrationOpen(newStatus);
            setToast({ message: `Registration ${newStatus ? 'Opened' : 'Closed'} successfully.`, type: 'success' });
        } catch (error) {
            console.error("Error toggling registration:", error);
            setToast({ message: "Failed to update registration status.", type: 'error' });
        } finally {
            setUpdatingReg(false);
        }
    };

    const toggleEditing = async () => {
        setUpdatingEditing(true);
        try {
            const newStatus = !isEditingAllowed;
            await setDoc(doc(db, 'settings', 'editing'), {
                isOpen: newStatus
            }, { merge: true });
            setIsEditingAllowed(newStatus);
            setToast({ message: `Editing ${newStatus ? 'Allowed' : 'Locked'} successfully.`, type: 'success' });
        } catch (error) {
            console.error("Error toggling editing:", error);
            setToast({ message: "Failed to update editing status.", type: 'error' });
        } finally {
            setUpdatingEditing(false);
        }
    };

    // Fetch All Judges for Ultimate Judge Oversight
    useEffect(() => {
        if (!isAdmin && !isJudge) return;

        const fetchJudgesDirectory = async () => {
            try {
                const judgesSnap = await getDocs(collection(db, 'judges'));
                const judgesList = judgesSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as JudgeMember[];

                // Fetch names and emails from users collection
                const namesMap: Record<string, string> = {};
                const contactsMap: Record<string, { name: string; email: string; phone: string }> = {};

                await Promise.all(judgesList.map(async (j) => {
                    // Start with data potentially already in the judge document
                    let name = j.displayName || `Judge (${j.id.substring(0, 8)})`;
                    let email = j.email || '';
                    let phone = j.phoneNumber || '';

                    // Fallback to users collection if fields are missing
                    if (!j.displayName || !j.email || !j.phoneNumber) {
                        const userDoc = await getDoc(doc(db, 'users', j.id));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            name = name === `Judge (${j.id.substring(0, 8)})` ? (userData?.displayName || userData?.fullName || userData?.name || name) : name;
                            email = email || userData?.email || '';
                            phone = phone || userData?.phoneNumber || userData?.phone || '';
                        }
                    }

                    namesMap[j.id] = name;
                    contactsMap[j.id] = { name, email, phone };
                }));

                console.log(`Resolved info for ${judgesList.length} judges`);
                setJudgeNames(namesMap);
                // Note: judgeContacts state might need updating if used elsewhere, 
                // but let's ensure allJudges has the data.
                setAllJudges(judgesList.map(j => ({
                    ...j,
                    displayName: namesMap[j.id],
                    email: contactsMap[j.id].email,
                    phoneNumber: contactsMap[j.id].phone
                })));
            } catch (err) {
                console.error('Error fetching judges directory:', err);
            }
        };

        fetchJudgesDirectory();
    }, [isAdmin, isJudge, isUltimateJudge]);

    const toggleScreening2 = async () => {
        setUpdatingScreening2(true);
        try {
            const newStatus = !isScreeningRound2Open;
            await setDoc(doc(db, 'settings', 'screeningRound2'), {
                isOpen: newStatus
            }, { merge: true });
            setIsScreeningRound2Open(newStatus);
            setToast({ message: `Screening Round 2 ${newStatus ? 'Opened' : 'Closed'} successfully.`, type: 'success' });
        } catch (error) {
            console.error("Error toggling screening round 2:", error);
            setToast({ message: "Failed to update screening round 2 status.", type: 'error' });
        } finally {
            setUpdatingScreening2(false);
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

        if (selectedApp?.screening?.round2?.scores) {
            setCurrentScoresRound2(selectedApp.screening.round2.scores);
        } else {
            setCurrentScoresRound2({
                technicalFeasibility: 0,
                scientificRigor: 0,
                commercialLogic: 0,
                scalability: 0,
                impactAlignment: 0,
                communicationQuality: 0
            });
        }
    }, [selectedApp]);

    useEffect(() => {
        if (loading || (!isAdmin && !isJudge)) return;

        // Build query based on role
        let q;
        if (isJudge && !isUltimateJudge) {
            // Team judges must filter by their team. Wait for team ID if not yet available.
            if (!judgeTeam) return;

            q = query(
                collection(db, 'applications'),
                where('assignedTeam', '==', judgeTeam)
            );
        } else {
            // Admins and Ultimate Judges see all applications
            q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('Fetched startups:', snapshot.size);
            const appsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];

            setApplications(appsData);
        }, (error) => {
            console.error('FIREBASE_PERMISSION_ERROR: Startup Applications Fetch failed', error);
        });

        return () => unsubscribe();
    }, [isAdmin, isJudge, isUltimateJudge, judgeTeam, loading]);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchUserCount = async () => {
            try {
                const coll = collection(db, 'users');
                const snapshot = await getCountFromServer(coll);
                setTotalUsers(snapshot.data().count);
            } catch (error) {
                console.error('Error fetching total users count:', error);
            }
        };

        fetchUserCount();
        // We only fetch this once per session/admin visit to save quota
    }, [isAdmin]);

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

        console.log('FETCHING: ambassadors collection...');
        const q = query(collection(db, 'ambassadors'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            console.log('SUCCESS: ambassadors fetched', snapshot.size);

            const userPromises = snapshot.docs.map(async (docRef) => {
                const data = docRef.data();

                // If name AND ID are already there (cached), use it
                if ((data.displayName || data.name) && data.ambassadorId) {
                    return {
                        id: docRef.id,
                        ...data,
                        displayName: data.displayName || data.name,
                        email: data.email || 'No email provided',
                        points: data.points || 0,
                        ambassadorId: data.ambassadorId
                    };
                }

                // Fallback: Fetch missing info from users collection
                try {
                    const userSnap = await getDoc(doc(db, 'users', docRef.id));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        return {
                            id: docRef.id,
                            ...data,
                            displayName: userData.displayName || 'Unnamed User',
                            email: userData.email || 'No email provided',
                            points: data.points || 0,
                            photoURL: userData.photoURL,
                            ambassadorId: userData.ambassadorId || data.ambassadorId
                        };
                    }
                } catch (err) {
                    console.error("Error resolving ambassador name:", err);
                }

                return {
                    id: docRef.id,
                    ...data,
                    displayName: 'Anonymous (' + docRef.id.slice(0, 5) + ')',
                    email: data.email || 'No email provided',
                    points: data.points || 0
                };
            });

            const users = await Promise.all(userPromises);
            // Re-sort client side by points since we resolved names asynchronously
            const sortedUsers = (users as UserProfile[]).sort((a, b) => (b.points || 0) - (a.points || 0));
            setAmbassadorsList(sortedUsers);
        }, (error) => {
            console.error('FIREBASE_PERMISSION_ERROR: Ambassadors collection Fetch failed', error);
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

    const handleSaveScreeningRound2 = async () => {
        if (!selectedApp) return;
        setSavingScore(true);

        const totalScore = RUBRICS_ROUND2.reduce((acc, rubric) => {
            return acc + (currentScoresRound2[rubric.id as keyof typeof currentScoresRound2] * (rubric.weight * 10)); // Scale to 100
        }, 0);

        const screeningData = {
            round2: {
                status: 'completed' as const,
                scores: currentScoresRound2,
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

            setToast({ message: 'Round 2 evaluation saved successfully!', type: 'success' });
        } catch (error) {
            console.error('Error saving round 2 screening:', error);
            setToast({ message: 'Failed to save round 2 screening evaluation.', type: 'error' });
        } finally {
            setSavingScore(false);
        }
    };

    const handleAmbassadorStatusUpdate = (appId: string, userId: string | undefined, newStatus: string) => {
        const app = ambassadorApps.find(a => a.id === appId);
        if (!app) return;

        const location = app.location || app.nationality || '';
        const defaultType = (location.toLowerCase().includes('saudi') || location.toLowerCase() === 'sa') ? 'local' : 'global';

        setDecisionConfig({
            appId,
            userId: userId || appId, // Fallback to appId since for ambassador_applications, the doc ID is the user's UID
            userName: app.name || app.fullName || 'Applicant',
            userEmail: app.email,
            status: newStatus as any,
            location: location,
            ambassadorType: defaultType
        });
        setShowDecisionModal(true);
    };

    const executeAmbassadorDecision = async () => {
        if (!decisionConfig) return;
        setProcessingDecision(true);

        const { appId, userId, userName, userEmail, status } = decisionConfig;

        try {
            // 1. If accepted/rejected, update user role AND sync to 'ambassadors' collection
            if (status === 'accepted') {
                await runTransaction(db, async (transaction) => {
                    // Get current counter
                    const counterRef = doc(db, 'counters', 'ambassadors');
                    const counterSnap = await transaction.get(counterRef);
                    let nextId = 1;

                    if (counterSnap.exists()) {
                        nextId = (counterSnap.data().lastId || 0) + 1;
                    }

                    // Check if already an ambassador and has ID
                    const ambRef = doc(db, 'ambassadors', userId);
                    const ambSnap = await transaction.get(ambRef);
                    const existingAmbData = ambSnap.data();

                    // Get user data for role update and point sync
                    const userRef = doc(db, 'users', userId);
                    const userSnap = await transaction.get(userRef);
                    const userData = userSnap.data();

                    const finalAmbassadorId = existingAmbData?.ambassadorId || nextId;

                    // --- ALL WRITES MUST BE BELOW ALL READS ---

                    // Update counter ONLY IF we assigned a new ID
                    if (!existingAmbData?.ambassadorId) {
                        transaction.set(counterRef, { lastId: finalAmbassadorId }, { merge: true });
                    }

                    // Update application status
                    transaction.update(doc(db, 'ambassador_applications', appId), {
                        status: status
                    });

                    // Update user role
                    transaction.set(userRef, {
                        role: 'ambassador',
                        points: userData?.points ?? 0,
                        ambassadorId: finalAmbassadorId
                    }, { merge: true });

                    // Add to ambassadors collection
                    transaction.set(ambRef, {
                        userId: userId,
                        name: userName,
                        email: userEmail,
                        location: decisionConfig.location || '',
                        joinedAt: serverTimestamp(),
                        points: userData?.points ?? 0,
                        ambassadorId: finalAmbassadorId,
                        ...(userData || {}) // Copy other user data like photoURL
                    });
                });

            } else {
                // Normal update for non-accepted status
                await updateDoc(doc(db, 'ambassador_applications', appId), {
                    status: status
                });

                if (status === 'rejected' || status === 'pending') {
                    await updateDoc(doc(db, 'users', userId), {
                        role: 'user'
                    });

                    // Remove from ambassadors collection
                    await deleteDoc(doc(db, 'ambassadors', userId));
                }
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
                            location: decisionConfig.location,
                            ambassadorType: decisionConfig.ambassadorType
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
            // Safely attempt to revert role
            try {
                const userRef = doc(db, 'users', userToRemove.id);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    await updateDoc(userRef, {
                        role: 'user'
                    });
                } else {
                    console.log("No user document found to revert role, skipping role update.");
                }
            } catch (err) {
                console.warn("Error updating user role during removal:", err);
            }

            // Always remove from 'ambassadors' collection
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
        console.log("Delete button clicked for:", appId, applicantName);
        setAppToDelete({ id: appId, name: applicantName });
        setShowDeleteAppModal(true);
    };

    const confirmDeleteApplication = async () => {
        if (!appToDelete) return;
        setProcessingAppDeletion(true);
        console.log("Attempting to delete application:", appToDelete);
        try {
            const docRef = doc(db, 'ambassador_applications', appToDelete.id);
            console.log("Deleting document at path:", docRef.path);
            await deleteDoc(docRef);
            console.log("Deletion successful!");
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

    const handleDeleteStartup = (appId: string, startupName: string) => {
        setStartupToDelete({ id: appId, name: startupName });
        setShowDeleteStartupModal(true);
    };

    const confirmDeleteStartup = async () => {
        if (!startupToDelete) return;
        setProcessingStartupDeletion(true);
        try {
            await deleteDoc(doc(db, 'applications', startupToDelete.id));
            setToast({ message: `Startup application for ${startupToDelete.name} deleted successfully.`, type: 'success' });
            setShowDeleteStartupModal(false);
            setStartupToDelete(null);
        } catch (error: any) {
            console.error('Error deleting startup application:', error);
            setToast({ message: 'Failed to delete startup application.', type: 'error' });
        } finally {
            setProcessingStartupDeletion(false);
        }
    };


    const handleGivePoints = async () => {
        if (!rewardUser || !pointsToAdd) return;
        setProcessingReward(true);
        const amount = parseInt(pointsToAdd);
        if (isNaN(amount)) {
            setToast({ message: "Invalid points amount", type: 'error' });
            setProcessingReward(false);
            return;
        }

        try {
            const newPoints = (rewardUser.currentPoints || 0) + amount;

            // Update users collection
            const userRef = doc(db, 'users', rewardUser.id);
            await updateDoc(userRef, {
                points: newPoints
            });

            // Update ambassadors collection (where they are stored as active)
            const ambRef = doc(db, 'ambassadors', rewardUser.id);
            const ambSnap = await getDoc(ambRef);
            if (ambSnap.exists()) {
                await updateDoc(ambRef, {
                    points: newPoints
                });
            }

            // Save to point_history sub-collection
            await addDoc(collection(userRef, 'point_history'), {
                points: amount,
                reason: rewardReason || 'Manual adjustment',
                awardedBy: auth.currentUser?.uid || 'admin',
                timestamp: serverTimestamp()
            });

            setToast({ message: `Successfully awarded ${amount} Venture Coins to ${rewardUser.name}!`, type: 'success' });
            setShowRewardModal(false);
            setRewardUser(null);
            setPointsToAdd('');
            setRewardReason('');
        } catch (error) {
            console.error('Error awarding Venture Coins:', error);
            setToast({ message: 'Failed to award Venture Coins.', type: 'error' });
        } finally {
            setProcessingReward(false);
        }
    };

    const fetchHistory = async (userId: string, userName: string) => {
        setLoadingHistory(true);
        setHistoryUser({ id: userId, name: userName });
        setShowHistoryModal(true);

        try {
            const q = query(
                collection(db, 'users', userId, 'point_history'),
                orderBy('timestamp', 'desc')
            );
            const snapshot = await getDocs(q);
            const history = snapshot.docs.map(doc => ({
                points: doc.data().points,
                reason: doc.data().reason,
                timestamp: doc.data().timestamp
            }));
            setUserHistory(history);
        } catch (error) {
            console.error('Error fetching history:', error);
            setToast({ message: 'Failed to fetch reward history.', type: 'error' });
        } finally {
            setLoadingHistory(false);
        }
    };

    const exportToExcel = (data: any[], fileName: string) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Calculate dynamic column widths
            if (data.length > 0) {
                const allKeys = Array.from(new Set(data.flatMap(row => Object.keys(row))));
                const colWidths = allKeys.map(key => {
                    const headerLen = key.toString().length;
                    const maxValLen = data.reduce((max, row) => {
                        const val = row[key];
                        if (val === null || val === undefined) return max;
                        return Math.max(max, val.toString().length);
                    }, 0);
                    return { wch: Math.max(headerLen, maxValLen) + 4 }; // Added more padding
                });
                worksheet['!cols'] = colWidths;
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            XLSX.writeFile(workbook, `${fileName}.xlsx`);
            setToast({ message: `Exported ${fileName} successfully!`, type: 'success' });
        } catch (error) {
            console.error('Error exporting to excel:', error);
            setToast({ message: 'Failed to export to excel.', type: 'error' });
        }
    };

    const filteredApps = applications.filter(app => {
        const matchesSearch =
            (app.leaderEmail?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.startupName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.teamMembers?.[0]?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

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

        const matchesOversightTeam = !selectedOversightTeam || app.assignedTeam === selectedOversightTeam;

        const matchesScreening = screeningFilter === 'all' ||
            (screeningFilter === 'scored' ? app.screening?.round1?.isCompleted : !app.screening?.round1?.isCompleted);

        return matchesSearch && matchesStatus && matchesPillar && matchesStage && matchesTeamSize && matchesAge && matchesNationality && matchesScreening && matchesOversightTeam;
    }).sort((a, b) => {
        if (sortBy === 'score') {
            const scoreA = a.screening?.round1?.totalScore || 0;
            const scoreB = b.screening?.round1?.totalScore || 0;
            return scoreB - scoreA;
        }

        // Default: Sort by date descending (Newest first)
        const dateA = a.submittedAt?.toMillis?.() || a.submittedAt?.seconds * 1000 || 0;
        const dateB = b.submittedAt?.toMillis?.() || b.submittedAt?.seconds * 1000 || 0;
        return dateB - dateA;
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

            const locStr = (app.location || app.nationality || '').toLowerCase();
            const isLocal = locStr.includes('saudi') || locStr === 'sa';
            const matchesType = ambAppTypeFilter === 'all' ||
                (ambAppTypeFilter === 'local' && isLocal) ||
                (ambAppTypeFilter === 'global' && !isLocal);

            return matchesSearch && matchesStatus && matchesNationality && matchesLocation && matchesDegree && matchesType;
        });
    }, [ambassadorApps, ambSearchTerm, ambStatusFilter, ambNationalityFilter, ambLocationFilter, ambDegreeFilter, ambAppTypeFilter]);

    const ambAppCounts = useMemo(() => {
        const local = ambassadorApps.filter(app => {
            const locStr = (app.location || app.nationality || '').toLowerCase();
            return locStr.includes('saudi') || locStr === 'sa';
        }).length;
        return {
            all: ambassadorApps.length,
            local,
            global: ambassadorApps.length - local
        };
    }, [ambassadorApps]);

    const ambDirCounts = useMemo(() => {
        const local = ambassadorsList.filter(user => {
            const locStr = (user.location || '').toLowerCase();
            return locStr.includes('saudi') || locStr === 'sa';
        }).length;
        return {
            all: ambassadorsList.length,
            local,
            global: ambassadorsList.length - local
        };
    }, [ambassadorsList]);

    const filteredAmbassadorsList = useMemo(() => {
        return ambassadorsList.filter(user => {
            const matchesSearch =
                (user.displayName?.toLowerCase().includes(ambSearchTerm.toLowerCase())) ||
                (user.email?.toLowerCase().includes(ambSearchTerm.toLowerCase()));

            const locStr = (user.location || '').toLowerCase();
            const isLocal = locStr.includes('saudi') || locStr === 'sa';
            const matchesType = ambDirTypeFilter === 'all' ||
                (ambDirTypeFilter === 'local' && isLocal) ||
                (ambDirTypeFilter === 'global' && !isLocal);

            return matchesSearch && matchesType;
        });
    }, [ambassadorsList, ambSearchTerm, ambDirTypeFilter]);


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
                {/* Header Section */}
                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-3 text-white tracking-tight">
                                {isAdmin ? 'Admin Dashboard' : isUltimateJudge ? 'Ultimate Judge' : isSupervisor ? `Team ${judgeTeam} Supervisor` : `Team ${judgeTeam} Evaluator`}
                            </h1>
                            <p className="text-vc-mint/60 uppercase tracking-[0.3em] font-bold text-[10px] flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                {activeTab === 'startups'
                                    ? isAdmin ? 'Startup Ecosystem Oversight' : isUltimateJudge ? 'Ultimate Performance Oversight' : `Team ${judgeTeam} Evaluation Queue`
                                    : activeTab === 'ambassadors'
                                        ? 'Ambassador Network Management'
                                        : activeTab === 'qr'
                                            ? 'Secure Access Protocol Control'
                                            : activeTab === 'teams'
                                                ? 'Oversight: Judge Network Performance'
                                                : 'Strategic Communication Command'
                                }
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {activeTab === 'startups' && (
                                <>
                                    <div className={`bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm ${!isAdmin ? 'opacity-0 pointer-events-none invisible' : ''}`}>
                                        <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest block mb-1">Total Users</span>
                                        <span className="text-xl font-bold text-white leading-none">{totalUsers}</span>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest block mb-1">Applications</span>
                                        <span className="text-xl font-bold text-white leading-none">{applications.length}</span>
                                    </div>
                                    <div className="bg-vc-mint/5 border border-vc-mint/20 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-vc-mint/60 text-[9px] uppercase font-bold tracking-widest block mb-1">Scored</span>
                                        <span className="text-xl font-bold text-vc-mint leading-none">{applications.filter(a => a.screening?.round1?.isCompleted).length}</span>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                        <span className="text-xl font-bold text-white leading-none">{applications.filter(a => !a.screening?.round1?.isCompleted).length}</span>
                                    </div>
                                </>
                            )}

                            {activeTab === 'ambassadors' && (
                                <>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest block mb-1">Total Apps</span>
                                        <span className="text-xl font-bold text-white leading-none">{ambassadorApps.length}</span>
                                    </div>
                                    <div className="bg-vc-mint/5 border border-vc-mint/20 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-vc-mint/60 text-[9px] uppercase font-bold tracking-widest block mb-1">Accepted</span>
                                        <span className="text-xl font-bold text-vc-mint leading-none">{ambassadorApps.filter(a => a.status === 'accepted').length}</span>
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-red-500/60 text-[9px] uppercase font-bold tracking-widest block mb-1">Rejected</span>
                                        <span className="text-xl font-bold text-red-500 leading-none">{ambassadorApps.filter(a => a.status === 'rejected').length}</span>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 min-w-[120px] backdrop-blur-sm">
                                        <span className="text-white/30 text-[9px] uppercase font-bold tracking-widest block mb-1">Pending</span>
                                        <span className="text-xl font-bold text-white leading-none">{ambassadorApps.filter(a => a.status === 'pending').length}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Team Supervisor Quick Contact (Visible to all team participants except Ultimate Judges) */}
                        {!!judgeTeam && !isAdmin && !isUltimateJudge && (
                            <div className="flex items-center gap-4 p-4 bg-vc-teal/5 border border-vc-teal/20 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-700">
                                <div className="w-10 h-10 rounded-xl bg-vc-teal/10 flex items-center justify-center text-vc-teal border border-vc-teal/20">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-vc-teal/60 uppercase tracking-widest mb-0.5">Team {judgeTeam} Supervisor</p>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-white mb-1">
                                            {allJudges.find(j => j.team === judgeTeam && j.role?.toLowerCase() === 'supervisor')?.displayName || 'Not Assigned'}
                                        </p>
                                        <div className="flex flex-col gap-0.5">
                                            {allJudges.find(j => j.team === judgeTeam && j.role?.toLowerCase() === 'supervisor')?.email && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium">
                                                    <Mail className="w-3 h-3 text-vc-teal/40" />
                                                    <span>{allJudges.find(j => j.team === judgeTeam && j.role?.toLowerCase() === 'supervisor')?.email}</span>
                                                </div>
                                            )}
                                            {allJudges.find(j => j.team === judgeTeam && j.role?.toLowerCase() === 'supervisor')?.phoneNumber && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium">
                                                    <Phone className="w-3 h-3 text-vc-teal/40" />
                                                    <span>{allJudges.find(j => j.team === judgeTeam && j.role?.toLowerCase() === 'supervisor')?.phoneNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Global Controls Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        {(isAdmin || isUltimateJudge) && activeTab !== 'broadcast' && (
                            <div className="flex flex-wrap items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={toggleRegistration}
                                            disabled={updatingReg}
                                            className={`h-11 px-6 rounded-2xl font-bold transition-all flex items-center gap-2 border ${isRegistrationOpen
                                                ? 'bg-vc-mint text-vc-green-dark border-vc-mint shadow-lg shadow-vc-mint/10'
                                                : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {isRegistrationOpen ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                            <span className="text-xs uppercase tracking-wider">Registration: {isRegistrationOpen ? 'Open' : 'Closed'}</span>
                                        </button>

                                        <button
                                            onClick={toggleEditing}
                                            disabled={updatingEditing}
                                            className={`h-11 px-6 rounded-2xl font-bold transition-all flex items-center gap-2 border ${isEditingAllowed
                                                ? 'bg-vc-teal text-white border-vc-teal shadow-lg shadow-vc-teal/10'
                                                : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {isEditingAllowed ? <Edit2 className="w-4 h-4" /> : <Shield className="w-4 h-4 text-orange-500" />}
                                            <span className="text-xs uppercase tracking-wider">Editing: {isEditingAllowed ? 'Allowed' : 'Locked'}</span>
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={toggleScreening2}
                                    disabled={updatingScreening2}
                                    className={`h-11 px-6 rounded-2xl font-bold transition-all flex items-center gap-2 border ${isScreeningRound2Open
                                        ? 'bg-vc-mint text-vc-green-dark border-vc-mint shadow-lg shadow-vc-mint/10'
                                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">Round 2: {isScreeningRound2Open ? 'Open' : 'Closed'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>



                {/* Custom Navigation Header */}
                <div className="flex flex-wrap items-center gap-2 mb-12 p-2 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('startups')}
                        className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'startups' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <Rocket className="w-4 h-4" /> Startups
                    </button>
                    {(isAdmin || isAmbassadorLead) && (
                        <button
                            onClick={() => setActiveTab('ambassadors')}
                            className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'ambassadors' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <Users className="w-4 h-4" /> Ambassadors
                        </button>
                    )}
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setActiveTab('qr')}
                                className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'qr' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <QrCode className="w-4 h-4" /> QR Access
                            </button>
                            <button
                                onClick={() => setActiveTab('broadcast')}
                                className={`flex-1 min-w-[120px] px-6 py-4 rounded-[2rem] font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'broadcast' ? 'bg-vc-mint text-vc-green-dark shadow-xl shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Mail className="w-4 h-4" /> Email
                            </button>
                        </>
                    )}
                </div>

                {/* Filter Controls Row */}
                {(activeTab === 'startups' || activeTab === 'ambassadors') && (
                    <div className="glass-panel p-6 mb-8 flex flex-wrap items-end gap-6">
                        <div className="flex-1 min-w-[300px]">
                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block px-2">Search Records</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or ID..."
                                    value={activeTab === 'startups' ? searchTerm : ambSearchTerm}
                                    onChange={(e) => activeTab === 'startups' ? setSearchTerm(e.target.value) : setAmbSearchTerm(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                />
                            </div>
                        </div>

                        {activeTab === 'startups' ? (
                            <>
                                <div className="w-[200px]">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block px-2">Pillar</label>
                                    <AdminDropdown
                                        options={pillars}
                                        value={pillarFilter}
                                        onChange={setPillarFilter}
                                        placeholder="All Pillars"
                                    />
                                </div>
                                <div className="w-[180px]">
                                    <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block px-2">Stage</label>
                                    <AdminDropdown
                                        options={stages}
                                        value={stageFilter}
                                        onChange={setStageFilter}
                                        placeholder="All Stages"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="w-[180px]">
                                <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block px-2">Status</label>
                                <AdminDropdown
                                    options={['all', 'pending', 'accepted', 'rejected']}
                                    value={ambStatusFilter}
                                    onChange={setAmbStatusFilter}
                                    placeholder="All Status"
                                />
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (activeTab === 'startups') {
                                    setSearchTerm('');
                                    setPillarFilter('all');
                                    setStageFilter('all');
                                    setNationalityFilter('all');
                                    setSortBy('date');
                                } else {
                                    setAmbSearchTerm('');
                                    setAmbStatusFilter('all');
                                    setAmbNationalityFilter('all');
                                }
                            }}
                            className="h-[46px] px-6 text-[10px] font-bold text-white/40 hover:text-vc-mint transition-colors border border-white/5 hover:border-vc-mint/20 rounded-2xl uppercase tracking-widest"
                        >
                            Reset
                        </button>
                    </div>
                )}

                <div className="space-y-4">
                    {activeTab === 'ambassadors' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint border border-vc-mint/20">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white leading-none mb-1">Ambassador Hub</h2>
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-black">Management & Directory</p>
                                    </div>
                                </div>
                                <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/10 backdrop-blur-sm">
                                    <button
                                        onClick={() => setAmbassadorSubTab('applications')}
                                        className={`px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambassadorSubTab === 'applications' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Applications
                                    </button>
                                    <button
                                        onClick={() => setAmbassadorSubTab('directory')}
                                        className={`px-6 py-2.5 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambassadorSubTab === 'directory' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Active Directory
                                    </button>
                                </div>
                            </div>

                            {ambassadorSubTab === 'applications' ? (
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2">
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                                            <button
                                                onClick={() => setAmbAppTypeFilter('all')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambAppTypeFilter === 'all' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                ALL ({ambAppCounts.all})
                                            </button>
                                            <button
                                                onClick={() => setAmbAppTypeFilter('local')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambAppTypeFilter === 'local' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                LOCAL ({ambAppCounts.local})
                                            </button>
                                            <button
                                                onClick={() => setAmbAppTypeFilter('global')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambAppTypeFilter === 'global' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                GLOBAL ({ambAppCounts.global})
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const exportData = filteredAmbassadorApps.map(app => ({
                                                    'Applicant Name': app.name || app.fullName || 'N/A',
                                                    'Email': app.email,
                                                    'Phone': app.phone || 'N/A',
                                                    'Nationality': app.nationality || 'N/A',
                                                    'University': app.university || 'N/A',
                                                    'Major': app.major || 'N/A',
                                                    'Degree': app.degree || 'N/A',
                                                    'Location': app.location || 'N/A',
                                                    'Status': app.status,
                                                    'Submitted At': app.submittedAt?.toDate().toLocaleString() || 'N/A',
                                                    'Social Media': app.socialMedia || 'N/A'
                                                }));
                                                exportToExcel(exportData, 'Ambassador_Applications');
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-vc-mint/10 border border-vc-mint/20 rounded-xl text-xs font-bold text-vc-mint hover:bg-vc-mint hover:text-vc-green-dark transition-all w-full sm:w-auto justify-center"
                                        >
                                            <FileSpreadsheet className="w-4 h-4" />
                                            Export Excel
                                        </button>
                                    </div>
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
                                                <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 text-center md:text-left w-full md:w-auto">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                        <Users className="text-vc-mint w-5 h-5 sm:w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0 flex flex-col items-center md:items-start">
                                                        <h3 className="font-bold text-base sm:text-lg mb-1 truncate text-vc-mint">{app.name || app.fullName || 'Unknown Applicant'}</h3>
                                                        <div className="flex flex-col gap-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest w-full">
                                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                                                                <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {app.email}</span>
                                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleString() || 'N/A'}</span>
                                                            </div>
                                                            {app.location && (
                                                                <div className="text-vc-mint/60 font-bold flex justify-center md:justify-start">
                                                                    <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> {app.location}</span>
                                                                </div>
                                                            )}
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
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
                                            <button
                                                onClick={() => setAmbDirTypeFilter('all')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambDirTypeFilter === 'all' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                ALL ({ambDirCounts.all})
                                            </button>
                                            <button
                                                onClick={() => setAmbDirTypeFilter('local')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambDirTypeFilter === 'local' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                LOCAL ({ambDirCounts.local})
                                            </button>
                                            <button
                                                onClick={() => setAmbDirTypeFilter('global')}
                                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ambDirTypeFilter === 'global' ? 'bg-vc-mint text-vc-green-dark shadow-lg shadow-vc-mint/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                            >
                                                GLOBAL ({ambDirCounts.global})
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => {
                                                    const exportData = ambassadorsList.map(amb => ({
                                                        'Name': amb.displayName || 'N/A',
                                                        'Email': amb.email,
                                                        'ID': amb.ambassadorId || 'N/A',
                                                        'Location': amb.location || 'N/A',
                                                        'Points': amb.points || 0
                                                    }));
                                                    exportToExcel(exportData, 'Ambassador_Directory');
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 bg-vc-mint/5 border border-vc-mint/10 rounded-lg hover:bg-vc-mint/10 transition-all text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-vc-mint flex-1 sm:flex-initial justify-center"
                                            >
                                                <FileSpreadsheet className="w-3 h-3" />
                                                Export Excel
                                            </button>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-vc-mint/5 border border-vc-mint/10 rounded-xl">
                                                <Trophy className="w-4 h-4 text-vc-mint" />
                                                <span className="text-xs uppercase tracking-widest text-vc-mint font-black">Leaderboard</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <span className="text-sm text-white/40">Showing {filteredAmbassadorsList.length} active ambassadors</span>
                                    </div>

                                    <div className="grid gap-4">
                                        {filteredAmbassadorsList
                                            .sort((a, b) => (b.points || 0) - (a.points || 0))
                                            .map((user, index) => (
                                                <div
                                                    key={user.id}
                                                    className="glass-panel p-6 flex items-center justify-between group hover:border-vc-mint/30 transition-all"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                                                {user.photoURL ? (
                                                                    <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <User className="w-6 h-6 text-white/20" />
                                                                )}
                                                            </div>
                                                            {index < 3 && (user.points || 0) > 0 && (
                                                                <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${index === 0 ? 'bg-yellow-500 border-yellow-200 text-yellow-900' :
                                                                    index === 1 ? 'bg-slate-300 border-slate-100 text-slate-800' :
                                                                        'bg-amber-600 border-amber-400 text-amber-50'
                                                                    }`}>
                                                                    {index + 1}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="font-bold text-lg leading-tight">{user.displayName}</h3>
                                                                <div className="px-2.5 py-0.5 rounded-full bg-vc-mint/10 border border-vc-mint/20 flex items-center gap-1.5">
                                                                    <CircleDollarSign className="w-4 h-4 text-vc-mint" />
                                                                    <span className="text-xs font-black text-vc-mint">{user.points || 0}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-white/30 uppercase tracking-[0.1em]">
                                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                                                <span className="flex items-center gap-1 text-vc-mint/60 font-black whitespace-nowrap"><Hash className="w-3 h-3" /> ID: #{user.ambassadorId || '---'}</span>
                                                                {user.location && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {user.location}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => fetchHistory(user.id, user.displayName)}
                                                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-vc-mint/10 hover:text-vc-mint transition-all border border-white/10 hover:border-vc-mint/30"
                                                            title="Reward History"
                                                        >
                                                            <History className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setRewardUser({ id: user.id, name: user.displayName || 'Ambassador', currentPoints: user.points || 0 });
                                                                setShowRewardModal(true);
                                                            }}
                                                            className="px-5 py-3 rounded-xl bg-vc-mint text-vc-green-dark font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-vc-mint/20"
                                                        >
                                                            Manage Points
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setUserToRemove({ id: user.id, name: user.displayName || 'Ambassador' });
                                                                setShowRemoveModal(true);
                                                            }}
                                                            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                            title="Remove Ambassador"
                                                        >
                                                            <UserMinus className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'qr' && (
                        <div className="glass-panel p-8 sm:p-12 min-h-[600px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-vc-mint/5 pointer-events-none" />

                            <div className="relative z-10 text-center mb-12">
                                <h2 className="text-3xl font-bold mb-2 font-poppins">QR Access Management</h2>
                                <p className="text-white/40 text-sm">
                                    Monitor and coordinate official QR access points.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 max-w-5xl mx-auto">
                                {/* Official Website QR */}
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center space-y-6 hover:bg-white/[0.08] transition-colors group">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">Main Website</h3>
                                        <p className="text-white/40 text-xs">Points to <span className="text-vc-mint">kfupm-venturecraft.org</span></p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl shadow-2xl border-[8px] border-vc-mint/20 group-hover:scale-105 transition-transform duration-500">
                                        <QRCodeSVG
                                            id="qr-main-website"
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
                                        onClick={() => downloadQR('qr-main-website', 'VentureCraft-Official-QR')}
                                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-vc-mint text-vc-green-dark font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-vc-mint/20"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download PNG
                                    </button>
                                </div>

                                {/* Socials Linktree QR */}
                                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center space-y-6 hover:bg-white/[0.08] transition-colors group">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">Socials Linktree</h3>
                                        <p className="text-white/40 text-xs">Points to <span className="text-vc-mint text-vc-teal">/socials</span></p>
                                    </div>

                                    <div className="bg-white p-6 rounded-3xl shadow-2xl border-[8px] border-vc-teal/20 group-hover:scale-105 transition-transform duration-500">
                                        <QRCodeSVG
                                            id="qr-socials-linktree"
                                            value="https://kfupm-venturecraft.org/socials"
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
                                        onClick={() => downloadQR('qr-socials-linktree', 'VentureCraft-Socials-QR')}
                                        className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-vc-teal text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-vc-teal/20"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download PNG
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'startups' && (
                        <div className="space-y-4">
                            {isUltimateJudge && (
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint border border-vc-mint/20">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Judging Team Oversight</h3>
                                                <p className="text-xs text-white/40 uppercase tracking-widest font-bold font-poppins">Global Progress Monitor</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowOversight(!showOversight)}
                                            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${showOversight ? 'bg-vc-mint text-vc-green-dark border-vc-mint' : 'bg-white/5 text-white/40 border-white/10 hover:border-vc-mint/30'}`}
                                        >
                                            {showOversight ? 'Hide Team Details' : 'View Team Workloads'}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showOversight && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                                                    {['A', 'B', 'C', 'D', 'E'].map(team => {
                                                        const teamApps = applications.filter(a => a.assignedTeam === team);
                                                        const scored = teamApps.filter(a => a.screening?.round1?.isCompleted).length;
                                                        const progress = teamApps.length > 0 ? (scored / teamApps.length) * 100 : 0;
                                                        const teamMembers = allJudges.filter(j => j.team === team);

                                                        return (
                                                            <div
                                                                key={team}
                                                                className={`glass-panel p-6 transition-all group cursor-pointer active:scale-95 ${selectedOversightTeam === team ? 'border-vc-mint shadow-[0_0_20px_rgba(0,186,166,0.15)] bg-vc-mint/5 scale-[1.02]' : 'border-vc-mint/10 hover:border-vc-mint/30'}`}
                                                                onClick={() => setSelectedOversightTeam(selectedOversightTeam === team ? null : team)}
                                                            >
                                                                <div className="flex items-center justify-between mb-6">
                                                                    <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center text-vc-mint border border-vc-mint/20 font-black text-xl">
                                                                        {team}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">Workload</span>
                                                                        <span className="text-lg font-bold text-white tracking-tight">{teamApps.length} Apps</span>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                                                                            <span className="text-white/40">Evaluation Progress</span>
                                                                            <span className="text-vc-mint">{Math.round(progress)}%</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${progress}%` }}
                                                                                className="h-full bg-vc-mint shadow-[0_0_10px_rgba(0,186,166,0.5)]"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="pt-4 border-t border-white/5">
                                                                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 block">Team Members ({teamMembers.length})</span>
                                                                        <div className="space-y-2">
                                                                            {teamMembers.length > 0 ? teamMembers.map(member => (
                                                                                <div key={member.id} className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${member.role?.toLowerCase() === 'supervisor' ? 'bg-vc-teal/10 border-vc-teal/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${member.role?.toLowerCase() === 'supervisor' ? 'bg-vc-teal text-white' : 'bg-vc-mint/20 text-vc-mint border border-vc-mint/20'}`}>
                                                                                        {member.displayName?.charAt(0) || <User className="w-3 h-3" />}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className={`text-xs font-bold truncate ${member.role?.toLowerCase() === 'supervisor' ? 'text-vc-teal' : 'text-white'}`}>{member.displayName || 'Unknown Judge'}</p>
                                                                                        {member.role?.toLowerCase() === 'supervisor' && (
                                                                                            <span className="text-[8px] uppercase tracking-tighter font-black opacity-60 text-vc-teal">Supervisor</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )) : (
                                                                                <p className="text-[10px] text-white/20 italic">No members assigned</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="h-px w-full bg-white/5" />
                                </div>
                            )}

                            {selectedOversightTeam && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 glass-panel border-vc-mint/30 bg-vc-mint/5"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-vc-mint flex items-center justify-center text-vc-green-dark font-black text-2xl shadow-lg shadow-vc-mint/20">
                                                {selectedOversightTeam}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">Team {selectedOversightTeam} Progress Monitor</h3>
                                                <div className="flex items-center gap-3">
                                                    {(() => {
                                                        const teamApps = applications.filter(a => a.assignedTeam === selectedOversightTeam);
                                                        const scored = teamApps.filter(a => a.screening?.round1?.isCompleted).length;
                                                        const pending = teamApps.length - scored;
                                                        return (
                                                            <>
                                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                                                                    <BarChart className="w-3 h-3 text-vc-mint" /> {teamApps.length} Total
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-vc-mint uppercase tracking-widest bg-vc-mint/10 px-2 py-1 rounded border border-vc-mint/20">
                                                                    <CheckCircle className="w-3 h-3" /> {scored} Scored
                                                                </span>
                                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">
                                                                    <Clock className="w-3 h-3" /> {pending} Pending
                                                                </span>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedOversightTeam(null)}
                                            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-2 group"
                                        >
                                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                            Clear Team Filter
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-white/40">
                                    {selectedOversightTeam ? (
                                        <span className="flex items-center gap-2">
                                            Showing Team <b className="text-vc-mint">{selectedOversightTeam}</b> work
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            {filteredApps.length} startups
                                        </span>
                                    ) : (
                                        `Showing ${filteredApps.length} startup applications`
                                    )}
                                </span>
                                <button
                                    onClick={() => {
                                        const exportData = filteredApps.map(app => ({
                                            'Startup Name': app.startupName || 'N/A',
                                            'Leader Name': (app.teamMembers && app.teamMembers.length > 0) ? app.teamMembers[0].name : 'N/A',
                                            'Leader Email': app.leaderEmail || 'N/A',
                                            'Leader Phone': app.leaderPhone || 'N/A',
                                            'Leader Nationality': app.leaderNationality || 'N/A',
                                            'Pillar': app.pillar || 'N/A',
                                            'Stage': app.stage || 'N/A',
                                            'Team Size': app.teamSize || 0,
                                            'Location': app.location || 'N/A',
                                            'Status': app.status || 'N/A',
                                            'Score': app.screening?.round1?.totalScore || 'N/A',
                                            'Submitted At': app.submittedAt?.toDate().toLocaleString() || 'N/A',
                                            'Website': app.website || 'N/A',
                                            'LinkedIn': app.linkedin || 'N/A',
                                            'Video Pitch': app.videoPitchUrl || 'N/A',
                                            'Pitch Deck': app.materials?.pitchDeckUrl || 'N/A',
                                            'Executive Summary': app.materials?.execSummaryUrl || 'N/A',
                                            'Supporting Data': app.materials?.supportingDataUrl || 'N/A',
                                            'Audience Category': app.audienceCategory || 'N/A',
                                            'COI Declaration': app.coiDeclaration || 'N/A'
                                        }));
                                        exportToExcel(exportData, 'Startup_Applications');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-vc-mint/10 border border-vc-mint/20 rounded-xl text-xs font-bold text-vc-mint hover:bg-vc-mint hover:text-vc-green-dark transition-all"
                                >
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Export Excel
                                </button>
                            </div>

                            <div className="grid gap-4">
                                {filteredApps.map((app) => (
                                    <motion.div
                                        layout
                                        key={app.id}
                                        className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-vc-mint/30 transition-all cursor-pointer items-center md:items-start text-center md:text-left"
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 min-w-0 flex-1">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                <Rocket className="text-vc-mint w-5 h-5 sm:w-6 h-6" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-base sm:text-lg mb-1 truncate text-vc-mint max-w-[200px] sm:max-w-[400px]">
                                                    {app.teamMembers?.[0]?.name || app.startupName || 'Startup Application'}
                                                </h3>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/40 uppercase tracking-widest overflow-hidden">
                                                    {isUltimateJudge && app.assignedTeam && (
                                                        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-vc-mint/10 text-vc-mint border border-vc-mint/20 font-black text-[9px] min-w-[55px] justify-center">
                                                                TEAM {app.assignedTeam}
                                                            </span>
                                                            {app.screening?.round1?.isCompleted && app.screening?.round1?.evaluatorId && (
                                                                <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 group-hover:border-vc-mint/30 transition-all">
                                                                    <div className="w-4 h-4 rounded-full bg-vc-mint/20 flex items-center justify-center text-[8px] font-black text-vc-mint border border-vc-mint/20">
                                                                        {judgeNames[app.screening.round1.evaluatorId]?.charAt(0) || <User className="w-2 h-2" />}
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-white/50 group-hover:text-vc-mint transition-colors tracking-tight">
                                                                        {judgeNames[app.screening.round1.evaluatorId] || 'Unknown Judge'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {!app.screening?.round1?.isCompleted && (
                                                                <span className="text-[9px] font-bold text-white/20 italic tracking-tight flex items-center gap-1.5">
                                                                    <Clock className="w-3 h-3" /> Awaiting Evaluation
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {app.startupName && (
                                                        <span className="flex items-center gap-1.5 text-vc-mint/60 font-bold shrink-0"><Rocket className="w-3 h-3" /> {app.startupName}</span>
                                                    )}
                                                    <span className="flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-[250px]"><Mail className="w-3 h-3 shrink-0" /> {app.leaderEmail || 'Applicant Email'}</span>
                                                    <span className="flex items-center gap-1.5 shrink-0"><Users className="w-3 h-3" /> {app.teamSize} Members</span>
                                                    <span className="flex items-center gap-1.5 shrink-0"><Clock className="w-3 h-3" /> {app.submittedAt?.toDate().toLocaleString() || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center md:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto shrink-0">
                                            <div className="hidden xl:block text-right min-w-[120px]">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-1">Pillar</span>
                                                <span className="text-sm text-white/60">{app.pillar}</span>
                                            </div>

                                            {app.screening?.round1?.totalScore !== undefined && (
                                                <div className="hidden lg:flex flex-col items-end min-w-[60px]">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-vc-mint/60">Score</span>
                                                    <span className="text-xl font-black text-vc-mint">{app.screening.round1.totalScore}</span>
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center md:items-end gap-2 min-w-[100px]">
                                                {(app.isEdited || app.updatedAt) && (
                                                    <div className="px-2 py-0.5 rounded-md bg-vc-mint/20 border border-vc-mint/30 text-[9px] font-black text-vc-mint uppercase tracking-widest animate-pulse">
                                                        Edited
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

                                            <div className="w-10 flex justify-center">
                                                {isAdmin ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteStartup(app.id, app.teamMembers?.[0]?.name || app.startupName || 'this application');
                                                        }}
                                                        className="p-2 rounded-xl bg-white/0 text-white/20 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                                        title="Delete Startup Application"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="w-4 h-4" /> // Spacing to match admin card layout
                                                )}
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
                        </div>
                    )}


                    {activeTab === 'broadcast' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Header Section */}
                            <div className="glass-panel p-2 px-5 relative overflow-hidden w-fit">
                                <div className="absolute inset-0 bg-vc-mint/5 pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-vc-mint/10 flex items-center justify-center shrink-0">
                                        <Mail className="text-vc-mint w-4 h-4" />
                                    </div>
                                    <h2 className="text-lg font-bold font-poppins leading-none">Email Center</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Panel: Content Editor */}
                                <div className="glass-panel p-8 space-y-6">
                                    <div className="flex items-center gap-2 text-vc-mint mb-2">
                                        <FileText className="w-5 h-5" />
                                        <h3 className="font-bold uppercase tracking-widest text-sm">Email Content</h3>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Subject Line</label>
                                            <input
                                                type="text"
                                                value={broadcastSubject}
                                                onChange={(e) => setBroadcastSubject(e.target.value)}
                                                placeholder="Enter email subject..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-vc-mint transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Email Headline</label>
                                            <input
                                                type="text"
                                                value={broadcastHeadline}
                                                onChange={(e) => setBroadcastHeadline(e.target.value)}
                                                placeholder="Enter main headline..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-vc-mint transition-all"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Message Body</label>
                                                <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                                                    <button
                                                        onClick={() => insertTag('**', '**')}
                                                        title="Bold text"
                                                        className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <span className="font-serif">B</span>
                                                    </button>
                                                    <div className="w-[1px] h-3 bg-white/10" />
                                                    <button
                                                        onClick={() => insertTag('_', '_')}
                                                        title="Italic text"
                                                        className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <span className="font-serif italic">I</span>
                                                    </button>
                                                    <div className="w-[1px] h-3 bg-white/10" />
                                                    <button
                                                        onClick={() => insertTag('[mint]', '[/mint]')}
                                                        title="Highlight in mint"
                                                        className="px-2 py-1 text-xs font-bold text-vc-mint hover:bg-vc-mint/10 rounded-lg transition-colors flex items-center gap-1.5"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-vc-mint" />
                                                        <span>Mint</span>
                                                    </button>
                                                    <div className="w-[1px] h-3 bg-white/10" />

                                                    {/* Font Size Dropdown */}
                                                    <div className="relative group/size">
                                                        <button className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                                                            <Type className="w-3.5 h-3.5" />
                                                            <ChevronDown className="w-3 h-3 text-white/20" />
                                                        </button>
                                                        <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#0c1e1c] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all z-50 p-1">
                                                            {[12, 14, 16, 18, 20, 24, 32].map(size => (
                                                                <button
                                                                    key={size}
                                                                    onClick={() => insertTag(`[size=${size}]`, '[/size]')}
                                                                    className="w-full text-left px-3 py-2 text-[10px] font-bold text-white/60 hover:text-vc-mint hover:bg-white/5 rounded-lg transition-all"
                                                                >
                                                                    {size}px {size === 16 && '(Default)'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="w-[1px] h-3 bg-white/10" />

                                                    {/* Alignment Group */}
                                                    <div className="flex items-center gap-0.5">
                                                        <button
                                                            onClick={() => insertTag('[align=left]', '[/align]')}
                                                            title="Align Left"
                                                            className="px-2 py-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                                        >
                                                            <AlignLeft className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => insertTag('[align=center]', '[/align]')}
                                                            title="Align Center"
                                                            className="px-2 py-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                                        >
                                                            <AlignCenter className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => insertTag('[align=right]', '[/align]')}
                                                            title="Align Right"
                                                            className="px-2 py-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
                                                        >
                                                            <AlignRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea
                                                ref={broadcastTextareaRef}
                                                value={broadcastMessage}
                                                onChange={(e) => setBroadcastMessage(e.target.value)}
                                                placeholder="Enter your announcement message here..."
                                                rows={8}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vc-mint transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Button Options */}
                                        <div className="pt-4 border-t border-white/5 space-y-6">
                                            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10 outline-none">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${broadcastShowButton ? 'bg-vc-mint/20 text-vc-mint' : 'bg-white/5 text-white/20'}`}>
                                                        <ExternalLink className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">Include Action Button</p>
                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Call to Action Option</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setBroadcastShowButton(!broadcastShowButton)}
                                                    className={`w-12 h-6 rounded-full transition-all relative ${broadcastShowButton ? 'bg-vc-mint shadow-[0_0_15px_rgba(57,204,137,0.4)]' : 'bg-white/10'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${broadcastShowButton ? 'right-1' : 'left-1'}`} />
                                                </button>
                                            </div>

                                            <AnimatePresence>
                                                {broadcastShowButton && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="space-y-4 overflow-hidden"
                                                    >
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    value={broadcastButtonText}
                                                                    onChange={(e) => setBroadcastButtonText(e.target.value)}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1">Button URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={broadcastButtonUrl}
                                                                    onChange={(e) => setBroadcastButtonUrl(e.target.value)}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-vc-mint transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Attachments Section */}
                                        <div className="pt-6 border-t border-white/5 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Attachments</label>
                                                <span className="text-[10px] text-white/20 uppercase font-medium">Total: {(broadcastAttachments.reduce((acc, att) => acc + (att.content.length * 0.75), 0) / (1024 * 1024)).toFixed(2)} MB / 10 MB</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                {broadcastAttachments.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2 group hover:border-vc-mint/30 transition-all">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <Paperclip className="w-3 h-3 text-vc-mint/50 shrink-0" />
                                                            <span className="text-xs text-white/60 truncate">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeBroadcastAttachment(idx)}
                                                            className="p-1.5 text-white/20 hover:text-red-500 transition-colors"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <label className="flex items-center justify-center gap-2 px-4 py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-vc-mint/40 transition-all group">
                                                    <Paperclip className="w-4 h-4 text-white/40 group-hover:text-vc-mint transition-colors" />
                                                    <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">Attach Files</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={handleBroadcastFileChange}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel: Recipients & Controls */}
                                <div className="space-y-8">
                                    <div className="glass-panel p-8 bg-vc-mint/5 border-vc-mint/20 space-y-8">
                                        <div className="flex items-center gap-2 text-vc-mint mb-2">
                                            <Users className="w-5 h-5" />
                                            <h3 className="font-bold uppercase tracking-widest text-sm">Send Options</h3>
                                        </div>

                                        {/* Option 1: Test Mode */}
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                                <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Phase 1: Send Test</h4>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="email"
                                                        value={sendToEmail}
                                                        onChange={(e) => setSendToEmail(e.target.value)}
                                                        placeholder="Your test email..."
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-vc-mint transition-all"
                                                    />
                                                    <button
                                                        onClick={handleSendTestBroadcast}
                                                        disabled={sendingBroadcast}
                                                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {sendingBroadcast ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                                                        Send Test
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Option 2: Live Mode */}
                                        <div className="space-y-4">
                                            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Phase 2: Global Broadcast</h4>
                                                        <p className="text-[10px] text-white/30 mt-1 uppercase">Sends to all users in database</p>
                                                    </div>
                                                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                                        <span className="text-[10px] font-black text-red-500 tracking-tighter uppercase">Danger Zone</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={handleBroadcastAll}
                                                    disabled={sendingBroadcast}
                                                    className="w-full py-4 bg-vc-mint text-vc-green-dark rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] transition-all active:scale-[0.98] shadow-xl shadow-vc-mint/10 flex items-center justify-center gap-3 disabled:opacity-50"
                                                >
                                                    {sendingBroadcast ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Rocket className="w-5 h-5" />
                                                    )}
                                                    {sendingBroadcast ? 'Broadcasting...' : 'Broadcast to All Users'}
                                                </button>
                                                <p className="text-[10px] text-white/20 text-center mt-4 italic">
                                                    * This action is irreversible. Please verify with a test email first.
                                                </p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    )}

                    <AnimatePresence>
                        {selectedApp && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
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
                                    className="relative w-full max-w-6xl max-h-[90vh] bg-[#0c1e1c] border border-vc-mint/20 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                                >
                                    {/* Modal Header */}
                                    <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                <Rocket className="text-vc-mint w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-lg md:text-2xl font-bold truncate leading-tight">{selectedApp.startupName || selectedApp.pillar}</h2>
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
                                            className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors shrink-0"
                                        >
                                            <X className="w-5 h-5 md:w-6 md:h-6" />
                                        </button>
                                    </div>

                                    {/* Modal Content - New 2-Column Layout */}
                                    <div className="flex-1 overflow-y-auto p-3 md:p-10 custom-scrollbar overflow-x-hidden">
                                        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 min-w-0">
                                            {/* Main Column: In-depth Details */}
                                            <div className="flex-1 min-w-0 space-y-10">
                                                {/* Startup Profile Section */}
                                                <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                        <Rocket className="w-4 h-4" /> Startup Profile
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Venture Pillar</p>
                                                            <p className="text-base md:text-lg font-medium text-white">{selectedApp.pillar}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Current Development Stage</p>
                                                            <p className="text-base md:text-lg font-medium text-white">{selectedApp.stage}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Established over 5 Years ago?</p>
                                                            <p className="text-base md:text-lg font-medium text-white">{selectedApp.isOlderThan5Years}</p>
                                                        </div>
                                                        {selectedApp.location && (
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Primary Location</p>
                                                                <p className="text-base md:text-lg font-medium text-white">{selectedApp.location}</p>
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
                                                <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                        <Users className="w-4 h-4" /> Team Foundation
                                                    </h3>

                                                    <div className="flex flex-col gap-8">
                                                        <div className="space-y-6">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Team Breakdown ({selectedApp.teamSize} Member{selectedApp.teamSize > 1 ? 's' : ''})</p>
                                                            <div className="space-y-3">
                                                                {selectedApp.teamMembers.map((m, i) => (
                                                                    <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors hover:bg-white/[0.08]">
                                                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                                                            <div className="w-8 h-8 rounded-lg bg-vc-mint/10 flex items-center justify-center text-[10px] font-bold text-vc-mint border border-vc-mint/20 shrink-0">
                                                                                {i + 1}
                                                                            </div>
                                                                            {i === 0 && (
                                                                                <span className="md:hidden px-2 py-0.5 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint text-[9px] font-black uppercase tracking-widest rounded-md ml-auto">
                                                                                    Team Leader
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex flex-wrap items-center gap-2 min-w-0 w-full md:w-auto">
                                                                            <span className="font-bold text-sm text-white/90 truncate max-w-full">{isAdmin ? (m.name || 'Anonymous Member') : 'Anonymous Member'}</span>
                                                                            <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-medium whitespace-nowrap opacity-60">
                                                                                ({isAdmin ? m.nationality : 'Hidden'})
                                                                            </span>
                                                                            {i === 0 && (
                                                                                <span className="hidden md:inline-flex ml-2 px-2 py-0.5 bg-vc-mint/10 border border-vc-mint/20 text-vc-mint text-[9px] font-black uppercase tracking-widest rounded-md">
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
                                                                    {selectedApp.audienceCategory && (
                                                                        <div className="flex items-center gap-3 text-xs bg-vc-mint/5 border border-vc-mint/10 p-3 rounded-xl mt-1">
                                                                            <GraduationCap className="w-3 h-3 text-vc-mint" />
                                                                            <span className="text-vc-mint/80 font-medium">{selectedApp.audienceCategory}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>

                                                {/* Context & Disclosure */}
                                                <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4" /> Context & Disclosure
                                                    </h3>
                                                    <div className="p-4 md:p-6 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10">
                                                        <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest mb-3">Conflict of Interest Declaration</p>
                                                        <p className="text-sm text-white/70 leading-relaxed italic whitespace-pre-wrap">
                                                            {selectedApp.coiDeclaration || "No conflict of interest or organizational relationships declared by the team."}
                                                        </p>
                                                    </div>
                                                </section>

                                                {/* Referral Information Section */}
                                                {selectedApp.referral && (
                                                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                        <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                            <Share2 className="w-4 h-4" /> Referral Information
                                                        </h3>
                                                        <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Referral Source</p>
                                                                <p className="text-base md:text-lg font-medium text-white">{selectedApp.referral.source}</p>
                                                            </div>
                                                            {selectedApp.referral.platform && (
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Platform</p>
                                                                    <p className="text-base md:text-lg font-medium text-white">{selectedApp.referral.platform}</p>
                                                                </div>
                                                            )}
                                                            {selectedApp.referral.ambassadorId && (
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Ambassador ID</p>
                                                                    <p className="text-base md:text-lg font-medium text-vc-mint">#{selectedApp.referral.ambassadorId}</p>
                                                                </div>
                                                            )}
                                                            {selectedApp.referral.ambassadorName && (
                                                                <div className="space-y-1">
                                                                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Ambassador Name</p>
                                                                    <p className="text-base md:text-lg font-medium text-white">{selectedApp.referral.ambassadorName}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                )}

                                                {/* Submission Materials */}
                                                <section className="bg-[#0f2a27] border border-white/10 rounded-[2.5rem] p-6 md:p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
                                                        <FileText className="w-4 h-4" /> Required Materials
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {[
                                                            { id: 'pitchDeck', label: 'Pitch Deck', url: selectedApp.materials.pitchDeckUrl, icon: FileText },
                                                            { id: 'execSummary', label: 'Exec Summary', url: selectedApp.materials.execSummaryUrl, icon: FileText },
                                                            { id: 'eligibilityProof', label: 'Eligibility Evidence', url: selectedApp.materials.eligibilityProofUrl, icon: Shield },
                                                            { id: 'supportingData', label: 'Supporting Data', url: selectedApp.materials.supportingDataUrl, icon: FileCode }
                                                        ].map((item, idx) => (
                                                            item.url ? (
                                                                <div key={idx} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-vc-mint/10 hover:border-vc-mint/30 group transition-all">
                                                                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3">
                                                                        <div className="flex items-center gap-3 min-w-0">
                                                                            <item.icon className="text-vc-mint w-5 h-5 shrink-0" />
                                                                            <div className="flex flex-col min-w-0">
                                                                                <span className="text-sm font-medium truncate">{item.label}</span>
                                                                                <a
                                                                                    href={item.url}
                                                                                    target="_blank"
                                                                                    className="text-[10px] text-vc-mint/60 hover:text-vc-mint transition-colors underline decoration-vc-mint/20 underline-offset-2 truncate"
                                                                                >
                                                                                    Open File
                                                                                </a>
                                                                            </div>
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
                                            <div className="w-full lg:w-[400px] shrink-0 space-y-8 min-w-0">
                                                {/* Screening & Scoring Section */}
                                                <section className="bg-[#0f2a27]/50 border border-vc-mint/20 rounded-3xl md:rounded-[2rem] p-4 md:p-8 relative overflow-hidden">


                                                    <div className="flex items-center justify-between mb-8">
                                                        <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                            <Shield className="w-4 h-4" /> Screening Round 1
                                                        </h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs uppercase tracking-widest font-bold text-white/60">Total Score</span>
                                                            <span className="text-2xl md:text-4xl font-black text-vc-mint">
                                                                {Math.round(RUBRICS.reduce((acc, r) => acc + (currentScores[r.id as keyof typeof currentScores] * (r.weight * 10)), 0))}
                                                                <span className="text-xs md:text-base font-bold text-white/30 ml-2">/ 100</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        {RUBRICS.map((rubric) => (
                                                            <div key={rubric.id} className="space-y-3">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="space-y-1 min-w-0">
                                                                        <label className="text-base font-bold text-white flex items-center gap-2">
                                                                            {rubric.label}
                                                                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60 font-normal">
                                                                                {rubric.weight * 100}% Weight
                                                                            </span>
                                                                        </label>
                                                                        <p className="text-xs md:text-sm text-white/60 leading-relaxed">{rubric.description}</p>
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
                                                                    disabled={!canScore}
                                                                    value={currentScores[rubric.id as keyof typeof currentScores]}
                                                                    onChange={(e) => setCurrentScores({
                                                                        ...currentScores,
                                                                        [rubric.id]: parseInt(e.target.value)
                                                                    })}
                                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-vc-mint disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                            disabled={savingScore || !canScore}
                                                            className="px-6 py-3 bg-vc-mint text-vc-green-dark rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

                                                {/* Screening Round 2 Section */}
                                                <section className={`bg-[#0f2a27]/50 border rounded-3xl md:rounded-[2rem] p-4 md:p-8 relative overflow-hidden transition-all duration-500 ${isScreeningRound2Open ? 'border-vc-mint/30 opacity-100' : 'border-white/5 opacity-50 grayscale'}`}>
                                                    {!isScreeningRound2Open && (
                                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                            <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                                                <Shield className="w-4 h-4 text-white/40" />
                                                                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Round 2 Closed</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-8">
                                                        <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                                            <Shield className="w-4 h-4" /> Screening Round 2
                                                        </h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs uppercase tracking-widest font-bold text-white/60">Total Score</span>
                                                            <span className="text-2xl md:text-4xl font-black text-vc-mint">
                                                                {Math.round(RUBRICS_ROUND2.reduce((acc, r) => acc + (currentScoresRound2[r.id as keyof typeof currentScoresRound2] * (r.weight * 10)), 0))}
                                                                <span className="text-xs md:text-base font-bold text-white/30 ml-2">/ 100</span>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        {RUBRICS_ROUND2.map((rubric) => (
                                                            <div key={rubric.id} className="space-y-3">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="space-y-1 min-w-0">
                                                                        <label className="text-base font-bold text-white flex items-center gap-2">
                                                                            {rubric.label}
                                                                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60 font-normal">
                                                                                {Math.round(rubric.weight * 100)}% Weight
                                                                            </span>
                                                                        </label>
                                                                        <p className="text-xs md:text-sm text-white/60 leading-relaxed">{rubric.description}</p>
                                                                    </div>
                                                                    <span className="text-2xl font-bold text-vc-mint w-12 text-right">
                                                                        {currentScoresRound2[rubric.id as keyof typeof currentScoresRound2]}
                                                                    </span>
                                                                </div>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="10"
                                                                    step="1"
                                                                    disabled={!isScreeningRound2Open || !canScore}
                                                                    value={currentScoresRound2[rubric.id as keyof typeof currentScoresRound2]}
                                                                    onChange={(e) => setCurrentScoresRound2({
                                                                        ...currentScoresRound2,
                                                                        [rubric.id]: parseInt(e.target.value)
                                                                    })}
                                                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-vc-mint disabled:opacity-50 disabled:cursor-not-allowed"
                                                                />
                                                                <div className="flex justify-between text-xs uppercase font-bold text-white/50 tracking-widest">
                                                                    <span>Poor (0)</span>
                                                                    <span>Excellent (10)</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {isScreeningRound2Open && (
                                                        <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
                                                            <button
                                                                onClick={handleSaveScreeningRound2}
                                                                disabled={savingScore || !canScore}
                                                                className="px-6 py-3 bg-vc-mint text-vc-green-dark rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                                    )}
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
                            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
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
                                    className="relative w-full max-w-6xl max-h-[90vh] bg-[#0c1e1c] border border-vc-mint/20 rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
                                >
                                    {/* Modal Header */}
                                    <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-vc-mint/10 flex items-center justify-center shrink-0">
                                                <Users className="text-vc-mint w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-lg md:text-2xl font-bold truncate leading-tight">{selectedAmbassadorApp.email}</h2>
                                                <span className="text-white/40 text-[10px] md:text-sm block mt-0.5 truncate">Submitted on {selectedAmbassadorApp.submittedAt?.toDate().toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedAmbassadorApp(null)}
                                            className="p-2 md:p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors shrink-0"
                                        >
                                            <X className="w-5 h-5 md:w-6 md:h-6" />
                                        </button>
                                    </div>

                                    {/* Modal Content - Synced with Startup Layout */}
                                    <div className="flex-1 overflow-y-auto p-3 md:p-10 custom-scrollbar overflow-x-hidden">
                                        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 min-w-0">
                                            {/* Main Column: Profiles & Experience */}
                                            <div className="flex-1 min-w-0 space-y-10">
                                                {/* Person Profile Section */}
                                                <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                    <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                        <User className="w-4 h-4" /> Personal Profile
                                                    </h3>
                                                    <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Full Name</p>
                                                            <p className="text-base md:text-lg font-bold text-white/90">{selectedAmbassadorApp.name || selectedAmbassadorApp.fullName}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Nationality</p>
                                                            <p className="text-base md:text-lg font-bold text-white/90">{selectedAmbassadorApp.nationality}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Current Location</p>
                                                            <p className="text-base md:text-lg font-bold text-white/90">{selectedAmbassadorApp.location}</p>
                                                        </div>
                                                    </div>
                                                </section>

                                                {/* Education Section */}
                                                {(selectedAmbassadorApp.university || selectedAmbassadorApp.major) && (
                                                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                        <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                                            <GraduationCap className="w-4 h-4" /> Academic Background
                                                        </h3>
                                                        <div className="grid md:grid-cols-2 gap-x-6 md:gap-x-12 gap-y-6 md:gap-y-8">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">University</p>
                                                                <p className="text-base md:text-lg font-medium text-white">{selectedAmbassadorApp.university}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Major / Field of Study</p>
                                                                <p className="text-base md:text-lg font-medium text-white">{selectedAmbassadorApp.major}</p>
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
                                                    <section className="bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[2rem] p-4 md:p-8">
                                                        <h3 className="text-vc-mint font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                                            <AlertCircle className="w-4 h-4" /> Context & Motivation
                                                        </h3>
                                                        <div className="space-y-6">
                                                            {selectedAmbassadorApp.reason && (
                                                                <div className="p-4 md:p-6 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10 overflow-hidden">
                                                                    <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest mb-3">Why join?</p>
                                                                    <p className="text-sm text-white/70 leading-relaxed italic whitespace-pre-wrap break-words min-w-0">
                                                                        "{selectedAmbassadorApp.reason}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {selectedAmbassadorApp.experience && (
                                                                <div className="p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
                                                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">Relevant Experience</p>
                                                                    <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap break-words min-w-0">
                                                                        {selectedAmbassadorApp.experience}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                )}
                                            </div>

                                            {/* Sidebar: Contact & Decision */}
                                            <div className="w-full lg:w-[360px] shrink-0 space-y-8 min-w-0">
                                                {/* Contact & Digital Presence */}
                                                <section className="bg-[#0f2a27] border border-white/10 rounded-3xl md:rounded-[2.5rem] p-4 md:p-8">
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
                                                                    className="flex items-center gap-4 p-4 md:p-5 rounded-2xl bg-vc-mint/[0.03] border border-vc-mint/10 hover:bg-vc-mint/10 hover:border-vc-mint/30 group transition-all"
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
                                                <section className="bg-vc-mint/10 border-2 border-vc-mint/20 rounded-3xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl shadow-vc-mint/5">
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
                        )}
                    </AnimatePresence>



                    {toast && (
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    )
                    }

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

                                            {decisionConfig.status === 'accepted' && (
                                                <div className="pt-4 border-t border-white/5 space-y-3">
                                                    <p className="text-[10px] font-bold text-vc-mint/60 uppercase tracking-widest text-left">Choose Ambassador Type</p>
                                                    <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                                        <button
                                                            onClick={() => setDecisionConfig({ ...decisionConfig, ambassadorType: 'local' })}
                                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${decisionConfig.ambassadorType === 'local' ? 'bg-vc-mint text-vc-green-dark shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                                                        >
                                                            Local Ambassador
                                                        </button>
                                                        <button
                                                            onClick={() => setDecisionConfig({ ...decisionConfig, ambassadorType: 'global' })}
                                                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${decisionConfig.ambassadorType === 'global' ? 'bg-vc-mint text-vc-green-dark shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                                                        >
                                                            Global Ambassador
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
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

                    {/* Application Deletion Modal */}
                    <AnimatePresence>
                        {showDeleteAppModal && appToDelete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowDeleteAppModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-[#0c1e1c] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl"
                                >
                                    <div className="flex items-center gap-4 mb-4 text-red-400">
                                        <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Delete Application?</h3>
                                    </div>

                                    <p className="text-white/60 mb-6 font-poppins">
                                        Are you sure you want to permanently delete the application for <span className="text-white font-bold">{appToDelete.name}</span>? This action cannot be undone.
                                    </p>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setShowDeleteAppModal(false)}
                                            className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDeleteApplication}
                                            disabled={processingAppDeletion}
                                            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {processingAppDeletion ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                'Delete Application'
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Startup Application Deletion Modal */}
                    <AnimatePresence>
                        {showDeleteStartupModal && startupToDelete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                onClick={() => setShowDeleteStartupModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.95, opacity: 0 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-[#0c1e1c] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />

                                    <div className="relative z-10">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                                                <Trash2 className="w-8 h-8 text-red-500" />
                                            </div>

                                            <div className="space-y-3">
                                                <h3 className="text-2xl font-black text-white uppercase tracking-wider">Delete Startup?</h3>
                                                <p className="text-white/60 text-sm leading-relaxed px-4">
                                                    Are you sure you want to permanently delete the application for <span className="text-vc-mint font-bold">{startupToDelete.name}</span>? This action cannot be undone.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 w-full pt-8">
                                                <button
                                                    onClick={() => setShowDeleteStartupModal(false)}
                                                    disabled={processingStartupDeletion}
                                                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmDeleteStartup}
                                                    disabled={processingStartupDeletion}
                                                    className="w-full py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest hover:bg-red-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-red-500/10"
                                                >
                                                    {processingStartupDeletion ? (
                                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        'Confirm Delete'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reward System Modal */}
                    <AnimatePresence>
                        {
                            showRewardModal && rewardUser && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowRewardModal(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#0c1e1c] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-vc-mint/5 rounded-full blur-[40px] -mr-16 -mt-16" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 bg-vc-mint/10 rounded-xl border border-vc-mint/20">
                                                    <Star className="w-6 h-6 text-vc-mint" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">Award Venture Coins</h3>
                                                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{rewardUser.name}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                                    <span className="text-sm text-white/40 font-medium">Current Total</span>
                                                    <span className="text-lg font-black text-vc-mint flex items-center gap-1.5 leading-none">
                                                        <CircleDollarSign className="w-5 h-5" /> {rewardUser.currentPoints}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Venture Coins to Award</label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={pointsToAdd}
                                                            onChange={(e) => setPointsToAdd(e.target.value)}
                                                            placeholder="e.g. 50 or -20"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-vc-mint transition-colors font-bold text-lg"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] text-white/20 italic ml-1">Use negative numbers to subtract coins</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Reason / Completed Task</label>
                                                    <textarea
                                                        value={rewardReason}
                                                        onChange={(e) => setRewardReason(e.target.value)}
                                                        placeholder="e.g. Social media promotion, Event support..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vc-mint transition-colors h-24 resize-none font-poppins"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setShowRewardModal(false)}
                                                    className="flex-1 py-4 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors font-bold text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleGivePoints}
                                                    disabled={processingReward || !pointsToAdd}
                                                    className="flex-[1.5] py-4 rounded-xl bg-vc-mint text-vc-green-dark font-black text-sm hover:bg-vc-mint/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-vc-mint/10 flex items-center justify-center gap-2"
                                                >
                                                    {processingReward ? (
                                                        <div className="w-4 h-4 border-2 border-vc-green-dark/30 border-t-vc-green-dark rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            Award Venture Coins
                                                            <CheckCircle className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                    </AnimatePresence>

                    {/* Reward History Modal */}
                    <AnimatePresence>
                        {
                            showHistoryModal && historyUser && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setShowHistoryModal(false)}
                                >
                                    <motion.div
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-[#0c1e1c] border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-vc-mint/5 rounded-full blur-[60px] -mr-24 -mt-24" />

                                        <div className="relative z-10 flex flex-col flex-1 min-h-0">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-vc-mint/10 rounded-xl border border-vc-mint/20">
                                                        <Clock className="w-6 h-6 text-vc-mint" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Venture Coin History</h3>
                                                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold font-poppins">{historyUser.name}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowHistoryModal(false)}
                                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                                >
                                                    <X className="w-6 h-6 text-white/40" />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                                {loadingHistory ? (
                                                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/30">
                                                        <div className="w-8 h-8 border-2 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
                                                        <p className="font-poppins text-sm italic">Loading history...</p>
                                                    </div>
                                                ) : userHistory.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/20">
                                                        <AlertCircle className="w-12 h-12" />
                                                        <p className="font-poppins text-sm italic">No reward history found.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {userHistory.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-6 group hover:border-vc-mint/20 transition-all"
                                                            >
                                                                <div className="space-y-1.5 flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                                                                            {item.timestamp?.toDate().toLocaleDateString(undefined, {
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            }) || 'Just now'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-white/90 font-medium font-poppins leading-relaxed">{item.reason}</p>
                                                                </div>
                                                                <div className={`px-3 py-1.5 rounded-xl font-black text-sm shrink-0 flex items-center gap-1.5 ${item.points > 0 ? 'bg-vc-mint/10 text-vc-mint border border-vc-mint/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                    }`}>
                                                                    {item.points > 0 ? '+' : ''}{item.points}
                                                                    <Star className="w-3 h-3" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-white/5">
                                                <button
                                                    onClick={() => setShowHistoryModal(false)}
                                                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all text-sm"
                                                >
                                                    Close History
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                    </AnimatePresence>
                </div>
            </div>
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
