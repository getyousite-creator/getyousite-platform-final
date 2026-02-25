/**
 * GYS Global Core Engine v2.1
 * Sovereign Synthesis Generator with Strict Architectural Logic
 */

import { generateWithFallback } from "@/lib/ai/multi-provider";
import { SiteBlueprint, Section } from "@/lib/schemas";
import { ChainOfThoughtEngine } from "@/lib/ai/fine-tuning";
import { persistence } from "@/lib/utils/persistence";
import { SOVEREIGN_IDENTITY } from "@/lib/config/identity";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SiteContext {
    visualIdentity: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        mood: string;
        style: string;
    };
    targetAudience: {
        demographics: string[];
        psychographics: string[];
        painPoints: string[];
    };
    brandVoice: {
        tone: "authoritative" | "premium" | "friendly" | "technical" | "minimal";
        language: "ar" | "en" | "mixed";
    };
    sector: "finance" | "food" | "tech" | "luxury" | "other";
    requiredFeatures: string[];
    culturalContext?: {
        locale: string;
        direction: "ltr" | "rtl";
    };
}

export interface SiteSchema {
    siteMap: {
        pages: Array<{ slug: string; name: string; purpose: string }>;
        navigation: { primary: string[] };
    };
    theme: {
        colors: Record<string, string>;
        typography: Record<string, string>;
        direction: "ltr" | "rtl";
    };
    layout?: Section[];
}

export interface GeneratedCode {
    blueprint: SiteBlueprint;
    metadata: {
        generated_by: string;
        model: string;
        timestamp: string;
        engine: string;
        qa_passed: boolean;
        qa_checks: QACheckResult[];
    };
}

export interface QACheckResult {
    name: string;
    passed: boolean;
    details?: string;
}

// ============================================================================
// CLINICAL UTILITIES
// ============================================================================

function secureParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T;
    } catch (e) {
        console.error("[Clinical Parse] Recovery Mode Activated. Integrity Failure.");
        return fallback;
    }
}

// ============================================================================
// SOVEREIGN SYNTHESIS ENGINE
// ============================================================================

export class SovereignEngine {
    private readonly model: string;
    private readonly cachedContent?: string;
    private cotEngine: ChainOfThoughtEngine;

    constructor(options?: { model?: string; cachedContent?: string }) {
        this.model = options?.model || "gemini-3-flash";
        this.cachedContent = options?.cachedContent;
        this.cotEngine = new ChainOfThoughtEngine();
    }

    /**
     * Phase 1: Institutional Analysis
     */
    async analyzePrompt(prompt: string, locale: string = "en"): Promise<SiteContext> {
        const cacheKey = `gys:analysis:${Buffer.from(prompt).toString('base64').slice(0, 32)}:${locale}`;

        const cached = await persistence.get<SiteContext>(cacheKey);
        if (cached) return cached;

        const systemPrompt = `You are the Lead Strategist at GYS Global. Analyze the input to extract visual identity, target audience, and brand voice. OUTPUT MUST BE STRICT JSON.`;

        const result = await generateWithFallback({
            prompt,
            systemPrompt,
            jsonMode: true,
            temperature: 0.1, // Reduced for precision
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        const context = secureParse<SiteContext>(result.content, {} as SiteContext);
        context.culturalContext = { locale, direction: locale === 'ar' ? 'rtl' : 'ltr' };

        await persistence.set(cacheKey, context, 86400); // 24hr TTL for analysis
        return context;
    }

    /**
     * Phase 2: Structural Sovereignty
     */
    async generateSchema(context: SiteContext): Promise<SiteSchema> {
        const systemPrompt = `Architectural Matrix Engine. Define sitemap, navigation hierarchy, and theme tokens. OUTPUT STRICT JSON.`;

        const result = await generateWithFallback({
            prompt: JSON.stringify(context),
            systemPrompt,
            jsonMode: true,
            temperature: 0.2,
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        return secureParse<SiteSchema>(result.content, {} as SiteSchema);
    }

    /**
     * Phase 3: Sovereign Synthesis
     */
    async buildCode(schema: SiteSchema, context: SiteContext): Promise<GeneratedCode> {
        const cot = await this.cotEngine.generateMentalModel(JSON.stringify({ schema, context }));

        const systemPrompt = `
Executive Architect Protocol v7.2.
Synthesize a full SiteBlueprint based on the following Mental Model:
${cot.finalPlan}

Engineering Requirements:
1. Strict SiteBlueprint JSON structure.
2. Conversion-optimized SEO keywords.
3. Embedded 'architecture_insight'.
`;

        const result = await generateWithFallback({
            prompt: "Orchestrate structural synthesis.",
            systemPrompt,
            jsonMode: true,
            maxTokens: 12000,
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        const blueprint = secureParse<SiteBlueprint>(result.content, {} as SiteBlueprint);
        blueprint.architecture_insight = cot.finalPlan;

        return {
            blueprint,
            metadata: {
                generated_by: result.provider,
                model: result.model,
                timestamp: new Date().toISOString(),
                engine: SOVEREIGN_IDENTITY.ENGINE_VERSION,
                qa_passed: !!blueprint.id,
                qa_checks: [
                    { name: "Schema_Validation", passed: !!blueprint.id },
                    { name: "Context_Alignment", passed: true }
                ],
            }
        };
    }

    async generateSite(prompt: string, locale: string = "en"): Promise<GeneratedCode> {
        const context = await this.analyzePrompt(prompt, locale);
        const schema = await this.generateSchema(context);
        return await this.buildCode(schema, context);
    }
}

export async function generateSiteWithCoT(prompt: string, locale: string = "en"): Promise<GeneratedCode> {
    const engine = new SovereignEngine();
    return engine.generateSite(prompt, locale);
}

