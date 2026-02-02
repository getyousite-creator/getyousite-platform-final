# Supabase Database Setup

This directory contains database migrations for the GetYouSite platform.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new project in Supabase dashboard
3. **Credentials**: Copy your project URL and keys from Settings > API

## Applying Migrations

### Option 1: Supabase Dashboard (Recommended for First Migration)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy contents of `migrations/001_enable_rls.sql`
5. Paste into the query editor
6. Click **Run** (or press `Ctrl+Enter`)
7. Wait for "Success. No rows returned" message

### Option 2: Supabase CLI (For Advanced Users)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

## Verification

After running the migration, verify it worked correctly:

### 1. Check RLS is Enabled

Run this query in SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'stores';
```

**Expected Result:** `rowsecurity = true`

### 2. Check Policies Exist

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'stores';
```

**Expected Result:** 5 policies:
- `users_view_own_stores` (SELECT)
- `users_insert_own_stores` (INSERT)
- `users_update_own_stores` (UPDATE)
- `users_delete_own_stores` (DELETE)
- `public_view_deployed_stores` (SELECT)

### 3. Check Indexes

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'stores';
```

**Expected Result:** 4 indexes on `user_id`, `slug`, `status`, `created_at`

## Testing RLS Policies

### Create Test User

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add User**
3. Create a test user with email/password

### Test Row Level Security

Run this with different authenticated users to verify isolation:

```sql
-- This should only return rows where user_id = authenticated user's ID
SELECT * FROM stores;

-- Try to insert a row for another user (should fail)
INSERT INTO stores (user_id, name, blueprint, status)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Unauthorized Store', '{}', 'draft');
-- Expected: ERROR - new row violates row-level security policy
```

## Schema Overview

### stores Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to `auth.users` |
| `name` | TEXT | Store display name |
| `slug` | TEXT | Unique URL slug (nullable) |
| `description` | TEXT | Store description (nullable) |
| `blueprint` | JSONB | Site configuration JSON |
| `status` | TEXT | `draft`, `pending_payment`, `paid`, `deploying`, `deployed`, `failed` |
| `deployment_url` | TEXT | Live site URL (nullable) |
| `deployed_at` | TIMESTAMPTZ | Deployment timestamp (nullable) |
| `paid_at` | TIMESTAMPTZ | Payment timestamp (nullable) |
| `payment_id` | TEXT | Payment provider ID (nullable) |
| `amount` | DECIMAL | Payment amount (nullable) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update (auto-updated) |

### RLS Policies

**User Policies** (Authenticated users):
- Can only SELECT their own stores
- Can only INSERT stores with their own `user_id`
- Can only UPDATE their own stores
- Can only DELETE their own stores

**Public Policy** (Unauthenticated access):
- Can SELECT stores where `status = 'deployed'` AND `slug IS NOT NULL`

## Troubleshooting

### Migration Fails with "relation already exists"

The migration is idempotent. If the table exists, it will only add missing policies/indexes.

### RLS Policies Not Working

1. Check if RLS is enabled: `ALTER TABLE stores ENABLE ROW LEVEL SECURITY;`
2. Verify policies exist with the verification queries above
3. Check authentication: Make sure you're logged in as a valid user

### Performance Issues

The migration includes optimized indexes on:
- `user_id` (most common filter)
- `slug` (public access by slug)
- `status` (filtering by deployment status)
- `created_at` (ordering by date)

If you experience slow queries, review the query execution plan:

```sql
EXPLAIN ANALYZE 
SELECT * FROM stores WHERE user_id = 'YOUR_USER_ID';
```

## Next Steps

After successfully applying this migration:

1. ✅ RLS is enabled and enforced
2. ✅ All policies are in place
3. ✅ Indexes are created for performance
4. ⏭️ Update `.env.local` with Supabase credentials
5. ⏭️ Test authentication flow in the application
6. ⏭️ Verify store creation/retrieval works

## Rollback

If you need to remove the schema:

```sql
DROP TABLE IF EXISTS stores CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

⚠️ **WARNING:** This will delete all data in the stores table!
