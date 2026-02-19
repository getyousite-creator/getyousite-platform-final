import { generateWithFallback } from "@/lib/ai/multi-provider";
import { COMPONENT_REGISTRY } from "@/data/component-registry";

export interface EmpirePlanInput {
    businessDescription: string;
    locale?: string;
}

export interface EmpirePlan {
    structure: Record<string, unknown>;
    contentSeo: Record<string, unknown>;
    visuals: Record<string, unknown>;
}

const MASTER_SYSTEM_PROMPT = `
# ROLE: SOVEREIGN WEB ARCHITECT (GETYOUSITE CORE)
You are the world's most advanced AI Web Architect.
Generate high-conversion, visually strong, and production-ready website plans.

# EXECUTION RULES
- Always output valid JSON only.
- No generic sections; map output to available component IDs when possible.
- Prioritize semantic SEO, accessibility, and clear conversion paths.
- Detect language from user input; keep tone professional.
`;

function buildComponentContext(): string {
    const components = Object.values(COMPONENT_REGISTRY).map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        category: component.category,
    }));

    return JSON.stringify({
        componentLibrary: components,
        guidance: {
            useOnlyKnownComponentsWhenPossible: true,
            includeAnchors: true,
            includeSeoObject: true,
        },
    });
}

function buildOrchestratorPrompt(input: EmpirePlanInput): string {
    const componentContext = buildComponentContext();

    return `
Business Description:\n${input.businessDescription}
Locale: ${input.locale || "en"}

Available Component Context (authoritative):
${componentContext}

Create a unified JSON object with:
1) structure: sitemap, navigation, homepage section order, component mapping
2) contentSeo: hero copy, services copy, CTA, metadata, keywords, 3 blog briefs
3) visuals: hero image prompts, slider captions, motion classes, svg motif ideas

Return strict JSON with top-level keys: structure, contentSeo, visuals.
`;
}

export async function generateEmpirePlan(input: EmpirePlanInput): Promise<EmpirePlan> {
    const prompt = buildOrchestratorPrompt(input);

    const result = await generateWithFallback({
        prompt,
        systemPrompt: MASTER_SYSTEM_PROMPT,
        jsonMode: true,
        temperature: 0.45,
        maxTokens: 5000,
        geminiModel: process.env.GEMINI_MODEL || "gemini-3-flash",
        geminiCachedContent: process.env.GEMINI_CACHED_CONTENT,
    });

    const parsed = JSON.parse(result.content || "{}");

    return {
        structure: (parsed.structure as Record<string, unknown>) || {},
        contentSeo: (parsed.contentSeo as Record<string, unknown>) || {},
        visuals: (parsed.visuals as Record<string, unknown>) || {},
    };
}
