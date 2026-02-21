/**
 * Visual Motion Protocol (VMP)
 * Framer Motion Animations + Glassmorphism + Premium Shadows
 * 
 * Implements the sovereign visual effects protocol for high-end
 * animations and visual treatments.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MotionVariant {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    exit?: Record<string, number | string>;
    transition: {
        duration: number;
        ease?: string;
        delay?: number;
        repeat?: number;
        repeatType?: "loop" | "reverse" | "mirror";
        repeatDelay?: number;
    };
}

export interface HoverVariant {
    whileHover: Record<string, number | string>;
    whileTap: Record<string, number | string>;
    transition?: {
        duration: number;
        ease?: string;
    };
}

export interface VisualMotionConfig {
    animations: {
        fadeInUp: MotionVariant;
        fadeInDown: MotionVariant;
        fadeInLeft: MotionVariant;
        fadeInRight: MotionVariant;
        scaleIn: MotionVariant;
        rotateIn: MotionVariant;
        hoverScale: HoverVariant;
        hoverLift: HoverVariant;
        hoverGlow: HoverVariant;
        pulse: MotionVariant;
        shimmer: MotionVariant;
    };
    glassmorphism: {
        light: string;
        dark: string;
        premium: string;
        subtle: string;
    };
    shadows: {
        premium: string;
        subtle: string;
        dramatic: string;
        glow: string;
    };
    gradients: {
        brand: string;
        mesh: string;
        radial: string;
    };
}

// ============================================================================
// MOTION VARIANTS
// ============================================================================

/**
 * Core motion variants following the sovereign protocol
 */
export const MOTION_VARIANTS: VisualMotionConfig["animations"] = {
    // Fade In Up (Primary entrance animation)
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    },

    // Fade In Down
    fadeInDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    },

    // Fade In Left (RTL friendly)
    fadeInLeft: {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    },

    // Fade In Right (RTL friendly)
    fadeInRight: {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    },

    // Scale In (For cards, buttons)
    scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
    },

    // Rotate In (For decorative elements)
    rotateIn: {
        initial: { opacity: 0, rotate: -10 },
        animate: { opacity: 1, rotate: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
    },

    // Hover Scale (Interactive elements)
    hoverScale: {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.2, ease: "easeOut" },
    },

    // Hover Lift (Premium card effect)
    hoverLift: {
        whileHover: { y: -8, scale: 1.01 },
        whileTap: { y: 0, scale: 1 },
        transition: { duration: 0.3, ease: "easeOut" },
    },

    // Hover Glow (CTA buttons)
    hoverGlow: {
        whileHover: {
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
            scale: 1.02,
        },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.3, ease: "easeOut" },
    },

    // Pulse (Attention grabber)
    pulse: {
        initial: { scale: 1 },
        animate: { scale: 1.05 },
        exit: { scale: 1 },
        transition: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
        },
    },

    // Shimmer (Loading states)
    shimmer: {
        initial: { x: "-100%" },
        animate: { x: "100%" },
        transition: {
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0.5,
        },
    },
};

// ============================================================================
// GLASSMORPHISM STYLES
// ============================================================================

export const GLASSMORPHISM_STYLES: VisualMotionConfig["glassmorphism"] = {
    // Light glassmorphism (for light backgrounds)
    light: "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",

    // Dark glassmorphism (for dark backgrounds)
    dark: "bg-black/20 backdrop-blur-md border border-white/10 shadow-lg",

    // Premium glassmorphism (high-end cards)
    premium: "bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/10",

    // Subtle glassmorphism (minimal effect)
    subtle: "bg-white/5 backdrop-blur-sm border border-white/10",
};

// ============================================================================
// PREMIUM SHADOWS
// ============================================================================

export const PREMIUM_SHADOWS: VisualMotionConfig["shadows"] = {
    // Premium deep shadow (hero sections, featured cards)
    premium: "shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]",

    // Subtle shadow (everyday cards)
    subtle: "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",

    // Dramatic shadow (modals, overlays)
    dramatic: "shadow-[0_50px_100px_rgba(0,0,0,0.3)]",

    // Glow shadow (CTA buttons, highlights)
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.5)]",
};

// ============================================================================
// GRADIENT PRESETS
// ============================================================================

export const GRADIENT_PRESETS: VisualMotionConfig["gradients"] = {
    // Brand gradient (primary gradient)
    brand: "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400",

    // Mesh gradient (backgrounds)
    mesh: "bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20",

    // Radial gradient (spotlight effects)
    radial: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent",
};

// ============================================================================
// STRATEGIC LAYOUT PATTERNS (Z & F Patterns)
// ============================================================================

export interface LayoutPattern {
    name: string;
    description: string;
    useCase: string;
    structure: string[];
    ctaPosition: string;
}

export const LAYOUT_PATTERNS: Record<string, LayoutPattern> = {
    // Z-Pattern (for landing pages)
    zPattern: {
        name: "Z-Pattern",
        description: "Natural eye movement for left-to-right languages",
        useCase: "Landing pages, hero sections",
        structure: [
            "Top-left: Logo/Brand",
            "Top-right: Navigation/CTA",
            "Center: Value proposition",
            "Bottom-right: Primary CTA",
        ],
        ctaPosition: "top-right (LTR) / top-left (RTL)",
    },

    // F-Pattern (for content-heavy pages)
    fPattern: {
        name: "F-Pattern",
        description: "Reading pattern for text-heavy content",
        useCase: "Blog posts, documentation, pricing pages",
        structure: [
            "Top horizontal: Headline scanning",
            "Middle horizontal: Subheadline",
            "Vertical: Content scanning down left side",
        ],
        ctaPosition: "end of each horizontal bar",
    },

    // Gutenberg Diagram (balanced content)
    gutenberg: {
        name: "Gutenberg Diagram",
        description: "Divides page into four quadrants",
        useCase: "Homepage, dashboard",
        structure: [
            "Primary Optical Area (top-left): Logo, key message",
            "Strong Fallow Area (top-right): Navigation",
            "Weak Fallow Area (bottom-left): Secondary content",
            "Terminal Area (bottom-right): CTA, contact",
        ],
        ctaPosition: "Terminal Area (bottom-right for LTR)",
    },
};

// ============================================================================
// CTA PLACEMENT STRATEGY
// ============================================================================

export interface CTAPlacement {
    locale: "ar" | "en";
    primaryPosition: string;
    secondaryPosition: string;
    contrastRequirement: string;
    minHeight: string;
    minWidth: string;
}

export const CTA_PLACEMENT: Record<string, CTAPlacement> = {
    arabic: {
        locale: "ar",
        primaryPosition: "top-left (RTL natural)",
        secondaryPosition: "center-bottom",
        contrastRequirement: "High contrast with background (WCAG AA+)",
        minHeight: "48px",
        minWidth: "120px",
    },
    english: {
        locale: "en",
        primaryPosition: "top-right (LTR natural)",
        secondaryPosition: "center-bottom",
        contrastRequirement: "High contrast with background (WCAG AA+)",
        minHeight: "48px",
        minWidth: "120px",
    },
};

// ============================================================================
// RESPONSIVE UX PROTOCOL
// ============================================================================

export interface ResponsiveUXConfig {
    mobile: {
        navigation: string;
        buttonHeight: string;
        touchTarget: string;
        bottomSheet: boolean;
        thumbZone: string;
    };
    tablet: {
        columns: number;
        padding: string;
    };
    desktop: {
        columns: number;
        padding: string;
        maxWidth: string;
    };
}

export const RESPONSIVE_UX: ResponsiveUXConfig = {
    mobile: {
        navigation: "Bottom sheet (thumb-friendly)",
        buttonHeight: "48px minimum",
        touchTarget: "44x44px minimum",
        bottomSheet: true,
        thumbZone: "Bottom 1/3 of screen",
    },
    tablet: {
        columns: 2,
        padding: "1.5rem",
    },
    desktop: {
        columns: 12,
        padding: "2rem",
        maxWidth: "1400px",
    },
};

// ============================================================================
// VISUAL QUALITY GATE
// ============================================================================

export interface QualityCheckResult {
    name: string;
    passed: boolean;
    details?: string;
    recommendation?: string;
}

/**
 * Self-Correction Protocol - Visual Quality Gate
 */
export function runVisualQualityGate(config: {
    contrastRatio?: number;
    imageFormat?: string;
    imageSize?: number; // in KB
    hasWhitespace: boolean;
    whitespaceRatio?: number;
}): QualityCheckResult[] {
    const checks: QualityCheckResult[] = [];

    // Check 1: WCAG Contrast Ratio
    if (config.contrastRatio !== undefined) {
        checks.push({
            name: "WCAG Contrast Ratio",
            passed: config.contrastRatio >= 4.5,
            details: `Contrast ratio: ${config.contrastRatio.toFixed(2)}`,
            recommendation: config.contrastRatio < 4.5
                ? "Increase contrast to meet WCAG AA standard (4.5:1 minimum)"
                : undefined,
        });
    }

    // Check 2: Image Format (WebP only)
    if (config.imageFormat) {
        const isWebP = config.imageFormat.toLowerCase() === "webp";
        checks.push({
            name: "Image Format (WebP Required)",
            passed: isWebP,
            details: `Format: ${config.imageFormat}`,
            recommendation: isWebP
                ? undefined
                : "Convert images to WebP format for optimal performance",
        });
    }

    // Check 3: Image Size (Performance)
    if (config.imageSize !== undefined) {
        const isOptimized = config.imageSize < 200; // < 200KB
        checks.push({
            name: "Image Size Optimization",
            passed: isOptimized,
            details: `Size: ${config.imageSize}KB`,
            recommendation: isOptimized
                ? undefined
                : "Compress images to under 200KB for fast loading",
        });
    }

    // Check 4: Whitespace Ratio (Luxury feel)
    if (config.hasWhitespace && config.whitespaceRatio !== undefined) {
        const isLuxurious = config.whitespaceRatio >= 0.3; // 30%+ whitespace
        checks.push({
            name: "Whitespace Ratio (Luxury Feel)",
            passed: isLuxurious,
            details: `Whitespace: ${(config.whitespaceRatio * 100).toFixed(1)}%`,
            recommendation: isLuxurious
                ? undefined
                : "Increase whitespace by 15% for premium feel",
        });
    }

    // Check 5: High-End Assessment
    const overallScore = checks.filter(c => c.passed).length / checks.length;
    checks.push({
        name: "Overall High-End Assessment",
        passed: overallScore >= 0.8,
        details: `${(overallScore * 100).toFixed(0)}% quality score`,
        recommendation: overallScore >= 0.8
            ? "Design meets high-end standards"
            : "Review failed checks to achieve premium quality",
    });

    return checks;
}

// ============================================================================
// COMPLETE VISUAL CONFIG GENERATOR
// ============================================================================

export function generateVisualConfig(options?: {
    locale?: "ar" | "en";
    industry?: string;
}): VisualMotionConfig {
    const locale = options?.locale || "en";

    return {
        animations: MOTION_VARIANTS,
        glassmorphism: GLASSMORPHISM_STYLES,
        shadows: PREMIUM_SHADOWS,
        gradients: GRADIENT_PRESETS,
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    MOTION_VARIANTS,
    GLASSMORPHISM_STYLES,
    PREMIUM_SHADOWS,
    GRADIENT_PRESETS,
    LAYOUT_PATTERNS,
    CTA_PLACEMENT,
    RESPONSIVE_UX,
    runVisualQualityGate,
    generateVisualConfig,
};
