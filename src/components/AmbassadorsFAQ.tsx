'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Users, Award, Target, Rocket, Globe, UserPlus } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string | React.ReactNode;
    icon: React.ReactNode;
}

const faqData: FAQItem[] = [
    {
        id: 'what-is',
        question: 'What is the Venture Craft Ambassadors Program?',
        answer: 'The Venture Craft Ambassadors Program is a global initiative designed to engage passionate university students who actively promote innovation, entrepreneurship, and deep-tech solutions within their communities. Ambassadors play a key role in expanding the reach of the Venture Craft Challenge by raising awareness, encouraging participation, and representing the initiative across universities and student ecosystems worldwide.',
        icon: <Globe className="w-5 h-5" />,
    },
    {
        id: 'why-become',
        question: 'Why Become a Venture Craft Ambassador?',
        answer: (
            <ul className="space-y-2 text-white/70">
                <li className="flex items-start gap-2">
                    <span className="text-vc-mint mt-1">●</span>
                    Represent a prestigious global innovation initiative
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-vc-mint mt-1">●</span>
                    Gain official recognition and certification
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-vc-mint mt-1">●</span>
                    Expand your professional and entrepreneurial network
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-vc-mint mt-1">●</span>
                    Contribute to student-led innovation and community impact
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-vc-mint mt-1">●</span>
                    Receive global exposure through Venture Craft platforms
                </li>
            </ul>
        ),
        icon: <Rocket className="w-5 h-5" />,
    },
    {
        id: 'role',
        question: 'What is the Ambassador Role?',
        answer: (
            <div className="space-y-4 text-white/70">
                <p>Ambassadors help expand the reach of the Venture Craft Challenge by promoting it to a wider audience and supporting its presence within their communities. This can be done through various optional activities, based on availability and comfort:</p>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-vc-mint mt-1">●</span>
                        Sharing content on personal social media platforms
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-vc-mint mt-1">●</span>
                        Introducing the challenge to peers, student communities, and professional networks
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-vc-mint mt-1">●</span>
                        Encouraging potential participants to engage and apply
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-vc-mint mt-1">●</span>
                        Supporting physical marketing efforts, such as distributing materials
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-vc-mint mt-1">●</span>
                        Assisting in identifying or facilitating collaborations with student clubs and organizations
                    </li>
                </ul>
            </div>
        ),
        icon: <Target className="w-5 h-5" />,
    },
    {
        id: 'benefits',
        question: 'What are the Benefits?',
        answer: (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {[
                    'Official Certificate',
                    'Public Recognition',
                    'Networking Access',
                    'Event Invitations',
                    'Global Exposure',
                    'Special Appreciation',
                ].map((benefit) => (
                    <div
                        key={benefit}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm"
                    >
                        {benefit}
                    </div>
                ))}
            </div>
        ),
        icon: <Award className="w-5 h-5" />,
    },
    {
        id: 'vision',
        question: 'What is Our Vision?',
        answer: 'We believe ambassadors are partners, not just promoters. Our vision is to build a diverse, global community of students united by ambition, innovation, and collaboration. Through the ambassadors program, we aim to foster mutual growth, shared success, and long-term impact, empowering students to actively shape the future of innovation.',
        icon: <Users className="w-5 h-5" />,
    },
    {
        id: 'join',
        question: 'How Do I Join?',
        answer: 'You can join the Venture Craft Ambassadors Program by clicking apply at the bottom or top of the page.',
        icon: <UserPlus className="w-5 h-5" />,
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
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Ambassadors <span className="text-vc-mint">FAQ</span>
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
                                className={`border-b border-white/10 transition-all duration-300 ${openId === item.id
                                    ? 'bg-white/5 border border-white/20 rounded-xl my-2 translate-x-2'
                                    : 'hover:bg-white/[0.02]'
                                    }`}
                            >
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="w-full py-6 px-6 flex items-center justify-between text-left group"
                                >
                                    <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${openId === item.id ? 'text-vc-mint' : 'text-white'
                                        }`}>
                                        {item.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openId === item.id ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
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
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-white/70 text-base leading-relaxed">
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
                            Didn't find your answer? <a href="mailto:info@venturecraft.org" className="text-vc-mint font-semibold hover:underline transition-all">Contact us</a>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Background highlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-vc-teal/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
