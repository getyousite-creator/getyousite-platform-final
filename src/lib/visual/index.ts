/**
 * GetYouSite Visual Intelligence Module
 * 
 * Super-Visual Protocol V2 (SVP-V2) - Complete visual intelligence system
 * 
 * This module transforms GetYouSite from a "website generator" into a
 * "digital art studio" that produces high-conversion visual experiences.
 */

// Main Orchestrator
export {
    SVPV2Orchestrator,
    generateSVPV2,
    generateSVPV2CSS,
    generateSVPV2Tailwind,
    runSVPV2QualityGate,
    type SVPV2Config,
    type SVPV2Input,
} from "./svp-v2-orchestrator";

// Semantic Color Engine
export {
    findColorProfile,
    generateTailwindVariables,
    generateGradientCSS,
    calculateContrastRatio,
    validateWCAG,
    generateColorTheme,
    INDUSTRY_COLOR_PROFILES,
    type ColorPalette,
    type IndustryColorProfile,
} from "./semantic-color-engine";

// Typography Synergy
export {
    generateGoldenRatioScale,
    generateRemScale,
    findTypographyProfile,
    generateTypographyConfig,
    generateTypographyCSS,
    validateFontCount,
    isGoogleFont,
    FONT_PAIRINGS,
    INDUSTRY_TYPOGRAPHY_PROFILES,
    type FontPairing,
    type TypographyScale,
    type TypographyConfig,
    type IndustryTypographyProfile,
} from "./typography-synergy";

// Re-export GOLDEN_RATIO as named export
import typographySynergy from "./typography-synergy";
export const GOLDEN_RATIO = typographySynergy.GOLDEN_RATIO;

// Visual Motion Protocol
export {
    MOTION_VARIANTS,
    GLASSMORPHISM_STYLES,
    PREMIUM_SHADOWS,
    GRADIENT_PRESETS,
    LAYOUT_PATTERNS,
    CTA_PLACEMENT,
    RESPONSIVE_UX,
    runVisualQualityGate,
    generateVisualConfig,
    type MotionVariant,
    type HoverVariant,
    type VisualMotionConfig,
    type LayoutPattern,
    type CTAPlacement,
    type ResponsiveUXConfig,
    type QualityCheckResult,
} from "./visual-motion-protocol";
