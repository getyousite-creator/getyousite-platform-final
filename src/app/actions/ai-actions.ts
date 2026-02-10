'use server';

import { refineBlueprint as refineBlueprintLogic } from "@/lib/ai/multi-provider";
import { SiteBlueprint } from "@/lib/schemas";

/**
 * Server Action to refine a blueprint via AI.
 * This acts as a bridge between the Client Component (Customizer) and the Server-Side AI Logic.
 */
export async function refineBlueprintAction(params: {
    currentBlueprint: SiteBlueprint;
    command: string;
    businessName: string;
    niche: string;
    locale: string;
}) {
    // Determine locale if not provided or invalid, strictly 'ar' or 'en'
    // Logic: In a real scenario we'd respect the passed locale
    const safeLocale = params.locale || 'en';

    try {
        const result = await refineBlueprintLogic({
            ...params,
            locale: safeLocale
        });
        return result;
    } catch (error) {
        console.error("AI Action Refinement Error:", error);
        throw new Error("Failed to refine blueprint.");
    }
}
