
export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    starter: {
        id: 'starter',
        name: 'Starter',
        description: 'Proof of Concept Protocol - Ideal for early visionaries.',
        price: 0,
        currency: 'USD',
        features: [
            'Logic Community Support',
            'Standard GYS Branding',
            'GYS Subdomain Access',
            'Basic AI Unit Generation',
        ],
    },
    pro: {
        id: 'pro',
        name: 'Professional',
        description: 'Professional Growth Engine - High-status digital presence.',
        price: 19,
        currency: 'USD',
        features: [
            'Neural Traffic Analytics',
            'Priority Engineering Support',
            'Total Brand Sovereignty',
            'Naked Domain Linking',
            '3 Sovereign Web Assets',
        ],
    },
    business: {
        id: 'business',
        name: 'Business',
        description: 'Digital Empire Infrastructure - Full architectural control.',
        price: 49,
        currency: 'USD',
        features: [
            'API Access Protocol',
            'Redundant Security Backups',
            'Live Logic Support Chat',
            'Autonomous SEO Architect',
            '10 Sovereign Web Assets',
        ],
    },
};

export const getPlanById = (id: string): SubscriptionPlan => {
    return SUBSCRIPTION_PLANS[id] || SUBSCRIPTION_PLANS.starter;
};
