
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-vc-green-dark" />,
        error: <XCircle className="w-5 h-5 text-white" />, // Red bg makes white icon pop
        info: <Info className="w-5 h-5 text-vc-mint" />
    };

    const styles = {
        success: 'bg-vc-mint text-vc-green-dark border-vc-mint',
        error: 'bg-red-500 text-white border-red-500',
        info: 'bg-[#0f2a27] text-white border-vc-mint/20'
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={message} // Remounts on new message if needed, or handle list in parent
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl border shadow-xl backdrop-blur-md ${styles[type]}`}
                >
                    {icons[type]}
                    <span className="text-sm font-bold">{message}</span>
                    <button
                        onClick={onClose}
                        className="ml-4 p-1 rounded-full hover:bg-black/10 transition-colors"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
