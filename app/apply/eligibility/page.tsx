'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { motion } from 'framer-motion';

const eligibilityCriteria = [
    {
        category: 'Theme',
        requirement: (
            <div className="space-y-2">
                <p>This year's challenge focuses on <strong className="text-vc-mint font-bold uppercase tracking-wider">Sustainable Energy</strong>.</p>
                <p>We are looking for deep-tech solutions that power the future responsibly.</p>
            </div>
        ),
        notes: 'Aligns with the global mission for sustainability.'
    },
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
            <span>
                All team members must be <strong className="text-vc-mint">actively pursuing or have completed</strong> an undergraduate (bachelor’s) degree.
            </span>
        ),
        notes: 'Focuses on qualified candidates.'
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

const additionalPoints = [
    { title: 'IP / Ownership', detail: 'Teams must hold or legally control any intellectual property related to their submission.', reason: 'Protects originality and prevents disputes.' },
    { title: 'One-Entry Rule', detail: 'Each participant may join only one team.', reason: 'Prevents duplication and ensures fair participation.' },
    { title: 'Code of Conduct', detail: 'All team members must accept the official competition rules and code of conduct.', reason: 'Maintains professionalism and integrity.' },
    { title: 'Conflict of Interest', detail: 'Teams must disclose any existing mentor, investor, or organizational relationships with judges or organizers.', reason: 'Ensures impartial evaluation.' },
];

export default function EligibilityPage() {
    return (
        <main className="min-h-screen bg-[#001311] text-white pt-24 md:pt-40 relative overflow-x-hidden">
            <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-vc-mint/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 pb-24 relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight">Application Details & Criteria</h1>
                    <p className="text-white/60 max-w-xl mx-auto">Review the eligibility criteria and competition rules before you begin your journey.</p>
                </div>





                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                            <div className="w-2 h-8 bg-vc-mint rounded-full" />
                            Eligibility Criteria
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {eligibilityCriteria.map((item, idx) => (
                                <div key={idx} className="glass-panel p-6 flex flex-col md:flex-row md:items-start gap-6 group hover:border-vc-mint/30 transition-all">
                                    <div className="md:w-1/4">
                                        <h4 className="text-2xl font-bold text-vc-mint uppercase tracking-tight">{item.category}</h4>
                                    </div>
                                    <div className="md:w-1/2 text-white/80 text-lg leading-relaxed">
                                        {item.requirement}
                                    </div>
                                    <div className="md:w-1/4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                        <p className="text-white/40 text-base italic">{item.notes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                            <div className="w-2 h-8 bg-vc-mint rounded-full" />
                            Important Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {additionalPoints.map((item, idx) => (
                                <div key={idx} className="glass-panel p-6 space-y-3 group hover:border-vc-mint/30 transition-all">
                                    <h4 className="font-bold text-white uppercase tracking-tight flex items-center gap-2">
                                        <div className="w-1 h-4 bg-vc-mint/50 rounded-full" />
                                        {item.title}
                                    </h4>
                                    <p className="text-white/80 text-base leading-relaxed">{item.detail}</p>
                                    <p className="text-white/30 text-base italic border-t border-white/5 pt-3">{item.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </main>
    );
}
