import { useCallback } from 'react';
import { useMotionValue, useSpring, useTransform, MotionStyle } from 'framer-motion';

/**
 * use3DTilt — gives any card a smooth mouse-tracked 3D perspective tilt.
 * Apply onMouseMove and onMouseLeave to the element's event handlers,
 * and spread `style` into a motion.div with `style={{ perspective: '1000px' }}` on the parent.
 */
export function use3DTilt(strength = 12) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 180, damping: 28 });
  const springY = useSpring(rawY, { stiffness: 180, damping: 28 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-strength, strength]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [strength, -strength]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const style: MotionStyle = { rotateX, rotateY, transformStyle: 'preserve-3d' };

  return { style, onMouseMove, onMouseLeave };
}
