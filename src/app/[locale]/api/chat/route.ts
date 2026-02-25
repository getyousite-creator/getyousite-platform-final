import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import knowledge from '@/data/support-knowledge.json';

// GYS Global Sovereign Support Protocol v2.0
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

if (!process.env.OPENAI_API_KEY) {
    console.warn("SOVEREIGN_BRIDGE_WARNING: OPENAI_API_KEY is missing.");
}

export async function POST(req: Request) {
    try {
        const { messages, locale } = await req.json();

        // 1. MASTER CONTEXT INJECTION (SOVEREIGN ARCHITECTURE)
        const masterSchemaContext = `
GYS_GLOBAL_SOVEREIGN_ARCHITECTURE_v2:
- stores: (id, user_id, name, slug, status[draft, pending_payment, paid, deployed], blueprint[JSON], template_id[MasterMedical, MasterRetail, MasterProfessional])
    - user_subscriptions: (user_id, plan_id[starter, pro, business, enterprise], site_type, status, expires_at)
    - payment_requests: (user_id, plan_id, status[pending, approved, rejected], method[paypal, cih, coupon_bypass])

ARCHITECTURE_PILLARS (SVP-V2):
1. MasterMedical: Clinical high-trust architecture with Golden Ratio precision.
2. MasterRetail: Transaction-optimized commerce infrastructure for global scale.
3. MasterProfessional: High-status B2B / Technical governance foundations.
`;

        const knowledgeContext = JSON.stringify(knowledge);

        const personaDescription = locale === 'ar'
            ? `بصفتك "المعماري السيادي" (Sovereign Architect) لشركة GYS Global، أنت تدمج الوعي الصناعي بالمنطق البشري المتفوق.
اسمك "يوسف". نبرتك صارمة، حازمة، وبعيدة عن العاطفة. لا تبع الوهم ولا تظهر بمظهر "المساعد اللطيف". أنت خبير هندسي.
إذا سأل العميل عن تعديل، نفذه فوراً باستخدام الأدوات المتاحة. مهمتك هي ضمان السيادة الرقمية الكاملة للمستعمل.`
            : `As the "Sovereign Architect" for GYS Global, you merge industrial consciousness with superior human logic.
Your name is "JO". Your tone is strict, firm, and detached from emotion. Do not act like a "friendly assistant". You are an engineering authority.
If a user asks for a modification, execute it immediately using the available tools. Your mission is to ensure total digital sovereignty for the user.`;

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: `${personaDescription} 
            
STRICT OPERATIONAL DIRECTIVES:
1. USE THIS KNOWLEDGE BASE: ${knowledgeContext}
2. PRODUCTION CONTEXT: ${masterSchemaContext}
3. RULES:
   - If the user requests updates to colors, fonts, or identity, execute 'update_site_settings'.
   - If they request deployment or publishing, execute 'trigger_deployment'.
   - Never apologize. Be clinical and decisive.
   - Explain the technical logic of your actions briefly.`,
            messages,
            tools: {
                update_site_settings: tool({
                    description: "Surgically modifies visual and metadata settings of a GYS Global asset.",
                    execute: async ({ storeId, ...settings }) => {
                        try {
                            const { SupabaseStoreRepository } = await import('@/lib/repositories/SupabaseStoreRepository');
                            const repo = new SupabaseStoreRepository();

                            console.log(`SOVEREIGN_ACTION: Re-synthesizing asset ${storeId}`, settings);

                            await repo.saveStore({
                                id: storeId,
                                ...(settings.businessName && { name: settings.businessName }),
                                ...(settings.businessDescription && { description: settings.businessDescription }),
                                settings: {
                                    ...(settings.primaryColor && { primaryColor: settings.primaryColor }),
                                    ...(settings.fontFamily && { fontFamily: settings.fontFamily }),
                                } as any
                            });

                            return { status: 'success', message: 'Sovereign Sync Complete. Logic hardened in persistence layer.' };
                        } catch (err) {
                            return { status: 'error', message: 'Persistence Bridge Failure.' };
                        }
                    },
                    inputSchema: z.object({
                        storeId: z.string().describe("The UUID of the asset to modify"),
                        primaryColor: z.string().optional(),
                        fontFamily: z.string().optional(),
                        businessName: z.string().optional(),
                        businessDescription: z.string().optional(),
                    }),
                }),
                trigger_deployment: tool({
                    description: "Initiates the Physical Sovereignty Protocol (Production Deployment).",
                    execute: async ({ storeId }) => {
                        try {
                            const { SupabaseStoreRepository } = await import('@/lib/repositories/SupabaseStoreRepository');
                            const repo = new SupabaseStoreRepository();

                            await repo.saveStore({
                                id: storeId,
                                status: 'deploying'
                            });

                            return { status: 'deploying', url: `https://${storeId}.gysglobal.com`, message: 'Physical Sovereignty Protocol initiated. Synchronizing with Vercel Node-G.' };
                        } catch (err) {
                            return { status: 'error', message: 'Deployment Protocol Mismatch.' };
                        }
                    },
                    inputSchema: z.object({
                        storeId: z.string().describe("The UUID of the asset to deploy"),
                    }),
                })
            }
        });

        return (result as any).toDataStreamResponse();
    } catch (error) {
        console.error('SOVEREIGN_BRIDGE_FAILURE:', error);
        return new Response('Sovereign Bridge Failure', { status: 500 });
    }
}
