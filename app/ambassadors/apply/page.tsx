'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Users, Rocket, Globe, AlertCircle, ChevronDown, Search, X, GraduationCap, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { countries } from '@/lib/countries';

// Custom Dropdown Component (Identical to competition apply page)
function FlagDropdown({
    options,
    value,
    onChange,
    label,
    placeholder = "Select...",
    type = 'country'
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
            {label && (
                <label className="block text-base font-medium text-white/70">
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
                            <span className="text-white text-base">
                                {type === 'country' ? (
                                    <span className="hidden sm:inline">{selectedOption.name}</span>
                                ) : selectedOption.dialCode}
                                {type === 'country' && <span className="sm:hidden">{selectedOption.code.toUpperCase()}</span>}
                            </span>
                        </>
                    ) : (
                        <span className="text-white/40 text-base">{placeholder}</span>
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

function ApplicationFormContent() {
    const [step, setStep] = useState(1);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    // Ambassador Form State
    const [formData, setFormData] = useState({
        name: '',
        nationality: 'Saudi Arabia',
        email: '',
        phoneCode: '+966',
        phone: '',
        university: '',
        major: '',
        degree: '',
        socialMedia: '',
        reason: '',
        experience: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/signin?redirect=${encodeURIComponent('/ambassadors/apply')}`);
        }
    }, [user, authLoading, router]);

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Please enter your name.";
        if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = "Please enter a valid email.";
        if (formData.phone.length < 9) newErrors.phone = "Please check the phone number.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.university.trim()) newErrors.university = "Please enter your university.";
        if (!formData.major.trim()) newErrors.major = "Please enter your major.";
        if (!formData.degree) newErrors.degree = "Please select your degree.";
        if (!formData.socialMedia.trim()) newErrors.socialMedia = "Please enter your social media profile URL.";
        if (!formData.reason.trim()) newErrors.reason = "Please tell us why you want to join.";
        if (!formData.experience.trim()) newErrors.experience = "Please tell us about your experience.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        setStep(prev => Math.min(prev + 1, 2));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;
        setLoading(true);

        try {
            const CombinedPhone = `${formData.phoneCode} ${formData.phone}`;
            const applicationRef = doc(db, 'ambassador_applications', user.uid);

            await setDoc(applicationRef, {
                userId: user.uid,
                status: 'pending',
                submittedAt: serverTimestamp(),
                ...formData,
                phone: CombinedPhone
            });

            // Send Confirmation Email
            try {
                await fetch('/api/send-ambassador-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                    }),
                });
            } catch (emailErr) {
                console.error('Failed to send ambassador confirmation email:', emailErr);
            }

            setIsSuccessOpen(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex items-center justify-center mb-12">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= i ? 'border-vc-mint bg-vc-mint text-vc-green-dark' : 'border-white/20 text-white/40'}`}>
                            {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                        </div>
                        {i < 2 && (
                            <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${step > i ? 'bg-vc-mint' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#001311] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-vc-mint/20 border-t-vc-mint rounded-full animate-spin" />
                <p className="text-vc-mint/60 font-medium animate-pulse">Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-vc-teal/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10 min-h-[calc(100vh-200px)]">
                {step === 1 && (
                    <Link href="/ambassadors" className="inline-flex items-center gap-2 text-vc-mint/60 hover:text-vc-mint transition-colors mb-8 group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Go Back</span>
                    </Link>
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
                        Ambassador Registration
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto mb-4">
                        Please fill out all the required information to join the Venture Craft Ambassadors Program.
                    </p>
                    <p className="text-sm text-white/40 flex items-center justify-center gap-1.5">
                        <span className="text-vc-mint">*</span> Indicates a required field
                    </p>
                </div>

                {renderStepIndicator()}

                <div className="glass-panel p-8 md:p-12">
                    <AnimatePresence mode="wait">
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
                                    <h2 className="text-2xl font-bold">About you</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            1. Your name <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.name ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="Enter your answer"
                                        />
                                        {errors.name && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <FlagDropdown
                                            options={countries}
                                            value={formData.nationality}
                                            onChange={(val) => setFormData({ ...formData, nationality: val })}
                                            label="2. Nationality *"
                                            type="country"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            3. Email <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => {
                                                setFormData({ ...formData, email: e.target.value });
                                                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.email ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="Please enter an email"
                                        />
                                        {errors.email && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            4. Phone number <span className="text-vc-mint">*</span>
                                        </label>
                                        <div className={`flex items-center bg-white/5 border rounded-xl transition-all ${errors.phone ? 'border-vc-mint' : 'border-white/10 focus-within:border-vc-mint'}`}>
                                            <div className="w-[100px] border-r border-white/10">
                                                <FlagDropdown
                                                    options={countries}
                                                    value={formData.phoneCode}
                                                    onChange={(val) => setFormData({ ...formData, phoneCode: val })}
                                                    type="phone"
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="512345678"
                                                value={formData.phone}
                                                maxLength={9}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    if (val.length <= 9) {
                                                        setFormData({ ...formData, phone: val });
                                                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                                    }
                                                }}
                                                className="flex-1 bg-transparent border-none px-4 py-3.5 focus:outline-none focus:ring-0 text-white placeholder:text-white/20"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.phone}</p>}
                                    </div>
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
                                        <GraduationCap className="text-vc-mint w-5 h-5" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Education & Socials</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            5. University <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.university}
                                            onChange={(e) => {
                                                setFormData({ ...formData, university: e.target.value });
                                                if (errors.university) setErrors(prev => ({ ...prev, university: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.university ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="Enter your university"
                                        />
                                        {errors.university && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.university}</p>}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-base font-medium text-white/70">
                                            6. Major <span className="text-vc-mint">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.major}
                                            onChange={(e) => {
                                                setFormData({ ...formData, major: e.target.value });
                                                if (errors.major) setErrors(prev => ({ ...prev, major: '' }));
                                            }}
                                            className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.major ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                            placeholder="Enter your major"
                                        />
                                        {errors.major && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.major}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-base font-medium text-white/70">
                                        7. DEGREE <span className="text-vc-mint">*</span>
                                    </label>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border transition-all ${errors.degree ? 'border-vc-mint bg-vc-mint/5' : 'border-white/5'}`}>
                                        {['Bachelor', 'Master', 'PhD', 'Other'].map((d) => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, degree: d });
                                                    if (errors.degree) setErrors(prev => ({ ...prev, degree: '' }));
                                                }}
                                                className={`p-4 rounded-xl border text-left transition-all ${formData.degree === d ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.degree && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.degree}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-base font-medium text-white/70 flex items-center gap-2">
                                        <Share2 className="w-4 h-4 text-vc-mint" />
                                        8. Social media (X, LinkedIn, Instagram) <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.socialMedia}
                                        onChange={(e) => {
                                            setFormData({ ...formData, socialMedia: e.target.value });
                                            if (errors.socialMedia) setErrors(prev => ({ ...prev, socialMedia: '' }));
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.socialMedia ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                        placeholder="Enter your social media URL"
                                    />
                                    {errors.socialMedia && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.socialMedia}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-base font-medium text-white/70">
                                        9. Why do you want to be a Venture Craft Ambassador? <span className="text-vc-mint">*</span>
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => {
                                            setFormData({ ...formData, reason: e.target.value });
                                            if (errors.reason) setErrors(prev => ({ ...prev, reason: '' }));
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors min-h-[120px] resize-none ${errors.reason ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                        placeholder="Tell us what motivates you to join the program..."
                                    />
                                    {errors.reason && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.reason}</p>}
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-base font-medium text-white/70">
                                        10. Tell us about your relevant experience (Clubs, Communities, Startups) <span className="text-vc-mint">*</span>
                                    </label>
                                    <textarea
                                        value={formData.experience}
                                        onChange={(e) => {
                                            setFormData({ ...formData, experience: e.target.value });
                                            if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
                                        }}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 focus:outline-none transition-colors min-h-[120px] resize-none ${errors.experience ? 'border-vc-mint' : 'border-white/10 focus:border-vc-mint'}`}
                                        placeholder="Share your background and any relevant initiatives you've been part of..."
                                    />
                                    {errors.experience && <p className="text-xs text-vc-mint/80 mt-1 ml-1">{errors.experience}</p>}
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
                                                <span>Register Now</span>
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

            {/* Success Modal (Identical to competition apply page) */}
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
                                    Your application for the Venture Craft Ambassadors Program has been successfully received.
                                </p>
                                <div className="bg-vc-mint/5 border border-vc-mint/10 rounded-2xl p-4 inline-block">
                                    <p className="text-vc-mint text-sm font-medium flex items-center justify-center gap-2 text-center">
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span>A confirmation email has been sent to your inbox.</span>
                                    </p>
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => router.push('/ambassadors')}
                                className="btn-primary !w-full !py-4 !rounded-2xl flex items-center justify-center gap-2 hover:shadow-vc-mint/30 transition-all font-bold text-lg"
                            >
                                <span>Back to Ambassadors</span>
                                <Rocket className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

export default function AmbassadorApplyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#001311] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-vc-mint/20 border-t-vc-mint rounded-full animate-spin" />
            </div>
        }>
            <ApplicationFormContent />
        </Suspense>
    );
}
