/**
 * Zero-Learning UI Protocol - Hero Section
 * 
 * "The 5-Second Rule" - User knows they found their solution immediately
 * 
 * Features:
 * - Dynamic H1 with typewriter effect (changing keywords)
 * - Interactive Mesh Gradient (mouse-reactive)
 * - Single massive CTA with Pulse Glow
 * - Direct to generation (no complex signup)
 */

"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroSectionProps {
    onGetStarted?: () => void;
    keywords?: string[];
    typingSpeed?: number;
}

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

export const ZeroLearningHero: React.FC<HeroSectionProps> = ({
    onGetStarted,
    keywords = [
        "متاجر إلكترونية",
        "مدونات احترافية",
        "مواقع شركات",
        "معارض أعمال",
        "منصات تعليمية",
        "تطبيقات ويب",
    ],
    typingSpeed = 2000,
}) => {
    const [displayedKeyword, setDisplayedKeyword] = useState(keywords[0]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [keywordIndex, setKeywordIndex] = useState(0);

    // Mouse position for mesh gradient
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Smooth spring for gradient movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    // Transform mouse to gradient positions
    const gradientX = useTransform(smoothMouseX, [0, 1], ["0%", "100%"]);
    const gradientY = useTransform(smoothMouseY, [0, 1], ["0%", "100%"]);

    // Typewriter effect
    useEffect(() => {
        const currentKeyword = keywords[keywordIndex];
        
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayedKeyword.length < currentKeyword.length) {
                    setDisplayedKeyword(currentKeyword.slice(0, displayedKeyword.length + 1));
                } else {
                    // Finished typing, start deleting after pause
                    setTimeout(() => setIsDeleting(true), 1000);
                }
            } else {
                // Deleting
                if (displayedKeyword.length > 0) {
                    setDisplayedKeyword(displayedKeyword.slice(0, -1));
                } else {
                    // Finished deleting, move to next keyword
                    setIsDeleting(false);
                    setKeywordIndex((prev) => (prev + 1) % keywords.length);
                }
            }
        }, isDeleting ? 50 : typingSpeed / 20);

        return () => clearTimeout(timeout);
    }, [displayedKeyword, isDeleting, keywordIndex, keywords, typingSpeed]);

    // Handle mouse move for gradient
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <section
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-obsidian"
            onMouseMove={handleMouseMove}
        >
            {/* Interactive Mesh Gradient Background */}
            <MeshGradient mouseX={gradientX} mouseY={gradientY} />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8"
                >
                    <span className="w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
                    <span className="text-sm text-neutral-slate">
                        مدعوم بالذكاء الاصطناعي من الجيل التالي
                    </span>
                </motion.div>

                {/* Main Headline with Typewriter Effect */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
                >
                    ابنِ{" "}
                    <span className="text-transparent bg-clip-text bg-grad-premium min-w-[200px] inline-block">
                        {displayedKeyword}
                    </span>
                    <br />
                    <span className="text-4xl md:text-6xl lg:text-7xl text-neutral-slate">
                        في ثوانٍ، ليس ساعات
                    </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl md:text-2xl text-neutral-slate mb-12 max-w-3xl mx-auto"
                >
                    لا حاجة للبرمجة. لا قوالب جاهزة. لا تعقيد.
                    <br />
                    <span className="text-white font-medium">
                        فقط صف ما تريد، وسيقوم الذكاء الاصطناعي بالباقي.
                    </span>
                </motion.p>

                {/* Primary CTA - Massive with Pulse Glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <CTAButton onClick={onGetStarted} />
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-slate"
                >
                    <TrustItem icon="⚡" text="بدون بطاقة ائتمان" />
                    <TrustItem icon="🎨" text="تصاميم فريدة" />
                    <TrustItem icon="🚀" text="نشر فوري" />
                    <TrustItem icon="♾️" text="تعديلات غير محدودة" />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <ScrollIndicator />
            </motion.div>
        </section>
    );
};

// ============================================================================
// MESH GRADIENT COMPONENT
// ============================================================================

interface MeshGradientProps {
    mouseX: any;
    mouseY: any;
}

const MeshGradient: React.FC<MeshGradientProps> = ({ mouseX, mouseY }) => {
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Base gradient */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `
                        radial-gradient(at 0% 0%, rgba(6, 78, 59, 0.5) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(5, 150, 105, 0.3) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(190, 242, 100, 0.2) 0px, transparent 50%),
                        radial-gradient(at 0% 100%, rgba(6, 78, 59, 0.4) 0px, transparent 50%)
                    `,
                }}
            />

            {/* Interactive orbs that follow mouse */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(190,242,100,0.5) 0%, transparent 70%)",
                    left: mouseX,
                    top: mouseY,
                    x: "-50%",
                    y: "-50%",
                }}
            />

            {/* Secondary orb */}
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-15"
                style={{
                    background: "radial-gradient(circle, rgba(5,150,105,0.6) 0%, transparent 70%)",
                    right: mouseX,
                    bottom: mouseY,
                    x: "50%",
                    y: "50%",
                }}
            />

            {/* Grid overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "50px 50px",
                }}
            />
        </div>
    );
};

// ============================================================================
// CTA BUTTON COMPONENT
// ============================================================================

interface CTAButtonProps {
    onClick?: () => void;
}

const CTAButton: React.FC<CTAButtonProps> = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Glow effect */}
            <div
                className={`absolute inset-0 bg-accent-neon rounded-full blur-xl transition-opacity duration-300 ${
                    isHovered ? "opacity-60" : "opacity-40 animate-pulse"
                }`}
            />

            {/* Button body */}
            <div className="relative px-12 py-6 bg-grad-premium rounded-full border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4">
                    <span className="text-xl md:text-2xl font-bold text-white">
                        ابدأ البناء مجاناً
                    </span>
                    <motion.span
                        animate={{ x: isHovered ? 8 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ArrowIcon />
                    </motion.span>
                </div>
            </div>

            {/* Subtext */}
            <p className="mt-4 text-sm text-neutral-slate">
                لا يحتاج بطاقة ائتمان • جاهز في 30 ثانية
            </p>
        </motion.button>
    );
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function TrustItem({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function ScrollIndicator() {
    return (
        <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2"
        >
            <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white/40 rounded-full"
            />
        </motion.div>
    );
}

function ArrowIcon() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ZeroLearningHero,
};
