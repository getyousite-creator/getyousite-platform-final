
export interface SubscriptionPlan {
    id: string; // 'starter' | 'pro' | 'business'
    name: string;
    description: string;
    price: number;
    currency: string;
    features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    starter: {
        id: 'starter',
        name: 'Node Starter',
        description: 'Entry-level access to the Sovereign Network.',
        price: 19,
        currency: 'USD',
        features: ['1 AI Website', 'Basic Analytics', 'Standard Support']
    },
    pro: {
        id: 'pro',
        name: 'Nexus Pro',
        description: 'Advanced capabilities for serious operators.',
        price: 49,
        currency: 'USD',
        features: ['5 AI Websites', 'Advanced Analytics', 'Priority Support', 'Custom Domains']
    },
    business: {
        id: 'business',
        name: 'Empire Business',
        description: 'Complete dominance with dedicated infrastructure.',
        price: 99,
        currency: 'USD',
        features: ['Unlimited Websites', 'White-label Options', 'Dedicated Account Manager', 'API Access']
    }
};

export const getPlanById = (id: string): SubscriptionPlan => {
    return SUBSCRIPTION_PLANS[id] || SUBSCRIPTION_PLANS.starter;
};
