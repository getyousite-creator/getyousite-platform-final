/**
 * Super-Visual Protocol (SVP-V2)
 * Semantic Color Engine with Industry-Specific Psychology
 * 
 * This engine doesn't pick colors randomly - it maps business sectors
 * to targeted emotions using color psychology principles.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
    text: string;
    cta: string;
}

export interface IndustryColorProfile {
    industry: string;
    keywords: string[];
    palette: ColorPalette;
    emotion: string;
    psychology: string;
    gradient?: string;
}

export interface TypographyScale {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
}

export interface TypographyConfig {
    bodyFont: string;
    headingFont: string;
    scale: TypographyScale;
    lineHeight: number;
    letterSpacing: string;
}

export interface VisualMotionConfig {
    fadeInUp: {
        initial: { opacity: number; y: number };
        animate: { opacity: number; y: number };
        transition: { duration: number; ease: string };
    };
    hoverScale: {
        whileHover: { scale: number };
        whileTap: { scale: number };
    };
    glassmorphism: string;
    shadows: {
        premium: string;
        subtle: string;
        dramatic: string;
    };
}

// ============================================================================
// SEMANTIC COLOR ENGINE - INDUSTRY PROFILES
// ============================================================================

export const INDUSTRY_COLOR_PROFILES: Record<string, IndustryColorProfile> = {
    // Financial & Legal - Trust & Authority
    finance: {
        industry: "Finance & Banking",
        keywords: ["finance", "bank", "investment", "money", "capital", "wealth", "financial"],
        palette: {
            primary: "#1E3A8A",      // Royal Blue
            secondary: "#1F2937",    // Charcoal Gray
            accent: "#10B981",       // Emerald Green (growth)
            neutral: "#6B7280",      // Medium Gray
            background: "#F9FAFB",   // Off-white
            text: "#111827",         // Near black
            cta: "#F59E0B",          // Amber (action)
        },
        emotion: "الثقة والرزانة (Trust & Stability)",
        psychology: "الأزرق الملكي يزرع الثقة، الرمادي يضيف الرزانة، الأخضر يرمز للنمو المالي",
        gradient: "from-blue-900 via-blue-800 to-blue-700",
    },

    legal: {
        industry: "Legal & Law",
        keywords: ["law", "legal", "attorney", "lawyer", "court", "justice", "law firm"],
        palette: {
            primary: "#1E3A8A",      // Navy Blue
            secondary: "#374151",    // Slate Gray
            accent: "#DC2626",       // Deep Red (authority)
            neutral: "#6B7280",      // Gray
            background: "#FEFEFE",   // Pure white
            text: "#030712",         // Black
            cta: "#CA8A04",          // Gold (prestige)
        },
        emotion: "السلطة والهيبة (Authority & Prestige)",
        psychology: "الأزرق الداكن يرمز للعدالة، الذهبي يضيف الفخامة، الأحمر الداكن للقوة",
        gradient: "from-slate-900 via-blue-900 to-slate-800",
    },

    // Food & Restaurant - Appetite & Warmth
    food: {
        industry: "Food & Restaurant",
        keywords: ["restaurant", "food", "cafe", "kitchen", "dining", "cuisine", "chef"],
        palette: {
            primary: "#EA580C",      // Burnt Orange
            secondary: "#F59E0B",    // Warm Yellow
            accent: "#16A34A",       // Fresh Green
            neutral: "#78716C",      // Warm Gray
            background: "#FFFBEB",   // Warm cream
            text: "#292524",         // Warm brown
            cta: "#DC2626",          // Tomato Red (urgency)
        },
        emotion: "الشهية والدفء (Appetite & Warmth)",
        psychology: "البرتقالي والأصفر يحفزان الشهية، الأحمر يخلق الإلحاح، الأخضر للنضارة",
        gradient: "from-orange-600 via-orange-500 to-yellow-500",
    },

    restaurant: {
        industry: "Restaurant & Dining",
        keywords: ["مطعم", "طعام", "أكل", "مطبخ", "طبخ", "وجبات"],
        palette: {
            primary: "#EA580C",
            secondary: "#F59E0B",
            accent: "#16A34A",
            neutral: "#78716C",
            background: "#FFFBEB",
            text: "#292524",
            cta: "#DC2626",
        },
        emotion: "الشهية والدفء (Appetite & Warmth)",
        psychology: "الألوان الدافئة تحفز الشهية وتجعل الزبون يشعر بالجوع",
        gradient: "from-orange-600 via-orange-500 to-yellow-500",
    },

    // Technology & AI - Innovation & Future
    tech: {
        industry: "Technology & SaaS",
        keywords: ["tech", "software", "saas", "ai", "artificial", "startup", "digital", "app"],
        palette: {
            primary: "#7C3AED",      // Deep Purple
            secondary: "#09090B",    // Carbon Black
            accent: "#06B6D4",       // Cyan (future)
            neutral: "#52525B",      // Zinc Gray
            background: "#09090B",   // Dark mode default
            text: "#FAFAFA",         // White
            cta: "#8B5CF6",          // Violet (action)
        },
        emotion: "الابتكار والمستقبل (Innovation & Future)",
        psychology: "البنفسجي يرمز للإبداع، الأسود للفخامة التقنية، السيان للمستقبل",
        gradient: "from-violet-700 via-purple-600 to-indigo-600",
    },

    saas: {
        industry: "SaaS & Software",
        keywords: ["برمجيات", "تطبيق", "منصة", "تقنية", "ذكاء", "سحابي"],
        palette: {
            primary: "#7C3AED",
            secondary: "#09090B",
            accent: "#06B6D4",
            neutral: "#52525B",
            background: "#09090B",
            text: "#FAFAFA",
            cta: "#8B5CF6",
        },
        emotion: "الابتكار والمستقبل (Innovation & Future)",
        psychology: "تدرجات البنفسجي مع الأسود تخلق هوية تقنية فاخرة",
        gradient: "from-violet-700 via-purple-600 to-indigo-600",
    },

    // Medical & Healthcare - Trust & Care
    medical: {
        industry: "Medical & Healthcare",
        keywords: ["medical", "health", "doctor", "clinic", "hospital", "dental", "healthcare"],
        palette: {
            primary: "#0284C7",      // Sky Blue
            secondary: "#06B6D4",    // Cyan
            accent: "#10B981",       // Green (health)
            neutral: "#64748B",      // Slate
            background: "#F0F9FF",   // Light blue tint
            text: "#0C4A6E",         // Dark blue
            cta: "#EF4444",          // Red (urgency)
        },
        emotion: "الثقة والعناية (Trust & Care)",
        psychology: "الأزرق السماكي يهدئ، الأخضر يرمز للصحة، الأبيض للنقاء",
        gradient: "from-cyan-600 via-blue-500 to-cyan-400",
    },

    clinic: {
        industry: "Clinic & Dental",
        keywords: ["عيادة", "طبيب", "صحة", "أسنان", "علاج", "طبي"],
        palette: {
            primary: "#0284C7",
            secondary: "#06B6D4",
            accent: "#10B981",
            neutral: "#64748B",
            background: "#F0F9FF",
            text: "#0C4A6E",
            cta: "#EF4444",
        },
        emotion: "الثقة والعناية (Trust & Care)",
        psychology: "الألوان الهادئة تريح المريض وتزرع الثقة",
        gradient: "from-cyan-600 via-blue-500 to-cyan-400",
    },

    // Real Estate - Luxury & Stability
    realEstate: {
        industry: "Real Estate & Property",
        keywords: ["real estate", "property", "estate", "homes", "apartments", "housing"],
        palette: {
            primary: "#78350F",      // Amber Brown
            secondary: "#1C1917",    // Rich Black
            accent: "#F59E0B",       // Gold
            neutral: "#78716C",      // Stone
            background: "#FAFAF9",   // Warm white
            text: "#292524",         // Stone black
            cta: "#DC2626",          // Red (urgency)
        },
        emotion: "الفخامة والاستقرار (Luxury & Stability)",
        psychology: "البني يرمز للأرض والاستقرار، الذهبي للفخامة",
        gradient: "from-amber-900 via-amber-800 to-amber-700",
    },

    property: {
        industry: "Property & Housing",
        keywords: ["عقارات", "مباني", "شقق", "فلل", "أراضي", "تمليك"],
        palette: {
            primary: "#78350F",
            secondary: "#1C1917",
            accent: "#F59E0B",
            neutral: "#78716C",
            background: "#FAFAF9",
            text: "#292524",
            cta: "#DC2626",
        },
        emotion: "الفخامة والاستقرار (Luxury & Stability)",
        psychology: "الألوان الترابية ترمز للأرض والعقار",
        gradient: "from-amber-900 via-amber-800 to-amber-700",
    },

    // E-commerce & Retail - Action & Desire
    ecommerce: {
        industry: "E-commerce & Retail",
        keywords: ["ecommerce", "store", "shop", "retail", "shopping", "marketplace"],
        palette: {
            primary: "#DC2626",      // Red (urgency)
            secondary: "#1F2937",    // Dark Gray
            accent: "#10B981",       // Green (success)
            neutral: "#6B7280",      // Gray
            background: "#FFFFFF",   // Pure white
            text: "#111827",         // Black
            cta: "#EA580C",          // Orange (impulse)
        },
        emotion: "الرغبة والإلحاح (Desire & Urgency)",
        psychology: "الأحمر يخلق إلحاح الشراء، البرتقالي للشراء الاندفاعي",
        gradient: "from-red-600 via-red-500 to-orange-500",
    },

    store: {
        industry: "Store & Shopping",
        keywords: ["متجر", "تسوق", "شراء", "بيع", "منتجات", "تجارة"],
        palette: {
            primary: "#DC2626",
            secondary: "#1F2937",
            accent: "#10B981",
            neutral: "#6B7280",
            background: "#FFFFFF",
            text: "#111827",
            cta: "#EA580C",
        },
        emotion: "الرغبة والإلحاح (Desire & Urgency)",
        psychology: "الأحمر يحفز الشراء الفوري",
        gradient: "from-red-600 via-red-500 to-orange-500",
    },

    // Education - Knowledge & Growth
    education: {
        industry: "Education & Training",
        keywords: ["education", "school", "academy", "course", "training", "learning"],
        palette: {
            primary: "#2563EB",      // Blue (knowledge)
            secondary: "#7C3AED",    // Purple (wisdom)
            accent: "#10B981",       // Green (growth)
            neutral: "#64748B",      // Slate
            background: "#F8FAFC",   // Light slate
            text: "#1E293B",         // Slate dark
            cta: "#F59E0B",          // Amber (action)
        },
        emotion: "المعرفة والنمو (Knowledge & Growth)",
        psychology: "الأزرق للحكمة، البنفسجي للمعرفة، الأخضر للنمو",
        gradient: "from-blue-600 via-indigo-500 to-purple-500",
    },

    academy: {
        industry: "Academy & Courses",
        keywords: ["تعليم", "أكاديمية", "دورات", "تدريب", "تعلم", "مهارات"],
        palette: {
            primary: "#2563EB",
            secondary: "#7C3AED",
            accent: "#10B981",
            neutral: "#64748B",
            background: "#F8FAFC",
            text: "#1E293B",
            cta: "#F59E0B",
        },
        emotion: "المعرفة والنمو (Knowledge & Growth)",
        psychology: "الألوان الباردة تعزز التركيز والتعلم",
        gradient: "from-blue-600 via-indigo-500 to-purple-500",
    },

    // Fitness & Sports - Energy & Action
    fitness: {
        industry: "Fitness & Sports",
        keywords: ["fitness", "gym", "sports", "workout", "training", "athletic"],
        palette: {
            primary: "#DC2626",      // Red (energy)
            secondary: "#111827",    // Black
            accent: "#F59E0B",       // Orange (action)
            neutral: "#6B7280",      // Gray
            background: "#111827",   // Dark
            text: "#F9FAFB",         // White
            cta: "#EF4444",          // Bright red
        },
        emotion: "الطاقة والحماس (Energy & Action)",
        psychology: "الأحمر والأسود يخلقان طاقة وحماس عاليين",
        gradient: "from-red-600 via-red-500 to-orange-500",
    },

    gym: {
        industry: "Gym & Fitness",
        keywords: ["جيم", "رياضة", "لياقة", "تمارين", "كمال أجسام", "صحة"],
        palette: {
            primary: "#DC2626",
            secondary: "#111827",
            accent: "#F59E0B",
            neutral: "#6B7280",
            background: "#111827",
            text: "#F9FAFB",
            cta: "#EF4444",
        },
        emotion: "الطاقة والحماس (Energy & Action)",
        psychology: "الألوان القوية تحفز على الحركة",
        gradient: "from-red-600 via-red-500 to-orange-500",
    },

    // Beauty & Luxury - Elegance & Sophistication
    beauty: {
        industry: "Beauty & Cosmetics",
        keywords: ["beauty", "cosmetics", "salon", "spa", "skincare", "makeup"],
        palette: {
            primary: "#EC4899",      // Pink
            secondary: "#831843",    // Deep Magenta
            accent: "#F472B6",       // Light Pink
            neutral: "#9CA3AF",      // Silver
            background: "#FDF2F8",   // Pink tint
            text: "#831843",         // Deep pink
            cta: "#DB2777",          // Hot pink
        },
        emotion: "الأناقة والأنوثة (Elegance & Femininity)",
        psychology: "الوردي يرمز للأنوثة والجمال",
        gradient: "from-pink-500 via-pink-400 to-rose-300",
    },

    luxury: {
        industry: "Luxury & Premium",
        keywords: ["luxury", "premium", "exclusive", "vip", "high-end", "فاخر", "راقي"],
        palette: {
            primary: "#000000",      // Pure Black
            secondary: "#1F2937",    // Charcoal
            accent: "#D4AF37",       // Metallic Gold
            neutral: "#6B7280",      // Gray
            background: "#090909",   // Near black
            text: "#FAFAFA",         // White
            cta: "#D4AF37",          // Gold
        },
        emotion: "الفخامة والحصرية (Luxury & Exclusivity)",
        psychology: "الأسود والذهبي يخلقان فخامة مطلقة",
        gradient: "from-neutral-900 via-neutral-800 to-neutral-700",
    },

    // Default Fallback
    default: {
        industry: "General Business",
        keywords: [],
        palette: {
            primary: "#2563EB",      // Blue
            secondary: "#1E293B",    // Slate
            accent: "#10B981",       // Green
            neutral: "#64748B",      // Slate
            background: "#FFFFFF",   // White
            text: "#111827",         // Black
            cta: "#2563EB",          // Blue
        },
        emotion: "الاحترافية والثقة (Professionalism & Trust)",
        psychology: "الأزرق هو اللون الأكثر أماناً للأعمال العامة",
        gradient: "from-blue-600 via-blue-500 to-blue-400",
    },
};

// ============================================================================
// COLOR ENGINE FUNCTIONS
// ============================================================================

/**
 * Find the best matching color profile for a given niche
 */
export function findColorProfile(niche: string, vision?: string): IndustryColorProfile {
    const search = `${niche} ${vision || ""}`.toLowerCase();

    // Direct keyword matching
    for (const profile of Object.values(INDUSTRY_COLOR_PROFILES)) {
        if (profile.keywords.some(kw => search.includes(kw))) {
            console.log(`[Color Engine] Matched: ${profile.industry}`);
            return profile;
        }
    }

    // Fallback to default
    console.log("[Color Engine] No match found, using default profile");
    return INDUSTRY_COLOR_PROFILES.default;
}

/**
 * Generate Tailwind CSS variables from color palette
 */
export function generateTailwindVariables(palette: ColorPalette): string {
    return `
:root {
    --color-primary: ${palette.primary};
    --color-secondary: ${palette.secondary};
    --color-accent: ${palette.accent};
    --color-neutral: ${palette.neutral};
    --color-background: ${palette.background};
    --color-text: ${palette.text};
    --color-cta: ${palette.cta};
}
`.trim();
}

/**
 * Generate CSS custom properties for gradients
 */
export function generateGradientCSS(gradient?: string): string {
    if (!gradient) return "";

    return `
.bg-gradient-brand {
    background: linear-gradient(to right, var(--tw-gradient-stops));
    --tw-gradient-from: ${gradient.split(" ")[1] || "var(--color-primary)"};
    --tw-gradient-to: ${gradient.split(" ")[3] || "var(--color-accent)"};
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
`.trim();
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.1)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
    // Simple implementation - in production, use proper luminance calculation
    const getLuminance = (hex: string): number => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });

        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate WCAG compliance for a color palette
 */
export function validateWCAG(palette: ColorPalette): {
    textOnBackground: { ratio: number; pass: boolean };
    ctaOnBackground: { ratio: number; pass: boolean };
    primaryOnSecondary: { ratio: number; pass: boolean };
} {
    const AA_MIN = 4.5; // WCAG AA standard for normal text

    return {
        textOnBackground: {
            ratio: calculateContrastRatio(palette.text, palette.background),
            pass: calculateContrastRatio(palette.text, palette.background) >= AA_MIN,
        },
        ctaOnBackground: {
            ratio: calculateContrastRatio(palette.cta, palette.background),
            pass: calculateContrastRatio(palette.cta, palette.background) >= AA_MIN,
        },
        primaryOnSecondary: {
            ratio: calculateContrastRatio(palette.primary, palette.secondary),
            pass: calculateContrastRatio(palette.primary, palette.secondary) >= AA_MIN,
        },
    };
}

/**
 * Generate complete color theme configuration
 */
export function generateColorTheme(niche: string, vision?: string): {
    palette: ColorPalette;
    profile: IndustryColorProfile;
    wcag: ReturnType<typeof validateWCAG>;
    css: string;
    gradient: string;
} {
    const profile = findColorProfile(niche, vision);
    const wcag = validateWCAG(profile.palette);
    const css = generateTailwindVariables(profile.palette);
    const gradient = profile.gradient || "";

    // Log WCAG warnings
    if (!wcag.textOnBackground.pass) {
        console.warn(`[Color Engine] WCAG Warning: Text/Background contrast ${wcag.textOnBackground.ratio.toFixed(2)} < 4.5`);
    }
    if (!wcag.ctaOnBackground.pass) {
        console.warn(`[Color Engine] WCAG Warning: CTA/Background contrast ${wcag.ctaOnBackground.ratio.toFixed(2)} < 4.5`);
    }

    return {
        palette: profile.palette,
        profile,
        wcag,
        css,
        gradient,
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    findColorProfile,
    generateTailwindVariables,
    generateGradientCSS,
    calculateContrastRatio,
    validateWCAG,
    generateColorTheme,
    INDUSTRY_COLOR_PROFILES,
};
