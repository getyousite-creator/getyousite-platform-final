-- Migration 007: Blog Infrastructure
-- High-Authority SEO Content Engine

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_name TEXT DEFAULT 'Architect Prime',
    category TEXT DEFAULT 'Sovereign Insights',
    tags TEXT[],
    published_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    meta_title TEXT,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read published posts
CREATE POLICY "Allow public read-access to published posts" 
ON blog_posts FOR SELECT 
USING (is_published = true);

-- Only authenticated admins (checked via metadata or role) can manage posts
-- For now, we allow authenticated users to manage (this should be refined for production admin roles)
CREATE POLICY "Allow authenticated management" 
ON blog_posts FOR ALL 
USING (auth.role() = 'authenticated');
