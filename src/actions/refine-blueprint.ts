"use server";

import { refineBlueprint } from "@/lib/ai/multi-provider";
import { createClient } from "@/lib/supabase/server";
import { SiteBlueprint } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

/**
 * SOVEREIGN REFINEMENT ACTION
 * Interface between the AI Engine and the Database for blueprint mutations.
 */
export async function refineBlueprintAction(
    storeId: string,
    command: string,
    locale: string = "en"
) {
    try {
        const supabase = await createClient();

        // 1. Fetch current persistence
        const { data: store, error: fetchError } = await supabase
            .from("stores")
            .select("*")
            .eq("id", storeId)
            .single();

        if (fetchError || !store) {
            throw new Error("Store not found or access denied.");
        }

        const currentBlueprint = (store.blueprint || {}) as SiteBlueprint;

        // 2. Execute Neural Refinement
        console.log(`🧠 SOVEREIGN_REFINE: Synthesizing refinement for [${store.name}]...`);
        console.log(`> Command: ${command}`);

        const updatedBlueprint = await refineBlueprint({
            currentBlueprint,
            command,
            businessName: store.name,
            niche: store.niche || "Business",
            locale
        });

        // 3. Persist mutated logic
        const { error: updateError } = await supabase
            .from("stores")
            .update({
                blueprint: updatedBlueprint,
                updated_at: new Date().toISOString()
            })
            .eq("id", storeId);

        if (updateError) {
            throw new Error(`Persistence failure: ${updateError.message}`);
        }

        console.log(`✅ SOVEREIGN_REFINE: Blueprint mutation persisted for ${storeId}`);

        revalidatePath(`/dashboard`);
        revalidatePath(`/customizer`);

        return {
            success: true,
            blueprint: updatedBlueprint
        };

    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Sovereign Refinement Failure: An internal error occurred.";
        console.error("REFINEMENT_ERROR:", error);
        return { success: false, message };
    }
}
