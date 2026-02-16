export type ToneOfVoice =
    | "authoritative"
    | "premium"
    | "friendly"
    | "technical"
    | "minimal";

export interface StructuredGenerationProfile {
    industry: string;
    tone: ToneOfVoice;
    audience: string[];
    ctaMap: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    seoBlocks: {
        titlePattern: string;
        descriptionPattern: string;
        keywordClusters: string[];
    };
    designSeed: {
        paletteIntent: string;
        motionLevel: "low" | "medium" | "high";
        layoutDensity: "compact" | "balanced" | "airy";
        seed: number;
    };
}

function hashSeed(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function inferTone(niche: string, vision: string): ToneOfVoice {
    const source = `${niche} ${vision}`.toLowerCase();
    if (/(law|legal|finance|bank|compliance|enterprise)/.test(source)) return "authoritative";
    if (/(luxury|premium|boutique|fine dining|estate)/.test(source)) return "premium";
    if (/(clinic|medical|dental|health)/.test(source)) return "friendly";
    if (/(saas|software|ai|tech|cloud|developer)/.test(source)) return "technical";
    return "minimal";
}

function inferAudience(niche: string): string[] {
    const source = niche.toLowerCase();
    if (/(restaurant|food|cafe)/.test(source)) {
        return ["local customers", "delivery buyers", "event planners"];
    }
    if (/(saas|software|ai|tech)/.test(source)) {
        return ["founders", "operations managers", "technical buyers"];
    }
    if (/(real estate|property)/.test(source)) {
        return ["home buyers", "investors", "property owners"];
    }
    if (/(medical|clinic|health|dental)/.test(source)) {
        return ["patients", "families", "referral partners"];
    }
    return ["new visitors", "high-intent buyers", "returning customers"];
}

function inferPaletteIntent(industry: string, tone: ToneOfVoice): string {
    const source = industry.toLowerCase();
    if (/(restaurant|food|cafe)/.test(source)) return "warm-contrast";
    if (/(medical|health|clinic)/.test(source)) return "clean-trust";
    if (/(law|finance|enterprise)/.test(source)) return "deep-authority";
    if (tone === "premium") return "rich-minimal";
    if (tone === "technical") return "neon-precision";
    return "balanced-modern";
}

export function buildStructuredGenerationProfile(params: {
    businessName: string;
    niche: string;
    vision: string;
}): StructuredGenerationProfile {
    const tone = inferTone(params.niche, params.vision);
    const audience = inferAudience(params.niche);
    const seed = hashSeed(`${params.businessName}|${params.niche}|${params.vision}`);

    return {
        industry: params.niche,
        tone,
        audience,
        ctaMap: {
            primary: "Start now",
            secondary: "Book a demo",
            tertiary: "Contact sales",
        },
        seoBlocks: {
            titlePattern: `${params.businessName} | ${params.niche} Solutions`,
            descriptionPattern: `${params.businessName} helps ${audience[0]} with high-conversion ${params.niche.toLowerCase()} experiences.`,
            keywordClusters: [
                `${params.niche.toLowerCase()} services`,
                `${params.businessName.toLowerCase()} official`,
                `${params.niche.toLowerCase()} near me`,
            ],
        },
        designSeed: {
            paletteIntent: inferPaletteIntent(params.niche, tone),
            motionLevel: tone === "technical" ? "medium" : "low",
            layoutDensity: tone === "premium" ? "airy" : "balanced",
            seed,
        },
    };
}

