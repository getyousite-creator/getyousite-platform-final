/**
 * Micro-Interactions Protocol
 * 
 * Framer Motion animations that make the site feel "alive"
 * - Magnetic hover effect on interactive elements
 * - Blur out / Spring in page transitions
 * - Smooth, intelligent animations
 */

"use client";

import { motion, Variants, Transition } from "framer-motion";
import React from "react";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MagneticProps {
    children: React.ReactNode;
    intensity?: number;
    range?: number;
}

export interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}

export interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

// ============================================================================
// MAGNETIC HOVER EFFECT
// ============================================================================

/**
 * Magnetic Effect Component
 * 
 * Interactive elements subtly follow the cursor with a magnetic pull
 * Creates a premium, responsive feel
 */
export const Magnetic: React.FC<MagneticProps> = ({
    children,
    intensity = 0.3,
    range = 50,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;

        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Only apply magnetic effect within range
        const absX = Math.abs(distanceX);
        const absY = Math.abs(distanceY);

        if (absX < range && absY < range) {
            // Normalize and apply intensity
            const normalizedX = distanceX / range;
            const normalizedY = distanceY / range;

            setPosition({
                x: normalizedX * intensity * 10,
                y: normalizedY * intensity * 10,
            });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            style={{ display: "inline-block" }}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// FADE IN ANIMATIONS
// ============================================================================

/**
 * Fade In Component with directional variants
 * 
 * Content fades in with intelligent blur-out and spring-in
 */
export const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    duration = 0.6,
    direction = "up",
}) => {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom ease for premium feel
            },
        },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            style={{ display: "block" }}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Page Transition Component
 * 
 * Smooth blur-out for old content, spring-in for new content
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    className = "",
}) => {
    const pageVariants: Variants = {
        initial: {
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.98,
        },
        animate: {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.98,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// STAGGER CONTAINER
// ============================================================================

/**
 * Stagger Container
 * 
 * Animates children in sequence for smooth list reveals
 */
export interface StaggerContainerProps {
    children: React.ReactNode;
    delay?: number;
    staggerDelay?: number;
    className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    delay = 0,
    staggerDelay = 0.1,
    className = "",
}) => {
    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(5px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={className}
        >
            {React.Children.map(children, (child) => (
                <motion.div variants={itemVariants}>{child}</motion.div>
            ))}
        </motion.div>
    );
};

// ============================================================================
// HOVER SCALE EFFECT
// ============================================================================

/**
 * Hover Scale Component
 * 
 * Subtle scale effect on hover for interactive elements
 */
export interface HoverScaleProps {
    children: React.ReactNode;
    scale?: number;
    className?: string;
}

export const HoverScale: React.FC<HoverScaleProps> = ({
    children,
    scale = 1.02,
    className = "",
}) => {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// GLOW EFFECT
// ============================================================================

/**
 * Glow Effect Component
 * 
 * Animated glow for accent elements and CTAs
 */
export interface GlowProps {
    children: React.ReactNode;
    color?: string;
    intensity?: number;
    pulsate?: boolean;
    className?: string;
}

export const GlowEffect: React.FC<GlowProps> = ({
    children,
    color = "rgba(190, 242, 100, 0.4)",
    intensity = 20,
    pulsate = false,
    className = "",
}) => {
    const glowVariants: Variants = {
        normal: {
            boxShadow: `0 0 ${intensity}px ${color}`,
        },
        pulsate: {
            boxShadow: [
                `0 0 ${intensity}px ${color}`,
                `0 0 ${intensity * 1.5}px ${color}`,
                `0 0 ${intensity}px ${color}`,
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            variants={glowVariants}
            animate={pulsate ? "pulsate" : "normal"}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// ============================================================================
// PRESET TRANSITIONS
// ============================================================================

/**
 * Preset transition configurations
 */
export const TRANSITIONS = {
    // Smooth spring for most interactions
    spring: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15,
        mass: 0.1,
    },

    // Snappy spring for buttons
    snappy: {
        type: "spring" as const,
        stiffness: 400,
        damping: 17,
        mass: 0.08,
    },

    // Smooth ease for page transitions
    smooth: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
    },

    // Quick fade for tooltips
    quick: {
        duration: 0.2,
        ease: "easeOut",
    },
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    Magnetic,
    FadeIn,
    PageTransition,
    StaggerContainer,
    HoverScale,
    GlowEffect,
    TRANSITIONS,
};
