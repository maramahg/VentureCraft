'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
    { name: 'Eligibility', href: '/apply/eligibility' },
    { name: 'Rubrics', href: '/apply/rubrics' },
    { name: 'Materials', href: '/apply/materials' },
    { name: 'Apply Now', href: '/apply' },
];

export default function ApplicationTabs() {
    const pathname = usePathname();

    return (
        <div className="flex justify-center mb-12">
            <div className="glass-panel p-1.5 flex gap-1 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className="relative px-6 py-2.5 rounded-xl transition-all duration-300 overflow-hidden group whitespace-nowrap shrink-0"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-vc-mint shadow-[0_0_20px_rgba(79,209,197,0.3)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className={`relative z-10 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-vc-green-dark' : 'text-white/60 group-hover:text-white'}`}>
                                {tab.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
