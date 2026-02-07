"use server";

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * SOVEREIGN PROVISIONING ACTION
 * Logic: Triggers the Edge-First cache invalidation and provisioning circuit.
 * Goal: Zero-latency deployment after payment.
 */
export async function provisionSiteOnEdge(hostname: string) {
    console.log(`[PROVISIONING] Initiating Edge hard-reset for: ${hostname}`);

    try {
        // 1. Purge the ISR cache for the site-renderer path
        // This ensures the next request for this hostname fetches fresh data from DB
        revalidatePath(`/_site-renderer/${hostname}`, 'page');

        // 2. Clear global site tags if applicable
        revalidateTag('sites');

        // MISSION 6.1: VERCEL DOMAIN LINKAGE
        const { VercelService } = await import('@/lib/services/vercel-service');
        const domainResult = await VercelService.addDomain(hostname);

        if (!domainResult.success) {
            console.warn(`[GOVERNANCE_WARNING] Domain linking failed for ${hostname}:`, domainResult.error);
        }

        return {
            success: true,
            hostname,
            provisioned: true,
            domainLinked: domainResult.success,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`[PROVISIONING_ERROR] Failed to purge edge for ${hostname}:`, error);
        return { success: false, error: "Edge synchronization failure." };
    }
}
