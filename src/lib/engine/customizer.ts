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
    synthesize(userData: UserPromptData) {
        const niche = userData.niche.toLowerCase();
        const vision = userData.vision.toLowerCase();
        const biz = userData.businessName;

        // 1. Primary Niche Vectors
        if (niche.includes('health') || niche.includes('doctor') || vision.includes('medical') || vision.includes('patient')) {
            return {
                headline: `Clinical Excellence for ${biz}: Patient-First Care`,
                subheadline: `High-fidelity healthcare infrastructure designed for optimal patient outcomes and trust.`,
                features: ["Sovereign-Health-v1", "HIPAA-Standard-Logic", "Global-Clinical-Reach"]
            };
        }

        if (niche.includes('food') || niche.includes('resto') || niche.includes('cafe') || vision.includes('delicious') || vision.includes('taste')) {
            return {
                headline: `${biz}: The Art of Culinary Perfection`,
                subheadline: `A digital dining experience that bridges tradition with avant-garde flavor science.`,
                features: ["Menu-Logic-Synthesis", "Real-Time-Booking", "Gourmet-Visual-Grid"]
            };
        }

        if (niche.includes('tech') || niche.includes('ai') || niche.includes('software') || vision.includes('future') || vision.includes('input')) {
            return {
                headline: `Orchestrating the Future with ${biz} Intelligence`,
                subheadline: `Real-time neural architecture and high-frequency deployment for the global digital ecosystem.`,
                features: ["Neural-Feed-v3", "Logic-Hardened-API", "Autonomous-Expansion-Nodes"]
            };
        }

        if (niche.includes('estate') || niche.includes('property') || niche.includes('house')) {
            return {
                headline: `Luxury Architecture. Sovereign Ownership.`,
                subheadline: `Curating high-value residential and commercial ecosystems for ${biz} clients.`,
                features: ["Precision-Blueprints", "Asset-Security-Protocol", "Geometric-Layout-Optimization"]
            };
        }

        if (niche.includes('law') || niche.includes('legal') || niche.includes('court') || vision.includes('justice')) {
            return {
                headline: `Unyielding Advocacy. Strategic Counsel.`,
                subheadline: `Protecting your interests and legacy with the sovereign legal framework of ${biz}.`,
                features: ["Precedent-Logic", "Client-Confidentiality-v2", "High-Stakes-Litigation"]
            };
        }

        // 2. Intent-Based Synthesis (Catch-All)
        const intent = vision.length > 5 ? vision : `Optimal ${niche} services`;
        return {
            headline: `Reinventing ${niche} through the ${biz} Logic`,
            subheadline: `A sovereign digital asset built to dominate the ${niche} market: ${intent}.`,
            features: ["Structural-Efficiency", "Growth-Velocity-v1", "Clean-Architecture-Standard"]
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

        // 1. EXECUTE HEURISTIC SYNTHESIS
        const specializedContent = HeuristicSovereignGenerator.synthesize(userData);

        // 2. Deep Architectural Merge (Logic-First)
        const finalBlueprint: SiteBlueprint = {
            ...template.blueprint, // Base DNA
            id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: userData.businessName,
            description: userData.vision,
            ai_insight: `Focus on ${userData.niche.toLowerCase()} trends and local visibility for ${userData.businessName}. Synthetic heuristic applied.`,
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
                    subheadline: section.type === 'hero' ? specializedContent.subheadline : section.content.subheadline,
                    features: section.type === 'features' ? specializedContent.features : section.content.features
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
