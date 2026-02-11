"use server";

import { generateSinglePage } from "@/lib/ai/multi-provider";
import { createClient } from "@/lib/supabase/server";
import { SiteBlueprint } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function generateNewPageAction(storeId: string, slug: string, name: string) {
    try {
        const supabase = await createClient();

        // 1. Fetch current store state securely
        const { data: store, error } = await supabase
            .from("stores")
            .select("*")
            .eq("id", storeId)
            .single();

        if (error || !store) throw new Error("Store not found or access denied.");

        const settings = store.settings || {};
        const blueprint = (settings.blueprint || {}) as SiteBlueprint;

        // MISSION 8.4: DUPLICATE PREVENTION
        if (blueprint.pages && blueprint.pages[slug]) {
            throw new Error("Sovereign Protocol Alert: Page slug already exists in blueprint.");
        }

        const businessName = store.name;
        const niche = blueprint.metadata?.niche || "Professional Business";
        const vision = blueprint.description || store.description || "";
        const locale = blueprint.metadata?.locale || "en";

        // 2. Trigger AI Generation (Sovereign Engine)
        console.log(
            `🚀 SOVEREIGN_PAGE_GEN: Starting synthesis for [${name}] in [${businessName}]...`,
        );
        const newPage = await generateSinglePage({
            businessName,
            niche,
            vision,
            locale,
            targetPage: { slug, name },
        });

        // 3. Update Blueprint Logic
        const updatedBlueprint = { ...blueprint };
        if (!updatedBlueprint.pages) updatedBlueprint.pages = {};
        updatedBlueprint.pages[slug] = newPage;

        // 4. Persist Updates via Server Client
        const { error: updateError } = await supabase
            .from("stores")
            .update({
                settings: {
                    ...store.settings,
                    blueprint: updatedBlueprint,
                },
            })
            .eq("id", storeId);

        if (updateError) throw new Error(`Persistence failure: ${updateError.message}`);

        revalidatePath(`/dashboard/sites/${storeId}`);
        return { success: true, page: newPage };
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Sovereign Synthesis Failure: An internal error occurred.";
        console.error("PAGE_GENERATION_ERROR:", error);
        return { success: false, message };
    }
}
