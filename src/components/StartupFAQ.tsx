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
        id: 'eligibility',
        question: 'Who can apply?',
        answer: (
            <span>
                Applications are open to startups where the team leader and/or main co-founders are current Bachelor’s, Master’s, and PhD students, as well as post-doctoral researchers and recent graduates (up to 5 years post-graduation). For other team members, these qualifications are highly recommended. See <Link href="/apply/eligibility" className="text-vc-mint hover:underline">Eligibility & Criteria</Link> for details.
            </span>
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
        answer: 'All team members must be at least 18 years old at the time of application.',
    },
    {
        id: 'team-size',
        question: 'What is the maximum team size?',
        answer: (
            <div className="space-y-2">
                <p>There is no minimum or maximum number of members per team. You can participate as a solo founder or with a large team.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, please note that if your team is selected as a finalist, only a maximum of 5 members will be able to represent the startup in the final competition.</p>
            </div>
        ),
    },
    {
        id: 'team-requirement',
        question: 'Do I have to be a part of a team?',
        answer: (
            <div className="space-y-2">
                <p>No, you do not have to be part of a team. You can apply as an individual (solo founder).</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, we encourage forming teams to bring diverse skills and perspectives to your startup, but it is not a requirement.</p>
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
            <span>
                A complete application requires a pitch deck (max 10 slides), an executive summary (1–2 pages), and a 3-minute video pitch. Please review the <Link href="/apply/materials" className="text-vc-mint hover:underline">Application Materials</Link> for detailed requirements.
            </span>
        ),
    },
    {
        id: 'formats',
        question: 'What formats are accepted for uploads?',
        answer: (
            <div className="space-y-2">
                <p><span className="font-bold text-white">Pitch deck:</span> PDF or PowerPoint.</p>
                <p><span className="font-bold text-white">Executive summary & supporting data:</span> PDF or Word.</p>
                <p><span className="font-bold text-white">Video pitch:</span> Unlisted YouTube link.</p>
                <p className="text-sm mt-2">See the <Link href="/apply/materials" className="text-vc-mint hover:underline">full specifications</Link> for more info.</p>
            </div>
        ),
    },
    {
        id: 'confidentiality',
        question: 'Are submissions confidential?',
        answer: 'No. Submissions are not considered confidential unless a specific written agreement is made in advance. We advise against submitting proprietary trade secrets unless they are already protected.',
    },
    {
        id: 'ip',
        question: 'Who owns the intellectual property?',
        answer: 'Teams retain full ownership of their intellectual property. By submitting, you grant Venture Craft a non-exclusive license to use the materials solely for the purposes of administering, judging, and promoting the competition.',
    },
    {
        id: 'evaluation',
        question: 'How are teams evaluated?',
        answer: (
            <span>
                Submissions are evaluated by a panel of experts using a weighted scoring rubric. Each criterion is scored on a scale of 1–5. You can view the <Link href="/apply/rubrics" className="text-vc-mint hover:underline">Judging Rubrics</Link> for a complete breakdown.
            </span>
        ),
    },
    {
        id: 'decisions',
        question: 'Are judging decisions final?',
        answer: 'Yes. All decisions made by the judging panel and the organizers are final and binding.',
    },
    {
        id: 'updates',
        question: 'How will we receive updates?',
        answer: 'All official communication and competition updates will be sent via email to the designated team leader.',
    },
    {
        id: 'coi',
        question: 'Do we need to disclose conflicts of interest?',
        answer: 'Yes. Teams are required to disclose any existing relationships or potential conflicts with judges or organizers during the application process.',
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
                            Didn't find your answer? <a href="mailto:venture-craft@kfupm.edu.sa" className="text-vc-mint font-semibold hover:underline transition-all">Contact us</a>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Background highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-vc-teal/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
