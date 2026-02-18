'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { motion } from 'framer-motion';
import { GraduationCap, Microscope, Briefcase, Rocket, ShieldCheck } from 'lucide-react';

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
            <div className="space-y-2">
                <p>All team members must be <strong className="text-vc-mint font-bold">actively pursuing or have completed</strong> an undergraduate (bachelor’s) degree.</p>
                <div className="pt-2 border-t border-white/5 mt-2">
                    <p className="text-sm text-white/60">For graduates, the focus is on <strong className="text-white">Fresh Graduates (0–5 years)</strong> and <strong className="text-white">Early-Career Researchers (≤3 years experience)</strong>.</p>
                </div>
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
    {
        category: 'Team Composition',
        requirement: (
            <div className="space-y-2">
                <p>There is <strong className="text-vc-mint">no minimum or maximum limit</strong> on the number of team members.</p>
                <p>You may apply as a solo founder or as a team of any size.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, please note that if your team is selected as a finalist, only a maximum of 5 members will be able to represent the startup in the final competition.</p>
            </div>
        ),
        notes: 'Encourages both individual innovators and large collaborative teams.'
    }
];

const additionalPoints = [
    { title: 'IP / Ownership', detail: 'Teams must hold or legally control any intellectual property related to their submission.', reason: 'Protects originality and prevents disputes.' },
    { title: 'One-Entry Rule', detail: 'Each participant may join only one team.', reason: 'Prevents duplication and ensures fair participation.' },
    { title: 'Code of Conduct', detail: 'All team members must accept the official competition rules and code of conduct.', reason: 'Maintains professionalism and integrity.' },
    { title: 'Conflict of Interest', detail: 'Teams must disclose any existing mentor, investor, or organizational relationships with judges or organizers.', reason: 'Ensures impartial evaluation.' },
];

const targetAudience = [
    {
        category: 'Fresh STEM Graduates',
        description: 'Individuals who have graduated from technical universities within the last 0–5 years.',
        profile: 'Often motivated to prove their innovation and looking for high-impact opportunities.',
        evidence: 'Graduation Certificate, Official Transcript, or Degree Completion Letter.'
    },
    {
        category: 'Postdocs & Researchers',
        description: 'Individuals or research assistants who have developed tangible results, prototypes, or new methods.',
        profile: 'Highly capable of leading technical ventures with proper commercialization support.',
        evidence: 'Affiliation Letter, Research Contract, or Official Academic Appointment.'
    },
    {
        category: 'Early-Career R&D',
        description: 'Researchers working in labs, startups, or R&D departments with a strong technical background.',
        profile: 'Possess deep technical expertise and ≤3 years of professional experience.',
        evidence: 'Employment Certificate, R&D Lab Letter, or Professional Reference.'
    },
    {
        category: 'Academic Spinouts',
        description: 'Graduate students or researchers with lab-validated prototypes but no formal company established yet.',
        profile: 'Ready to transition research outcomes into commercial deep-tech startups.',
        evidence: 'University Spinout Letter, Lab Validation Report, or Tech-Disclosure Form.'
    }
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
                                <div key={idx} className="glass-panel p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-vc-mint/30 transition-all">
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

                    <div id="targeted-audience" className="space-y-6 scroll-mt-[20vh]">
                        <h3 className="text-xl font-bold text-vc-mint flex items-center gap-2">
                            <div className="w-2 h-8 bg-vc-mint rounded-full" />
                            Targeted Audience
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {targetAudience.map((item, idx) => (
                                <div key={idx} className="glass-panel p-6 space-y-4 group hover:border-vc-mint/30 transition-all border border-white/5 bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-vc-mint/10 flex items-center justify-center text-vc-mint group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                            {idx === 0 && <GraduationCap size={24} />}
                                            {idx === 1 && <Microscope size={24} />}
                                            {idx === 2 && <Briefcase size={24} />}
                                            {idx === 3 && <Rocket size={24} />}
                                        </div>
                                        <h4 className="font-bold text-white text-lg uppercase tracking-tight">{item.category}</h4>
                                    </div>
                                    <p className="text-white/80 text-base leading-relaxed">{item.description}</p>
                                    <div className="space-y-4 pt-8 mt-auto border-t border-white/5">
                                        <div>
                                            <p className="text-[10px] font-bold text-vc-mint/40 uppercase tracking-widest mb-1">Target Profile</p>
                                            <p className="text-white/40 text-sm italic">{item.profile}</p>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-[10px] font-bold text-vc-mint/60 uppercase tracking-widest mb-2">Required Evidence</p>
                                            <div className="flex items-start gap-2 bg-vc-mint/5 border border-vc-mint/10 p-3 rounded-lg">
                                                <ShieldCheck className="w-3.5 h-3.5 text-vc-mint mt-0.5 shrink-0" />
                                                <p className="text-vc-mint/80 text-[11px] font-medium leading-tight">{item.evidence}</p>
                                            </div>
                                        </div>
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
