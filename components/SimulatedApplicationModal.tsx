'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Rocket, FileText, CheckCircle, ArrowRight, ArrowLeft, Globe, Mail, Phone, ShieldCheck, ExternalLink, Video, Link as LinkIcon, Upload, AlertCircle } from 'lucide-react';
import { simulatedApplication } from '@/lib/simulated-application-sample';

interface SimulatedApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SimulatedApplicationModal({ isOpen, onClose }: SimulatedApplicationModalProps) {
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const renderStepIndicator = () => {
        return (
            <div className="flex items-center justify-center mb-12">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-500 ${step >= i ? 'bg-vc-mint text-vc-green-dark shadow-[0_0_20px_rgba(79,209,197,0.4)]' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                            {i}
                        </div>
                        {i < 3 && (
                            <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${step > i ? 'bg-vc-mint' : 'bg-white/10'}`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#001311]/95 backdrop-blur-xl"
                />

                {/* Modal Content - Replicating app/apply/page.tsx layout */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-[#001311] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col pt-20"
                >
                    {/* Header Fixed Area */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-white/5 backdrop-blur-md border-b border-white/5 z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-vc-mint/20 flex items-center justify-center">
                                <Rocket className="w-4 h-4 text-vc-mint" />
                            </div>
                            <span className="text-sm font-bold text-white uppercase tracking-widest">Simulation: Filled Application Form</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Example Application</span>
                                <span className="text-xs text-vc-mint font-bold italic">Venture Craftee</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6 text-white/40" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pt-10 pb-20 px-6 md:px-12">
                        <div className="max-w-3xl mx-auto">

                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold font-poppins text-white mb-2 uppercase tracking-tight">Venture Craftee Application</h2>
                                <p className="text-sm text-vc-mint font-bold uppercase tracking-[0.2em] opacity-80">Screening Status: Approved</p>
                            </div>

                            {renderStepIndicator()}

                            <div className="glass-panel p-8 md:p-10 border-white/10 bg-white/[0.02] shadow-2xl">
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
                                                <h2 className="text-2xl font-bold">Personal & Demographic Information</h2>
                                            </div>

                                            <div className="space-y-4 max-w-xs">
                                                <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                                    <Users className="w-3 h-3 text-vc-mint" />
                                                    Team size (including leader)
                                                </label>
                                                <input readOnly value={simulatedApplication.teamSize} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default" />
                                                <p className="text-base text-white/30 uppercase tracking-widest">No maximum limit</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Leader Personal Email Address <span className="text-vc-mint">*</span></label>
                                                    <input readOnly value={simulatedApplication.leaderEmail} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Leader Phone Number <span className="text-vc-mint">*</span></label>
                                                    <input readOnly value={simulatedApplication.leaderPhone} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default" />
                                                </div>

                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Audience Category *</label>
                                                    <input readOnly value={simulatedApplication.audienceCategory} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default" />
                                                    <p className="text-sm text-white/40 italic">
                                                        This helps us understand your team's background and alignment with the targeted audience.
                                                    </p>
                                                </div>

                                                <div className="md:col-span-2 space-y-4">
                                                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                                                        <ShieldCheck className="w-3 h-3 text-vc-mint" />
                                                        Eligibility Evidence <span className="text-vc-mint">*</span>
                                                    </label>
                                                    <div className="p-6 rounded-2xl border border-vc-mint bg-vc-mint/5 flex items-center gap-4">
                                                        <ShieldCheck className="w-6 h-6 text-vc-mint" />
                                                        <div>
                                                            <p className="text-sm font-medium">{simulatedApplication.eligibilityProofName}</p>
                                                            <p className="text-sm text-white/40">Verified Document (PDF)</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
                                                <h3 className="text-sm font-black text-vc-mint uppercase tracking-widest flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    Team Members Details
                                                </h3>
                                                {simulatedApplication.teamMembers.map((member, idx) => (
                                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">{idx === 0 ? 'Team Leader Full Name' : `Member ${idx + 1} Full Name`} <span className="text-vc-mint">*</span></p>
                                                            <p className="text-white font-medium">{member.name}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">{idx === 0 ? 'Leader Nationality *' : 'Nationality *'}</p>
                                                            <p className="text-white font-medium">{member.nationality}</p>
                                                        </div>
                                                        {idx === 0 && (
                                                            <div className="md:col-span-2 space-y-2 mt-2">
                                                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Leader Current Location (Residing) *</p>
                                                                <p className="text-white font-medium">{simulatedApplication.leaderLocation}</p>
                                                                <p className="text-[10px] text-white/40 italic">Note: Current location refers to where you are physically residing at this time.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-vc-mint/5 border border-vc-mint/20">
                                                    <CheckCircle className="w-5 h-5 text-vc-mint shrink-0 mt-0.5" />
                                                    <span className="text-sm text-white/80">I confirm that all team members are 18 years of age or older at the time of application.</span>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-vc-mint/5 border border-vc-mint/20">
                                                    <CheckCircle className="w-5 h-5 text-vc-mint shrink-0 mt-0.5" />
                                                    <span className="text-sm text-white/80">I confirm that the team leader and/or co-founders are either actively pursuing or have completed an undergraduate degree.</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-8">
                                                <button onClick={() => setStep(2)} className="bg-vc-mint text-vc-green-dark px-8 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                                                    Next Step <ArrowRight className="w-4 h-4" />
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
                                                <label className="block text-base font-medium text-white/70">Startup / Project Name <span className="text-vc-mint">*</span></label>
                                                <input readOnly value={simulatedApplication.startupName} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default font-bold text-lg" />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-base font-medium text-white/70">Startup Location <span className="text-vc-mint">*</span></label>
                                                <input readOnly value={simulatedApplication.location} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default" />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-base font-medium text-white/70">
                                                    Which of the following pillars does your startup most closely align with? <span className="text-vc-mint">*</span>
                                                </label>
                                                <p className="text-sm text-white/50 mb-3 mt-1">
                                                    The theme for this year is <span className="text-vc-mint font-bold uppercase tracking-wide">Sustainable Energy</span>.
                                                </p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                                                    {[
                                                        'Decarbonization Technologies',
                                                        'Circular Economy & Resource Efficiency',
                                                        'Energy Efficiency',
                                                        'Process Optimization & Advanced Engineering'
                                                    ].map((p) => {
                                                        const isSelected = simulatedApplication.pillar.includes(p) || p === 'Energy Efficiency'; // Logic to highlight the sample pillar
                                                        return (
                                                            <div
                                                                key={p}
                                                                className={`p-4 h-full flex items-center rounded-xl border text-left transition-all ${isSelected ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                                            >
                                                                {p}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="block text-base font-medium text-white/70">Is your startup older than 5 years? <span className="text-vc-mint">*</span></label>
                                                    <div className="flex gap-4">
                                                        {['Yes', 'No'].map((opt) => (
                                                            <div
                                                                key={opt}
                                                                className={`px-8 py-3 rounded-xl border transition-all ${simulatedApplication.isOlderThan5Years === opt ? 'border-vc-mint bg-vc-mint/10 text-vc-mint' : 'border-white/10 bg-white/5 text-white/60'}`}
                                                            >
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="block text-base font-medium text-white/70">Startup Stage *</label>
                                                    <input readOnly value={simulatedApplication.stage} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white cursor-default border-vc-mint/50 font-bold" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="block text-base font-medium text-white/70 flex items-center gap-2">
                                                    Conflict of Interest Declaration
                                                </label>
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 leading-relaxed italic">
                                                    {simulatedApplication.conflictOfInterest}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="block text-base font-medium text-white/70">Startup Website</label>
                                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 flex items-center justify-between">
                                                        <span className="truncate">{simulatedApplication.website}</span>
                                                        <ExternalLink className="w-3.5 h-3.5 text-vc-mint" />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="block text-base font-medium text-white/70">LinkedIn Page</label>
                                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 flex items-center justify-between">
                                                        <span className="truncate">{simulatedApplication.linkedin}</span>
                                                        <ExternalLink className="w-3.5 h-3.5 text-vc-mint" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-8">
                                                <button onClick={() => setStep(1)} className="text-white/40 font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                                                    <ArrowLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button onClick={() => setStep(3)} className="bg-vc-mint text-vc-green-dark px-8 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                                                    Next Step <ArrowRight className="w-4 h-4" />
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
                                                <div className="space-y-3">
                                                    <p className="text-base font-medium text-white/70">Pitch Deck <span className="text-vc-mint">*</span></p>
                                                    <div className="p-6 rounded-2xl border border-vc-mint bg-vc-mint/5 flex items-center gap-3">
                                                        <CheckCircle className="w-5 h-5 text-vc-mint" />
                                                        <span className="text-sm text-white/80 font-medium truncate">{simulatedApplication.pitchDeckName}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-base font-medium text-white/70">Executive Summary <span className="text-vc-mint">*</span></p>
                                                    <div className="p-6 rounded-2xl border border-vc-mint bg-vc-mint/5 flex items-center gap-3">
                                                        <CheckCircle className="w-5 h-5 text-vc-mint" />
                                                        <span className="text-sm text-white/80 font-medium truncate">{simulatedApplication.execSummaryName}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-base font-medium text-white/70 flex items-center gap-2">
                                                    <Video className="w-4 h-4 text-vc-mint" />
                                                    Video Pitch <span className="text-vc-mint">*</span>
                                                </p>
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-white/40 italic text-sm">
                                                    <span className="truncate">Unlisted YouTube Link: {simulatedApplication.videoPitchUrl}</span>
                                                    <Video className="w-4 h-4 text-vc-mint" />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <p className="text-base font-medium text-white/70">Supporting Data</p>
                                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-white/40 italic text-sm">
                                                    <FileText className="w-4 h-4" />
                                                    {simulatedApplication.supportingDataName}
                                                </div>
                                            </div>

                                            <div className="pt-6 space-y-4">
                                                <div className="p-6 bg-vc-mint/5 border border-vc-mint/20 rounded-2xl flex items-start gap-4">
                                                    <CheckCircle className="w-6 h-6 text-vc-mint shrink-0 mt-1" />
                                                    <p className="text-sm text-white/80 leading-relaxed">
                                                        I have read, understood and agree to the <span className="text-vc-mint font-bold">Terms and Conditions</span> of the Venture Craft Competition. I confirm that all information provided is accurate and complete.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-vc-mint/5 border border-vc-mint/20 rounded-2xl flex items-start gap-4 shadow-[0_0_20px_rgba(79,209,197,0.05)] border-t-4">
                                                <Rocket className="w-6 h-6 text-vc-mint shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-wider mb-1">Final Submission Success</p>
                                                    <p className="text-xs text-white/50 leading-relaxed italic">Application submitted successfully. All materials verified by the competition committee for technical alignment.</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-8">
                                                <button onClick={() => setStep(2)} className="text-white/40 font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                                                    <ArrowLeft className="w-4 h-4" /> Back
                                                </button>
                                                <button onClick={onClose} className="bg-white/10 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-all border border-white/10">
                                                    Close Simulation
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 bg-white/[0.03] border-t border-white/5 flex items-center justify-center">
                        <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-[0.3em]">Premium Case Study • Venture Craftee Interactive Example</p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
