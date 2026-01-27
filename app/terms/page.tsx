'use client';

import { motion } from 'framer-motion';
import { FileText, ArrowLeft, ShieldCheck, Scale, Gavel } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
    const terms = [
        { title: "Acceptance", content: "These terms and conditions constitute a legally binding agreement between Venture Craft (hereinafter referred to as “competition”, “we”, “us”, or “our”) and each individual member of the applicant team (hereinafter collectively or individually referred to as “participant”, “you” or “your”). By submitting an application, registering for, or participating in the competition, you accept and agree to comply with this agreement in full." },
        { title: "Accuracy of Information", content: "You agree to provide information that is accurate, current, and complete at all times. You further agree to promptly update any information that becomes inaccurate or incomplete during the competition." },
        { title: "Decisions", content: "Applications, pitches, and submissions may be evaluated by judges or selection methods determined by the competition. All judging and selection decisions are final and binding." },
        { title: "Intellectual Property", content: "The participant is solely responsible for the protection of their own intellectual property. The participant grants Venture Craft a non-exclusive, royalty-free, worldwide license to use submitted materials for administering, judging, and promoting the competition." },
        { title: "Confidentiality", content: "Venture Craft does not treat any submissions as confidential unless expressly agreed otherwise in writing. Participants are solely responsible for protecting sensitive information." },
        { title: "Publicity", content: "Venture Craft may use team names, startup names, logos, and recordings created in connection with the competition for promotional purposes in any media without additional compensation." },
        { title: "Travel and Expenses", content: "Participants are solely responsible for obtaining required visas. Venture Craft is not liable for costs beyond those expressly agreed in writing." },
        { title: "Disqualification", content: "Venture Craft reserves the right to disqualify any participant at any stage where these terms and conditions are not complied with." },
        { title: "Limitation of Liability", content: "Venture Craft and its partners shall not be liable for any loss, damage, or injury arising out of participation in the competition. Participation does not guarantee funding or selection." },
        { title: "Modifications", content: "Venture Craft reserves the right to amend these terms and conditions or modify the structure of the competition at any time. Continued participation constitutes acceptance of changes." },
        { title: "Governing Law", content: "These terms and conditions are governed by and construed in accordance with the laws of the Kingdom of Saudi Arabia." },
    ];

    return (
        <main className="min-h-screen bg-[#001311] text-white pt-32 pb-24 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(79,209,197,0.08),transparent_50%)] pointer-events-none" />

            <div className="container max-w-4xl mx-auto px-6 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-vc-mint/60 hover:text-vc-mint transition-colors mb-12 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>

                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-vc-mint/10 flex items-center justify-center">
                            <ShieldCheck className="text-vc-mint w-7 h-7" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-poppins">Terms & Conditions</h1>
                    </div>
                    <p className="text-white/60 text-lg">
                        Last Updated: January 2026. Please read these terms carefully before participating in the Venture Craft Competition.
                    </p>
                </div>

                <div className="space-y-10">
                    {terms.map((term, i) => (
                        <motion.section
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-panel p-8 relative overflow-hidden group hover:border-vc-mint/20 transition-all"
                        >
                            <div className="flex items-start gap-5">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-vc-mint/10 text-vc-mint font-bold flex items-center justify-center text-lg">
                                    {i + 1}
                                </span>
                                <div className="space-y-3">
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{term.title}</h2>
                                    <p className="text-white/70 leading-relaxed text-sm md:text-base">
                                        {term.content}
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                <div className="mt-16 pt-12 border-t border-white/10 text-center">
                    <p className="text-white/40 text-sm mb-8">
                        By using the Venture Craft platform or submitting an application, you agree to these terms in full.
                    </p>
                    <Link href="/apply" className="btn-primary !px-12 !py-4 !rounded-2xl inline-flex items-center gap-3 group">
                        <span>Apply for Competition</span>
                        <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </main>
    );
}
