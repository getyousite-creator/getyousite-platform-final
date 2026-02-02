-- SOVEREIGN SHOWCASE ENHANCEMENT
-- Path: supabase/migrations/005_showcase_features.sql

-- 1. Add is_featured column to stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- 2. Add description for admin notes
ALTER TABLE stores ADD COLUMN IF NOT EXISTS admin_description TEXT;

-- 3. Update public view policy to include featured sites regardless of status (or just keep it to deployed)
-- The existing policy covers status='deployed', which is perfect.

-- 4. Create an index for featured sites
CREATE INDEX IF NOT EXISTS idx_stores_featured ON stores(is_featured) WHERE is_featured = TRUE;
