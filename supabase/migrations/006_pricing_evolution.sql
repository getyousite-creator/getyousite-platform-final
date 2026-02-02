-- PRICING EVOLUTION: SITE TYPE & CURRENCY SUPPORT
-- Path: supabase/migrations/006_pricing_evolution.sql

-- 1. Extend payment_requests with site_type and currency
ALTER TABLE payment_requests 
ADD COLUMN IF NOT EXISTS site_type TEXT,
ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD';

-- 2. Extend user_subscriptions with allowed_site_type
-- This allows us to lock a user to a specific niche (Blog, Business, Store)
ALTER TABLE user_subscriptions
ADD COLUMN IF NOT EXISTS allowed_site_type TEXT DEFAULT 'blog';

-- 3. Update RLS (Optional: ensuring clean access)
-- Policies already exist for payment_requests and user_subscriptions.

-- 4. Admin View expansion (Implicitly handled by table alter)
