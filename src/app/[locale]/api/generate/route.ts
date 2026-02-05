import { generateCompleteWebsite } from '@/lib/ai/multi-provider';

export const runtime = 'edge';

/**
 * GENERATIVE INTELLIGENCE API v3
 * Multi-provider AI with OpenAI + Kimi/K2.5 fallback
 * Generates complete websites from scratch
 */
export async function POST(req: Request) {
    try {
        const { businessName, niche, vision, locale, features } = await req.json();

        // Validate required fields
        if (!businessName || !niche) {
            return new Response(JSON.stringify({
                error: 'Missing required fields: businessName and niche are required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log(`🚀 Generating website for: ${businessName} (${niche})`);

        // Generate complete website using multi-provider AI
        const blueprint = await generateCompleteWebsite({
            businessName,
            niche,
            vision: vision || `Professional ${niche} website`,
            locale: locale || 'en',
            features: features || ['responsive', 'seo', 'multilingual']
        });

        console.log(`✅ Website generated successfully using: ${blueprint._meta?.generated_by || 'AI Engine'}`);

        return new Response(JSON.stringify(blueprint), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ GENERATIVE_ENGINE_FAILURE:', error);
        return new Response(JSON.stringify({
            error: 'Sovereign Engine Failure',
            details: (error as Error).message,
            timestamp: new Date().toISOString()
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
