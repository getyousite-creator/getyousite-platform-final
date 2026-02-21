/**
 * Typography Synergy System
 * Golden Ratio (1.618) Typography Scale with Industry-Specific Font Pairing
 * 
 * Implements the sovereign typography protocol for professional design
 * that surpasses competitors.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FontPairing {
    bodyFont: string;
    headingFont: string;
    category: string;
    description: string;
}

export interface TypographyScale {
    xs: string;   // 0.75rem
    sm: string;   // 0.875rem
    base: string; // 1rem
    lg: string;   // 1.125rem
    xl: string;   // 1.25rem
    "2xl": string; // 1.5rem
    "3xl": string; // 1.875rem
    "4xl": string; // 2.25rem
    "5xl": string; // 3rem
    "6xl": string; // 3.75rem
    "7xl": string; // 4.5rem
}

export interface TypographyConfig {
    scale: TypographyScale;
    bodyFont: string;
    headingFont: string;
    lineHeight: number;
    letterSpacing: string;
    fontWeight: {
        body: string;
        heading: string;
    };
}

export interface IndustryTypographyProfile {
    industry: string;
    keywords: string[];
    pairing: FontPairing;
    scale: TypographyScale;
    lineHeight: number;
    letterSpacing: string;
}

// ============================================================================
// GOLDEN RATIO CALCULATOR
// ============================================================================

const GOLDEN_RATIO = 1.618;

/**
 * Generate typography scale based on golden ratio (1.618)
 * Starting from base size of 16px (1rem)
 */
export function generateGoldenRatioScale(baseSize: number = 16): TypographyScale {
    const scale: TypographyScale = {
        xs: `${(baseSize / (GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO)).toFixed(2)}px`,  // ~11px
        sm: `${(baseSize / (GOLDEN_RATIO * GOLDEN_RATIO)).toFixed(2)}px`,                  // ~12px
        base: `${baseSize}px`,                                                              // 16px
        lg: `${(baseSize * GOLDEN_RATIO).toFixed(2)}px`,                                    // ~26px
        xl: `${(baseSize * GOLDEN_RATIO * 1.2).toFixed(2)}px`,                              // ~31px
        "2xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO).toFixed(2)}px`,                  // ~42px
        "3xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO * 1.2).toFixed(2)}px`,            // ~50px
        "4xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO).toFixed(2)}px`,   // ~67px
        "5xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO * 1.2).toFixed(2)}px`, // ~81px
        "6xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO).toFixed(2)}px`, // ~109px
        "7xl": `${(baseSize * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO * GOLDEN_RATIO * 1.2).toFixed(2)}px`, // ~131px
    };

    return scale;
}

/**
 * Convert pixel scale to rem scale
 */
export function generateRemScale(baseSize: number = 16): TypographyScale {
    const pxScale = generateGoldenRatioScale(baseSize);
    
    const scale: TypographyScale = {
        xs: `${(parseFloat(pxScale.xs) / 16).toFixed(3)}rem`,
        sm: `${(parseFloat(pxScale.sm) / 16).toFixed(3)}rem`,
        base: `${(parseFloat(pxScale.base) / 16).toFixed(3)}rem`,
        lg: `${(parseFloat(pxScale.lg) / 16).toFixed(3)}rem`,
        xl: `${(parseFloat(pxScale.xl) / 16).toFixed(3)}rem`,
        "2xl": `${(parseFloat(pxScale["2xl"]) / 16).toFixed(3)}rem`,
        "3xl": `${(parseFloat(pxScale["3xl"]) / 16).toFixed(3)}rem`,
        "4xl": `${(parseFloat(pxScale["4xl"]) / 16).toFixed(3)}rem`,
        "5xl": `${(parseFloat(pxScale["5xl"]) / 16).toFixed(3)}rem`,
        "6xl": `${(parseFloat(pxScale["6xl"]) / 16).toFixed(3)}rem`,
        "7xl": `${(parseFloat(pxScale["7xl"]) / 16).toFixed(3)}rem`,
    };

    return scale;
}

// ============================================================================
// FONT PAIRING DATABASE
// ============================================================================

export const FONT_PAIRINGS: Record<string, FontPairing> = {
    // Arabic Font Pairings
    arabicStartup: {
        bodyFont: "IBM Plex Sans Arabic",
        headingFont: "IBM Plex Sans Arabic",
        category: "Arabic - Startup/Tech",
        description: "خط عصري تقني للشركات الناشئة والتطبيقات",
    },

    arabicService: {
        bodyFont: "Tajawal",
        headingFont: "Tajawal",
        category: "Arabic - Service Business",
        description: "خط واضح ومقروء للمواقع الخدمية",
    },

    arabicLuxury: {
        bodyFont: "Amiri",
        headingFont: "Amiri",
        category: "Arabic - Luxury/Literary",
        description: "خط كلاسيكي فاخر للمحتوى الأدبي والراقي",
    },

    arabicModern: {
        bodyFont: "Cairo",
        headingFont: "IBM Plex Sans Arabic",
        category: "Arabic - Modern Hybrid",
        description: "مزيج عصري بين Cairo للعناوين و IBM للنصوص",
    },

    // English Font Pairings
    englishStandard: {
        bodyFont: "Inter",
        headingFont: "Cal Sans",
        category: "English - Standard",
        description: "Inter للنصوص Cal Sans للعناوين - مزيج احترافي",
    },

    englishTech: {
        bodyFont: "Inter",
        headingFont: "Geist",
        category: "English - Tech/SaaS",
        description: "خطوط تقنية عصرية للتطبيقات والمنصات",
    },

    englishProfessional: {
        bodyFont: "Poppins",
        headingFont: "Montserrat",
        category: "English - Professional",
        description: "مزيج احترافي للأعمال والشركات",
    },

    englishLuxury: {
        bodyFont: "Lora",
        headingFont: "Playfair Display",
        category: "English - Luxury",
        description: "خطوط فاخرة للعلامات التجارية الراقية",
    },

    englishMinimal: {
        bodyFont: "Inter",
        headingFont: "Inter",
        category: "English - Minimal",
        description: "نفس الخط للعناوين والنصوص - تصميم مينيمالي",
    },
};

// ============================================================================
// INDUSTRY TYPOGRAPHY PROFILES
// ============================================================================

export const INDUSTRY_TYPOGRAPHY_PROFILES: Record<string, IndustryTypographyProfile> = {
    // Technology & SaaS
    tech: {
        industry: "Technology & SaaS",
        keywords: ["tech", "software", "saas", "ai", "startup", "digital", "app"],
        pairing: FONT_PAIRINGS.englishTech,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "-0.02em",
    },

    saas: {
        industry: "SaaS & Software",
        keywords: ["برمجيات", "تطبيق", "منصة", "تقنية", "ذكاء"],
        pairing: FONT_PAIRINGS.arabicModern,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    // Medical & Healthcare
    medical: {
        industry: "Medical & Healthcare",
        keywords: ["medical", "health", "doctor", "clinic", "hospital", "dental"],
        pairing: FONT_PAIRINGS.englishProfessional,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    clinic: {
        industry: "Clinic & Dental",
        keywords: ["عيادة", "طبيب", "صحة", "أسنان", "علاج"],
        pairing: FONT_PAIRINGS.arabicService,
        scale: generateRemScale(16),
        lineHeight: 1.8,
        letterSpacing: "0em",
    },

    // Finance & Legal
    finance: {
        industry: "Finance & Banking",
        keywords: ["finance", "bank", "investment", "money", "capital"],
        pairing: FONT_PAIRINGS.englishProfessional,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "-0.01em",
    },

    legal: {
        industry: "Legal & Law",
        keywords: ["law", "legal", "attorney", "lawyer", "court"],
        pairing: FONT_PAIRINGS.englishLuxury,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    // Food & Restaurant
    food: {
        industry: "Food & Restaurant",
        keywords: ["restaurant", "food", "cafe", "kitchen", "dining"],
        pairing: FONT_PAIRINGS.englishMinimal,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "0em",
    },

    restaurant: {
        industry: "Restaurant & Dining",
        keywords: ["مطعم", "طعام", "أكل", "مطبخ", "طبخ"],
        pairing: FONT_PAIRINGS.arabicModern,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    // E-commerce & Retail
    ecommerce: {
        industry: "E-commerce & Retail",
        keywords: ["ecommerce", "store", "shop", "retail", "shopping"],
        pairing: FONT_PAIRINGS.englishStandard,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "-0.01em",
    },

    store: {
        industry: "Store & Shopping",
        keywords: ["متجر", "تسوق", "شراء", "بيع", "منتجات"],
        pairing: FONT_PAIRINGS.arabicModern,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "0em",
    },

    // Real Estate
    realEstate: {
        industry: "Real Estate & Property",
        keywords: ["real estate", "property", "estate", "homes", "apartments"],
        pairing: FONT_PAIRINGS.englishLuxury,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    property: {
        industry: "Property & Housing",
        keywords: ["عقارات", "مباني", "شقق", "فلل", "أراضي"],
        pairing: FONT_PAIRINGS.arabicLuxury,
        scale: generateRemScale(16),
        lineHeight: 1.8,
        letterSpacing: "0em",
    },

    // Education
    education: {
        industry: "Education & Training",
        keywords: ["education", "school", "academy", "course", "training"],
        pairing: FONT_PAIRINGS.englishStandard,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0em",
    },

    academy: {
        industry: "Academy & Courses",
        keywords: ["تعليم", "أكاديمية", "دورات", "تدريب", "تعلم"],
        pairing: FONT_PAIRINGS.arabicStartup,
        scale: generateRemScale(16),
        lineHeight: 1.8,
        letterSpacing: "0em",
    },

    // Fitness
    fitness: {
        industry: "Fitness & Sports",
        keywords: ["fitness", "gym", "sports", "workout", "training"],
        pairing: FONT_PAIRINGS.englishStandard,
        scale: generateRemScale(16),
        lineHeight: 1.5,
        letterSpacing: "0.02em",
    },

    gym: {
        industry: "Gym & Fitness",
        keywords: ["جيم", "رياضة", "لياقة", "تمارين", "كمال أجسام"],
        pairing: FONT_PAIRINGS.arabicModern,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "0em",
    },

    // Beauty & Luxury
    beauty: {
        industry: "Beauty & Cosmetics",
        keywords: ["beauty", "cosmetics", "salon", "spa", "skincare"],
        pairing: FONT_PAIRINGS.englishLuxury,
        scale: generateRemScale(16),
        lineHeight: 1.7,
        letterSpacing: "0.05em",
    },

    luxury: {
        industry: "Luxury & Premium",
        keywords: ["luxury", "premium", "exclusive", "vip", "فاخر", "راقي"],
        pairing: FONT_PAIRINGS.englishLuxury,
        scale: generateRemScale(16),
        lineHeight: 1.8,
        letterSpacing: "0.05em",
    },

    // Default
    default: {
        industry: "General Business",
        keywords: [],
        pairing: FONT_PAIRINGS.englishStandard,
        scale: generateRemScale(16),
        lineHeight: 1.6,
        letterSpacing: "0em",
    },
};

// ============================================================================
// TYPOGRAPHY ENGINE FUNCTIONS
// ============================================================================

/**
 * Find the best matching typography profile for a given niche
 */
export function findTypographyProfile(niche: string, vision?: string): IndustryTypographyProfile {
    const search = `${niche} ${vision || ""}`.toLowerCase();

    // Direct keyword matching
    for (const profile of Object.values(INDUSTRY_TYPOGRAPHY_PROFILES)) {
        if (profile.keywords.some(kw => search.includes(kw))) {
            console.log(`[Typography Engine] Matched: ${profile.industry}`);
            return profile;
        }
    }

    // Fallback to default
    console.log("[Typography Engine] No match found, using default profile");
    return INDUSTRY_TYPOGRAPHY_PROFILES.default;
}

/**
 * Generate complete typography configuration
 */
export function generateTypographyConfig(
    niche: string,
    vision?: string,
    locale: string = "en"
): TypographyConfig {
    const profile = findTypographyProfile(niche, vision);

    // Override font pairing based on locale
    let pairing = profile.pairing;
    if (locale === "ar") {
        // Prefer Arabic pairings for Arabic locale
        if (!profile.pairing.category.startsWith("Arabic")) {
            if (niche.toLowerCase().match(/تقنية|برمجيات|تطبيق/)) {
                pairing = FONT_PAIRINGS.arabicStartup;
            } else if (niche.toLowerCase().match(/فاخر|راقي/)) {
                pairing = FONT_PAIRINGS.arabicLuxury;
            } else {
                pairing = FONT_PAIRINGS.arabicService;
            }
        }
    }

    return {
        scale: profile.scale,
        bodyFont: pairing.bodyFont,
        headingFont: pairing.headingFont,
        lineHeight: profile.lineHeight,
        letterSpacing: profile.letterSpacing,
        fontWeight: {
            body: "400",
            heading: "700",
        },
    };
}

/**
 * Generate CSS variables for typography
 */
export function generateTypographyCSS(config: TypographyConfig): string {
    return `
:root {
    --font-body: "${config.bodyFont}", system-ui, sans-serif;
    --font-heading: "${config.headingFont}", system-ui, sans-serif;
    
    --text-xs: ${config.scale.xs};
    --text-sm: ${config.scale.sm};
    --text-base: ${config.scale.base};
    --text-lg: ${config.scale.lg};
    --text-xl: ${config.scale.xl};
    --text-2xl: ${config.scale["2xl"]};
    --text-3xl: ${config.scale["3xl"]};
    --text-4xl: ${config.scale["4xl"]};
    --text-5xl: ${config.scale["5xl"]};
    
    --line-height: ${config.lineHeight};
    --letter-spacing: ${config.letterSpacing};
    
    --font-weight-body: ${config.fontWeight.body};
    --font-weight-heading: ${config.fontWeight.heading};
}

body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
    font-weight: var(--font-weight-body);
}

h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-weight-heading);
    line-height: 1.2;
    letter-spacing: -0.02em;
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }
`.trim();
}

/**
 * Validate font count (max 2 families per site)
 */
export function validateFontCount(config: TypographyConfig): boolean {
    const uniqueFonts = new Set([config.bodyFont, config.headingFont]);
    return uniqueFonts.size <= 2;
}

/**
 * Check if font is available in Google Fonts
 */
export function isGoogleFont(fontName: string): boolean {
    const googleFonts = [
        "Inter",
        "Poppins",
        "Montserrat",
        "Lora",
        "Playfair Display",
        "Cal Sans",
        "Geist",
        "Tajawal",
        "Cairo",
        "IBM Plex Sans Arabic",
        "Amiri",
        "Noto Sans Arabic",
    ];

    return googleFonts.some(f => fontName.toLowerCase().includes(f.toLowerCase()));
}

/**
 * Export default object with all exports
 */
const typographySynergy = {
    generateGoldenRatioScale,
    generateRemScale,
    findTypographyProfile,
    generateTypographyConfig,
    generateTypographyCSS,
    validateFontCount,
    isGoogleFont,
    FONT_PAIRINGS,
    INDUSTRY_TYPOGRAPHY_PROFILES,
    GOLDEN_RATIO,
};

export default typographySynergy;
