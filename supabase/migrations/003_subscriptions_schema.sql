-- SOVEREIGN MONETIZATION SCHEMA
-- Path: supabase/migrations/003_subscriptions_schema.sql

-- 1. Create Subscription Plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY, -- 'free', 'pro', 'enterprise'
    name TEXT NOT NULL,
    description TEXT,
    price_id TEXT, -- Stripe Price ID
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create User Subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    plan_id TEXT REFERENCES subscription_plans(id) DEFAULT 'free',
    status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
    current_period_end TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Seed Default Plans
INSERT INTO subscription_plans (id, name, description, features) VALUES
('free', 'Starter', 'Perfect for individuals starting their digital journey.', '["1 Store", "Standard Templates", "Basic Support"]'),
('pro', 'Professional', 'Ultimate power for growing businesses.', '["Unlimited Stores", "Premium Templates", "Sovereign Image Optimization", "Priority Support"]'),
('enterprise', 'Enterprise', 'Custom-grade infrastructure for scale.', '["Custom Templates", "White-label Support", "Dedicated Infrastructure"]')
ON CONFLICT (id) DO NOTHING;

-- 4. RLS Implementation (Sovereign Security)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Plans are public for viewing
CREATE POLICY "anyone_can_view_plans" ON subscription_plans
    FOR SELECT USING (true);

-- User can only see their own subscription status
CREATE POLICY "users_see_own_subscription" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role (server-side) can manage subscriptions
-- (We don't want users writing to this table directly)
CREATE POLICY "service_role_manage_subscriptions" ON user_subscriptions
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');
