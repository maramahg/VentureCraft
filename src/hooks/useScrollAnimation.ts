'use client';

import { useEffect, useRef, useState } from 'react';


import { RefObject } from 'react';

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px'):
    { ref: RefObject<HTMLDivElement | null>; isVisible: boolean } {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(currentRef);
                }
            },
            {
                threshold,
                rootMargin,
            }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin]);

    return { ref, isVisible };
}
