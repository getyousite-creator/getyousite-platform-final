/**
 * Design System Module - Visual Identity Protocol
 * 
 * Complete sovereign design system for GetYouSite.com
 * - Emerald Cyber-Noir color palette
 * - Multilingual typography with golden ratio
 * - Atomic components with glassmorphism
 * - Micro-interactions with Framer Motion
 */

// Color System
export {
    SOVEREIGN_COLORS,
    SOVEREIGN_COLORS_LIGHT,
    GRADIENT_PRESETS,
    generateCSSVariables,
    generateTailwindConfig,
    calculateContrastRatio,
    validateWCAG,
    validateSovereignPalette,
    type ColorToken,
    type ColorPalette,
    type GradientPreset,
    type ThemeMode,
} from "./sovereign-colors";

// Typography Engine
export {
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
    type FontFamily,
    type TypographyScale,
    type TypographyConfig,
} from "./typography-engine";

// Atomic Components
export {
    SovereignButton,
    SovereignCard,
    SovereignIcon,
    LoadingSpinner,
    SovereignBadge,
    SovereignDivider,
    type ButtonProps,
    type CardProps,
    type IconProps,
    type BadgeProps,
    type DividerProps,
} from "./atomic-components";

// Micro-Interactions
export {
    Magnetic,
    FadeIn,
    PageTransition,
    StaggerContainer,
    HoverScale,
    GlowEffect,
    TRANSITIONS,
    type MagneticProps,
    type FadeInProps,
    type PageTransitionProps,
    type StaggerContainerProps,
    type HoverScaleProps,
    type GlowProps,
} from "./micro-interactions";
