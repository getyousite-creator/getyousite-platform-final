import { HeroPrime } from '@/components/smart-components';

export type ComponentType = 'HERO_PRIME' | 'FEATURE_GRID' | 'LOGIC_SERVICES';

interface ComponentDefinition {
    id: ComponentType;
    name: string;
    description: string;
    defaultProps: Record<string, any>;
    category: 'hero' | 'content' | 'footer' | 'header';
}

export const COMPONENT_REGISTRY: Record<ComponentType, ComponentDefinition> = {
    HERO_PRIME: {
        id: 'HERO_PRIME',
        name: 'Hero Prime (Sovereign)',
        description: 'The main entry point for sovereign websites with high impact visuals.',
        category: 'hero',
        defaultProps: {
            title: 'Welcome to the Future',
            subtitle: 'This is a sovereign digital asset built by GetYouSite AI.',
            ctaText: 'Start Now',
            layout: 'modern',
            alignment: 'center',
            colorScheme: 'navy'
        }
    },
    // Placeholder for future components
    FEATURE_GRID: {
        id: 'FEATURE_GRID',
        name: 'Feature Grid (Matrix)',
        description: 'Displays key selling points in a structured grid.',
        category: 'content',
        defaultProps: {}
    },
    LOGIC_SERVICES: {
        id: 'LOGIC_SERVICES',
        name: 'Logic Services',
        description: 'Detailed service cards with hover effects.',
        category: 'content',
        defaultProps: {}
    }
};
