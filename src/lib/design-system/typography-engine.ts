/**
 * Multilingual Typography Engine
 * 
 * Harmonious Arabic/English typography with golden ratio scaling (φ ≈ 1.618)
 * Using Clash Display + IBM Plex Sans Arabic for headings
 * Using Satoshi + Tajawal for body text
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FontFamily {
    name: string;
    stack: string;
    weights: number[];
    usage: string;
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
    "6xl": string;
    "7xl": string;
}

export interface TypographyConfig {
    headingFont: FontFamily;
    bodyFont: FontFamily;
    arabicHeadingFont: FontFamily;
    arabicBodyFont: FontFamily;
    scale: TypographyScale;
    lineHeight: {
        heading: number;
        body: number;
    };
    letterSpacing: {
        heading: string;
        body: string;
    };
}

// ============================================================================
// FONT FAMILIES
// ============================================================================

/**
 * English Heading Font - Clash Display
 * Geometric, precise, modern - suggests engineering precision
 */
export const CLASH_DISPLAY: FontFamily = {
    name: "Clash Display",
    stack: '"Clash Display", system-ui, sans-serif',
    weights: [400, 500, 600, 700],
    usage: "Headings (H1-H6) - English",
};

/**
 * English Body Font - Satoshi
 * Clean, readable, geometric sans-serif
 */
export const SATOSHI: FontFamily = {
    name: "Satoshi",
    stack: '"Satoshi", system-ui, sans-serif',
    weights: [300, 400, 500, 700],
    usage: "Body text - English",
};

/**
 * Arabic Heading Font - IBM Plex Sans Arabic (Bold)
 * Technical, precise, harmonious with Clash Display
 */
export const IBM_PLEX_ARABIC: FontFamily = {
    name: "IBM Plex Sans Arabic",
    stack: '"IBM Plex Sans Arabic", system-ui, sans-serif',
    weights: [400, 500, 600, 700],
    usage: "Headings (H1-H6) - Arabic",
};

/**
 * Arabic Body Font - Tajawal
 * Clean, modern, highly readable
 */
export const TAJAWAL: FontFamily = {
    name: "Tajawal",
    stack: '"Tajawal", system-ui, sans-serif',
    weights: [300, 400, 500, 700],
    usage: "Body text - Arabic",
};

// ============================================================================
// GOLDEN RATIO TYPOGRAPHY SCALE
// ============================================================================

const GOLDEN_RATIO = 1.618;

/**
 * Generate typography scale based on golden ratio (φ ≈ 1.618)
 * Starting from base size of 16px (1rem)
 * 
 * This ensures perfect visual harmony and eye comfort
 */
export function generateGoldenRatioScale(baseSize: number = 16): TypographyScale {
    return {
        xs: `${(baseSize / (GOLDEN_RATIO ** 4)).toFixed(2)}px`,   // ~11px
        sm: `${(baseSize / (GOLDEN_RATIO ** 3)).toFixed(2)}px`,   // ~12px
        base: `${baseSize}px`,                                     // 16px
        lg: `${(baseSize * GOLDEN_RATIO).toFixed(2)}px`,          // ~26px
        xl: `${(baseSize * GOLDEN_RATIO ** 1.2).toFixed(2)}px`,   // ~31px
        "2xl": `${(baseSize * GOLDEN_RATIO ** 1.4).toFixed(2)}px`, // ~42px
        "3xl": `${(baseSize * GOLDEN_RATIO ** 1.6).toFixed(2)}px`, // ~56px
        "4xl": `${(baseSize * GOLDEN_RATIO ** 1.8).toFixed(2)}px`, // ~75px
        "5xl": `${(baseSize * GOLDEN_RATIO ** 2).toFixed(2)}px`,  // ~100px
        "6xl": `${(baseSize * GOLDEN_RATIO ** 2.2).toFixed(2)}px`, // ~134px
        "7xl": `${(baseSize * GOLDEN_RATIO ** 2.4).toFixed(2)}px`, // ~179px
    };
}

/**
 * Generate REM-based scale (better for accessibility)
 */
export function generateRemScale(baseSize: number = 16): TypographyScale {
    const pxScale = generateGoldenRatioScale(baseSize);
    
    return {
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
}

// ============================================================================
// TYPOGRAPHY CONFIGURATION
// ============================================================================

export const TYPOGRAPHY_CONFIG: TypographyConfig = {
    headingFont: CLASH_DISPLAY,
    bodyFont: SATOSHI,
    arabicHeadingFont: IBM_PLEX_ARABIC,
    arabicBodyFont: TAJAWAL,
    scale: generateRemScale(16),
    lineHeight: {
        heading: 1.2, // Tight for headings
        body: 1.7,    // Comfortable for reading
    },
    letterSpacing: {
        heading: "-0.02em", // Slightly tight for premium feel
        body: "0em",        // Normal for readability
    },
};

// ============================================================================
// CSS GENERATOR
// ============================================================================

/**
 * Generate CSS variables for typography system
 */
export function generateTypographyCSS(): string {
    const config = TYPOGRAPHY_CONFIG;
    
    return `
/* ============================================
   MULTILINGUAL TYPOGRAPHY ENGINE
   Golden Ratio Scale (φ ≈ 1.618)
   ============================================ */

:root {
    /* Font Families - English */
    --font-heading: ${config.headingFont.stack};
    --font-body: ${config.bodyFont.stack};
    
    /* Font Families - Arabic */
    --font-arabic-heading: ${config.arabicHeadingFont.stack};
    --font-arabic-body: ${config.arabicBodyFont.stack};
    
    /* Typography Scale (Golden Ratio) */
    --text-xs: ${config.scale.xs};
    --text-sm: ${config.scale.sm};
    --text-base: ${config.scale.base};
    --text-lg: ${config.scale.lg};
    --text-xl: ${config.scale.xl};
    --text-2xl: ${config.scale["2xl"]};
    --text-3xl: ${config.scale["3xl"]};
    --text-4xl: ${config.scale["4xl"]};
    --text-5xl: ${config.scale["5xl"]};
    --text-6xl: ${config.scale["6xl"]};
    --text-7xl: ${config.scale["7xl"]};
    
    /* Line Heights */
    --line-height-heading: ${config.lineHeight.heading};
    --line-height-body: ${config.lineHeight.body};
    
    /* Letter Spacing */
    --letter-spacing-heading: ${config.letterSpacing.heading};
    --letter-spacing-body: ${config.letterSpacing.body};
    
    /* Font Weights */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
}

/* Base Typography */
body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--line-height-body);
    letter-spacing: var(--letter-spacing-body);
    font-weight: var(--font-weight-normal);
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    line-height: var(--line-height-heading);
    letter-spacing: var(--letter-spacing-heading);
    font-weight: var(--font-weight-bold);
}

/* Arabic Typography */
[dir="rtl"] {
    --font-heading: var(--font-arabic-heading);
    --font-body: var(--font-arabic-body);
}

[dir="rtl"] h1,
[dir="rtl"] h2,
[dir="rtl"] h3,
[dir="rtl"] h4,
[dir="rtl"] h5,
[dir="rtl"] h6 {
    font-family: var(--font-arabic-heading);
    font-weight: var(--font-weight-bold);
}

/* Heading Sizes */
h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }

/* Responsive Typography */
@media (max-width: 768px) {
    h1 { font-size: var(--text-4xl); }
    h2 { font-size: var(--text-3xl); }
    h3 { font-size: var(--text-2xl); }
}
`.trim();
}

// ============================================================================
// TAILWIND CONFIG EXTENSION
// ============================================================================

/**
 * Generate Tailwind config for typography
 */
export function generateTailwindTypographyConfig(): Record<string, unknown> {
    const config = TYPOGRAPHY_CONFIG;
    
    return {
        theme: {
            extend: {
                fontFamily: {
                    heading: [config.headingFont.name],
                    body: [config.bodyFont.name],
                    "arabic-heading": [config.arabicHeadingFont.name],
                    "arabic-body": [config.arabicBodyFont.name],
                },
                fontSize: {
                    xs: config.scale.xs,
                    sm: config.scale.sm,
                    base: config.scale.base,
                    lg: config.scale.lg,
                    xl: config.scale.xl,
                    "2xl": config.scale["2xl"],
                    "3xl": config.scale["3xl"],
                    "4xl": config.scale["4xl"],
                    "5xl": config.scale["5xl"],
                    "6xl": config.scale["6xl"],
                    "7xl": config.scale["7xl"],
                },
                lineHeight: {
                    heading: config.lineHeight.heading.toString(),
                    body: config.lineHeight.body.toString(),
                },
                letterSpacing: {
                    heading: config.letterSpacing.heading,
                    body: config.letterSpacing.body,
                },
                fontWeight: {
                    light: "300",
                    normal: "400",
                    medium: "500",
                    semibold: "600",
                    bold: "700",
                },
            },
        },
    };
}

// ============================================================================
// FONT LOADING UTILITIES
// ============================================================================

/**
 * Generate Google Fonts import URL
 */
export function getGoogleFontsURL(): string {
    const fonts = [
        "IBM+Plex+Sans+Arabic:wght@400;500;600;700",
        "Tajawal:wght@300;400;500;700",
    ];
    
    return `https://fonts.googleapis.com/css2?family=${fonts.join("&family=")}&display=swap`;
}

/**
 * Generate font preload links
 */
export function generateFontPreloads(): string[] {
    const base = "https://fonts.gstatic.com/s";
    
    return [
        `<link rel="preload" href="${base}/ibmplexsansarabic/v12/LDI0apOFNxEwR-Bd1O9uYNmnUQomAgE25imKSzHh.woff2" as="font" type="font/woff2" crossorigin>`,
        `<link rel="preload" href="${base}/tajawal/v14/Iura6YBj_oCad4k1nzrBCB5I.woff2" as="font" type="font/woff2" crossorigin>`,
    ];
}

// ============================================================================
// TYPOGRAPHY VALIDATOR
// ============================================================================

export interface TypographyValidationResult {
    valid: boolean;
    warnings: string[];
    recommendations: string[];
}

/**
 * Validate typography configuration
 */
export function validateTypography(): TypographyValidationResult {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Check golden ratio adherence
    const config = TYPOGRAPHY_CONFIG;
    const baseSize = 16;
    const lgSize = parseFloat(config.scale.lg);
    const expectedLg = baseSize * GOLDEN_RATIO;
    
    if (Math.abs(lgSize - expectedLg) > 0.5) {
        warnings.push(`LG size (${lgSize}px) deviates from golden ratio (${expectedLg.toFixed(2)}px)`);
    }
    
    // Check line height for readability
    if (config.lineHeight.body < 1.5) {
        warnings.push("Body line height should be at least 1.5 for readability");
    }
    
    // Check font count (max 2 families per language)
    recommendations.push("Ensure max 2 font families per language");
    recommendations.push("Use font-display: swap for better performance");
    
    return {
        valid: warnings.length === 0,
        warnings,
        recommendations,
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    CLASH_DISPLAY,
    SATOSHI,
    IBM_PLEX_ARABIC,
    TAJAWAL,
    TYPOGRAPHY_CONFIG,
    GOLDEN_RATIO,
    generateGoldenRatioScale,
    generateRemScale,
    generateTypographyCSS,
    generateTailwindTypographyConfig,
    getGoogleFontsURL,
    generateFontPreloads,
    validateTypography,
};
