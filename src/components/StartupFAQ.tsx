'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
    id: string;
    question: string;
    answer: string | React.ReactNode;
}

const faqData: FAQItem[] = [
    {
        id: 'postponed',
        question: 'Has the competition been delayed, and what is the new date?',
        answer: (
            <div className="space-y-2">
                <p>The competition is officially <strong className="text-vc-mint">back</strong>! We have launched a revised timeline with the main final events scheduled for September and October 2026. Please refer to the Timeline section on our homepage for detailed phase dates.</p>
            </div>
        ),
    },
    {
        id: 'deadline',
        question: 'When is the application deadline?',
        answer: (
            <div className="space-y-2">
                <p>The application deadline is <strong className="text-vc-mint">August 15, 2026</strong>. Previous applicants can update their applications until this date. General registration for new participants will open on <strong className="text-vc-mint">July 15</strong> and close on <strong className="text-vc-mint">August 15</strong>.</p>
            </div>
        ),
    },
    {
        id: 'editing',
        question: 'Can I edit my application after submission?',
        answer: (
            <div className="space-y-2">
                <p>Yes, the application editing portal has been <strong className="text-vc-mint">reopened exclusively for previous applicants</strong> until <strong className="text-vc-mint">August 15, 2026</strong>.</p>
                <p className="text-white/70">You are highly encouraged to log in, refine your startup details, upload any updated pitch or video materials, and complete the newly added Travel & Visa section.</p>
            </div>
        ),
    },
    {
        id: 'eligibility',
        question: 'Who can apply?',
        answer: (
            <div className="space-y-2">
                <p>Applications are open to startups where the <strong className="text-vc-mint">team leader and/or main co-founders</strong> are current Bachelor’s, STEM Diploma, Master’s, and PhD students, as well as post-doctoral researchers and recent graduates (up to 5 years post-graduation).</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">Note: For other team members, these qualifications are highly recommended. See <Link href="/apply/eligibility" className="text-vc-mint hover:underline">Eligibility & Criteria</Link> for details.</p>
            </div>
        ),
    },
    {
        id: 'ambassador-participation',
        question: 'Can I apply for the ambassador program and participate in the competition?',
        answer: (
            <div className="space-y-2">
                <p>Yes, you are welcome to apply for the ambassador program even if you are participating in the competition.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, please note that ambassadors do not receive any advantages or preferential treatment in the competition judging process.</p>
            </div>
        ),
    },
    {
        id: 'age',
        question: 'What is the minimum age?',
        answer: (
            <div className="space-y-2">
                <p>All team members must be at least <strong className="text-vc-mint">18 years old</strong> at the time of application.</p>
            </div>
        ),
    },
    {
        id: 'team-size',
        question: 'What is the maximum team size?',
        answer: (
            <div className="space-y-2">
                <p>There is <strong className="text-vc-mint">no minimum or maximum number</strong> of members per team. You can participate as a solo founder or with a large team. All team members are welcome to travel and physically participate in the final stages.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, please note that Venture Craft will sponsor travel (flights, visa coordination, and accommodation) for a maximum of 2 members per team, and any additional members must be self-funded.</p>
            </div>
        ),
    },
    {
        id: 'team-requirement',
        question: 'Do I have to be a part of a team?',
        answer: (
            <div className="space-y-2">
                <p>No, you do not have to be part of a team. You can apply as an <strong className="text-vc-mint">individual (solo founder)</strong>.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, we encourage forming teams to bring diverse skills and perspectives to your startup, but it is not a requirement.</p>
            </div>
        ),
    },
    {
        id: 'team-eligibility',
        question: 'Do all team members need to meet the eligibility requirements?',
        answer: (
            <div className="space-y-2">
                <p>Only the <strong className="text-vc-mint">team leader and main co-founders</strong> are required to meet the specific eligibility criteria (such as education level).</p>
                <p>Other team members, including professors, mentors, or industry experts, are welcome to join and support the startup without needing to meet these requirements.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">Note: All team members, regardless of their role, must be at least 18 years old.</p>
            </div>
        ),
    },
    {
        id: 'travel-requirement',
        question: 'Is it mandatory for teams to travel to Saudi Arabia?',
        answer: (
            <div className="space-y-2">
                <p>Yes. All team members are welcome to travel to Saudi Arabia to attend the <strong className="text-vc-mint">in-person bootcamp</strong> as well as the <strong className="text-vc-mint">final competition</strong>.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, please note that Venture Craft will sponsor travel (flights, visa coordination, and accommodation) for a maximum of 2 members per team, and any additional members must be self-funded.</p>
            </div>
        ),
    },
    {
        id: 'travel-sponsorship',
        question: 'Will travel and accommodation be sponsored for all team members?',
        answer: (
            <div className="space-y-2">
                <p>Venture Craft will sponsor travel (flights, visa coordination, and accommodation) for a <strong className="text-vc-mint">maximum of 2 attendees</strong> per team. All team members are welcome to travel and participate in the bootcamp and final competition.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">Note: Any additional members beyond the 2 sponsored ones must be self-funded.</p>
            </div>
        ),
    },
    {
        id: 'theme',
        question: 'What is the 2026 theme?',
        answer: (
            <div className="space-y-2">
                <p>The 2026 theme is **Sustainable Energy**, focusing on four core pillars:</p>
                <ul className="list-disc list-inside text-sm text-vc-mint/80 space-y-1 ml-2">
                    <li>Decarbonization Technologies</li>
                    <li>Circular Economy & Resource Efficiency</li>
                    <li>Energy Efficiency</li>
                    <li>Process Optimization & Advanced Engineering</li>
                </ul>
                <p className="mt-2 text-sm">Learn more about our mission and focus <Link href="/about/venture-craft" className="text-vc-mint hover:underline">here</Link>.</p>
            </div>
        ),
    },
    {
        id: 'submission',
        question: 'What do we need to submit?',
        answer: (
            <div className="space-y-2">
                <p>A complete application requires a <strong className="text-vc-mint">pitch deck</strong> (max 15 slides), an <strong className="text-vc-mint">executive summary</strong> (1–2 pages), and a <strong className="text-vc-mint">3–5 minute video pitch</strong>.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">Note: You may also include optional supporting data (up to 5 pages). Please review the <Link href="/apply/materials" className="text-vc-mint hover:underline">Application Materials</Link> for detailed requirements.</p>
            </div>
        ),
    },
    {
        id: 'formats',
        question: 'What formats are accepted for uploads?',
        answer: (
            <div className="space-y-2">
                <p><strong className="text-vc-mint">Pitch deck:</strong> PDF or PowerPoint.</p>
                <p><strong className="text-vc-mint">Executive summary & supporting data:</strong> PDF or Microsoft Word.</p>
                <p><strong className="text-vc-mint">Video pitch:</strong> Unlisted YouTube link.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">See the <Link href="/apply/materials" className="text-vc-mint hover:underline">full specifications</Link> for more info.</p>
            </div>
        ),
    },
    {
        id: 'confidentiality',
        question: 'Are submissions confidential?',
        answer: (
            <div className="space-y-2">
                <p>No. Submissions are <strong className="text-vc-mint">not considered confidential</strong> unless a specific written agreement is made in advance.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">We advise against submitting proprietary trade secrets unless they are already protected.</p>
            </div>
        ),
    },
    {
        id: 'ip',
        question: 'Who owns the intellectual property?',
        answer: (
            <div className="space-y-2">
                <p>Teams retain <strong className="text-vc-mint">full ownership</strong> of their intellectual property.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">By submitting, you grant Venture Craft a non-exclusive license to use the materials solely for the purposes of administering, judging, and promoting the competition.</p>
            </div>
        ),
    },
    {
        id: 'evaluation',
        question: 'How are teams evaluated?',
        answer: (
            <div className="space-y-2">
                <p>Submissions are evaluated by a panel of experts using a <strong className="text-vc-mint">weighted scoring rubric</strong>. Each criterion is scored on a scale of 1–5.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">You can view the <Link href="/apply/rubrics" className="text-vc-mint hover:underline">Judging Rubrics</Link> for a complete breakdown.</p>
            </div>
        ),
    },
    {
        id: 'decisions',
        question: 'Are judging decisions final?',
        answer: (
            <div className="space-y-2">
                <p>Yes. All decisions made by the <strong className="text-vc-mint">judging panel and the organizers</strong> are final and binding.</p>
            </div>
        ),
    },
    {
        id: 'updates',
        question: 'How will we receive updates?',
        answer: (
            <div className="space-y-2">
                <p>All official communication and competition updates will be sent <strong className="text-vc-mint">via email</strong> to the designated team leader.</p>
            </div>
        ),
    },
];

export default function StartupFAQ() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="relative z-10 py-12 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">

                    {/* FAQ Items */}
                    <div className="flex flex-col border-t border-white/10">
                        {faqData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`border-b border-white/10 transition-all duration-500 overflow-hidden ${openId === item.id
                                    ? 'bg-vc-mint/[0.03] border-vc-mint/20 rounded-2xl my-3 shadow-[0_0_40px_-15px_rgba(45,212,191,0.1)]'
                                    : 'hover:bg-white/[0.02]'
                                    }`}
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="w-full py-6 px-6 flex items-center justify-between text-left group transition-all"
                                >
                                    <div className="flex items-center">
                                        <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${openId === item.id ? 'text-vc-mint' : 'text-white'
                                            }`}>
                                            {item.question}
                                        </span>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: openId === item.id ? 180 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className={`${openId === item.id ? 'text-vc-mint' : 'text-white/40'}`}
                                    >
                                        <ChevronDown className="w-5 h-5" />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {openId === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-8 text-white/70 text-base md:text-lg leading-relaxed border-t border-vc-mint/5 pt-4">
                                                {typeof item.answer === 'string' ? (
                                                    <p>{item.answer}</p>
                                                ) : (
                                                    item.answer
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <p className="text-white/40 text-base">
                            Didn't find your answer? <a href="mailto:info.venturecraft@kfupm.edu.sa" className="text-vc-mint font-semibold hover:underline transition-all">Contact us</a>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Background highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-vc-teal/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
