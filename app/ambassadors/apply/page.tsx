'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, ChevronDown, Search, Globe, AlertCircle, UserPlus, Instagram, Linkedin, Twitter, Phone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { countries } from '@/lib/countries';

// Custom Dropdown Component (Repurposed from competition apply page)
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
                                    <span>{selectedOption.name}</span>
                                ) : selectedOption.dialCode}
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
                                            <span className="text-base text-white/80 group-hover:text-white truncate max-w-[150px]">{opt.name}</span>
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

export default function AmbassadorApplyPage() {
    const [formData, setFormData] = useState({
        name: '',
        nationality: 'Saudi Arabia',
        email: '',
        phoneCode: '+966',
        phone: '',
        university: '',
        major: '',
        degree: '',
        socialMedia: ''
    });

    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

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

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Please enter your name.";
        if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = "Please enter a valid email.";
        if (formData.phone.length < 9) newErrors.phone = "Please enter a valid phone number.";
        if (!formData.university.trim()) newErrors.university = "Please enter your university.";
        if (!formData.major.trim()) newErrors.major = "Please enter your major.";
        if (!formData.degree) newErrors.degree = "Please select your degree.";
        if (!formData.socialMedia.trim()) newErrors.socialMedia = "Please enter your social media profile URL.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
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

            setIsSuccessOpen(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <div className="min-h-screen bg-[#001D1B] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-vc-mint border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#001D1B] text-white selection:bg-vc-mint/30">
            <Navbar />

            <div className="relative pt-32 pb-24 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-vc-mint/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-vc-teal/10 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <Link
                                href="/ambassadors"
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <h1 className="text-3xl md:text-5xl font-bold font-poppins text-balance">
                                Become an <span className="text-vc-mint">Ambassador</span>
                            </h1>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative group">
                            {/* Form Header */}
                            <div className="mb-12">
                                <span className="text-vc-mint/60 text-sm font-bold tracking-[0.2em] uppercase mb-2 block">Registration Form</span>
                                <h2 className="text-2xl font-bold font-poppins">About you</h2>
                                <p className="text-white/40 mt-2">Please fill in your details accurately.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* 1. Your Name */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        1. Your name <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your answer"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                    />
                                    {errors.name && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                                </div>

                                {/* 2. Nationality */}
                                <FlagDropdown
                                    label="2. Nationality *"
                                    options={countries}
                                    value={formData.nationality}
                                    onChange={(val) => setFormData({ ...formData, nationality: val })}
                                />

                                {/* 3. Email */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        3. Email <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Please enter an email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                    />
                                    {errors.email && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                                </div>

                                {/* 4. Phone Number */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        4. Phone number <span className="text-vc-mint">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="w-[120px] shrink-0">
                                            <FlagDropdown
                                                options={countries}
                                                value={formData.phoneCode}
                                                onChange={(val) => setFormData({ ...formData, phoneCode: val })}
                                                type="phone"
                                            />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="5XXXXXXXX"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
                                </div>

                                {/* 5. University */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        5. University <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.university}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                        placeholder="Enter your answer"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                    />
                                    {errors.university && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.university}</p>}
                                </div>

                                {/* 6. Major */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        6. Major <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.major}
                                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                        placeholder="Enter your answer"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                    />
                                    {errors.major && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.major}</p>}
                                </div>

                                {/* 7. Degree */}
                                <SimpleDropdown
                                    label="7. DEGREE *"
                                    options={["Bachelor", "Master", "PhD", "Other"]}
                                    value={formData.degree}
                                    onChange={(val) => setFormData({ ...formData, degree: val })}
                                />

                                {/* 8. Social Media */}
                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-white/70">
                                        8. Social meadia(x,Linkdin,Instagram) <span className="text-vc-mint">*</span>
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.socialMedia}
                                        onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                                        placeholder="Please enter a URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-vc-mint/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                    />
                                    {errors.socialMedia && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.socialMedia}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-vc-mint text-[#001D1B] font-bold text-lg rounded-xl transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,209,197,0.3)] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-12"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-[#001D1B] border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Register Now
                                            <UserPlus className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {isSuccessOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#002B28] border border-vc-mint/20 rounded-[2.5rem] p-12 text-center max-w-lg relative z-10 shadow-3xl"
                        >
                            <div className="w-20 h-20 bg-vc-mint/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-10 h-10 text-vc-mint" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4 font-poppins">Registration Successful!</h2>
                            <p className="text-white/60 text-lg mb-10 leading-relaxed font-poppins">
                                Thank you for applying to the Venture Craft Ambassadors Program. Our team will review your application and get back to you soon.
                            </p>
                            <button
                                onClick={() => router.push('/ambassadors')}
                                className="w-full py-4 bg-vc-mint text-[#001D1B] font-bold text-lg rounded-xl transition-all hover:bg-white"
                            >
                                Back to Ambassadors
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
