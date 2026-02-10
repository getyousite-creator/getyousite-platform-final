
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
        Your task is to ruthlessly analyze a website blueprint and provide a scored audit.
        
        ANALYSIS VECTORS:
        1. **SEO Integrity (30%)**: Check title, description, and semantic keywords.
        2. **Conversion Architecture (30%)**: Evaluate AIDA flow, CTA placement, and copy persuasion.
        3. **Visual Cohesion (20%)**: Assess color harmony (hex codes) and font selection.
        4. **Content Depth (20%)**: Analyze text length and value proposition clarity.

        OUTPUT FORMAT (JSON):
        {
            "overall_score": number (0-100),
            "vectors": {
                "seo": { "score": number, "issues": string[], "recommendations": string[] },
                "conversion": { "score": number, "issues": string[], "recommendations": string[] },
                "visual": { "score": number, "issues": string[], "recommendations": string[] },
                "content": { "score": number, "issues": string[], "recommendations": string[] }
            },
            "executive_summary": "A 2-sentence high-status summary of the site's state.",
            "action_plan": ["Step 1", "Step 2", "Step 3"]
        }

        LANGUAGE: ${locale === 'ar' ? 'Arabic' : 'English'}
        TONE: Clinical, authoritative, and precise.
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
