import { generateCompleteWebsite } from '@/lib/ai/multi-provider';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

/**
 * Locale-scoped generate endpoint.
 * Keeps behavior aligned with /api/generate for auth and credit failures.
 */
export async function POST(req: Request) {
    try {
        const { businessName, niche, vision, locale, features } = await req.json();

        if (!businessName || !niche) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields: businessName and niche are required',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        const blueprint = await generateCompleteWebsite({
            businessName,
            niche,
            vision: vision || `Professional ${niche} website`,
            locale: locale || 'en',
            features: features || ['responsive', 'seo', 'multilingual'],
        });

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
            const { data: userData, error: fetchError } = await supabase
                .from('users')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (fetchError || !userData || userData.credits < 1) {
                return new Response(
                    JSON.stringify({
                        error: 'INSUFFICIENT_CREDITS',
                        message: 'Credit Logic Depleted. Top-up Required.',
                    }),
                    {
                        status: 402,
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
            }

            const { error: updateError } = await supabase
                .from('users')
                .update({ credits: userData.credits - 1 })
                .eq('id', user.id);

            if (updateError) {
                console.error('Credit deduction failed:', updateError);
            }
        }

        return new Response(JSON.stringify(blueprint), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        const message = (error as Error).message || 'UNKNOWN_ERROR';

        if (message === 'AUTH_REQUIRED_FOR_AI') {
            return new Response(
                JSON.stringify({
                    error: 'UNAUTHORIZED',
                    message: 'Sovereign Access Required. Please Authenticate.',
                }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        if (message.includes('INSUFFICIENT_CREDITS')) {
            return new Response(
                JSON.stringify({
                    error: 'PAYMENT_REQUIRED',
                    message: 'Credit Logic Depleted. Top-up Required.',
                }),
                {
                    status: 402,
                    headers: { 'Content-Type': 'application/json' },
                },
            );
        }

        return new Response(
            JSON.stringify({
                error: 'Sovereign Engine Failure',
                details: message,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }
}
