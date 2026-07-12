'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Target, Gift, CircleDollarSign, Megaphone } from 'lucide-react';

const steps = [
    {
        icon: <Megaphone className="w-8 h-8" />,
        title: "Complete Tasks",
        description: "Engage in various promotional activities, from social media sharing to campus initiatives.",
        color: "text-blue-400",
        bg: "bg-blue-400/15",
        border: "border-blue-400/40"
    },
    {
        icon: <CircleDollarSign className="w-8 h-8" />,
        title: "Earn Venture Coins",
        description: "Every verified contribution adds Venture Coins to your profile and boosts your standing.",
        color: "text-yellow-400",
        bg: "bg-yellow-400/15",
        border: "border-yellow-400/40"
    },
    {
        icon: <Trophy className="w-8 h-8" />,
        title: "Climb the Ranking",
        description: "The more Venture Coins you earn, the higher your rank. You can track your position in real time on your profile.",
        color: "text-vc-mint",
        bg: "bg-vc-mint/15",
        border: "border-vc-mint/40"
    }
];

export default function AmbassadorRewards() {
    return (
        <section className="py-24 relative overflow-hidden border-t border-white/5 bg-[#157369]/[0.05]">
            {/* Background Decorations - Integrated with site theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vc-mint/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[400px] h-[400px] bg-vc-teal/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="max-w-6xl mx-auto">

                    {/* Header - Centered as in first version */}
                    <div className="text-center mb-16 space-y-4">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xl sm:text-2xl md:text-3xl lg:text-[2.75rem] font-bold  text-white uppercase tracking-tighter leading-tight font-poppins"
                        >
                            Rewards & <span className="text-vc-mint">Recognition</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-white/60 text-lg md:text-xl font-poppins max-w-2xl mx-auto"
                        >
                            Our transparent system ensures every effort is valued. Stay active, earn points, and climb the leaderboard.
                        </motion.p>
                    </div>

                    {/* Grid of 3 Cards - Restored Format & Colors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-8 rounded-[2.5rem] border ${step.border} ${step.bg} backdrop-blur-md relative group hover:-translate-y-2 transition-all duration-300`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.border} border flex items-center justify-center ${step.color} mb-6`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-poppins uppercase tracking-wide">{step.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed font-poppins">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* The Ultimate Reward - Clean, Integrated, No Gradient */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="rounded-[2.5rem] bg-vc-mint p-8 md:p-10 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-8 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="shrink-0 w-20 h-20 rounded-2xl bg-[#001D1B] flex items-center justify-center">
                            <Crown className="w-10 h-10 text-vc-mint group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="max-w-2xl space-y-4">
                            <h3 className="text-[#001D1B] font-black text-2xl uppercase tracking-tight">
                                The Ultimate Reward
                            </h3>
                            <p className="text-[#001D1B]/80 text-lg font-bold font-poppins leading-snug">
                                Ambassadors with the highest Venture Coins will receive special awards at the program's conclusion.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-[#001D1B]/5 border border-[#001D1B]/10 px-4 py-2 rounded-xl text-[#001D1B] font-black uppercase tracking-widest text-xs">
                                <Star className="w-4 h-4 fill-current" />
                                <span>Exclusive Invitation to the Final Ceremony</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
