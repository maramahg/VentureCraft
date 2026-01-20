import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
}

export const ScrollReveal = ({
  children,
  y = 40,
  duration = 0.7,
  delay = 0,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, ease: 'easeOut', delay }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
};
