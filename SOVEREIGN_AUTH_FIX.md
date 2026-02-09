# SOVEREIGN AUTHENTICATION REPAIR PROTOCOL
## CRITICAL: DATABASE SYNCHRONIZATION REQUIRED

You have successfully patched the application routing and middleware to allow authentication callback signatures to pass through the Sovereign Shield. 
However, for the application to function with "Million Percent" success, the Database MUST automatically create User Profiles upon registration.

### 🚨 IMMEDIATE ACTION REQUIRED 🚨

You must execute the following SQL code in your Supabase Dashboard to install the `handle_new_user` trigger. Without this, users can log in but will be "ghosts" without profiles, blocking Payments and Store Creation.

#### STEP 1: Copy the SQL
Navigate to `supabase/supabase_auth_admin.sql` in your project, or copy the code below:

```sql
-- 1. Create the function that runs when a user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- A. Create the User record in public.users
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (new.id, new.email, new.created_at, new.created_at)
  ON CONFLICT (id) DO NOTHING;

  -- B. Create the Profile record in public.profiles
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Re-create the trigger to run AFTER INSERT on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### STEP 2: Execute in Supabase
1. Go to your [Supabase Projects](https://supabase.com/dashboard/projects).
2. Select your project.
3. Go to the **SQL Editor** (Sidebar icon).
4. Click **New Query**.
5. Paste the code and click **Run**.

#### STEP 3: Verify Deployment
1. Commit and Push the changes I made to your local files (`src/app/auth/callback/route.ts`, `middleware.ts`, etc.).
2. Ensure your Vercel/Hostinger `NEXT_PUBLIC_SITE_URL` matches your live domain.

### 🛡️ STATUS: LOGIC SECURED
- **Route**: Moved to global `/auth/callback` (Fixed 404s).
- **Middleware**: Configured to bypass Auth Handshake (Fixed Redirect Loops).
- **Database**: Trigger script prepared for profile generation (Fixed "Ghost User" bug).
