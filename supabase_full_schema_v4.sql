-- GETYOUSITE SOVEREIGN SCHEMA (PHASE 4 READY)
-- Purpose: Unified Data Infrastructure for Intelligence & Analytics
-- Execute in Supabase SQL Editor

-- 1. ANALYTICS ENGINE
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    path TEXT DEFAULT '/',
    views INTEGER DEFAULT 0,
    visitors INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    device TEXT,
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    session_duration INTEGER,
    bounce_rate FLOAT,
    exit_rate FLOAT,
    source TEXT,
    medium TEXT,
    campaign TEXT,
    referrer TEXT,
    events JSONB,
    timestamp TIMESTAMPTZ DEFAULT now(),
    date DATE DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_analytics_store_date ON public.analytics(store_id, date);

-- 2. SEO PERFORMANCE ENGINE
CREATE TABLE IF NOT EXISTS public.seo_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    overall_score INTEGER DEFAULT 0,
    seo_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    accessibility_score INTEGER DEFAULT 0,
    best_practices_score INTEGER DEFAULT 0,
    issues JSONB,
    recommendations JSONB,
    lcp FLOAT,
    fid FLOAT,
    cls FLOAT,
    target_keywords TEXT[],
    ranking_positions JSONB,
    analyzed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_audits_store_date ON public.seo_audits(store_id, analyzed_at);

-- 3. MEDIA & ASSETS
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    storage_path TEXT NOT NULL,
    alt TEXT,
    caption TEXT,
    width INTEGER,
    height INTEGER,
    ai_tags TEXT[],
    ai_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SYSTEM LOGGING (SOVEREIGN AUDIT)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level TEXT NOT NULL,
    source TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_logs_created ON public.system_logs(created_at);

-- 5. PROFILE REFINEMENT (PAYPAL & SUBSCRIPTIONS)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS plan_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS paypal_payer_id TEXT;
-- 6. CONVERSION ENGINE (STORE LEADS)
CREATE TABLE IF NOT EXISTS public.store_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    message TEXT,
    metadata JSONB,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert (contact form)
CREATE POLICY "public_insert_leads" ON public.store_leads FOR INSERT WITH CHECK (true);

-- Policy: Store owners can view leads for their stores
CREATE POLICY "owners_view_leads" ON public.store_leads FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.stores 
        WHERE id = store_leads.store_id AND user_id = auth.uid()
    )
);

CREATE INDEX IF NOT EXISTS idx_store_leads_store_id ON public.store_leads(store_id);
