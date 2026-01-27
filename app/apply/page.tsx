'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, FileText, Video, Users, Rocket, Link as LinkIcon, AlertCircle, ChevronDown, Search, Globe, X, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Footer from '@/components/Footer';

import { countries } from '@/lib/countries';

// Custom Dropdown Component
function FlagDropdown({
    options,
    value,
    onChange,
    label,
    placeholder = "Select...",
    type = 'country' // 'country' or 'phone'
}: {
    options: typeof countries,
    value: string,
    onChange: (val: string) => void,
    label?: string,
    placeholder?: string,
    type?: 'country' | 'phone'
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(search.toLowerCase()) ||
        opt.dialCode.includes(search)
    );

    const selectedOption = options.find(opt =>
        type === 'country' ? opt.name === value : opt.dialCode === value
    );

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
        <div className="space-y-2 relative w-full" ref={dropdownRef}>
            {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 flex items-center justify-between hover:bg-white/10 transition-all text-left ${type === 'phone' ? 'h-[52px]' : 'py-3'}`}
            >
                <div className="flex items-center gap-3">
                    {selectedOption ? (
                        <>
                            <img
                                src={`https://flagcdn.com/w40/${selectedOption.code.toLowerCase()}.png`}
                                alt={selectedOption.name}
                                className="w-5 h-auto rounded-sm"
                            />
                            <span className="text-white text-sm">
                                {type === 'country' ? (
                                    <span className="hidden sm:inline">{selectedOption.name}</span>
                                ) : selectedOption.dialCode}
                                {type === 'country' && <span className="sm:hidden">{selectedOption.code.toUpperCase()}</span>}
                            </span>
                        </>
                    ) : (
                        <span className="text-white/40 text-sm">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 w-full min-w-[200px] mt-2 bg-[#0c1e1c] border border-vc-mint/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-2">
                            <Search className="w-4 h-4 text-vc-mint/60" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search countries..."
                                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto no-scrollbar">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <button
                                        key={opt.code}
                                        type="button"
                                        onClick={() => {
                                            onChange(type === 'country' ? opt.name : opt.dialCode);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-vc-mint/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://flagcdn.com/w40/${opt.code.toLowerCase()}.png`}
                                                alt={opt.name}
                                                className="w-5 h-auto rounded-xs"
                                            />
                                            <span className="text-sm text-white/80 group-hover:text-white truncate max-w-[120px]">{opt.name}</span>
                                        </div>
                                        <span className="text-xs text-vc-mint/40 group-hover:text-vc-mint">{opt.dialCode}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-white/40 text-sm">No results found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Simple Dropdown Component
function SimpleDropdown({
    options,
    value,
    onChange,
    label,
    placeholder = "Select..."
}: {
    options: string[],
    value: string,
    onChange: (val: string) => void,
    label?: string,
    placeholder?: string
}) {
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
        <div className="space-y-2 relative w-full" ref={dropdownRef}>
            {label && <label className="block text-sm font-medium text-white/70">{label}</label>}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-all text-left"
            >
                <span className={`text-sm ${value ? 'text-white' : 'text-white/40'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute z-50 w-full mt-2 bg-[#0c1e1c] border border-vc-mint/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto no-scrollbar">
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
                                    <span className="text-sm text-white/80 group-hover:text-white">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ApplyPage() {
    const [step, setStep] = useState(0); // 0 = Eligibility Info, 1-3 = Form
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
    const [regLoading, setRegLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Fetch global settings for registration status
        const fetchRegStatus = async () => {
            try {
                const regDoc = await getDoc(doc(db, 'settings', 'registration'));
                if (regDoc.exists()) {
                    setIsRegistrationOpen(regDoc.data().isOpen ?? true);
                }
            } catch (error) {
                console.error("Error fetching registration status:", error);
            } finally {
                setRegLoading(false);
            }
        };

        fetchRegStatus();
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        // Part 1
        teamSize: 1,
        teamMembers: [{ name: '', nationality: 'Saudi Arabia' }],
        ageConfirmed: false,
        educationConfirmed: false,
        leaderEmail: '',
        leaderPhoneCode: '+966',
        leaderPhoneNumber: '',
        leaderNationality: 'Saudi Arabia',

        // Part 2
        pillar: '',
        isOlderThan5Years: 'No',
        stage: '',
        coiDeclaration: '',
        website: '',
        linkedin: '',
        additionalLinks: '',

        // Part 3
        videoPitchUrl: '',
        agreedToTerms: false,
        // Files will be handled separately for state
    });

    const [files, setFiles] = useState<{
        pitchDeck: File | null;
        execSummary: File | null;
        supportingData: File | null;
    }>({
        pitchDeck: null,
        execSummary: null,
        supportingData: null
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push('/signin?redirect=/apply');
            } else {
                setUser(currentUser);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Sync step with URL for Navbar/Footer visibility
    useEffect(() => {
        if (step > 0) {
            router.push(`/apply?step=${step}`, { scroll: false });
        } else {
            router.push('/apply', { scroll: false });
        }
    }, [step, router]);

    const handleTeamSizeChange = (size: number) => {
        const newSize = Math.max(1, Math.min(10, size));
        setFormData(prev => {
            const newMembers = [...prev.teamMembers];
            if (newSize > prev.teamMembers.length) {
                for (let i = prev.teamMembers.length; i < newSize; i++) {
                    newMembers.push({ name: '', nationality: 'Saudi Arabia' });
                }
            } else {
                newMembers.splice(newSize);
            }
            return { ...prev, teamSize: newSize, teamMembers: newMembers };
        });
    };

    const handleMemberChange = (index: number, field: 'name' | 'nationality', value: string) => {
        const newMembers = [...formData.teamMembers];
        newMembers[index][field] = value;
        setFormData(prev => ({
            ...prev,
            teamMembers: newMembers,
            ...(index === 0 && field === 'nationality' ? { leaderNationality: value } : {})
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Upload Files first
            const uploadFile = async (file: File | null, folder: string) => {
                if (!file) return null;
                const storageRef = ref(storage, `applications/${user.uid}/${folder}/${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                return await getDownloadURL(snapshot.ref);
            };

            const [pitchDeckUrl, execSummaryUrl, supportingDataUrl] = await Promise.all([
                uploadFile(files.pitchDeck, 'pitch_decks'),
                uploadFile(files.execSummary, 'exec_summaries'),
                uploadFile(files.supportingData, 'supporting_data')
            ]);

            const combinedPhone = `${formData.leaderPhoneCode} ${formData.leaderPhoneNumber}`;
            const applicationRef = doc(db, 'applications', user.uid);

            // 2. Clean up data for Firestore
            const submissionData = {
                userId: user.uid,
                status: 'pending',
                submittedAt: serverTimestamp(),

                // Form Data
                teamSize: formData.teamSize,
                teamMembers: formData.teamMembers,
                leaderEmail: formData.leaderEmail,
                leaderPhone: combinedPhone,
                leaderNationality: formData.leaderNationality,

                // Details
                pillar: formData.pillar,
                isOlderThan5Years: formData.isOlderThan5Years,
                stage: formData.stage,
                coiDeclaration: formData.coiDeclaration,

                // Links
                website: formData.website,
                linkedin: formData.linkedin,
                additionalLinks: formData.additionalLinks,
                videoPitchUrl: formData.videoPitchUrl,

                // Metadata for materials & URLs
                materials: {
                    pitchDeckName: files.pitchDeck?.name || null,
                    pitchDeckUrl: pitchDeckUrl,
                    execSummaryName: files.execSummary?.name || null,
                    execSummaryUrl: execSummaryUrl,
                    supportingDataName: files.supportingData?.name || null,
                    supportingDataUrl: supportingDataUrl,
                },

                // Confirmations
                confirmations: {
                    ageConfirmed: formData.ageConfirmed,
                    educationConfirmed: formData.educationConfirmed
                }
            };

            await setDoc(applicationRef, submissionData);
            setIsSuccessOpen(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => {
        if (step === 0) return null;
        return (
            <div className="flex items-center justify-center mb-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= i ? 'border-vc-mint bg-vc-mint text-vc-green-dark' : 'border-white/20 text-white/40'}`}>
                            {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                        </div>
                        {i < 3 && (
                            <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${step > i ? 'bg-vc-mint' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const eligibilityCriteria = [
        { category: 'Age', requirement: 'Must be 18 years or older at the time of application.', notes: 'Ensures legal eligibility for participation and contracts.' },
        { category: 'Education', requirement: 'Must be actively pursuing or have completed an undergraduate degree.', notes: 'Focuses on young, early-career entrepreneurs.' },
        { category: 'Startup Age', requirement: 'Startup must be no older than 5 years from its time of establishment.', notes: 'Keeps the competition aligned with emerging ventures and early-stage innovation.' },
        { category: 'Basis', requirement: 'Must be science/technology-based startup (deep-tech) and relevant to the theme.', notes: 'Ensures ventures are rooted in research, innovation, or applied science.' },
        { category: 'Team Size', requirement: 'Teams should ideally consist of multiple members to promote collaboration.', notes: 'Promotes manageable collaboration and fairness across entries.' },
        { category: 'Complete Submission', requirement: 'Teams must submit all required materials (online form, pitch deck, executive summary, etc) before the deadline.', notes: 'Guarantees fairness and preparedness for evaluation.' },
    ];

    const additionalPoints = [
        { title: 'IP / Ownership', detail: 'Teams must hold or legally control any intellectual property related to their submission.', reason: 'Protects originality and prevents disputes.' },
        { title: 'One-Entry Rule', detail: 'Each participant may join only one team.', reason: 'Prevents duplication and ensures fair participation.' },
        { title: 'Code of Conduct', detail: 'All team members must accept the official competition rules and code of conduct.', reason: 'Maintains professionalism and integrity.' },
        { title: 'Conflict of Interest', detail: 'Teams must disclose any existing mentor, investor, or organizational relationships with judges or organizers.', reason: 'Ensures impartial evaluation.' },
    ];

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-40 relative">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10 min-h-[calc(100vh-200px)]">
                {step > 0 && (
                    <button
                        onClick={() => setStep(0)}
                        className="inline-flex items-center gap-2 text-vc-mint/60 hover:text-vc-mint transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Criterion</span>
                    </button>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight">
                        {step === 0 ? 'Application Details & Criteria' : 'Application Form'}
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        {step === 0
                            ? 'Review the eligibility criteria and competition rules before you begin your journey.'
                            : 'Please fill out all the required information to apply for the KFUPM Venture Craft Challenge.'}
                    </p>
                </div>

                {renderStepIndicator()}

                <div className={`${step === 0 ? '' : 'glass-panel p-8 md:p-12'}`}>
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="landing"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                                        <div className="w-2 h-8 bg-vc-mint rounded-full" />
                                        Eligibility Criteria
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {eligibilityCriteria.map((item, idx) => (
                                            <div key={idx} className="glass-panel p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-vc-mint/30 transition-all">
                                                <div className="md:w-1/4">
                                                    <h4 className="text-lg font-bold text-white uppercase tracking-tight">{item.category}</h4>
                                                </div>
                                                <div className="md:w-1/2">
                                                    <p className="text-white/80 text-sm leading-relaxed">{item.requirement}</p>
                                                </div>
                                                <div className="md:w-1/4 border-l border-white/5 md:pl-6">
                                                    <p className="text-white/40 text-xs italic">{item.notes}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className="flex flex-col items-center pt-8 space-y-6">
                                    {isRegistrationOpen ? (
                                        <>
                                            <p className="text-white/60 text-sm text-center max-w-md">
                                                Review the criteria above to proceed to the application form.
                                            </p>
                                            <button
                                                onClick={() => setStep(1)}
                                                className="btn-primary !px-16 !py-5 !text-lg !rounded-2xl flex items-center gap-3 group shadow-2xl shadow-vc-mint/20"
                                            >
                                                <span>Apply Now</span>
                                                <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="bg-vc-mint/5 border border-vc-mint/20 p-8 rounded-[2rem] text-center max-w-lg w-full space-y-4">
                                            <div className="w-16 h-16 bg-vc-mint/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <Clock className="text-vc-mint w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Registration Opens Soon</h3>
                                            <p className="text-white/60 text-sm leading-relaxed">
                                                Thank you for your interest in Venture Craft. Registration is currently unavailable and will officially open on <span className="text-vc-mint font-bold text-base block mt-2">February 1, 2026</span>
                                            </p>
                                            <div className="pt-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/40 uppercase tracking-widest">
                                                    Official Launch Pending
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-vc-mint/20 flex items-center justify-center">
                                        <Users className="text-vc-mint w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Personal & Demographic Information</h2>
                                </div>

                                <div className="space-y-4 max-w-xs mb-8">
                                    <label className="block text-sm font-medium text-white/70 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-vc-mint" />
                                        Team size (including leader)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.teamSize}
                                        onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                    />
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Maximum 10 members</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Leader Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.leaderEmail}
                                            onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Leader Phone Number</label>
                                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-vc-mint transition-all">
                                            <div className="w-[100px] border-r border-white/10">
                                                <FlagDropdown
                                                    options={countries}
                                                    value={formData.leaderPhoneCode}
                                                    onChange={(val) => setFormData({ ...formData, leaderPhoneCode: val })}
                                                    type="phone"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="512345678"
                                                value={formData.leaderPhoneNumber}
                                                onChange={(e) => setFormData({ ...formData, leaderPhoneNumber: e.target.value })}
                                                className="flex-1 bg-transparent border-none px-4 py-3.5 focus:outline-none focus:ring-0 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 mt-12">
                                    <h3 className="text-lg font-semibold text-vc-mint flex items-center gap-2">
                                        <Globe className="w-5 h-5" />
                                        Team Members Details
                                    </h3>
                                    {formData.teamMembers.map((member, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/40 uppercase tracking-widest">{idx === 0 ? 'Team Leader Name' : `Member ${idx + 1} Name`}</label>
                                                <input
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-vc-mint focus:outline-none transition-colors"
                                                    placeholder="Full Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <FlagDropdown
                                                    options={countries}
                                                    value={member.nationality}
                                                    onChange={(val) => handleMemberChange(idx, 'nationality', val)}
                                                    label="Nationality"
                                                    type="country"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-vc-mint/5 border border-vc-mint/10">
                                        <input
                                            type="checkbox"
                                            id="age"
                                            checked={formData.ageConfirmed}
                                            onChange={(e) => setFormData({ ...formData, ageConfirmed: e.target.checked })}
                                            className="mt-1 accent-vc-mint h-4 w-4"
                                        />
                                        <label htmlFor="age" className="text-sm text-white/70 cursor-pointer">
                                            I confirm that all team members are 18 years of age or older at the time of application.
                                        </label>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-vc-mint/5 border border-vc-mint/10">
                                        <input
                                            type="checkbox"
                                            id="edu"
                                            checked={formData.educationConfirmed}
                                            onChange={(e) => setFormData({ ...formData, educationConfirmed: e.target.checked })}
                                            className="mt-1 accent-vc-mint h-4 w-4"
                                        />
                                        <label htmlFor="edu" className="text-sm text-white/70 cursor-pointer">
                                            I confirm that all team members are either actively pursuing or have completed an undergraduate (bachelor’s) degree.
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-8">
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.ageConfirmed || !formData.educationConfirmed}
                                        className="btn-primary flex items-center gap-2 !px-8 !py-4 !rounded-2xl disabled:opacity-50"
                                    >
                                        <span>Next Step</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-vc-mint/20 flex items-center justify-center">
                                        <Rocket className="text-vc-mint w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Start-up Details</h2>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/70">Which of the following pillars does your startup most closely align with?</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'Decarbonization Technologies',
                                            'Circular Economy & Resource Efficiency',
                                            'Energy Efficiency',
                                            'Process Optimization & Advanced Engineering'
                                        ].map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setFormData({ ...formData, pillar: p })}
                                                className={`p-4 rounded-xl border text-left transition-all ${formData.pillar === p ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Is your startup older than 5 years?</label>
                                        <div className="flex gap-4">
                                            {['Yes', 'No'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setFormData({ ...formData, isOlderThan5Years: opt })}
                                                    className={`px-8 py-3 rounded-xl border transition-all ${formData.isOlderThan5Years === opt ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <SimpleDropdown
                                            options={['Ideation', 'Pre-Seed', 'Seed', 'Post-Seed']}
                                            value={formData.stage}
                                            onChange={(val) => setFormData({ ...formData, stage: val })}
                                            label="Startup Stage"
                                            placeholder="Select stage"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/70">Conflict of Interest Declaration (Required)</label>
                                    <textarea
                                        value={formData.coiDeclaration}
                                        onChange={(e) => setFormData({ ...formData, coiDeclaration: e.target.value })}
                                        placeholder="Please disclose any relationships or state 'None'."
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Startup Website (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">LinkedIn Page (Optional)</label>
                                        <input
                                            type="url"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                            placeholder="https://linkedin.com/company/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/70">Additional Links (Optional)</label>
                                    <textarea
                                        value={formData.additionalLinks}
                                        onChange={(e) => setFormData({ ...formData, additionalLinks: e.target.value })}
                                        placeholder="Any other relevant links to your startup..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                    />
                                </div>

                                <div className="flex justify-between pt-8">
                                    <button onClick={prevStep} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                                        <ArrowLeft className="w-5 h-5" />
                                        <span>Back</span>
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.pillar || !formData.stage || !formData.coiDeclaration}
                                        className="btn-primary flex items-center gap-2 !px-8 !py-4 !rounded-2xl disabled:opacity-50"
                                    >
                                        <span>Next Step</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-vc-mint/20 flex items-center justify-center">
                                        <FileText className="text-vc-mint w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Application Material</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Pitch Deck (PDF or PPTX)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf,.pptx"
                                                onChange={(e) => setFiles({ ...files, pitchDeck: e.target.files?.[0] || null })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.pitchDeck ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                                <Upload className={`w-8 h-8 ${files.pitchDeck ? 'text-vc-mint' : 'text-white/20'}`} />
                                                <p className="text-sm font-medium">{files.pitchDeck ? files.pitchDeck.name : 'Upload Pitch Deck'}</p>
                                                <p className="text-xs text-white/40">Drop file here or click to browse</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-white/70">Executive Summary (PDF or DOCX)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={(e) => setFiles({ ...files, execSummary: e.target.files?.[0] || null })}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.execSummary ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                                <FileText className={`w-8 h-8 ${files.execSummary ? 'text-vc-mint' : 'text-white/20'}`} />
                                                <p className="text-sm font-medium">{files.execSummary ? files.execSummary.name : 'Upload Executive Summary'}</p>
                                                <p className="text-xs text-white/40">Drop file here or click to browse</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/70 flex items-center gap-2">
                                        <Video className="w-4 h-4 text-vc-mint" />
                                        Video Pitch (Unlisted YouTube Link)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.videoPitchUrl}
                                        onChange={(e) => setFormData({ ...formData, videoPitchUrl: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-white/70">Supporting Data (Optional / PDF or Word)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept=".pdf,.docx,.doc"
                                            onChange={(e) => setFiles({ ...files, supportingData: e.target.files?.[0] || null })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`p-6 rounded-2xl border border-dashed transition-all flex items-center gap-4 ${files.supportingData ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                            <LinkIcon className={`w-6 h-6 ${files.supportingData ? 'text-vc-mint' : 'text-white/20'}`} />
                                            <div>
                                                <p className="text-sm font-medium">{files.supportingData ? files.supportingData.name : 'Upload Supporting Data'}</p>
                                                <p className="text-xs text-white/40">Optional technical documents</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-panel p-6 border-vc-mint/30 bg-vc-mint/5">
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            id="final-agreement"
                                            checked={formData.agreedToTerms}
                                            onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                                            className="mt-1 w-6 h-6 rounded border-vc-mint/50 bg-white/5 text-vc-mint focus:ring-vc-mint focus:ring-offset-0 cursor-pointer"
                                        />
                                        <label htmlFor="final-agreement" className="text-sm text-white/80 leading-relaxed cursor-pointer select-none">
                                            I have read, understood and agree to the <button onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }} className="text-vc-mint hover:underline font-bold decoration-vc-mint/30">Terms and Conditions</button> of the Venture Craft Competition. I confirm that all information provided is accurate and complete.
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-8">
                                    <button onClick={prevStep} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                                        <ArrowLeft className="w-5 h-5" />
                                        <span>Back</span>
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !files.pitchDeck || !files.execSummary || !formData.videoPitchUrl || !formData.agreedToTerms}
                                        className="btn-primary flex items-center gap-2 !px-12 !py-4 !rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-vc-mint/20 transition-all active:scale-95"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Application</span>
                                                <CheckCircle className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {step === 0 && <Footer />}

            {/* Terms and Conditions Modal */}
            <AnimatePresence>
                {isTermsOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 bg-[#001311]/80"
                            onClick={() => setIsTermsOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[85vh] bg-[#0c1e1c] border border-vc-mint/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <FileText className="text-vc-mint w-6 h-6" />
                                    Terms and Conditions
                                </h2>
                                <button
                                    onClick={() => setIsTermsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                >
                                    <X className="w-6 h-6 text-white/50 group-hover:text-white" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar scroll-smooth">
                                {[
                                    { title: "Acceptance", content: "These terms and conditions constitute a legally binding agreement between Venture Craft (hereinafter referred to as “competition”, “we”, “us”, or “our”) and each individual member of the applicant team (hereinafter collectively or individually referred to as “participant”, “you” or “your”). By submitting an application, registering for, or participating in the competition, you accept and agree to comply with this agreement in full. Where an application is submitted on behalf of a team, the application or participation of the team shall constitute acceptance of these terms and conditions by all team members. The individual submitting the application is responsible for ensuring that all team members have reviewed and accepted the terms and conditions." },
                                    { title: "Accuracy of Information", content: "You agree to provide information that is accurate, current, and complete at all times in connection with your application and participation in the competition. You further agree to promptly update any information that becomes inaccurate or incomplete during the competition. The initial application, and any subsequent materials submitted or shared, are subject to compliance with the eligibility requirements communicated by Venture Craft." },
                                    { title: "Decisions", content: "Applications, pitches, and submissions may be evaluated by judges, mentors, or other individuals appointed by Venture Craft, or through other selection methods determined by the competition. We reserve the right to determine and apply the selection process for each stage of the competition. All judging and selection decisions are final and binding, and no correspondence or appeals regarding such decisions will be entertained." },
                                    { title: "Intellectual Property", content: "The participant is solely responsible for the protection of their own intellectual property and for ensuring that any ideas, materials, data, technology, or content they submit or present as part of the competition do not infringe the rights of any third party and are used with all necessary permissions. The participant grants Venture Craft a non-exclusive, royalty-free, worldwide license to use submitted materials, including applications, pitch decks, presentations, and demo materials, for the purposes of administering, judging, and promoting the competition. All intellectual property rights relating to Venture Craft, including its name, logo, branding, website, structure, and materials, remain the exclusive property of Venture Craft." },
                                    { title: "Confidentiality", content: "The participant acknowledges and agrees that Venture Craft does not treat any applications, submissions, pitch materials, presentations, or other information provided in connection with the competition as confidential, unless expressly agreed otherwise in writing by Venture Craft. The participant is solely responsible for protecting any confidential information and should not submit trade secrets or other sensitive information unless such information is adequately protected. Venture Craft shall not be liable for any disclosure, use, or misappropriation of any information submitted as part of the competition." },
                                    { title: "Publicity", content: "You understand and agree that we may use, reproduce, publish, display, distribute your name, team name, startup name, logo, likeness, photographs, video recordings, and other non-confidential materials submitted or created in connection with the competition, in any manner and in any media, without additional compensation or notice." },
                                    { title: "Travel and Expenses", content: "The participant is solely responsible for obtaining any required visas or travel documents. Venture Craft shall not be responsible or liable for any costs or expenses incurred by the participant beyond those expressly agreed in writing. Any travel support or reimbursement offered by Venture Craft, if any, shall be provided at its sole discretion and subject to any additional terms communicated to the participant." },
                                    { title: "Disqualification", content: "We reserve the right, at our sole discretion, to refuse, reject, suspend, or disqualify any participant at any stage of the competition where these terms and conditions are not complied with." },
                                    { title: "Limitation of Liability", content: "To the fullest extent permitted by law, Venture Craft, its partners and affiliates, and any individuals or entities involved in the organization, operation, sponsorship, mentorship, judging, or support, shall not be liable for any loss, damage, or injury arising out of or in connection with the competition or participation in the competition, including, but not limited to, any direct, indirect, incidental, consequential, special, or punitive damages, or any loss of profits, revenue, data, or business opportunities, even if advised of the possibility of such damages. Participation in the competition does not guarantee selection, funding, investment, or any particular outcome." },
                                    { title: "Modifications", content: "Venture Craft reserves the right to amend these terms and conditions, and to modify the structure, timing, format, requirements, or other aspects of the competition. Venture Craft also reserves the right to postpone, modify, suspend, or cancel the competition, in whole or in part, if circumstances beyond its reasonable control affect the fair or proper operation of the competition. Continued participation in the competition following any such changes constitutes acceptance of the updated terms and conditions." },
                                    { title: "Governing Law", content: "These terms and conditions are governed by and are construed in accordance with the laws of the Kingdom of Saudi Arabia." },
                                ].map((term, i) => (
                                    <div key={i} className="space-y-3">
                                        <h3 className="text-vc-mint font-bold italic flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-vc-mint/10 flex items-center justify-center not-italic text-sm">{i + 1}</span>
                                            {term.title}
                                        </h3>
                                        <p className="text-white/70 leading-relaxed pl-11">
                                            {term.content}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 border-t border-white/10 bg-white/5 flex justify-end">
                                <button
                                    onClick={() => setIsTermsOpen(false)}
                                    className="btn-primary !py-3 !px-10 !rounded-xl"
                                >
                                    Close Window
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Success Modal */}
            <AnimatePresence>
                {isSuccessOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            className="absolute inset-0 bg-[#001311]/90"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-[#0c1e1c] border border-vc-mint/20 rounded-[2.5rem] shadow-[0_0_100px_rgba(79,209,197,0.15)] overflow-hidden p-10 text-center"
                        >
                            {/* Animated Checkmark */}
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                                className="w-24 h-24 rounded-full bg-gradient-to-br from-vc-mint to-vc-teal mx-auto flex items-center justify-center mb-8 shadow-xl shadow-vc-mint/20"
                            >
                                <CheckCircle className="w-12 h-12 text-vc-green-dark" strokeWidth={3} />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold text-white mb-4 font-poppins"
                            >
                                Application Sent!
                            </motion.h2>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-4 mb-10"
                            >
                                <p className="text-white/70 leading-relaxed">
                                    Your team's proposal for the Venture Craft Competition has been successfully received.
                                </p>
                                <div className="bg-vc-mint/5 border border-vc-mint/10 rounded-2xl p-4 inline-block">
                                    <p className="text-vc-mint text-sm font-medium flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Confirmation sent to the leader's email.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => router.push('/')}
                                className="btn-primary !w-full !py-4 !rounded-2xl flex items-center justify-center gap-2 hover:shadow-vc-mint/30 transition-all font-bold text-lg"
                            >
                                <span>Back to Dashboard</span>
                                <Rocket className="w-5 h-5" />
                            </motion.button>

                            {/* Decorative Sparkles */}
                            <div className="absolute top-10 left-10 w-2 h-2 bg-vc-mint rounded-full animate-ping" />
                            <div className="absolute bottom-20 right-10 w-3 h-3 bg-vc-teal rounded-full animate-pulse" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}
