import { generateWithFallback } from "@/lib/ai/multi-provider";

export interface EmpirePlanInput {
    businessDescription: string;
    locale?: string;
}

export interface EmpirePlan {
    structure: Record<string, unknown>;
    contentSeo: Record<string, unknown>;
    visuals: Record<string, unknown>;
}

async function structuralPlannerAgent(input: EmpirePlanInput) {
    const prompt = `
Analyze this business idea and output JSON only:
"${input.businessDescription}"

Return:
1) sitemap: array of pages (slug, title, purpose)
2) layout: section order for homepage
3) theme: primary/secondary/accent hex
4) navigation: menu links
`;

    const result = await generateWithFallback({
        prompt,
        jsonMode: true,
        temperature: 0.3,
        maxTokens: 2500,
    });

    return JSON.parse(result.content || "{}");
}

async function copySeoAgent(input: EmpirePlanInput) {
    const prompt = `
Business: "${input.businessDescription}"
Locale: "${input.locale || "en"}"

Generate JSON only:
1) homepage copy (hero, services, testimonials, CTA)
2) seo metadata (title, description, keywords)
3) 3 blog post briefs (title, angle, primary keyword)
`;

    const result = await generateWithFallback({
        prompt,
        jsonMode: true,
        temperature: 0.5,
        maxTokens: 2800,
    });

    return JSON.parse(result.content || "{}");
}

async function visualMotionAgent(input: EmpirePlanInput) {
    const prompt = `
Business: "${input.businessDescription}"

Generate JSON only:
1) hero image prompts (3 variants)
2) slider captions (3 slides)
3) tailwind motion classes for subtle entrance animations
4) svg motif ideas for lightweight visuals
`;

    const result = await generateWithFallback({
        prompt,
        jsonMode: true,
        temperature: 0.6,
        maxTokens: 2200,
    });

    return JSON.parse(result.content || "{}");
}

export async function generateEmpirePlan(input: EmpirePlanInput): Promise<EmpirePlan> {
    const [structure, contentSeo, visuals] = await Promise.all([
        structuralPlannerAgent(input),
        copySeoAgent(input),
        visualMotionAgent(input),
    ]);

    return { structure, contentSeo, visuals };
}
