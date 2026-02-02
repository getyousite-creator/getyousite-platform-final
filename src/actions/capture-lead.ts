'use server';

import { LeadSchema, SiteBlueprint } from "@/lib/schemas";
import { SupabaseStoreRepository } from "@/lib/repositories/SupabaseStoreRepository";
import { v4 as uuidv4 } from 'uuid';
import { CustomizerEngine } from "@/lib/engine/customizer";

export type ActionState = {
    success: boolean;
    message?: string;
    blueprint?: SiteBlueprint;
    errors?: {
        email?: string[];
        vision?: string[];
        budget?: string[];
        siteType?: string[];
    };
};

const rateLimitMap = new Map<string, number>();
const storeRepo = new SupabaseStoreRepository();

export async function captureLead(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const email = formData.get('email') as string;
    const now = Date.now();
    const lastSubmission = rateLimitMap.get(email);

    if (lastSubmission && now - lastSubmission < 30000) {
        return {
            success: false,
            message: "Too many transmission requests. Please wait.",
        };
    }
    rateLimitMap.set(email, now);

    const rawData = {
        email: formData.get('email'),
        vision: formData.get('vision'),
        budget: formData.get('budget'),
        siteType: formData.get('siteType'),
    };

    const validatedFields = LeadSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please correct the errors in the form.",
        };
    }

    const { vision, budget, siteType, email: userEmail } = validatedFields.data;

    try {
        console.log("ACTION_LOG: Initializing Sovereign Customization Sequence...");

        // 1. GENERATE FINAL BLUEPRINT VIA CUSTOMIZER ENGINE
        // Defaulting to 't1-quantum' for hero generation if no template is pre-selected
        const finalBlueprint = await CustomizerEngine.generateFinalBlueprint({
            businessName: vision.split(' ').slice(0, 2).join(' '),
            niche: siteType === 'blog' ? 'Blogging & Content' : siteType === 'store' ? 'E-commerce & Retail' : 'Professional Business',
            vision: vision,
            selectedId: "t1-quantum"
        });

        // 2. PERSISTENCE BRIDGE (SUPABASE)
        await storeRepo.saveStore({
            id: uuidv4(),
            slug: `${vision.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
            template_id: "sovereign-engine-v1",
            settings: {
                primaryColor: finalBlueprint.theme.primary,
                secondaryColor: finalBlueprint.theme.secondary,
                fontFamily: finalBlueprint.theme.fontFamily,
                businessName: finalBlueprint.name,
                businessDescription: finalBlueprint.description,
                language: "en",
                blueprint: finalBlueprint // Full Schema Authority
            }
        });

        return {
            success: true,
            message: "Orchestration Complete. Site deployed to Sovereign Cloud.",
            blueprint: finalBlueprint
        };
    } catch (error: any) {
        console.error("SOVEREIGN_ENGINE_FAILURE:", error);
        return {
            success: false,
            message: "Engine Failure: " + (error.message || "Unknown error during orchestration.")
        };
    }
}
