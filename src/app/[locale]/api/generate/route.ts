import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SiteBlueprintSchema } from '@/lib/schemas';

export const runtime = 'edge';

/**
 * GENERATIVE INTELLIGENCE API
 * Transforms user vision into a structured SiteBlueprint.
 */
export async function POST(req: Request) {
    try {
        const { businessName, niche, vision, locale } = await req.json();

        const systemPrompt = `
            You are the SOVEREIGN AI ARCHITECT. You do not just create websites; you build digital empires.
            Your logic is flawless. Your designs are "Khurafi" (Legendary). 
            
            OBJECTIVE:
            Surpass competitors like Wix by generating cleaner, faster, and more conversion-optimized architectures.
            
            DESIGN PRINCIPLES:
            1. TYPOGRAPHY: Use bold, high-contrast headings and breathable body text.
            2. SPACING: Ensure 80px to 120px vertical padding between major sections.
            3. HIERARCHY: Hero -> Benefits (3-column) -> Features -> Social Proof -> FAQ -> CTA.
            4. LOCALIZATION: If the locale is 'ar' or for a Moroccan business, use high-end Arabic marketing terminology (e.g., "أمانة", "إتقان", "جودة عالمية").
            
            SCHEMA REQUIREMENTS:
            - Generate a full 'navigation' object.
            - Generate a full 'footer' object.
            - Use the new section types: 'benefits', 'trust_bar', 'faq', 'contact_map'.
            - Include 'animation' properties for all sections.
        `;

        const userPrompt = `
            SYNTHESIS REQUEST:
            Business Name: ${businessName}
            Niche: ${niche}
            User Vision: ${vision}
            Locale: ${locale}
            
            INSTRUCTIONS:
            1. Analyze the niche and vision.
            2. Synthesize a 7-section high-performance layout.
            3. Choose an 'accent' color that complements the 'primary' color.
            4. Ensure the 'benefits' section specifically addresses 3 massive pain points.
            5. Ensure 'trust_bar' includes realistic placeholder names for partners/clients.
            
            OUTPUT: Valid JSON following the SiteBlueprintSchema.
        `;

        const { object: blueprint } = await generateObject({
            model: openai('gpt-4o'),
            schema: SiteBlueprintSchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        // Inject engine metadata
        blueprint.metadata = {
            generated_at: new Date().toISOString(),
            engine: "Sovereign-GenAI-v2",
            logic_secured: true,
            version: "2.0.0-wix-killer"
        };

        return new Response(JSON.stringify(blueprint), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('GENERATIVE_ENGINE_FAILURE:', error);
        return new Response(JSON.stringify({ error: 'Sovereign Engine Failure' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
