'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, FileText, Video, Users, Rocket, Link as LinkIcon, AlertCircle, ChevronDown, Search, Globe, X, Clock, ShieldCheck, Hash, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp, getDoc, runTransaction, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { upload } from '@vercel/blob/client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';


import { countries } from '@/lib/countries';
import { isValidUrl, isValidYoutubeUrl, isValidLinkedinUrl, isPersonalEmail } from '@/lib/utils';

// Custom Dropdown Component
function FlagDropdown({
    options,
    value,
    onChange,
    label,
    description,
    placeholder = "Select...",
    type = 'country' // 'country' or 'phone'
}: {
    options: typeof countries,
    description?: string,
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
            {label && (
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                    {label.includes('*') ? (
                        <>
                            {label.replace('*', '').trim()} <span className="text-vc-mint">*</span>
                        </>
                    ) : label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 flex items-center gap-2 hover:bg-white/10 transition-all text-left ${type === 'phone' ? 'h-[52px]' : 'py-3'}`}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOption ? (
                        <>
                            <img
                                src={`https://flagcdn.com/w40/${selectedOption.code.toLowerCase()}.png`}
                                alt={selectedOption.name}
                                className="w-5 h-auto rounded-sm shrink-0"
                            />
                            <span className="text-white text-base truncate">
                                {type === 'country' ? (
                                    <span className="hidden sm:inline">{selectedOption.name}</span>
                                ) : selectedOption.dialCode}
                                {type === 'country' && <span className="sm:hidden">{selectedOption.code.toUpperCase()}</span>}
                            </span>
                        </>
                    ) : (
                        <span className="text-white/40 text-base truncate">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-vc-mint shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {description && (
                <p className="text-xs text-vc-mint italic ml-1 mt-1">
                    {description}
                </p>
            )}

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
                                className="bg-transparent border-none outline-none text-base w-full text-white placeholder:text-white/20"
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
                                            <span className="text-base text-white/80 group-hover:text-white truncate max-w-[120px]">{opt.name}</span>
                                        </div>
                                        <span className="text-sm text-vc-mint/40 group-hover:text-vc-mint">{opt.dialCode}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-white/40 text-base">No results found</div>
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
            {label && (
                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                    {label.includes('*') ? (
                        <>
                            {label.replace('*', '').trim()} <span className="text-vc-mint">*</span>
                        </>
                    ) : label}
                </label>
            )}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-all text-left"
            >
                <span className={`text-base ${value ? 'text-white' : 'text-white/40'}`}>
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
                                    <span className="text-base text-white/80 group-hover:text-white">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const ApplyPageContent = () => {
    const [step, setStep] = useState(0); // 0 = Intro, 1-3 = Form
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);
    const [regLoading, setRegLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();


    // Force clear step parameter if registration is closed to show header
    useEffect(() => {
        if (!regLoading && !isRegistrationOpen && searchParams.get('step')) {
            router.replace('/apply', { scroll: false });
        }
    }, [regLoading, isRegistrationOpen, searchParams, router]);

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
        leaderLocation: 'Saudi Arabia',
        audienceCategory: '',

        // Part 2
        startupName: '',
        location: '',
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
        referralSource: '',
        referralPlatform: '',
        referralAmbassadorId: '',
        referralAmbassadorName: '',
        // Files will be handled separately for state
    });

    const [files, setFiles] = useState<{
        pitchDeck: File | null;
        execSummary: File | null;
        supportingData: File | null;
        eligibilityProof: File | null;
    }>({
        pitchDeck: null,
        execSummary: null,
        supportingData: null,
        eligibilityProof: null
    });

    // Sync URL to Step on mount/update (Moved after formData/files for visibility)
    useEffect(() => {
        const s = searchParams.get('step');
        if (s) {
            const newStep = parseInt(s);
            if (!isNaN(newStep) && newStep !== step) {
                // Prevent skipping steps via URL
                if (newStep === 2 && !validateStep1()) {
                    router.replace('/apply?step=1', { scroll: false });
                    return;
                }
                if (newStep === 3) {
                    if (!validateStep1()) {
                        router.replace('/apply?step=1', { scroll: false });
                        return;
                    }
                    if (!validateStep2()) {
                        router.replace('/apply?step=2', { scroll: false });
                        return;
                    }
                }
                setStep(newStep);
            }
        }
    }, [searchParams, formData, files]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Secure the page - redirect to signin if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/signin?redirect=${encodeURIComponent('/apply')}`);
        }
    }, [user, authLoading, router]);

    // ... (keep existing sync useEffect)

    const handleApplyClick = () => {
        if (!user) {
            router.push(`/signin?redirect=${encodeURIComponent('/apply')}`);
        }
    };

    // Sync step with URL for Navbar/Footer visibility
    useEffect(() => {
        if (isRegistrationOpen) {
            if (step > 0) {
                router.push(`/apply?step=${step}`, { scroll: false });
            } else {
                router.push('/apply', { scroll: false });
            }
        }
    }, [step, router, isRegistrationOpen]);

    const handleTeamSizeChange = (size: number) => {
        const newSize = Math.max(1, size);
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

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.ageConfirmed || !formData.educationConfirmed) {
            newErrors.eligibility = "Please confirm all eligibility checkboxes to proceed.";
        }
        if (!formData.audienceCategory) {
            newErrors.audienceCategory = "Please select your team's audience category.";
        }
        if (!files.eligibilityProof) {
            newErrors.eligibilityProof = "Please upload evidence for your eligibility category.";
        }
        if (!formData.leaderEmail) {
            newErrors.leaderEmail = "Please enter the team leader's email address.";
        } else if (!isPersonalEmail(formData.leaderEmail)) {
            newErrors.leaderEmail = "Please enter a personal email address (e.g., Gmail, Outlook). School or work emails are not allowed.";
        }
        if (formData.leaderPhoneNumber.length < 7 || formData.leaderPhoneNumber.length > 15) {
            newErrors.leaderPhoneNumber = "Please check the phone number.";
        }
        if (!formData.leaderLocation) {
            newErrors.leaderLocation = "Please select the team leader's current location.";
        }
        formData.teamMembers.forEach((m, idx) => {
            if (!m.name.trim()) {
                newErrors[`member_${idx}`] = "Please provide name for this member.";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.startupName.trim()) {
            newErrors.startupName = "Please enter your Startup / Project Name.";
        }
        if (!formData.location.trim()) {
            newErrors.location = "Please enter your Startup Location.";
        }
        if (!formData.pillar) {
            newErrors.pillar = "Please select which pillar your startup aligns with.";
        }
        if (!formData.stage) {
            newErrors.stage = "Please select your startup's current stage.";
        }
        if (!formData.coiDeclaration.trim()) {
            newErrors.coiDeclaration = "Please provide a Conflict of Interest declaration (or state 'None').";
        }
        if (formData.website && !isValidUrl(formData.website)) {
            newErrors.website = "Please enter a valid URL (e.g., https://example.com).";
        }
        if (formData.linkedin && !isValidLinkedinUrl(formData.linkedin)) {
            newErrors.linkedin = "Please enter a valid LinkedIn URL.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep3 = () => {
        const newErrors: Record<string, string> = {};
        if (!files.pitchDeck) {
            newErrors.pitchDeck = "Please upload your Pitch Deck.";
        }
        if (!files.execSummary) {
            newErrors.execSummary = "Please upload your Executive Summary.";
        }
        if (!formData.videoPitchUrl.trim()) {
            newErrors.videoPitchUrl = "Please provide the link to your Video Pitch.";
        } else if (!isValidYoutubeUrl(formData.videoPitchUrl)) {
            newErrors.videoPitchUrl = "Please provide a valid YouTube URL (youtube.com or youtu.be).";
        }
        if (!formData.agreedToTerms) {
            newErrors.agreedToTerms = "You must agree to the Terms and Conditions to submit.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Full Validation Check
        if (!validateStep1()) {
            setStep(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!validateStep2()) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!validateStep3()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {

            // 1. Upload Files first (Only if they passed security)
            const uploadFile = async (file: File | null, folder: string) => {
                if (!file) return null;
                const timestamp = Date.now();
                const newBlob = await upload(`applications/${user.uid}/${folder}/${timestamp}-${file.name}`, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                return newBlob.url;
            };

            const [pitchDeckUrl, execSummaryUrl, supportingDataUrl, eligibilityProofUrl] = await Promise.all([
                uploadFile(files.pitchDeck, 'pitch_decks'),
                uploadFile(files.execSummary, 'exec_summaries'),
                uploadFile(files.supportingData, 'supporting_data'),
                uploadFile(files.eligibilityProof, 'eligibility_proofs')
            ]);

            const combinedPhone = `${formData.leaderPhoneCode} ${formData.leaderPhoneNumber}`;
            const applicationRef = doc(db, 'applications', user.uid);

            // 2. Clean up data for Firestore
            const submissionData = {
                userId: user.uid,
                status: 'pending',
                submittedAt: serverTimestamp(),

                // Form Data
                startupName: formData.startupName,
                location: formData.location,
                teamSize: formData.teamSize,
                teamMembers: formData.teamMembers,
                leaderEmail: formData.leaderEmail,
                leaderPhone: combinedPhone,
                leaderNationality: formData.leaderNationality,
                leaderLocation: formData.leaderLocation,

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
                    eligibilityProofName: files.eligibilityProof?.name || null,
                    eligibilityProofUrl: eligibilityProofUrl,
                },
                audienceCategory: formData.audienceCategory,

                // Confirmations
                confirmations: {
                    ageConfirmed: formData.ageConfirmed,
                    educationConfirmed: formData.educationConfirmed
                },

                // Referral Info
                referral: {
                    source: formData.referralSource,
                    platform: formData.referralPlatform || null,
                    ambassadorId: formData.referralAmbassadorId || null,
                    ambassadorName: formData.referralAmbassadorName || null
                }
            };

            await setDoc(applicationRef, submissionData);

            // 3. Award Venture Coins if referred by an ambassador
            if (formData.referralSource === 'Ambassadors' && (formData.referralAmbassadorId || formData.referralAmbassadorName)) {
                try {
                    await runTransaction(db, async (transaction) => {
                        let ambDocId = null;

                        // Try to find by ID first if provided
                        if (formData.referralAmbassadorId) {
                            const ambId = parseInt(formData.referralAmbassadorId.replace('#', ''));
                            if (!isNaN(ambId)) {
                                const q = query(collection(db, 'ambassadors'), where('ambassadorId', '==', ambId));
                                const qSnap = await getDocs(q);
                                if (!qSnap.empty) {
                                    ambDocId = qSnap.docs[0].id;
                                }
                            }
                        }

                        // If not found by ID, try by name (exact match)
                        if (!ambDocId && formData.referralAmbassadorName) {
                            const q = query(collection(db, 'ambassadors'), where('name', '==', formData.referralAmbassadorName));
                            const qSnap = await getDocs(q);
                            if (!qSnap.empty) {
                                ambDocId = qSnap.docs[0].id;
                            }
                        }

                        if (ambDocId) {
                            const ambRef = doc(db, 'ambassadors', ambDocId);
                            const userRef = doc(db, 'users', ambDocId);

                            const ambSnap = await transaction.get(ambRef);

                            if (ambSnap.exists()) {
                                const currentPoints = ambSnap.data().points || 0;
                                const newPoints = currentPoints + 10;

                                transaction.update(ambRef, { points: newPoints });
                                transaction.set(userRef, { points: newPoints }, { merge: true });

                                // Log in point history
                                const historyRef = doc(collection(userRef, 'point_history'));
                                transaction.set(historyRef, {
                                    points: 10,
                                    reason: `Referral: ${formData.startupName || 'New Startup Application'}`,
                                    timestamp: serverTimestamp(),
                                    type: 'referral'
                                });
                            }
                        }
                    });
                } catch (rewardErr) {
                    console.error('Failed to award referral points:', rewardErr);
                    // Don't block submission success if reward fails
                }
            }

            // 3. Send Confirmation Email to Team Leader
            try {
                await fetch('/api/send-submission-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.leaderEmail,
                        leaderName: formData.teamMembers[0]?.name || 'Team Leader',
                        startupName: formData.startupName || formData.pillar
                    }),
                });
            } catch (emailErr) {
                console.error('Failed to send confirmation email:', emailErr);
                // We don't block the UI if the email fails, as the application is already saved
            }

            setIsSuccessOpen(true);
        } catch (error: any) {
            console.error('Error submitting application:', error);
            const errorMessage = error.message || '';

            if (errorMessage.includes('Blob') || errorMessage.includes('upload')) {
                alert('File upload failed. Your storage might be full or the file type is not supported. Please try again or use a smaller file.');
            } else if (errorMessage.includes('Firestore') || errorMessage.includes('permission')) {
                alert('Database submission failed. Please check your internet connection and try again.');
            } else {
                alert('Failed to submit application. Please try again.');
            }
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
        {
            category: 'Age',
            requirement: (
                <span>
                    All team members <strong className="text-vc-mint">must be 18 years of age or older</strong> at the time of application submission.
                </span>
            ),
            notes: 'Ensures legal eligibility for participation.'
        },
        {
            category: 'Education',
            requirement: (
                <div className="space-y-1">
                    <p>This requirement applies <strong className="text-vc-mint font-bold">only</strong> to the team leader and/or main co-founders.</p>
                    <p className="text-xs text-white/40 italic">Recommended for others.</p>
                </div>
            ),
            notes: 'Ensures the competition targets high-potential early-stage talent.'
        },
        {
            category: 'Startup Stage',
            requirement: (
                <div className="space-y-2">
                    <p>The startup must be <strong className="text-vc-mint">no older than 5 years</strong> from its date of establishment.</p>
                    <p>The competition is targeted <strong className="text-white font-bold">at early-stage startups</strong>, specifically:</p>
                    <ul className="list-disc pl-5 space-y-1 text-white/70">
                        <li><span className="text-vc-mint font-bold uppercase tracking-wider text-xs">Ideation</span></li>
                        <li><span className="text-vc-mint font-bold uppercase tracking-wider text-xs">Pre-Seed</span></li>
                        <li><span className="text-vc-mint font-bold uppercase tracking-wider text-xs">Seed</span></li>
                    </ul>
                    <p>Startups at later stages may be deemed ineligible.</p>
                </div>
            ),
            notes: 'Keeps the competition aligned with emerging ventures and early-stage innovation.'
        },
        {
            category: 'Basis',
            requirement: (
                <div className="space-y-2">
                    <p>The startup must be <strong className="text-vc-mint font-bold">science- or technology-based</strong>.</p>
                    <p>The proposed solution must align with <strong className="text-white">at least one</strong> of the competition’s four pillars:</p>
                    <ul className="list-disc pl-5 space-y-1 text-white/70">
                        <li><span className="text-vc-mint/80 font-semibold italic">Decarbonization Technologies</span></li>
                        <li><span className="text-vc-mint/80 font-semibold italic">Circular Economy & Resource Efficiency</span></li>
                        <li><span className="text-vc-mint/80 font-semibold italic">Energy Efficiency</span></li>
                        <li><span className="text-vc-mint/80 font-semibold italic">Process Optimization & Advanced Engineering</span></li>
                    </ul>
                </div>
            ),
            notes: 'Ensures ventures are rooted in research, innovation, or applied science.'
        },
        {
            category: 'Conflict of Interest',
            requirement: (
                <div className="space-y-2">
                    <p>Teams must <strong className="text-vc-mint font-bold">fully disclose any existing or prior relationships</strong> (mentor, investor, advisory, employment, or organizational) with:</p>
                    <ul className="list-disc pl-5 space-y-1 text-white/70">
                        <li>Investors</li>
                        <li>Judges</li>
                        <li>Organizers</li>
                        <li>Partner corporations</li>
                    </ul>
                    <p>Disclosure <strong className="text-white italic">does not automatically disqualify</strong> a team but is required to ensure fairness and transparency.</p>
                </div>
            ),
            notes: 'Ensures impartial evaluation.'
        },
        {
            category: 'Complete Submission',
            requirement: (
                <span>
                    Teams must submit <strong className="text-vc-mint">all required application materials</strong> via the online application form <strong className="text-white">before the stated deadline</strong>.<br />
                    Incomplete or late submissions will not be considered.
                </span>
            ),
            notes: 'Guarantees fairness and preparedness.'
        },
    ];

    const rubrics = {
        screening1: {
            title: "Screening Round 1:",
            description: "Round 1 Identifies the most promising science-based ideas and capable founding teams with clear articulation of problem, innovation, and feasibility. Based on part 1 of the application form along with the pitch deck and video pitch from part 3.",
            criteria: [
                { name: "Problem & Market Clarity", description: "Assesses whether the problem is clearly defined, significant, and grounded in a real, identifiable need. The team should articulate who experiences the problem, why it matters, and why it is worth solving now.", weight: 30 },
                { name: "Solution & Innovation (Scientific / Technical Basis)", description: "Evaluates the novelty and originality of the proposed solution, including whether it is grounded in credible science or technology and meaningfully differentiated from existing approaches.", weight: 30 },
                { name: "Early Business Logic", description: "Assesses whether the team demonstrates a basic understanding of how the innovation creates value, including intended users, use cases, and high-level revenue logic.", weight: 20 },
                { name: "Communication & Conviction", description: "Evaluates clarity, coherence, and persuasiveness of the pitch deck and the video pitch, including the team’s ability to explain the problem and solution clearly and confidently.", weight: 20 },
            ]
        },
        screening2: {
            title: "Screening Round 2:",
            description: "Round 2 assesses the technical soundness, scientific rigor, and early validation of the proposed solution. Based on the executive summary and supporting data from part 3 in the application.",
            criteria: [
                { name: "Technical Feasibility & Validation Approach", description: "Assesses whether the solution is technically feasible based on evidence provided (experimental, simulated, calculated, or well-reasoned theoretical). Teams are not penalized for lack of experimental data if assumptions are clearly justified.", weight: 25 },
                { name: "Scientific Rigor & Quality of Reasoning", description: "Evaluates the soundness of scientific or engineering logic, clarity of assumptions, grounding in first principles or literature, and acknowledgment of limitations.", weight: 20 },
                { name: "Commercial Logic & Market Credibility", description: "Assesses whether the team demonstrates a realistic understanding of the target market, customer value, and adoption pathway, consistent with the technical solution presented.", weight: 20 },
                { name: "Scalability & Development Pathway", description: "Evaluates whether the team presents a logical roadmap from current concept to scalable implementation, including key technical and commercial milestones.", weight: 20 },
                { name: "Impact & Sustainability Alignment", description: "Considers environmental, social, or economic impact and alignment with sustainability or strategic priorities.", weight: 10 },
                { name: "Clarity of Technical & Business Communication", description: "Evaluates how clearly technical concepts, assumptions, business logic, and next steps are communicated in the executive summary and any optional supporting material.", weight: 5 },
            ]
        }
    };

    const applicationMaterials = [
        {
            number: 1,
            title: "PITCH DECK",
            format: "PDF or PowerPoint",
            length: "10 - 15 slides (maximum)",
            purpose: "Provides a concise overview of the startup. Used to assess clarity, logic, and communication quality.",
            content: {
                title: "Expected content includes (but is not limited to):",
                items: [
                    "Team structure",
                    "Identity, mission, and vision",
                    "Problem statement and proposed solution",
                    "Market size, competition, and validation",
                    "Business model",
                    "Financial overview",
                    "Traction and growth strategy"
                ]
            }
        },
        {
            number: 2,
            title: "EXECUTIVE SUMMARY",
            format: "PDF or Microsoft Word",
            length: "1 - 2 pages",
            purpose: "Summarizes the full business case.",
            intro: "The executive summary should function as a standalone, persuasive document that summarizes the entire content.",
            content: {
                title: "Must include:",
                alphaItems: [
                    "Problem statement",
                    "Innovation & technical basis",
                    "Market opportunity",
                    "Business model",
                    "Team & capabilities",
                    "Impact & sustainability"
                ]
            }
        },
        {
            number: 3,
            title: "VIDEO PITCH",
            format: "Unlisted YouTube link",
            length: "3 - 5 minutes",
            purpose: "To clearly communicate the startup’s value proposition and why it is worth investing in. The video pitch is your chance to humanize your startup. It puts a face to the business, making it more relatable and memorable than just words.",
            content: {
                title: "Expected content:",
                items: [
                    "The video pitch should be a presentation of the pitch deck that is also submitted as part of the application.",
                    "Teams are not required to present every slide in the deck.",
                    "Teams may select and present only the slides most relevant to clearly communicating their idea within the 3 - 5 minute timeframe."
                ]
            },
            extra: {
                title: "Presentation & Recording Format:",
                items: [
                    "At least one co-founder or the team leader should appear in the video.",
                    "Participating members are encouraged to briefly introduce themselves and their roles."
                ],
                formats: {
                    title: "Teams should present the pitch deck using one of the following formats only:",
                    list: [
                        "Presenting in front of a physical screen or display, with the pitch deck shown and the team speaking.",
                        "Screen-sharing the pitch deck while presenting (e.g., recording via Zoom, Microsoft Teams, or Google Meet)."
                    ]
                },
                quality: {
                    title: "Technical and Quality requirements:",
                    list: [
                        "Clear audio and visible slides.",
                        "Professional but simple production is acceptable.",
                        "Language: English (professional and consistent throughout the video)."
                    ]
                },
                instructions: {
                    title: "Video submission instructions:",
                    list: [
                        "Upload: Click the \"Create\" icon in YouTube and select \"Upload video\".",
                        "Set Visibility: On the \"Visibility\" step, choose Unlisted. Note: Videos must be set to Unlisted (not Public or Private).",
                        "Share: Once processed, copy the video link and submit on the form."
                    ]
                }
            }
        },
        {
            number: 4,
            title: "SUPPORTING DATA",
            format: "PDF or Microsoft Word",
            length: "Maximum of 5 pages",
            intro: "Depending on the maturity of the idea, submissions may include:",
            content: {
                nestedItems: [
                    {
                        title: "Conceptual or system-level descriptions",
                        subItems: [
                            "High-level system architecture, workflows, or process diagrams",
                            "Explanation of underlying scientific or engineering principles"
                        ]
                    },
                    {
                        title: "Analytical or calculated results",
                        subItems: [
                            "Engineering calculations, scaling estimates, or first-principles analysis",
                            "Order-of-magnitude estimates supporting feasibility"
                        ]
                    },
                    {
                        title: "Simulated or computational results",
                        subItems: [
                            "Simulation outputs, modeling results, or virtual experiments",
                            "Figures, plots, or screenshots illustrating performance or behavior",
                            "Brief explanation of assumptions and methodology (raw code not required)"
                        ],
                        nestedNote: {
                            title: "If included:",
                            items: [
                                "Only summarized outputs, figures, screenshots, or explanations are required.",
                                "Full simulation files, executable models, or software access are not required."
                            ]
                        }
                    },
                    {
                        title: "Prototype or proof-of-concept (if available)",
                        subItems: [
                            "Description of the prototype and its maturity level",
                            "Images, diagrams, or summarized test results"
                        ]
                    },
                    {
                        title: "Literature-based justification",
                        subItems: [
                            "References to academic literature, prior art, or industry benchmarks",
                            "Explanation of how existing work supports the proposed approach"
                        ]
                    }
                ]
            },
            note: "Supporting data is used to enhance technical evaluation, but the absence of supporting data will not negatively affect eligibility. Emphasis is placed on clarity, relevance, and technical reasoning rather than volume or complexity."
        }
    ];

    const additionalPoints = [
        { title: 'IP / Ownership', detail: 'Teams must hold or legally control any intellectual property related to their submission.', reason: 'Protects originality and prevents disputes.' },
        { title: 'One-Entry Rule', detail: 'Each participant may join only one team.', reason: 'Prevents duplication and ensures fair participation.' },
        { title: 'Code of Conduct', detail: 'All team members must accept the official competition rules and code of conduct.', reason: 'Maintains professionalism and integrity.' },
        { title: 'Conflict of Interest', detail: 'Teams must disclose any existing mentor, investor, or organizational relationships with judges or organizers.', reason: 'Ensures impartial evaluation.' },
    ];

    if (authLoading || regLoading) {
        return (
            <div className="min-h-screen bg-[#001311] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-vc-mint/20 border-t-vc-mint rounded-full animate-spin" />
                <p className="text-vc-mint/60 font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!user) return null; // Prevent flicker before redirect

    if (!isRegistrationOpen && !regLoading) {
        return (
            <main className="min-h-screen bg-[#001311] text-white flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Orbs */}
                <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
                <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-vc-teal/15 rounded-full blur-[120px] animate-pulse pointer-events-none" />

                {/* Go Back Link - Adjusted for Navbar */}
                <Link
                    href="/"
                    className="absolute top-40 left-20 p-3 rounded-full glass-panel hover:bg-white/10 transition-all duration-300 group z-50 focus:outline-none focus:ring-2 focus:ring-vc-mint/50 flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5 text-vc-mint group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="text-sm font-medium pr-2 text-vc-mint/80 group-hover:text-vc-mint transition-colors">Go Back</span>
                </Link>

                <div className="relative z-10 text-center px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vc-teal/20 to-vc-mint/20 flex items-center justify-center border border-vc-mint/30 shadow-[0_0_30px_rgba(79,209,197,0.2)]">
                            <Clock className="w-10 h-10 text-vc-mint" />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold mb-6 font-poppins tracking-tighter text-white"
                    >
                        Registration <br /> <span className="text-vc-mint">Coming Soon</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Stay tuned for the <span className="text-vc-mint font-bold italic">KFUPM Venture Craft</span> deep-tech startup challenge.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="glass-panel px-8 py-4 rounded-2xl border border-vc-mint/20 bg-white/5 backdrop-blur-xl inline-flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-vc-mint animate-ping" />
                            <p className="text-lg font-medium text-white tracking-wide italic">More coming soon!</p>
                        </div>

                        <Link
                            href="/apply/faq"
                            className="text-vc-mint/60 hover:text-vc-mint transition-all flex items-center gap-2 text-sm font-medium tracking-wide uppercase group"
                        >
                            <span className="border-b border-transparent group-hover:border-vc-mint/40 py-0.5 transition-all">Check Application FAQ</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Decorative Grid */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(#1a3a3a_1px,transparent_1px)] [background-size:40px_40px]" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10 min-h-[calc(100vh-200px)]">
                {step === 0 && null}
                {step === 1 && (
                    <button
                        onClick={() => setStep(0)}
                        className="inline-flex items-center gap-2 text-vc-mint/60 hover:text-vc-mint transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Intro</span>
                    </button>
                )}
                {step > 1 && (
                    <button
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 text-vc-mint/60 hover:text-vc-mint transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Previous Step</span>
                    </button>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight">
                        Application Form
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto mb-4">
                        Please fill out all the required information to apply for the KFUPM Venture Craft Challenge.
                        Have questions? Check our <Link href="/apply/faq" target="_blank" className="text-vc-mint hover:underline font-medium">Application FAQ</Link>.
                    </p>
                    <p className="text-sm text-white/40 flex items-center justify-center gap-1.5">
                        <span className="text-vc-mint">*</span> Indicates a required field
                    </p>
                </div>



                {renderStepIndicator()}

                <div className="glass-panel p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-4 mb-8">
                                    <h2 className="text-3xl font-bold font-poppins text-white mb-2">Before You Begin</h2>
                                    <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                                        To ensure a successful application, please review the following resources carefully.
                                        Understanding the eligibility criteria and required materials will help you prepare a strong submission.
                                    </p>

                                    <div className="mt-4 mb-2 p-3 rounded-xl bg-white/5 border border-vc-mint/20 text-center max-w-xl mx-auto backdrop-blur-sm">
                                        <p className="text-base text-white/90">
                                            This Year's Theme: <span className="text-vc-mint font-bold uppercase tracking-wide ml-1">Sustainable Energy</span>
                                        </p>
                                    </div>
                                    <div className="mt-6 p-4 bg-vc-mint/10 border border-vc-mint/20 rounded-xl flex items-start gap-3 max-w-2xl mx-auto text-left">
                                        <AlertCircle className="w-5 h-5 text-vc-mint shrink-0 mt-0.5" />
                                        <p className="text-sm text-white/80 leading-relaxed">
                                            <strong className="text-vc-mint font-bold block mb-1 uppercase tracking-wider text-xs">Important Disclaimer</strong>
                                            Please review these resources carefully. Failure to adhere to strict eligibility and application material requirements may disqualify an applicant.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                    {[
                                        {
                                            title: "Eligibility Criteria",
                                            description: "Check if your team and startup qualify.",
                                            icon: ShieldCheck,
                                            href: "/apply/eligibility",
                                            color: "text-vc-mint"
                                        },
                                        {
                                            title: "Application Materials",
                                            description: "Required documents and formats.",
                                            icon: FileText,
                                            href: "/apply/materials",
                                            color: "text-blue-400"
                                        },
                                        {
                                            title: "Judging Rubrics",
                                            description: "How your application will be judged.",
                                            icon: CheckCircle,
                                            href: "/apply/rubrics",
                                            color: "text-purple-400"
                                        },
                                        {
                                            title: "Application FAQ",
                                            description: "Common questions and answers.",
                                            icon: HelpCircle,
                                            href: "/apply/faq",
                                            color: "text-orange-400"
                                        }
                                    ].map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            target="_blank"
                                            className="group relative p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-vc-mint/30 hover:shadow-[0_0_20px_rgba(79,209,197,0.1)] transition-all duration-300 flex items-center gap-4 overflow-hidden active:scale-[0.98]"
                                        >
                                            <div className={`p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-vc-mint/10 group-hover:border-vc-mint/20 transition-colors ${item.color}`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-vc-mint transition-colors flex items-center gap-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-white/50 font-medium leading-normal">{item.description}</p>
                                            </div>
                                            <div className="pr-2">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-vc-mint text-white/30 group-hover:text-vc-green-dark transition-all duration-300">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex justify-center pt-8">
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="px-8 py-4 bg-gradient-to-r from-vc-teal to-vc-mint text-white font-bold rounded-xl shadow-lg shadow-vc-mint/20 hover:shadow-vc-mint/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group text-lg uppercase tracking-wider"
                                    >
                                        <span>Start Application</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
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
                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                        <Users className="w-3 h-3 text-vc-mint" />
                                        Team size (including leader)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.teamSize}
                                        onChange={(e) => handleTeamSizeChange(parseInt(e.target.value))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                    />
                                    <p className="text-base text-white/30 uppercase tracking-widest">No maximum limit</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                                            Leader Personal Email Address <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.leaderEmail}
                                            onChange={(e) => {
                                                setFormData({ ...formData, leaderEmail: e.target.value });
                                                if (errors.leaderEmail) setErrors(prev => ({ ...prev, leaderEmail: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.leaderEmail ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="personal.email@example.com"
                                        />
                                        {errors.leaderEmail && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.leaderEmail}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                                            Leader Phone Number <span className="text-vc-mint">*</span>
                                        </label>
                                        <div className={`flex items-center bg-white/5 border rounded-xl transition-all ${errors.leaderPhoneNumber ? 'border-vc-mint' : 'border-white/10 focus-within:border-vc-mint'}`}>
                                            <div className="w-fit border-r border-white/10">
                                                <FlagDropdown
                                                    options={countries}
                                                    value={formData.leaderPhoneCode}
                                                    onChange={(val) => setFormData({ ...formData, leaderPhoneCode: val })}
                                                    type="phone"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="5123456789"
                                                value={formData.leaderPhoneNumber}
                                                maxLength={15}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 15) {
                                                        setFormData({ ...formData, leaderPhoneNumber: val });
                                                        if (errors.leaderPhoneNumber) setErrors(prev => ({ ...prev, leaderPhoneNumber: '' }));
                                                    }
                                                }}
                                                className="flex-1 bg-transparent border-none px-4 py-3.5 focus:outline-none focus:ring-0 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                        {errors.leaderPhoneNumber && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.leaderPhoneNumber}</p>}
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <SimpleDropdown
                                            label="Audience Category *"
                                            placeholder="Select who best describes your team..."
                                            options={[
                                                "Fresh STEM Graduates (0-5 years)",
                                                "Postdocs & Researchers",
                                                "Early-Career R&D (≤5 years)",
                                                "Academic Spinouts"
                                            ]}
                                            value={formData.audienceCategory}
                                            onChange={(val) => {
                                                setFormData({ ...formData, audienceCategory: val });
                                                if (errors.audienceCategory) setErrors(prev => ({ ...prev, audienceCategory: '' }));
                                            }}
                                        />
                                        {errors.audienceCategory && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.audienceCategory}</p>}
                                        <p className="text-sm text-white/40 italic">
                                            This helps us understand your team's background and alignment with the targeted audience.
                                        </p>
                                    </div>

                                    <div className="md:col-span-2 space-y-4">
                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-vc-mint" />
                                            Eligibility Evidence <span className="text-vc-mint">*</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    setFiles({ ...files, eligibilityProof: e.target.files?.[0] || null });
                                                    if (errors.eligibilityProof) setErrors(prev => ({ ...prev, eligibilityProof: '' }));
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={`p-6 rounded-2xl border border-dashed transition-all flex items-center gap-4 ${files.eligibilityProof ? 'border-vc-mint bg-vc-mint/5' : errors.eligibilityProof ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                                <ShieldCheck className={`w-6 h-6 ${files.eligibilityProof ? 'text-vc-mint' : errors.eligibilityProof ? 'text-vc-mint' : 'text-white/20'}`} />
                                                <div>
                                                    <p className="text-sm font-medium">{files.eligibilityProof ? files.eligibilityProof.name : 'Upload Eligibility Evidence'}</p>
                                                    <p className="text-sm text-white/40">Certificate, lab letter, or work contract (PDF/JPG)</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-white/40 mt-2 ml-1 leading-relaxed">
                                            Provide evidence verifying your specific eligibility category (e.g. proof of enrollment, employment, or graduation).
                                            <span className="ml-1">Not sure what to upload? Review the <Link href="/apply/eligibility#targeted-audience" target="_blank" className="text-vc-mint hover:underline font-medium">Targeted Audience profiles</Link> for guidance.</span>
                                        </p>
                                        <p className="text-xs text-red-400 mt-2 ml-2 italic">
                                            * Please ensure you upload the correct document. Incorrect evidence may risk your application's eligibility.
                                        </p>
                                        {errors.eligibilityProof && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.eligibilityProof}</p>}
                                    </div>
                                </div>

                                <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 mt-12">
                                    <h3 className="text-2xl font-bold text-vc-mint flex items-center gap-2">
                                        <Globe className="w-5 h-5" />
                                        Team Members Details
                                    </h3>
                                    {formData.teamMembers.map((member, idx) => (
                                        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                                                    {idx === 0 ? 'Team Leader Full Name (First and Last Name)' : `Member ${idx + 1} Full Name (First and Last Name)`} <span className="text-vc-mint">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.teamMembers[idx].name}
                                                    onChange={(e) => {
                                                        handleMemberChange(idx, 'name', e.target.value);
                                                        if (errors[`member_${idx}`]) setErrors(prev => ({ ...prev, [`member_${idx}`]: '' }));
                                                    }}
                                                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors[`member_${idx}`] ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                                    placeholder="Enter full name"
                                                />
                                                {errors[`member_${idx}`] && <p className="text-xs text-vc-mint/80 mt-1">{errors[`member_${idx}`]}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <FlagDropdown
                                                    options={countries}
                                                    value={member.nationality}
                                                    onChange={(val) => handleMemberChange(idx, 'nationality', val)}
                                                    label={idx === 0 ? "Leader Nationality *" : "Nationality *"}
                                                    type="country"
                                                />
                                            </div>
                                            {idx === 0 && (
                                                <div className="md:col-span-2 space-y-2 mt-4">
                                                    <FlagDropdown
                                                        options={countries}
                                                        value={formData.leaderLocation}
                                                        onChange={(val) => {
                                                            setFormData({ ...formData, leaderLocation: val });
                                                            if (errors.leaderLocation) setErrors(prev => ({ ...prev, leaderLocation: '' }));
                                                        }}
                                                        label="Leader Current Location (Residing) *"
                                                        description="Note: Current location refers to where you are physically residing at this time."
                                                        type="country"
                                                    />
                                                    {errors.leaderLocation && <p className="text-xs text-vc-mint/80 mt-1">{errors.leaderLocation}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-vc-mint/10 transition-all duration-200 ${errors.eligibility ? 'bg-vc-mint/10 border-vc-mint' : 'bg-vc-mint/5 border-vc-mint/10'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.ageConfirmed}
                                            onChange={(e) => {
                                                setFormData({ ...formData, ageConfirmed: e.target.checked });
                                                if (errors.eligibility) setErrors(prev => ({ ...prev, eligibility: '' }));
                                            }}
                                            className="mt-1 accent-vc-mint h-4 w-4 shrink-0"
                                        />
                                        <span className="text-base text-white/70">
                                            I confirm that all team members are 18 years of age or older at the time of application.
                                        </span>
                                    </label>
                                    <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer hover:bg-vc-mint/10 transition-all duration-200 ${errors.eligibility ? 'bg-vc-mint/10 border-vc-mint' : 'bg-vc-mint/5 border-vc-mint/10'}`}>
                                        <input
                                            type="checkbox"
                                            checked={formData.educationConfirmed}
                                            onChange={(e) => {
                                                setFormData({ ...formData, educationConfirmed: e.target.checked });
                                                if (errors.eligibility) setErrors(prev => ({ ...prev, eligibility: '' }));
                                            }}
                                            className="mt-1 accent-vc-mint h-4 w-4 shrink-0"
                                        />
                                        <span className="text-base text-white/70 leading-relaxed">
                                            I confirm that the team leader and/or co-founders are either actively pursuing or have completed an undergraduate degree.
                                        </span>
                                    </label>
                                    {errors.eligibility && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.eligibility}</p>}
                                </div>

                                <div className="flex justify-end pt-8">
                                    <button
                                        onClick={nextStep}
                                        className="btn-primary flex items-center gap-2 !px-8 !py-4 !rounded-2xl"
                                    >
                                        <span>Next Step</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {
                            step === 2 && (
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
                                        <h2 className="text-3xl font-bold">Start-up Details</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            Startup / Project Name <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.startupName}
                                            onChange={(e) => {
                                                setFormData({ ...formData, startupName: e.target.value });
                                                if (errors.startupName) setErrors(prev => ({ ...prev, startupName: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.startupName ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="Enter your startup or project name"
                                        />
                                        {errors.startupName && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.startupName}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            Startup Location <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => {
                                                setFormData({ ...formData, location: e.target.value });
                                                if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.location ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="City, Country"
                                        />
                                        {errors.location && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.location}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            Which of the following pillars does your startup most closely align with? <span className="text-vc-mint">*</span>
                                        </label>
                                        <p className="text-sm text-white/50 mb-3 mt-1">
                                            The theme for this year is <span className="text-vc-mint font-bold">Sustainable Energy</span>.
                                        </p>
                                        <div className={`grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4 p-4 rounded-xl border transition-all ${errors.pillar ? 'border-vc-mint bg-vc-mint/5' : 'border-white/5'}`}>
                                            {[
                                                'Decarbonization Technologies',
                                                'Circular Economy & Resource Efficiency',
                                                'Energy Efficiency',
                                                'Process Optimization & Advanced Engineering'
                                            ].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => {
                                                        setFormData({ ...formData, pillar: p });
                                                        if (errors.pillar) setErrors(prev => ({ ...prev, pillar: '' }));
                                                    }}
                                                    className={`p-4 h-full flex items-center rounded-xl border text-left transition-all ${formData.pillar === p ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        {errors.pillar && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.pillar}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-base font-medium text-white/70">
                                                Is your startup older than 5 years? <span className="text-vc-mint">*</span>
                                            </label>
                                            <div className="flex gap-4">
                                                {['Yes', 'No'].map((opt) => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => {
                                                            setFormData({ ...formData, isOlderThan5Years: opt });
                                                            if (errors.stage) setErrors(prev => ({ ...prev, stage: '' }));
                                                        }}
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
                                                onChange={(val) => {
                                                    setFormData({ ...formData, stage: val });
                                                    if (errors.stage) setErrors(prev => ({ ...prev, stage: '' }));
                                                }}
                                                label="Startup Stage *"
                                                placeholder="Select stage"
                                            />
                                            {errors.stage && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.stage}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            Conflict of Interest Declaration <span className="text-vc-mint">*</span>
                                        </label>
                                        <textarea
                                            value={formData.coiDeclaration}
                                            onChange={(e) => {
                                                setFormData({ ...formData, coiDeclaration: e.target.value });
                                                if (errors.coiDeclaration) setErrors(prev => ({ ...prev, coiDeclaration: '' }));
                                            }}
                                            placeholder="Please disclose any relationships or state 'None'."
                                            rows={4}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.coiDeclaration ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                        />
                                        {errors.coiDeclaration && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.coiDeclaration}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-base font-medium text-white/70">Startup Website</label>
                                            <input
                                                type="url"
                                                value={formData.website}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, website: e.target.value });
                                                    if (errors.website) setErrors(prev => ({ ...prev, website: '' }));
                                                }}
                                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.website ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                                placeholder="https://..."
                                            />
                                            {errors.website && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.website}</p>}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="block text-base font-medium text-white/70">LinkedIn Page</label>
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, linkedin: e.target.value });
                                                    if (errors.linkedin) setErrors(prev => ({ ...prev, linkedin: '' }));
                                                }}
                                                className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.linkedin ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                                placeholder="https://linkedin.com/company/..."
                                            />
                                            {errors.linkedin && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.linkedin}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">Additional Links</label>
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
                                            className="btn-primary flex items-center gap-2 !px-8 !py-4 !rounded-2xl"
                                        >
                                            <span>Next Step</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        }

                        {
                            step === 3 && (
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
                                        <h2 className="text-3xl font-bold">Application Material</h2>
                                    </div>
                                    <p className="text-sm text-white/50 -mt-4 mb-4">
                                        Please ensure all files meet the required standards.
                                        Check our <Link href="/apply/faq" target="_blank" className="text-vc-mint hover:underline font-medium mx-1">Application FAQ</Link>
                                        or review the detailed <Link href="/apply/materials" target="_blank" className="text-vc-mint hover:underline font-medium text-vc-mint/80">Application Materials</Link> documentation.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="block text-base font-medium text-white/70">
                                                Pitch Deck <span className="text-vc-mint">*</span>
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.pptx"
                                                    onChange={(e) => {
                                                        setFiles({ ...files, pitchDeck: e.target.files?.[0] || null });
                                                        if (errors.pitchDeck) setErrors(prev => ({ ...prev, pitchDeck: '' }));
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.pitchDeck ? 'border-vc-mint bg-vc-mint/5' : errors.pitchDeck ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                                    <Upload className={`w-8 h-8 ${files.pitchDeck ? 'text-vc-mint' : errors.pitchDeck ? 'text-vc-mint' : 'text-white/20'}`} />
                                                    <p className="text-base font-medium">{files.pitchDeck ? files.pitchDeck.name : 'Upload Pitch Deck'}</p>
                                                    <p className="text-sm text-white/40">Drop file here or click to browse</p>
                                                </div>
                                            </div>
                                            {errors.pitchDeck && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.pitchDeck}</p>}
                                            <p className="text-[11px] text-white/40 mt-2 ml-1 leading-relaxed">
                                                Provides a concise overview (10-15 slides) covering team, problem, solution, market, business model, and financials.
                                                <Link href="/apply/materials#pitch-deck" target="_blank" className="text-vc-mint hover:underline font-medium ml-1">Need more info?</Link>
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-base font-medium text-white/70">
                                                Executive Summary <span className="text-vc-mint">*</span>
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.docx"
                                                    onChange={(e) => {
                                                        setFiles({ ...files, execSummary: e.target.files?.[0] || null });
                                                        if (errors.execSummary) setErrors(prev => ({ ...prev, execSummary: '' }));
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.execSummary ? 'border-vc-mint bg-vc-mint/5' : errors.execSummary ? 'border-vc-mint bg-vc-mint/5' : 'border-white/10 bg-white/5 group-hover:border-vc-mint/50'}`}>
                                                    <FileText className={`w-8 h-8 ${files.execSummary ? 'text-vc-mint' : errors.execSummary ? 'text-vc-mint' : 'text-white/20'}`} />
                                                    <p className="text-base font-medium">{files.execSummary ? files.execSummary.name : 'Upload Executive Summary'}</p>
                                                    <p className="text-sm text-white/40">Drop file here or click to browse</p>
                                                </div>
                                            </div>
                                            {errors.execSummary && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.execSummary}</p>}
                                            <p className="text-[11px] text-white/40 mt-2 ml-1 leading-relaxed">
                                                A 1-2 page standalone document summarizing the full business case, innovation, market opportunity, and impact.
                                                <Link href="/apply/materials#executive-summary" target="_blank" className="text-vc-mint hover:underline font-medium ml-1">Need more info?</Link>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70 flex items-center gap-2">
                                            <Video className="w-4 h-4 text-vc-mint" />
                                            Video Pitch <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoPitchUrl}
                                            onChange={(e) => {
                                                setFormData({ ...formData, videoPitchUrl: e.target.value });
                                                if (errors.videoPitchUrl) setErrors(prev => ({ ...prev, videoPitchUrl: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.videoPitchUrl ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="https://youtube.com/..."
                                        />
                                        {errors.videoPitchUrl && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.videoPitchUrl}</p>}
                                        <p className="text-[11px] text-white/40 mt-2 ml-1 leading-relaxed">
                                            A 3-5 minute unlisted YouTube video where the team leader or at least one co-founder appears and presents the pitch deck.
                                            <Link href="/apply/materials#video-pitch" target="_blank" className="text-vc-mint hover:underline font-medium ml-1">Need more info?</Link>
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">Supporting Data</label>
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
                                                    <p className="text-sm text-white/40">Optional technical documents</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-white/40 mt-2 ml-1 leading-relaxed">
                                            Optional additional proof of concept, technical validation, or detailed data (max 5 pages).
                                            <Link href="/apply/materials#supporting-data" target="_blank" className="text-vc-mint hover:underline font-medium ml-1">Need more info?</Link>
                                        </p>
                                    </div>

                                    <div className="space-y-6 mt-12">
                                        <label className="block text-base font-medium text-white/70">
                                            How did you hear about us? <span className="text-vc-mint">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <SimpleDropdown
                                                label="Referral Source *"
                                                placeholder="Select source..."
                                                options={["Colleagues", "Social Media", "Ambassadors", "Other"]}
                                                value={formData.referralSource}
                                                onChange={(val) => setFormData({ ...formData, referralSource: val })}
                                            />

                                            {formData.referralSource === "Social Media" && (
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Specify Platform <span className="text-vc-mint">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={formData.referralPlatform}
                                                        onChange={(e) => setFormData({ ...formData, referralPlatform: e.target.value })}
                                                        placeholder="e.g., LinkedIn, Instagram"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                                    />
                                                </div>
                                            )}

                                            {formData.referralSource === "Ambassadors" && (
                                                <>
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Ambassador ID</label>
                                                        <input
                                                            type="text"
                                                            value={formData.referralAmbassadorId}
                                                            onChange={(e) => setFormData({ ...formData, referralAmbassadorId: e.target.value })}
                                                            placeholder="ID (if known)"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Ambassador Name</label>
                                                        <input
                                                            type="text"
                                                            value={formData.referralAmbassadorName}
                                                            onChange={(e) => setFormData({ ...formData, referralAmbassadorName: e.target.value })}
                                                            placeholder="Full Name (if ID unknown)"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-vc-mint transition-colors"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`glass-panel p-6 border transition-all ${errors.agreedToTerms ? 'border-vc-mint bg-vc-mint/10' : 'border-vc-mint/30 bg-vc-mint/5'}`}>
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                id="final-agreement"
                                                checked={formData.agreedToTerms}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, agreedToTerms: e.target.checked });
                                                    if (errors.agreedToTerms) setErrors(prev => ({ ...prev, agreedToTerms: '' }));
                                                }}
                                                className="mt-1 w-6 h-6 rounded border-vc-mint/50 bg-white/5 text-vc-mint focus:ring-vc-mint focus:ring-offset-0 cursor-pointer"
                                            />
                                            <label htmlFor="final-agreement" className="text-base text-white/80 leading-relaxed cursor-pointer select-none">
                                                I have read, understood and agree to the <button onClick={(e) => { e.preventDefault(); setIsTermsOpen(true); }} className="text-vc-mint hover:underline font-bold decoration-vc-mint/30">Terms and Conditions</button> of the Venture Craft Competition. I confirm that all information provided is accurate and complete.
                                            </label>
                                        </div>
                                        {errors.agreedToTerms && <p className="text-xs text-vc-mint/80 mt-2 ml-10 font-medium">{errors.agreedToTerms}</p>}
                                    </div>

                                    <div className="flex justify-between pt-8">
                                        <button onClick={prevStep} className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                                            <ArrowLeft className="w-5 h-5" />
                                            <span>Back</span>
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
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
                                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
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
                                        <h3 className="text-base md:text-lg text-vc-mint font-bold italic flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-vc-mint/10 flex items-center justify-center not-italic text-sm">{i + 1}</span>
                                            {term.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-white/70 leading-relaxed pl-11">
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
        </main>
    );
}

export default function ApplyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint/20 border-t-vc-mint rounded-full animate-spin" />
            </div>
        }>
            <ApplyPageContent />
        </Suspense>
    );
}
