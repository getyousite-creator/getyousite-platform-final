"use server";

/**
 * Sovereign Synthesis Actions
 * Server actions for logic-driven blueprint refinement
 */

import { SovereignOrchestrator } from '@/lib/ai/orchestrator';
import { SiteBlueprint } from '@/lib/schemas';

interface RefineBlueprintParams {
    currentBlueprint: SiteBlueprint;
    command: string;
    businessName: string;
    niche: string;
    locale?: string;
}

/**
 * Refine an existing blueprint using strategic architectural command.
 * Routes through the SovereignOrchestrator's updateSitePartially method.
 */
export async function refineBlueprintAction(params: RefineBlueprintParams): Promise<SiteBlueprint> {
    const { currentBlueprint, command, businessName, niche, locale = 'ar' } = params;

    const enrichedCommand = `
Business: ${businessName}
Niche: ${niche}
Command: ${command}
    `.trim();

    return SovereignOrchestrator.updateSitePartially(currentBlueprint, enrichedCommand, locale);
}
