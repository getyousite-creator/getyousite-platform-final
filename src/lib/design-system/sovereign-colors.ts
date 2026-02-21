/**
 * Visual Identity Protocol (VIP) - Sovereign Color System
 * 
 * "Emerald Cyber-Noir" Palette
 * Moving beyond corporate blue and AI purple to create a unique, premium identity
 * that suggests "luxury personal engineer" rather than "template tool"
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ColorToken {
    name: string;
    value: string;
    description: string;
    usage: string[];
}

export interface ColorPalette {
    primary: {
        deep: string;
        DEFAULT: string;
        light: string;
    };
    accent: {
        neon: string;
        DEFAULT: string;
        dim: string;
    };
    neutral: {
        obsidian: string;
        DEFAULT: string;
        light: string;
        slate: string;
    };
    surface: {
        DEFAULT: string;
        elevated: string;
        overlay: string;
    };
    semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };
}

export interface GradientPreset {
    name: string;
    value: string;
    usage: string;
}

export interface ThemeMode {
    mode: "light" | "dark";
    colors: ColorPalette;
    gradients: GradientPreset[];
}

// ============================================================================
// SOVEREIGN COLOR PALETTE - "Emerald Cyber-Noir"
// ============================================================================

/**
 * Primary brand colors - Deep emerald green representing trust and growth
 * Moving away from typical corporate blue (#2563EB) and AI purple (#7C3AED)
 */
export const SOVEREIGN_COLORS: ColorPalette = {
    primary: {
        deep: "#064E3B",   // Emerald 900 - Deep trust, growth, nature
        DEFAULT: "#059669", // Emerald 600 - Primary actions
        light: "#34D399",   // Emerald 400 - Highlights, hover states
    },
    
    accent: {
        neon: "#BEF264",    // Lime 300 - Electric energy, AI intelligence
        DEFAULT: "#84CC16", // Lime 500 - Secondary actions
        dim: "#65A30D",     // Lime 600 - Subtle accents
    },
    
    neutral: {
        obsidian: "#0A0A0A", // Volcanic black - Luxury dark backgrounds
        DEFAULT: "#171717",  // Neutral 900 - Primary dark surfaces
        light: "#262626",    // Neutral 800 - Elevated surfaces
        slate: "#404040",    // Neutral 700 - Borders, dividers
    },
    
    surface: {
        DEFAULT: "#0A0A0A",  // Main background (dark mode)
        elevated: "#171717", // Cards, modals
        overlay: "rgba(0, 0, 0, 0.8)", // Overlays, dialogs
    },
    
    semantic: {
        success: "#10B981",  // Emerald 500 - Success states
        warning: "#F59E0B",  // Amber 500 - Warning states
        error: "#EF4444",    // Red 500 - Error states
        info: "#06B6D4",     // Cyan 500 - Information states
    },
};

/**
 * Light mode variant - "Emerald Dawn"
 * Softer, cleaner version for light theme
 */
export const SOVEREIGN_COLORS_LIGHT: ColorPalette = {
    primary: {
        deep: "#065F46",   // Emerald 800
        DEFAULT: "#10B981", // Emerald 500
        light: "#6EE7B7",   // Emerald 300
    },
    
    accent: {
        neon: "#D9F99D",    // Lime 200 - Softer neon for light mode
        DEFAULT: "#A3E635", // Lime 400
        dim: "#84CC16",     // Lime 500
    },
    
    neutral: {
        obsidian: "#0A0A0A", // Keep for text
        DEFAULT: "#262626",  // Neutral 800
        light: "#525252",    // Neutral 600
        slate: "#A3A3A3",    // Neutral 400
    },
    
    surface: {
        DEFAULT: "#FFFFFF",  // Pure white background
        elevated: "#FAFAFA", // Neutral 50
        overlay: "rgba(0, 0, 0, 0.5)",
    },
    
    semantic: SOVEREIGN_COLORS.semantic,
};

// ============================================================================
// GRADIENT SYSTEM
// ============================================================================

/**
 * Premium gradient presets
 * Each gradient serves a specific purpose in the visual hierarchy
 */
export const GRADIENT_PRESETS: GradientPreset[] = [
    {
        name: "grad-premium",
        value: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)",
        usage: "Primary buttons, hero backgrounds, premium cards",
    },
    {
        name: "grad-glow",
        value: "radial-gradient(circle, rgba(190,242,100,0.15) 0%, transparent 70%)",
        usage: "Hover effects, focus states, ambient lighting",
    },
    {
        name: "grad-cyber",
        value: "linear-gradient(90deg, #064E3B 0%, #059669 50%, #BEF264 100%)",
        usage: "Progress bars, feature highlights, CTAs",
    },
    {
        name: "grad-noir",
        value: "linear-gradient(180deg, #0A0A0A 0%, #171717 100%)",
        usage: "Dark mode backgrounds, section dividers",
    },
    {
        name: "grad-emerald-mist",
        value: "linear-gradient(135deg, rgba(6,78,59,0.1) 0%, rgba(5,150,105,0.05) 100%)",
        usage: "Subtle backgrounds, card overlays",
    },
];

// ============================================================================
// CSS VARIABLES GENERATOR
// ============================================================================

/**
 * Generate CSS custom properties for theming
 */
export function generateCSSVariables(mode: "light" | "dark" = "dark"): string {
    const colors = mode === "dark" ? SOVEREIGN_COLORS : SOVEREIGN_COLORS_LIGHT;
    
    return `
/* ============================================
   SOVEREIGN VISUAL IDENTITY - ${mode.toUpperCase()} MODE
   "Emerald Cyber-Noir" Palette
   ============================================ */

:root {
    /* Primary Colors - Deep Emerald */
    --primary-deep: ${colors.primary.deep};
    --primary: ${colors.primary.DEFAULT};
    --primary-light: ${colors.primary.light};
    
    /* Accent Colors - Electric Lime */
    --accent-neon: ${colors.accent.neon};
    --accent: ${colors.accent.DEFAULT};
    --accent-dim: ${colors.accent.dim};
    
    /* Neutral Colors - Volcanic Black */
    --neutral-obsidian: ${colors.neutral.obsidian};
    --neutral: ${colors.neutral.DEFAULT};
    --neutral-light: ${colors.neutral.light};
    --neutral-slate: ${colors.neutral.slate};
    
    /* Surface Colors */
    --surface: ${colors.surface.DEFAULT};
    --surface-elevated: ${colors.surface.elevated};
    --surface-overlay: ${colors.surface.overlay};
    
    /* Semantic Colors */
    --success: ${colors.semantic.success};
    --warning: ${colors.semantic.warning};
    --error: ${colors.semantic.error};
    --info: ${colors.semantic.info};
    
    /* Gradient Presets */
    --grad-premium: linear-gradient(135deg, ${colors.primary.deep} 0%, #022C22 100%);
    --grad-glow: radial-gradient(circle, rgba(190,242,100,0.15) 0%, transparent 70%);
    --grad-cyber: linear-gradient(90deg, ${colors.primary.deep} 0%, ${colors.primary.DEFAULT} 50%, ${colors.accent.neon} 100%);
    --grad-noir: linear-gradient(180deg, ${colors.neutral.obsidian} 0%, ${colors.neutral.DEFAULT} 100%);
    --grad-emerald-mist: linear-gradient(135deg, rgba(6,78,59,0.1) 0%, rgba(5,150,105,0.05) 100%);
    
    /* Shadows - Emerald-tinted */
    --shadow-sm: 0 1px 2px 0 rgba(6, 78, 59, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(6, 78, 59, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(6, 78, 59, 0.15);
    --shadow-xl: 0 20px 25px -5px rgba(6, 78, 59, 0.2);
    --shadow-2xl: 0 25px 50px -12px rgba(6, 78, 59, 0.25);
    
    /* Glow Effects - Neon accent */
    --glow-primary: 0 0 20px rgba(5, 150, 105, 0.5);
    --glow-accent: 0 0 20px rgba(190, 242, 100, 0.4);
    --glow-success: 0 0 20px rgba(16, 185, 129, 0.4);
    
    /* Border Radius - Slightly rounded (8px base) */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
    :root {
        color-scheme: dark;
    }
}
`.trim();
}

// ============================================================================
// TAILWIND CONFIG EXTENSION
// ============================================================================

/**
 * Generate Tailwind config extension for sovereign colors
 */
export function generateTailwindConfig(): Record<string, unknown> {
    return {
        theme: {
            extend: {
                colors: {
                    primary: {
                        deep: SOVEREIGN_COLORS.primary.deep,
                        DEFAULT: SOVEREIGN_COLORS.primary.DEFAULT,
                        light: SOVEREIGN_COLORS.primary.light,
                    },
                    accent: {
                        neon: SOVEREIGN_COLORS.accent.neon,
                        DEFAULT: SOVEREIGN_COLORS.accent.DEFAULT,
                        dim: SOVEREIGN_COLORS.accent.dim,
                    },
                    neutral: {
                        obsidian: SOVEREIGN_COLORS.neutral.obsidian,
                        DEFAULT: SOVEREIGN_COLORS.neutral.DEFAULT,
                        light: SOVEREIGN_COLORS.neutral.light,
                        slate: SOVEREIGN_COLORS.neutral.slate,
                    },
                    surface: {
                        DEFAULT: SOVEREIGN_COLORS.surface.DEFAULT,
                        elevated: SOVEREIGN_COLORS.surface.elevated,
                        overlay: SOVEREIGN_COLORS.surface.overlay,
                    },
                    success: SOVEREIGN_COLORS.semantic.success,
                    warning: SOVEREIGN_COLORS.semantic.warning,
                    error: SOVEREIGN_COLORS.semantic.error,
                    info: SOVEREIGN_COLORS.semantic.info,
                },
                backgroundImage: {
                    'grad-premium': GRADIENT_PRESETS[0].value,
                    'grad-glow': GRADIENT_PRESETS[1].value,
                    'grad-cyber': GRADIENT_PRESETS[2].value,
                    'grad-noir': GRADIENT_PRESETS[3].value,
                    'grad-emerald-mist': GRADIENT_PRESETS[4].value,
                },
                boxShadow: {
                    'emerald-sm': '0 1px 2px 0 rgba(6, 78, 59, 0.05)',
                    'emerald-md': '0 4px 6px -1px rgba(6, 78, 59, 0.1)',
                    'emerald-lg': '0 10px 15px -3px rgba(6, 78, 59, 0.15)',
                    'emerald-xl': '0 20px 25px -5px rgba(6, 78, 59, 0.2)',
                    'emerald-2xl': '0 25px 50px -12px rgba(6, 78, 59, 0.25)',
                    'glow-primary': '0 0 20px rgba(5, 150, 105, 0.5)',
                    'glow-accent': '0 0 20px rgba(190, 242, 100, 0.4)',
                },
                borderRadius: {
                    'sovereign': '8px', // Base radius for all components
                },
            },
        },
    };
}

// ============================================================================
// WCAG CONTRAST VALIDATOR
// ============================================================================

export interface ContrastResult {
    ratio: number;
    pass: boolean;
    level: "AA" | "AAA" | "FAIL";
    foreground: string;
    background: string;
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(hex: string): number {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(foreground: string, background: string): number {
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate WCAG 2.1 compliance for color combinations
 */
export function validateWCAG(foreground: string, background: string): ContrastResult {
    const ratio = calculateContrastRatio(foreground, background);
    
    let level: "AA" | "AAA" | "FAIL";
    let pass: boolean;
    
    if (ratio >= 7.0) {
        level = "AAA";
        pass = true;
    } else if (ratio >= 4.5) {
        level = "AA";
        pass = true;
    } else {
        level = "FAIL";
        pass = false;
    }

    return {
        ratio,
        pass,
        level,
        foreground,
        background,
    };
}

/**
 * Validate all sovereign color combinations
 */
export function validateSovereignPalette(): ContrastResult[] {
    const results: ContrastResult[] = [];
    
    // Test primary on neutral backgrounds
    results.push(validateWCAG(SOVEREIGN_COLORS.primary.DEFAULT, SOVEREIGN_COLORS.neutral.obsidian));
    results.push(validateWCAG(SOVEREIGN_COLORS.primary.DEFAULT, SOVEREIGN_COLORS.surface.DEFAULT));
    
    // Test accent on neutral backgrounds
    results.push(validateWCAG(SOVEREIGN_COLORS.accent.neon, SOVEREIGN_COLORS.neutral.obsidian));
    results.push(validateWCAG(SOVEREIGN_COLORS.accent.DEFAULT, SOVEREIGN_COLORS.neutral.obsidian));
    
    // Test neutral text on primary backgrounds
    results.push(validateWCAG("#FFFFFF", SOVEREIGN_COLORS.primary.deep));
    results.push(validateWCAG("#FFFFFF", SOVEREIGN_COLORS.primary.DEFAULT));
    
    // Test semantic colors
    results.push(validateWCAG(SOVEREIGN_COLORS.semantic.success, SOVEREIGN_COLORS.neutral.obsidian));
    results.push(validateWCAG(SOVEREIGN_COLORS.semantic.error, SOVEREIGN_COLORS.neutral.obsidian));
    results.push(validateWCAG(SOVEREIGN_COLORS.semantic.warning, SOVEREIGN_COLORS.neutral.obsidian));
    
    return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    SOVEREIGN_COLORS,
    SOVEREIGN_COLORS_LIGHT,
    GRADIENT_PRESETS,
    generateCSSVariables,
    generateTailwindConfig,
    calculateContrastRatio,
    validateWCAG,
    validateSovereignPalette,
};
