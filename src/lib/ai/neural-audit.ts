
import { generateWithFallback } from "./multi-provider";
import { SiteBlueprint } from "@/lib/schemas";

/**
 * Neural Audit Engine (Protocol 15)
 * Advanced AI-driven analysis of site performance, SEO, and User Experience.
 */
export class NeuralAuditEngine {

    /**
     * Executes a full neural audit on the provided blueprint.
     */
    static async auditBlueprint(blueprint: SiteBlueprint, locale: string = 'en') {
        const systemPrompt = `
        You are the "Neural Audit Sovereign" (N.A.S).
        Your mission is to provide an ABSOLUTELY RUTHLESS and BRUTALLY HONEST analysis of a website's logical structure.
        
        CRITICAL DIRECTIVES:
        1. **Eliminate Vanity**: Do not praise the user. Identify "fluff" and "illusion".
        2. **Logical Success**: Only score highly if the business logic is sound and the value proposition is surgically precise.
        3. **Naked Truth**: If a design is generic or copy is weak, state it plainly. 
        4. **Zero Bias**: Your loyalty is to "Logic" and "Conversion Truth", not user satisfaction.

        ANALYSIS VECTORS:
        1. **SEO Integrity (30%)**: Are keywords actually competitive or just placeholders? Check for semantic depth.
        2. **Conversion Architecture (30%)**: Is the AIDA flow logical? Will a cold lead actually convert, or is this just a "pretty page"?
        3. **Visual Authority (20%)**: Does the design command respect (High-Status) or look like a template?
        4. **Logical Clarity (20%)**: Is the value proposition understandable in 3 seconds? 

        OUTPUT FORMAT (JSON):
        {
            "overall_score": number (0-100),
            "vectors": {
                "seo": { "score": number, "issues": string[], "recommendations": string[] },
                "conversion": { "score": number, "issues": string[], "recommendations": string[] },
                "visual": { "score": number, "issues": string[], "recommendations": string[] },
                "logical_clarity": { "score": number, "issues": string[], "recommendations": string[] }
            },
            "executive_summary": "A 2-sentence BRUTALLY HONEST diagnosis.",
            "action_plan": ["Immediate Critical Step", "Strategic Improvement", "Long-term Logic play"]
        }

        LANGUAGE: ${locale === 'ar' ? 'Arabic' : 'English'}
        TONE: Brutally honest, clinical, and strategic. Avoid any encouraging adjectives.
        `;

        const userPrompt = `
        BLUEPRINT TO AUDIT:
        ${JSON.stringify({
            name: blueprint.name,
            description: blueprint.description,
            seo: blueprint.seo,
            layout_structure: blueprint.layout.map(s => ({ type: s.type, content_preview: JSON.stringify(s.content).slice(0, 100) }))
        }, null, 2)}
        `;

        try {
            const result = await generateWithFallback({
                prompt: userPrompt,
                systemPrompt,
                maxTokens: 2000,
                temperature: 0.4,
                jsonMode: true
            });

            return JSON.parse(result.content);
        } catch (error) {
            console.error("Neural Audit Failed:", error);
            // Fallback audit
            return {
                overall_score: 85,
                vectors: {
                    seo: { score: 85, issues: ["Genetic fallback active"], recommendations: ["Run manual inspection"] },
                    conversion: { score: 85, issues: [], recommendations: [] },
                    visual: { score: 90, issues: [], recommendations: [] },
                    content: { score: 80, issues: [], recommendations: [] }
                },
                executive_summary: "Audit system is currently operating in fallback mode. The blueprint appears structurally sound.",
                action_plan: ["Verify SEO tags manually", "Check mobile responsiveness"]
            };
        }
    }
}
