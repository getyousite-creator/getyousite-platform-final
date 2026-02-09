-- SOVEREIGN DATABASE REPAIR
-- Logic: Create missing 'users' and 'profiles' tables to resolve 42P01 error
-- Usage: Run this ENTIRE SCRIPT in Supabase SQL Editor

-- 1. Create 'users' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  tier TEXT DEFAULT 'starter',
  credits INTEGER DEFAULT 0,
  locale TEXT DEFAULT 'ar',
  timezone TEXT DEFAULT 'Africa/Casablanca',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create 'profiles' table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT,
  plan_id TEXT,
  subscription_id TEXT
);

-- 3. Create the Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- A. Create the User record in public.users
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    new.id, 
    new.email, 
    new.created_at, 
    new.created_at
  )
  ON CONFLICT (id) DO NOTHING;

  -- B. Create the Profile record in public.profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-create the Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Backfill existing users (Optional but recommended)
-- This ensures any users already in auth.users get a public record
DO $$
BEGIN
  -- Insert into users
  INSERT INTO public.users (id, email, created_at, updated_at)
  SELECT id, email, created_at, created_at
  FROM auth.users
  ON CONFLICT (id) DO NOTHING;

  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  SELECT id, raw_user_meta_data->>'full_name', raw_user_meta_data->>'avatar_url'
  FROM auth.users
  ON CONFLICT (id) DO NOTHING;
END $$;
