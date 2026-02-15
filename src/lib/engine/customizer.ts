import { SITE_TEMPLATES, TemplateTheme } from '../templates';
import { SiteBlueprint } from '../schemas';

export interface UserPromptData {
    businessName: string;
    niche: string;
    vision: string;
    selectedId: string;
}

// CLINICAL HEURISTIC SYNTHESIS
const HeuristicSovereignGenerator = {
    synthesize(userData: UserPromptData, locale: string = 'en') {
        const niche = userData.niche.toLowerCase();
        const vision = userData.vision.toLowerCase();
        const biz = userData.businessName;
        const isAr = locale === 'ar';

        // 1. Primary Niche Vectors
        if (niche.includes('health') || niche.includes('doctor') || vision.includes('medical')) {
            return {
                headline: isAr ? `التميز الطبي لـ ${biz}: رعاية المرضى أولاً` : `Clinical Excellence for ${biz}: Patient-First Care`,
                subheadline: isAr ? `بنية تحتية للرعاية الصحية مصممة لتحسين نتائج المرضى وبناء الثقة.` : `High-fidelity healthcare infrastructure designed for optimal patient outcomes and trust.`,
                features: ["Sovereign-Health-v1", "HIPAA-Standard-Logic", "Global-Clinical-Reach"]
            };
        }

        if (niche.includes('tech') || niche.includes('ai') || vision.includes('future')) {
            return {
                headline: isAr ? `تنظيم المستقبل بذكاء ${biz}` : `Orchestrating the Future with ${biz} Intelligence`,
                subheadline: isAr ? `بنية عصبية في الوقت الفعلي ونشر عالي التردد للنظام الرقمي العالمي.` : `Real-time neural architecture and high-frequency deployment for the global digital ecosystem.`,
                features: ["Neural-Feed-v3", "Logic-Hardened-API", "Autonomous-Expansion-Nodes"]
            };
        }

        if (niche.includes('estate') || niche.includes('property') || niche.includes('house')) {
            return {
                headline: isAr ? `عمارة فاخرة. ملكية سيادية.` : `Luxury Architecture. Sovereign Ownership.`,
                subheadline: isAr ? `تقييم وتنسيق البيئات السكنية والتجارية عالية القيمة لعملاء ${biz}.` : `Curating high-value residential and commercial ecosystems for ${biz} clients.`,
                features: ["Precision-Blueprints", "Asset-Security-Protocol", "Geometric-Layout-Optimization"],
                injectionSection: {
                    type: 'CINEMATIC_VIDEO',
                    content: {
                        prompt: `Modern luxury villa for ${biz}`,
                        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-in-a-sunny-day-36314-large.mp4"
                    }
                }
            };
        }

        // 2. Intent-Based Synthesis (Catch-All)
        return {
            headline: isAr ? `بناء التميز: بروتوكول ${biz}` : `Constructing Excellence: The ${biz} Protocol`,
            subheadline: isAr ? `أصل رقمي سيادي مصمم للهيمنة القصوى على السوق في قطاع ${userData.niche}.` : `A sovereign digital asset engineered for maximum market dominance in the ${userData.niche} sector.`,
            features: [isAr ? "كفاءة هيكلية" : "Structural-Efficiency", isAr ? "سرعة النمو" : "Growth-Velocity-v1", isAr ? "معايير العمارة النظيفة" : "Clean-ArchitectureStandard"]
        };
    }
};

/**
 * SOVEREIGN CUSTOMIZATION ENGINE
 * 
 * The core transformation logic that merges user intent with architectural blueprints.
 * Follows the principle of "Algebraic Transformation" (Template + Logic = Unique Platform).
 */
export const CustomizerEngine = {
    /**
     * Generates a final, personalized blueprint by either mutating a base template
     * or calling the Generative AI engine.
     */
    async generateFinalBlueprint(userData: UserPromptData): Promise<SiteBlueprint> {
        const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';

        // Logic: Try AI generation first for "Legendary" output
        try {
            const response = await fetch(`/${locale}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, locale }),
            });

            if (response.ok) {
                const aiBlueprint = await response.json();
                console.log("ENGINE_EVOLUTION: Generative AI Blueprint Synthesized.");
                return aiBlueprint;
            }
            console.warn("ENGINE_FALLBACK: AI Generation failed, falling back to heuristic customization.");
        } catch (e) {
            console.error("ENGINE_RECOVERY: AI Error, using heuristic fallback.", e);
        }

        const template = this.findTemplate(userData.selectedId);
        if (!template) {
            console.error(`ENGINE_CRITICAL_FAILURE: Template ID '${userData.selectedId}' not found.`);
            throw new Error(`CRITICAL_ERROR: Template_ID_Not_Found: ${userData.selectedId}`);
        }

        // 1. EXECUTE HEURISTIC SYNTHESIS
        const specializedContent = HeuristicSovereignGenerator.synthesize(userData, locale) as any;

        // 2. Deep Architectural Merge (Logic-First)
        let baseLayout = [...template.blueprint.layout];

        // LOGIC: Inject specialized sections if requested by the heuristic
        if (specializedContent.injectionSection) {
            // Find insertion point (usually after hero)
            const heroIndex = baseLayout.findIndex(s => s.type === 'hero' || s.type === 'HERO_PRIME');
            const newSection = {
                id: `inject_${Date.now()}`,
                animation: 'fade-in' as const,
                styles: {},
                ...specializedContent.injectionSection
            };
            baseLayout.splice(heroIndex + 1, 0, newSection);
        }

        const finalBlueprint: SiteBlueprint = {
            ...template.blueprint, // Base DNA
            id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: userData.businessName,
            description: userData.vision,
            ai_insight: `Focus on ${userData.niche.toLowerCase()} trends and local visibility for ${userData.businessName}. Synthetic heuristic applied. [LOCALE: ${locale}]`,
            theme: {
                ...template.blueprint.theme,
                primary: template.blueprint.theme.primary,
                secondary: template.blueprint.theme.secondary || "#1e293b",
            },
            layout: baseLayout.map(section => ({
                ...section,
                content: {
                    ...section.content,
                    headline: section.type === 'hero' || section.type === 'HERO_PRIME' ? specializedContent.headline : section.content.headline,
                    subheadline: section.type === 'hero' || section.type === 'HERO_PRIME' ? specializedContent.subheadline : section.content.subheadline,
                    features: section.type === 'features' || section.type === 'FEATURE_GRID' ? specializedContent.features : section.content.features
                }
            })),
            metadata: {
                ...template.blueprint.metadata,
                generated_at: new Date().toISOString(),
                engine_version: "Sovereign-v1.4-Heuristic-Synthesis",
                niche: userData.niche,
                seo: {
                    title: `${userData.businessName} | Optimal ${userData.niche}`,
                    description: userData.vision.substring(0, 160) || `World-class ${userData.niche} services by ${userData.businessName}.`,
                    keywords: [userData.niche, 'sovereign', 'intelligence']
                }
            },
            economic_impact: template.blueprint.economic_impact || {
                estimated_savings: "$2.4M",
                valuation: 3200000,
                logic_verified: true,
            },
            whiteLabel: template.blueprint.whiteLabel || false,
            timestamp: new Date().toISOString()
        };

        return finalBlueprint;
    },

    findTemplate(id: string): TemplateTheme | null {
        for (const cat of SITE_TEMPLATES.categories) {
            const found = cat.themes.find(t => t.id === id);
            if (found) return found;
        }
        return null;
    }
};
