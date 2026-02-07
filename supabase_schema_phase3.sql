-- PHASE 3: MONETIZATION ENGINE (STRIPE SYNC)
-- Execute this in the Supabase SQL Editor if Prisma sync fails

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS plan_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT;

-- Index for fast lookup via webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
