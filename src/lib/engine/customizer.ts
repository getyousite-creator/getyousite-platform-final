import { SITE_TEMPLATES, TemplateTheme } from "../templates";
import { SiteBlueprint, Section } from "../schemas";
import { applyPersonaRefinement } from "@/lib/ai/persona-refinement";
import { FALLBACK_IMAGES, FALLBACK_PROFILES } from "@/data/fallback-blueprints";
import { VisualHarmonyEngine } from "./visual-harmony";
import { SOVEREIGN_IDENTITY } from "@/lib/config/identity";

export interface UserPromptData {
    businessName: string;
    niche: string;
    vision: string;
    selectedId: string;
}

interface SpecializedContent {
    headline: string;
    subheadline: string;
    features: string[];
    injectionSection?: {
        type: Section["type"];
        content: Record<string, unknown>;
    };
}

// ============================================================================
// PROTOCOL UTILITIES
// ============================================================================

const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

function getBusinessType(input: string): keyof typeof FALLBACK_PROFILES {
    const value = input.toLowerCase();
    if (/gym|fitness|رياض|لياقة/.test(value)) return "fitness";
    if (/restaur|cafe|food|مطعم|أكل/.test(value)) return "restaurant";
    if (/clinic|medical|health|عيادة|طبي/.test(value)) return "medical";
    return "general";
}

function mapThemeByNiche(niche: string) {
    const value = niche.toLowerCase();
    let seed = "#3b82f6";

    if (/finance|legal|law|قانون|مالي/.test(value)) seed = "#1E3A8A";
    else if (/restaur|food|cafe|مطعم/.test(value)) seed = "#EA580C";
    else if (/tech|synthesis|software|تقنية/.test(value)) seed = "#7C3AED";
    else if (/medical|health|clinic|طبي/.test(value)) seed = "#0D9488";

    const palette = VisualHarmonyEngine.synthesizePalette(seed);
    return {
        primary: palette.primary,
        secondary: palette.secondary,
        backgroundColor: palette.background,
        textColor: palette.text,
        accent: palette.accent
    };
}

// ============================================================================
// ARCHITECTURAL SYNTHESIS
// ============================================================================

function buildRichFallbackLayout(userData: UserPromptData, locale: string): Section[] {
    const isAr = locale === "ar";
    const type = getBusinessType(`${userData.niche} ${userData.vision}`);
    const profile = FALLBACK_PROFILES[type];

    return [
        {
            id: generateId("hero"),
            type: "hero",
            styles: {},
            animation: "fade-in",
            content: {
                headline: profile.hero,
                subheadline: userData.vision || `Professional ${userData.niche} solutions engineered for conversion.`,
                cta: isAr ? "ابدأ الآن" : "Get Started",
                image: FALLBACK_IMAGES[type],
                anchor: "home",
            },
        },
        {
            id: generateId("features"),
            type: "FEATURE_GRID",
            styles: {},
            animation: "fade-in",
            content: {
                title: isAr ? "ما نقدمه" : "Value Proposition",
                items: profile.services.map((s, i) => ({
                    id: `f_${i}`,
                    title: s,
                    description: "High-fidelity strategic vector.",
                })),
                anchor: "services",
            },
        },
        {
            id: generateId("contact"),
            type: "contact",
            styles: {},
            animation: "fade-in",
            content: {
                title: isAr ? "تواصل معنا" : "Protocol Contact",
                description: isAr ? "نحن متاحون للاستشارة الاستراتيجية." : "Available for strategic consultation.",
                email: `ops@${userData.businessName.replace(/\s+/g, '').toLowerCase()}.com`,
                anchor: "contact",
            },
        }
    ];
}

const HeuristicSovereignGenerator = {
    synthesize(userData: UserPromptData, locale: string = "en"): SpecializedContent {
        const type = getBusinessType(`${userData.niche} ${userData.vision}`);
        const isAr = locale === "ar";
        const biz = userData.businessName;

        const vectors: Record<keyof typeof FALLBACK_PROFILES, SpecializedContent> = {
            medical: {
                headline: isAr ? `التميز الطبي لـ ${biz}` : `Clinical Excellence for ${biz}`,
                subheadline: isAr ? "بنية تحتية للرعاية الصحية مصممة للثقة." : "Healthcare infrastructure engineered for trust.",
                features: ["Sovereign-Health-v1", "Clinical-Logic", "Global-Reach"],
            },
            fitness: {
                headline: isAr ? `نظام ${biz} للياقة` : `${biz} Fitness Protocol`,
                subheadline: isAr ? "تحويل بدني عبر هندسة الأداء." : "Physical transformation via performance engineering.",
                features: ["Performance-v2", "Metric-Driven", "Sovereign-Body"],
            },
            restaurant: {
                headline: isAr ? `مطبخ ${biz} الاستراتيجي` : `${biz} Strategic Kitchen`,
                subheadline: isAr ? "هيبة الضيافة. دقة الطهي." : "Hospitality prestige. Culinary precision.",
                features: ["Gourmet-Logic", "Seamless-Service", "Visual-Aesthetics"],
            },
            general: {
                headline: isAr ? `بروتوكول ${biz}` : `The ${biz} Protocol`,
                subheadline: isAr ? "أصل رقمي سيادي مهيأ للنمو." : "Sovereign digital asset optimized for growth.",
                features: ["Structural-Efficiency", "Growth-Velocity-v1", "Clean-Architecture"],
            }
        };

        return vectors[type] || vectors.general;
    },
};

export const CustomizerEngine = {
    async generateFinalBlueprint(userData: UserPromptData): Promise<SiteBlueprint> {
        const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en";

        // Logic: Strategic Synthesis Attempt
        try {
            const response = await fetch(`/${locale}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userData, locale }),
            });

            if (response.ok) return await response.json();
        } catch (e) {
            console.error("[Customizer Engine] Synthesis Recovery Mode.");
        }

        const template = this.findTemplate(userData.selectedId);
        if (!template) throw new Error(`CRITICAL: Template_Not_Found: ${userData.selectedId}`);

        const specializedContent = HeuristicSovereignGenerator.synthesize(userData, locale);
        const theme = mapThemeByNiche(userData.niche);
        const baseLayout = [...template.blueprint.layout];

        const finalBlueprint: SiteBlueprint = {
            ...template.blueprint,
            id: generateId("site"),
            name: userData.businessName,
            description: userData.vision,
            architecture_insight: `Heuristic synthesis applied for ${userData.niche} under Protocol SIP-7.2.`,
            theme: {
                ...template.blueprint.theme,
                primary: theme.primary,
                secondary: theme.secondary,
                backgroundColor: theme.backgroundColor,
                textColor: theme.textColor,
            },
            layout: baseLayout.map((section) => ({
                ...section,
                content: {
                    ...section.content,
                    headline: (section.type === "hero" || section.type === "HERO_PRIME") ? specializedContent.headline : section.content.headline,
                    subheadline: (section.type === "hero" || section.type === "HERO_PRIME") ? specializedContent.subheadline : section.content.subheadline,
                    features: (section.type === "features" || section.type === "FEATURE_GRID") ? specializedContent.features : section.content.features,
                },
            })),
            metadata: {
                ...template.blueprint.metadata,
                generated_at: new Date().toISOString(),
                engine_version: SOVEREIGN_IDENTITY.ENGINE_VERSION,
                niche: userData.niche,
            },
            timestamp: new Date().toISOString(),
        };

        return applyPersonaRefinement(finalBlueprint, userData, locale);
    },

    findTemplate(id: string): TemplateTheme | null {
        for (const cat of SITE_TEMPLATES.categories) {
            const found = cat.themes.find((t) => t.id === id);
            if (found) return found;
        }
        return null;
    },
};

