'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Rocket, CheckCircle, XCircle, Clock,
    Filter, Search, ChevronDown, Eye, Mail,
    Phone, Globe, Linkedin, Video, ArrowLeft,
    Check, X, AlertCircle, Shield, FileText, FileCode
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

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

export default function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pillarFilter, setPillarFilter] = useState<string>('all');
    const [stageFilter, setStageFilter] = useState<string>('all');
    const [teamSizeFilter, setTeamSizeFilter] = useState<string>('all');
    const [ageFilter, setAgeFilter] = useState<string>('all');
    const [nationalityFilter, setNationalityFilter] = useState<string>('all');
    const router = useRouter();

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
                    alert('Access Denied: You do not have admin privileges.');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                alert('Database Error: Insufficient permissions to check admin status.');
                router.push('/');
            }
        });

        return () => unsubscribeAuth();
    }, [router]);

    useEffect(() => {
        if (!isAdmin) return;

        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Application[];
            setApplications(appsData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching applications:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin]);

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

    if (loading && isAdmin) {
        return (
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint/30 border-t-vc-mint rounded-full animate-spin" />
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
                        <h1 className="text-4xl font-bold font-poppins mb-2">Admin Dashboard</h1>
                        <p className="text-white/50">Manage and review Venture Craft applications</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
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
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-3 min-w-[100px]">
                            <span className="text-red-500/60 text-[10px] uppercase font-bold tracking-widest block mb-1">Rejected</span>
                            <span className="text-2xl font-bold text-red-500">{applications.filter(a => a.status === 'rejected').length}</span>
                        </div>
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

                            {/* Team Size Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase">Team Size</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                    value={teamSizeFilter}
                                    onChange={(e) => setTeamSizeFilter(e.target.value)}
                                >
                                    <option value="all">Any Size</option>
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Member' : 'Members'}</option>)}
                                    <option value="6+">6+ Members</option>
                                </select>
                            </div>

                            {/* Startup Age Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase">Startup Age</label>
                                <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                    <button
                                        onClick={() => setAgeFilter('all')}
                                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${ageFilter === 'all' ? 'bg-vc-mint text-vc-green-dark' : 'text-white/40'}`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => setAgeFilter('new')}
                                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${ageFilter === 'new' ? 'bg-vc-mint text-vc-green-dark' : 'text-white/40'}`}
                                    >
                                        {'< 5Y'}
                                    </button>
                                    <button
                                        onClick={() => setAgeFilter('old')}
                                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${ageFilter === 'old' ? 'bg-vc-mint text-vc-green-dark' : 'text-white/40'}`}
                                    >
                                        {'> 5Y'}
                                    </button>
                                </div>
                            </div>

                            {/* Nationality Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/40 uppercase">Leader Nationality</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-vc-mint appearance-none cursor-pointer"
                                    value={nationalityFilter}
                                    onChange={(e) => setNationalityFilter(e.target.value)}
                                >
                                    <option value="all">All Nationalities</option>
                                    {uniqueNationalities.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setStatusFilter('all');
                                    setPillarFilter('all');
                                    setStageFilter('all');
                                    setTeamSizeFilter('all');
                                    setAgeFilter('all');
                                    setNationalityFilter('all');
                                }}
                                className="w-full py-3 text-xs font-bold text-white/40 hover:text-vc-mint transition-colors border border-white/5 hover:border-vc-mint/20 rounded-xl uppercase tracking-widest mt-4"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/40">Showing {filteredApps.length} applications</span>
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
                                    <p className="text-white/40">No applications found matching your criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
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
            </AnimatePresence>
        </main>
    );
}
