'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string | React.ReactNode;
}

const faqData: FAQItem[] = [
    {
        id: 'eligibility',
        question: 'Who can apply to become an ambassador?',
        answer: (
            <div className="space-y-2">
                <p>University <strong className="text-vc-mint">students and recent graduates</strong> are welcome to apply.</p>
            </div>
        ),
    },
    {
        id: 'duration',
        question: 'When does the ambassador role end?',
        answer: (
            <div className="space-y-2">
                <p>The ambassador program has <strong className="text-vc-mint">resumed</strong> alongside the competition relaunch. Active outreach and promotion duties will run from July 15, when new registrations open, through to the finals.</p>
            </div>
        ),
    },
    {
        id: 'major',
        question: 'Is a specific major required?',
        answer: (
            <div className="space-y-2">
                <p>No, students from <strong className="text-vc-mint">all majors</strong> are welcome.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, being in an engineering or technology-related field may increase your chances of selection.</p>
            </div>
        ),
    },
    {
        id: 'remote',
        question: 'Is the work in-person?',
        answer: (
            <div className="space-y-2">
                <p>No, the role is primarily <strong className="text-vc-mint">online</strong>.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">However, occasional on-campus activities at your university may be required.</p>
            </div>
        ),
    },
    {
        id: 'location',
        question: 'Do I need to be located at KFUPM?',
        answer: (
            <div className="space-y-2">
                <p>No, your work will be within your <strong className="text-vc-mint">own university only</strong>.</p>
            </div>
        ),
    },
    {
        id: 'ceremony',
        question: 'Is attending the final ceremony mandatory?',
        answer: (
            <div className="space-y-2">
                <p>No, attendance is <strong className="text-vc-mint">not mandatory</strong>.</p>
                <p className="text-vc-mint/80 font-medium italic text-sm">Only the top three ambassadors (based on points) will be given the opportunity to attend the final ceremony.</p>
            </div>
        ),
    },
    {
        id: 'points',
        question: 'What are ambassador points?',
        answer: (
            <div className="space-y-2">
                <p>Points are awarded for each completed task. These points are used to <strong className="text-vc-mint">rank ambassadors</strong>.</p>
            </div>
        ),
    },
    {
        id: 'difficulty',
        question: 'Are the tasks difficult or time-consuming?',
        answer: (
            <div className="space-y-2">
                <p>No, the tasks are <strong className="text-vc-mint">simple and manageable</strong>.</p>
            </div>
        ),
    },
    {
        id: 'on-ground',
        question: 'Is on-ground activity required?',
        answer: (
            <div className="space-y-2">
                <p>Yes, in some cases you may be asked to help at booths or distribute posters to <strong className="text-vc-mint">promote the competition</strong>.</p>
            </div>
        ),
    },
    {
        id: 'competition-participation',
        question: 'Can I apply for ambassador and participate in the competition?',
        answer: (
            <div className="space-y-2">
                <p>Yes, you can participate in <strong className="text-vc-mint">both</strong>, provided that ambassadors receive no preferential treatment. Portal updates for previous applicants are open now, and new registrations open July 15.</p>
            </div>
        ),
    },
];

export default function AmbassadorsFAQ() {
    const [openId, setOpenId] = useState<string | null>(null);

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="relative z-10 py-24 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none"><span className="text-vc-mint">FAQ</span>
                        </h2>
                    </motion.div>

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
