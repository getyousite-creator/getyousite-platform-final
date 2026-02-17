-- Add AI generation credit tracking for users
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;
