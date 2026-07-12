'use client';

import { motion } from 'framer-motion';
import { Trophy, Users, Plane, Globe, Network } from 'lucide-react';

const prizes = [
    {
        place: '1st',
        amount: '$100K',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/20',
        height: 'h-[340px]',
        order: 'order-1 md:order-2',
        delay: 0,
        isMain: true
    },
    {
        place: '2nd',
        amount: '$60K',
        color: 'text-slate-300',
        bg: 'bg-slate-300/10',
        border: 'border-slate-300/20',
        height: 'h-[280px]',
        order: 'order-2 md:order-1',
        delay: 0.2
    },
    {
        place: '3rd',
        amount: '$40K',
        color: 'text-amber-600',
        bg: 'bg-amber-600/10',
        border: 'border-amber-600/20',
        height: 'h-[240px]',
        order: 'order-3 md:order-3',
        delay: 0.4
    }
];

const benefits = [
    { icon: Users, text: 'Mentorship' },
    { icon: Plane, text: 'Travel Support' },
    { icon: Globe, text: 'Visibility' },
    { icon: Network, text: 'Networking' }
];

export default function Prizes() {
    return (
        <section className="relative z-20 py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-extrabold mb-4 font-poppins uppercase tracking-tight text-white"
                    >
                        Prizes & Awards
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-vc-mint font-bold max-w-2xl mx-auto font-poppins"
                    >
                        Rewarding excellence in deep tech innovation and sustainable solutions.
                    </motion.p>
                </div>

                {/* Podium */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 max-w-5xl mx-auto mb-20">
                    {prizes.map((prize) => (
                        <motion.div
                            key={prize.place}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: prize.delay, ease: "easeOut" }}
                            className={`${prize.order} w-full md:w-1/3 px-2`}
                        >
                            <div className={`relative flex flex-col items-center justify-start ${prize.height} rounded-t-3xl border-t border-x ${prize.border} ${prize.bg} backdrop-blur-xl pt-10 pb-8 px-4 group hover:bg-white/5 transition-colors duration-500`}>
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-t-3xl bg-gradient-to-t from-transparent to-white/20`} />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <Trophy className={`w-16 h-16 mb-6 ${prize.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
                                    <span className={`text-5xl md:text-6xl font-black mb-2 font-poppins ${prize.isMain ? 'text-white' : 'text-white/80'}`}>
                                        {prize.amount}
                                    </span>
                                    <span className={`text-lg font-bold uppercase tracking-widest ${prize.color}`}>
                                        {prize.place} Place
                                    </span>
                                    <p className="text-white/40 text-sm mt-2 font-medium uppercase tracking-tighter">
                                        {prize.isMain ? 'Grand Prize' : ''}
                                    </p>
                                </div>

                                {prize.isMain && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-vc-mint text-vc-green-dark text-xs font-black rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(79,209,197,0.5)]">
                                        Winner
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Corporate Special Awards */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mb-20 px-4"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-vc-mint/30 bg-vc-mint/5 backdrop-blur-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-vc-mint/10 transition-all duration-500">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-vc-mint/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(79,209,197,0.2)]">
                                <svg className="w-8 h-8 text-vc-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-bold text-white font-poppins">Corporate Special Awards</h3>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="text-4xl md:text-5xl font-black text-white font-poppins">$15,000</div>
                            <div className="text-vc-mint font-bold uppercase tracking-tighter text-lg">Per Award (X3)</div>
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-vc-mint/10 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </motion.div>

                {/* Additional Benefits */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-vc-mint uppercase tracking-widest">Additional Benefits</h3>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.text}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="aspect-square flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-vc-mint/30 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-vc-mint/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <benefit.icon className="w-6 h-6 md:w-7 md:h-7 text-vc-mint" />
                                </div>
                                <span className="text-white/80 font-semibold text-center font-poppins text-sm md:text-lg leading-tight">
                                    {benefit.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
