-- =====================================================
-- GETYOUSITE PLATFORM - DATABASE SCHEMA & RLS
-- Complete Schema with Row Level Security
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: stores (User-Generated Sites)
-- =====================================================

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Site Metadata
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    
    -- Content & Configuration
    blueprint JSONB NOT NULL,
    
    -- Status Tracking
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'paid', 'deploying', 'deployed', 'failed')),
    
    -- Deployment Info
    deployment_url TEXT,
    deployed_at TIMESTAMPTZ,
    
    -- Payment Info
    paid_at TIMESTAMPTZ,
    payment_id TEXT,
    amount DECIMAL(10,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES: stores table
-- =====================================================

-- Policy 1: Users can view only their own stores
DROP POLICY IF EXISTS "users_view_own_stores" ON stores;
CREATE POLICY "users_view_own_stores"
    ON stores
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Users can insert only their own stores
DROP POLICY IF EXISTS "users_insert_own_stores" ON stores;
CREATE POLICY "users_insert_own_stores"
    ON stores
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update only their own stores
DROP POLICY IF EXISTS "users_update_own_stores" ON stores;
CREATE POLICY "users_update_own_stores"
    ON stores
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete only their own stores
DROP POLICY IF EXISTS "users_delete_own_stores" ON stores;
CREATE POLICY "users_delete_own_stores"
    ON stores
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy 5: Public can view deployed stores by slug
DROP POLICY IF EXISTS "public_view_deployed_stores" ON stores;
CREATE POLICY "public_view_deployed_stores"
    ON stores
    FOR SELECT
    USING (status = 'deployed' AND slug IS NOT NULL);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_created_at ON stores(created_at DESC);

-- =====================================================
-- TRIGGER: Auto-update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- 1. Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'stores';
-- Expected: rowsecurity = true

-- 2. List all policies on stores table
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'stores';
-- Expected: 5 policies (4 user + 1 public)

-- 3. Verify indexes exist
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'stores';
-- Expected: 4 indexes

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================

-- To completely remove stores table:
-- DROP TABLE IF EXISTS stores CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
