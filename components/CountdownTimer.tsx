'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        // Target: April 1st, 2026, 11:59:59 PM KSA (UTC+3)
        const targetDate = new Date('2026-04-01T23:59:59+03:00').getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="relative w-14 h-16 md:w-20 md:h-24 flex items-center justify-center bg-[#002B28]/80 backdrop-blur-md border border-vc-mint/20 rounded-xl shadow-2xl overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-vc-mint/40 to-transparent" />
                <span className="text-2xl md:text-5xl font-black text-vc-mint font-poppins tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(79,209,197,0.4)] relative z-10 transition-all duration-300">
                    {value.toString().padStart(2, '0')}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>
            <span className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/30">
                {label}
            </span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 md:gap-6"
        >
            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-vc-mint/20 text-xl md:text-4xl font-light mb-5">:</div>
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <div className="text-vc-mint/20 text-xl md:text-4xl font-light mb-5">:</div>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <div className="text-vc-mint/20 text-xl md:text-4xl font-light mb-5">:</div>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
        </motion.div>
    );
}
