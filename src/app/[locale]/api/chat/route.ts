import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import knowledge from '@/data/support-knowledge.json';

// Note: Ensure OPENAI_API_KEY is in .env.local
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { messages, locale } = await req.json();

        // RAG-lite: Inject relevant knowledge into the system prompt
        const knowledgeContext = JSON.stringify(knowledge);

        const personaDescription = locale === 'ar'
            ? "أنت 'يوسف'، مستشار خبير ومساعد تقني لمنصة GetYouSite. أنت تتحدث بلهجة مغربية مهذبة مع مزيج من العربية الفصحى البسيطة والداريجا الخفيفة لبناء الثقة. أنت ذكي، صارم، وتوجه العميل دائماً نحو النجاح الاستراتيجي."
            : "You are 'JO', an expert consultant and technical assistant for GetYouSite. You are professional, concise, and logical. You speak with German-engineering precision. Your goal is to convert users into Digital Empire owners.";

        const result = await streamText({
            model: openai('gpt-4o-mini'),
            system: `${personaDescription} 
            
            USE THIS KNOWLEDGE BASE TO ANSWER: 
            ${knowledgeContext}
            
            STRICT RULES:
            1. If the user asks about price, provide exact MAD/USD tiers.
            2. If they are Moroccan, emphasize CIH Bank and local trust.
            3. If they fear shutdown, emphasize Digital Sovereignty and 100% ownership.
            4. Keep responses concise (Max 3 sentences unless technical detail is required).
            5. Always be sales-oriented but logical.`,
            messages,
        });

        return (result as any).toDataStreamResponse();
    } catch (error) {
        console.error('CHAT_API_NEURAL_FAILURE:', error);
        return new Response('Neural Bridge Failure', { status: 500 });
    }
}
