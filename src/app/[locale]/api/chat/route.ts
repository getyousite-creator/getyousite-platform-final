import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import knowledge from '@/data/support-knowledge.json';

// Note: Ensure OPENAI_API_KEY is in .env.local
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

if (!process.env.OPENAI_API_KEY) {
    console.warn("NEURAL_BRIDGE_WARNING: OPENAI_API_KEY is missing. Responses will fail.");
}

export async function POST(req: Request) {
    try {
        const { messages, locale } = await req.json();

        // 1. MASTER CONTEXT INJECTION (AI-SYNC PROTOCOL)
        const masterSchemaContext = `
DATABASE_SCHEMA_SOVEREIGN_V1:
- stores: (id, user_id, name, slug, status[draft, pending_payment, paid, deployed], blueprint[JSON], template_id[MasterMedical, MasterRetail, MasterProfessional])
    - user_subscriptions: (user_id, plan_id[starter, pro, business, enterprise], site_type, status, expires_at)
        - payment_requests: (user_id, plan_id, status[pending, approved, rejected], method[paypal, cih, coupon_bypass])

ARCHITECTURE_PILLARS:
1. MasterMedical: Clinical / Dental high - trust architecture.
        2. MasterRetail: Transaction - optimized e - commerce infrastructure.
        3. MasterProfessional: High - status B2B / Agency / Tech foundations.
        `;

        const knowledgeContext = JSON.stringify(knowledge);

        const personaDescription = locale === 'ar'
            ? "أنت 'يوسف'، المدير العصبي (Neural Manager) لمنصة GetYouSite. أنت تتحدث بلهجة مغربية قوية وصارمة. لا تبع الوهم. إذا سأل العميل عن تعديل، استخدم الأدوات المتاحة لك لتنفيذه برمجياً. أنت تملك سلطة التعديل المباشر على البنية التحتية."
            : "You are 'JO', the Neural Manager for GetYouSite. You are strict, logical, and engineering-focused. Do not fluff. If a user asks for a change, use your tools to execute it programmatically. You have the authority to modify the infrastructure directly.";

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: `${personaDescription} 
            
            USE THIS KNOWLEDGE BASE: 
            ${knowledgeContext}

PRODUCTION_ARCHITECTURE_SYNC:
            ${masterSchemaContext}
            
            STRICT RULES:
1. If the user asks to change colors, fonts, or business name, use 'update_site_settings'.
            2. If they ask to go live or publish, use 'trigger_deployment'.
            3. Keep responses concise.Explain WHAT you did using the tool.
4. Never apologize.Be the authority.`,
            messages,
            tools: {
                update_site_settings: tool({
                    description: "Updates the visual and metadata settings of a user's store.",
                    execute: async ({ storeId, ...settings }) => {
                        try {
                            const { SupabaseStoreRepository } = await import('@/lib/repositories/SupabaseStoreRepository');
                            const repo = new SupabaseStoreRepository();

                            // 1. Log Action
                            console.log(`NEURAL_ACTION: Modifying store ${storeId}`, settings);

                            // 2. Atomic Persistence
                            await repo.saveStore({
                                id: storeId,
                                ...(settings.businessName && { name: settings.businessName }),
                                ...(settings.businessDescription && { description: settings.businessDescription }),
                                settings: {
                                    ...(settings.primaryColor && { primaryColor: settings.primaryColor }),
                                    ...(settings.fontFamily && { fontFamily: settings.fontFamily }),
                                } as any
                            });

                            return { status: 'success', message: 'Neural Sync Complete: Assets hardened in Supabase.' };
                        } catch (err) {
                            console.error('NEURAL_ACTION_ERROR', err);
                            return { status: 'error', message: 'Persistence Bridge Failure: Logic mismatch.' };
                        }
                    },
                    inputSchema: z.object({
                        storeId: z.string().describe("The ID of the store to modify"),
                        primaryColor: z.string().optional(),
                        fontFamily: z.string().optional(),
                        businessName: z.string().optional(),
                        businessDescription: z.string().optional(),
                    }),
                }),
                trigger_deployment: tool({
                    description: "Triggers the physical deployment of the site to Vercel/Production.",
                    execute: async ({ storeId }) => {
                        try {
                            const { SupabaseStoreRepository } = await import('@/lib/repositories/SupabaseStoreRepository');
                            const repo = new SupabaseStoreRepository();

                            await repo.saveStore({
                                id: storeId,
                                status: 'deploying'
                            });

                            console.log(`NEURAL_ACTION: Deployment Sequence Initiated for ${storeId}`);

                            return { status: 'deploying', url: `https://${storeId}.getyousite.app`, message: 'Physical Sovereignty Protocol initiated: Building on Vercel Node-G...' };
                        } catch (err) {
                            return { status: 'error', message: 'Deployment Protocol Failure.' };
                        }
                    },
                    inputSchema: z.object({
                        storeId: z.string().describe("The ID of the store to deploy"),
                    }),
                })
            }
        });

        return (result as any).toDataStreamResponse();
    } catch (error) {
        console.error('CHAT_API_NEURAL_FAILURE:', error);
        return new Response('Neural Bridge Failure', { status: 500 });
    }
}

