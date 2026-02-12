"use server";

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * SOVEREIGN PROVISIONING ACTION
 * Logic: Triggers the Edge-First cache invalidation and provisioning circuit.
 * Goal: Zero-latency deployment after payment.
 */
export async function provisionSiteOnEdge(hostname: string) {
    console.log(`[PROVISIONING] Initiating Edge hard-reset for: ${hostname}`);

    try {
        if (!hostname || hostname.length < 3) {
            throw new Error("Invalid hostname provided for provisioning.");
        }

        // 1. Purge the ISR cache for the site-renderer path
        // This ensures the next request for this hostname fetches fresh data from DB
        revalidatePath(`/_site-renderer/${hostname}`, "page");

        // 2. Clear global site tags if applicable
        (revalidateTag as any)("sites");

        // MISSION 6.1: VERCEL DOMAIN LINKAGE
        const { VercelService } = await import("@/lib/services/vercel-service");
        const domainResult = await VercelService.addDomain(hostname);

        const isFullyProvisioned = domainResult.success;

        if (!domainResult.success) {
            console.warn(
                `[GOVERNANCE_WARNING] Domain linking failed for ${hostname}. Site will render on subdomain only.`,
            );
        }

        return {
            success: true, // Revalidation always works if cache is accessible
            hostname,
            provisioned: true,
            domainLinked: domainResult.success,
            timestamp: new Date().toISOString(),
            governance_alert: !domainResult.success
                ? "Custom domain linking pending manual verification."
                : null,
        };
    } catch (error) {
        console.error(`[PROVISIONING_ERROR] Failed to purge edge for ${hostname}:`, error);
        return { success: false, error: "Edge synchronization failure." };
    }
}
