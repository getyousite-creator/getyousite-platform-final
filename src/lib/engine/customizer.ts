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
     * Generates a final, personalized blueprint by mutating a base template.
     */
    async generateFinalBlueprint(userData: UserPromptData): Promise<SiteBlueprint> {
        const template = this.findTemplate(userData.selectedId);
        if (!template) {
            console.error(`ENGINE_CRITICAL_FAILURE: Template ID '${userData.selectedId}' not found.`);
            throw new Error(`CRITICAL_ERROR: Template_ID_Not_Found: ${userData.selectedId}`);
        }

        // CLINICAL CONTENT GENERATION MAP
        const nicheContent: Record<string, any> = {
            "AI News": {
                headline: `Breaking: ${userData.businessName} Orchestrates the Future of Intelligence`,
                subheadline: `Real-time neural analysis and high-frequency reporting on the global AI ecosystem.`,
                features: ["Neural-Feed-v1", "Deep-Logic-Analysis", "Global-Intelligence-Network"]
            },
            "Real Estate": {
                headline: `Luxury Architecture. Sovereign Ownership.`,
                subheadline: `Curating the future of residential and commercial ecosystems for ${userData.businessName}.`,
                features: ["Virtual-Blueprint-Tours", "Sovereign-Asset-Protection", "Geometric-Layout-Optimization"]
            }
        };

        const specializedContent = nicheContent[userData.niche] || {
            headline: `Architecting ${userData.businessName} for the Future`,
            subheadline: userData.vision,
            features: ["Logic-Standard-v1", "Clean-Architecture", "Optimized-Efficiency"]
        };

        // 2. Deep Architectural Merge (Logic-First)
        const finalBlueprint: SiteBlueprint = {
            id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            ...template.blueprint, // Base DNA
            name: userData.businessName, // User branding
            description: userData.vision, // User vision
            theme: {
                ...template.blueprint.theme,
                primary: template.blueprint.theme.primary,
                secondary: "#a855f7",
            },
            layout: template.blueprint.layout.map(section => ({
                ...section,
                content: {
                    ...section.content,
                    headline: section.type === 'hero'
                        ? specializedContent.headline
                        : section.content.headline,
                    subheadline: section.type === 'hero' ? specializedContent.subheadline : section.content.subheadline
                }
            })),
            metadata: {
                ...template.blueprint.metadata,
                generated_at: new Date().toISOString(),
                engine_version: "Sovereign-v1.2-Niche-Aware",
                niche: userData.niche
            }
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
