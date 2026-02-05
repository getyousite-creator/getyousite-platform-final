import { SITE_TEMPLATES, TemplateTheme } from '../templates';
import { SiteBlueprint } from '../schemas';

export interface UserPromptData {
    businessName: string;
    niche: string;
    vision: string;
    selectedId: string;
}

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
        // Logic: Try AI generation first for "Legendary" output
        try {
            const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en';
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

        // CLINICAL CONTENT GENERATION MAP
        // CLINICAL CONTENT GENERATION MAP
        const nicheContent: Record<string, any> = {
            "AI & Tech": {
                headline: `Breaking: ${userData.businessName} Orchestrates the Future of Intelligence`,
                subheadline: `Real-time neural analysis and high-frequency reporting on the global AI ecosystem.`,
                features: ["Neural-Feed-v1", "Deep-Logic-Analysis", "Global-Intelligence-Network"]
            },
            "Real Estate": {
                headline: `Luxury Architecture. Sovereign Ownership.`,
                subheadline: `Curating the future of residential and commercial ecosystems for ${userData.businessName}.`,
                features: ["Virtual-Blueprint-Tours", "Sovereign-Asset-Protection", "Geometric-Layout-Optimization"]
            },
            "Cooking & Culinary": {
                headline: `Taste the Art of Perfection`,
                subheadline: `Where ${userData.businessName} blends tradition with avant-garde culinary science.`,
                features: ["Seasonal-Menu-Curation", "Farm-to-Table-Logistics", "Chef's-Table-Experience"]
            },
            "News & Media": {
                headline: `The Truth, Accelerated.`,
                subheadline: `${userData.businessName} delivers the world's pulse with uncompromising clarity.`,
                features: ["Real-Time-Wire", "Investigative-Deep-Dives", "Global-Correspondent-Network"]
            },
            "Health & Science": {
                headline: `Advancing Human Longevity`,
                subheadline: `Pioneering research and clinical excellence at ${userData.businessName}.`,
                features: ["Clinical-Trials-Access", "Precision-Medicine-Protocol", "Advanced-Diagnostics"]
            },
            "Finance & Law": {
                headline: `Protecting Your Legacy`,
                subheadline: `Strategic counsel for the modern era by ${userData.businessName}.`,
                features: ["Wealth-Preservation", "Corporate-Governance", "Strategic-Litigation"]
            },
            "Fitness & Wellness": {
                headline: `Forge Your Ultimate Self`,
                subheadline: `${userData.businessName} provides the blueprint for physical and mental mastery.`,
                features: ["Performance-Tracking", "Elite-Coaching", "Recovery-Protocols"]
            }
        };

        const specializedContent = nicheContent[userData.niche] || {
            headline: `Architecting ${userData.businessName} for the Future`,
            subheadline: userData.vision,
            features: ["Logic-Standard-v1", "Clean-Architecture", "Optimized-Efficiency"]
        };

        // 2. Deep Architectural Merge (Logic-First)
        const finalBlueprint: SiteBlueprint = {
            ...template.blueprint, // Base DNA
            id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: userData.businessName,
            description: userData.vision,
            ai_insight: specializedContent.insight || `Focus on ${userData.niche.toLowerCase()} trends and local visibility for ${userData.businessName}.`,
            theme: {
                ...template.blueprint.theme,
                primary: template.blueprint.theme.primary,
                secondary: template.blueprint.theme.secondary || "#1e293b",
            },
            layout: template.blueprint.layout.map(section => ({
                ...section,
                content: {
                    ...section.content,
                    headline: section.type === 'hero' ? specializedContent.headline : section.content.headline,
                    subheadline: section.type === 'hero' ? specializedContent.subheadline : section.content.subheadline
                }
            })),
            metadata: {
                ...template.blueprint.metadata,
                generated_at: new Date().toISOString(),
                engine_version: "Sovereign-v1.3-Harden-Logic",
                niche: userData.niche
            },
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
