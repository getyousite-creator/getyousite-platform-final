-- SOVEREIGN PAYMENT REQUESTS (MOROCCAN HYBRID SYSTEM)
-- Path: supabase/migrations/004_payment_requests.sql

-- 1. Create Payment Methods Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('paypal', 'stripe', 'cih', 'barid', 'cashplus');
    END IF;
END $$;

-- 2. Create Payment Requests Table (For Manual/Offline Proofs)
CREATE TABLE IF NOT EXISTS payment_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
    method payment_method NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    receipt_url TEXT, -- URL to the uploaded proof (Reçu)
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Implementation
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "users_see_own_payment_requests" ON payment_requests
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create requests (for proof of payment)
CREATE POLICY "users_create_payment_requests" ON payment_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only service role can update/delete
CREATE POLICY "service_role_manage_payment_requests" ON payment_requests
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 4. Trigger to update user_subscriptions on approval
-- (Advanced Logic: When status becomes 'approved', we trigger subscription update)
-- This is usually handled via Server Action, but we keep the DB ready.
