"use client";

import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    className?: string;
    viewport?: UseInViewOptions;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
}

export default function ScrollReveal({
    children,
    width = "fit-content",
    delay = 0,
    duration = 0.5,
    className = "",
    viewport = { once: true, margin: "0px 0px -50px 0px" },
    direction = "up",
    distance = 50,
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    const getInitial = () => {
        switch (direction) {
            case "up":
                return { opacity: 0, y: distance };
            case "down":
                return { opacity: 0, y: -distance };
            case "left":
                return { opacity: 0, x: distance };
            case "right":
                return { opacity: 0, x: -distance };
            case "none":
                return { opacity: 0 };
            default:
                return { opacity: 0, y: distance };
        }
    };

    const getAnimate = () => {
        switch (direction) {
            case "up":
            case "down":
                return { opacity: 1, y: 0 };
            case "left":
            case "right":
                return { opacity: 1, x: 0 };
            case "none":
                return { opacity: 1 };
            default:
                return { opacity: 1, y: 0 };
        }
    };

    return (
        <div ref={ref} style={{ position: "relative", width }} className={className}>
            <motion.div
                initial={getInitial()}
                animate={isInView ? getAnimate() : getInitial()}
                transition={{ duration, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
}
