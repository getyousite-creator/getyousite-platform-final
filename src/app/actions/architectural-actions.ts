'use server';

import { refineBlueprint as refineBlueprintLogic } from "@/lib/ai/multi-provider";
import { SiteBlueprint } from "@/lib/schemas";
import { ActionResult } from "./auth-actions";

/**
 * Server Action to refine a blueprint via the synthesis core.
 * This acts as a bridge between the Client Component (Customizer) and the Server-Side Architectural Logic.
 */
export async function refineBlueprintAction(params: {
    currentBlueprint: SiteBlueprint;
    command: string;
    businessName: string;
    niche: string;
    locale: string;
}) {
    // Determine locale if not provided or invalid, strictly 'ar' or 'en'
    const safeLocale = params.locale || 'en';

    try {
        const result = await refineBlueprintLogic({
            ...params,
            locale: safeLocale
        });
        return result;
    } catch (error) {
        console.error("Architectural Action Refinement Error:", error);
        throw new Error("Failed to refine blueprint.");
    }
}

/**
 * STRATEGIC INTELLIGENCE PROTOCOL
 * Logic: Analyzes business intent for structural and conversion viability.
 */
export async function analyzeVisionStrategicAction(params: {
    vision: string;
    niche: string;
    businessName: string;
}): Promise<ActionResult<{
    viabilityScore: number;
    tacticalAdvice: string;
    optimizationBrief: string;
}>> {
    try {
        const { businessName, niche, vision } = params;

        // Logic: High-status strategic refinement
        const systemPrompt = `
      You are the SOVEREIGN STRATEGY COMPTROLLER.
      TASK: Analyze the USER'S VISION for a new business/site.
      1. Calculate a VIABILITY SCORE (0-100) based on market demand and logical clarity.
      2. Provide TACTICAL ADVICE (1 sentence of hard truth).
      3. Provide an OPTIMIZED BRIEF (The perfect version of their vision for architectural synthesis).
      
      BUSINESS: ${businessName}
      NICHE: ${niche}
      VISION: ${vision}
      
      RETURN JSON ONLY: { "viabilityScore": number, "tacticalAdvice": string, "optimizationBrief": string }
    `;

        const { generateWithFallback } = await import("@/lib/ai/multi-provider");
        const result = await generateWithFallback({
            prompt: `Analyze Vision: ${vision}`,
            systemPrompt: systemPrompt,
            jsonMode: true
        });

        const analysis = JSON.parse(result.content);

        return {
            success: true,
            data: analysis
        };
    } catch (e) {
        return { success: false, error: "Strategic Linkage Failed" };
    }
}
