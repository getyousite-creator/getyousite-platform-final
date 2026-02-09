'use server';

import { generateSinglePage } from '@/lib/ai/multi-provider';
import { SupabaseStoreRepository } from '@/lib/repositories/SupabaseStoreRepository';
import { SiteBlueprint } from '@/lib/schemas';

const storeRepo = new SupabaseStoreRepository();

export async function generateNewPageAction(storeId: string, slug: string, name: string) {
    try {
        // 1. Fetch current store state
        // We'll use a hacky way to get the store by ID if getStoreById doesn't exist, 
        // but SupabaseStoreRepository should have a way.
        // Let's assume listUserStores and filter, or add getStoreById.
        // Actually, listUserStores isn't ideal. Let's check if getStoreById is in the repo.

        const { supabase } = await import("@/lib/supabase");
        const { data: store, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', storeId)
            .single();

        if (error || !store) throw new Error("Store not found");

        const blueprint = store.settings.blueprint as SiteBlueprint;
        const businessName = store.name;
        const niche = blueprint.metadata?.niche || "Professional Business";
        const vision = blueprint.description || store.description || "";
        const locale = blueprint.metadata?.locale || "en";

        // 2. Trigger AI Generation
        console.log(`🚀 SOVEREIGN_PAGE_GEN: Starting synthesis for [${name}] in [${businessName}]...`);
        const newPage = await generateSinglePage({
            businessName,
            niche,
            vision,
            locale,
            targetPage: { slug, name }
        });

        // 3. Update Blueprint
        const updatedBlueprint = { ...blueprint };
        if (!updatedBlueprint.pages) updatedBlueprint.pages = {};
        updatedBlueprint.pages[slug] = newPage;

        // 4. Persist
        await storeRepo.saveStore({
            id: storeId,
            settings: {
                ...store.settings,
                blueprint: updatedBlueprint
            }
        });

        return { success: true, page: newPage };
    } catch (error: any) {
        console.error("PAGE_GENERATION_ERROR:", error);
        return { success: false, message: error.message };
    }
}
