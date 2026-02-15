# GetYouSite Production Runbook (Strict)

Updated: 2026-02-15

## Objective

Ship safely with zero ambiguity: no broken critical routes, no SEO domain leaks, and predictable API guard behavior.

## Mandatory Inputs

- `NEXT_PUBLIC_SITE_URL` (must be `https://getyousite.com` in production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Optional but recommended for full functionality:
    - `OPENAI_API_KEY`
    - `STRIPE_SECRET_KEY`
    - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
    - `PAYPAL_CLIENT_ID`
    - `PAYPAL_CLIENT_SECRET`

## Hard Gates (No Exceptions)

1. Build gate:
   `npm run build`

2. Route gate:
   `npm run audit:routes`

3. SEO gate:
   `npm run audit:seo`

4. Generate guard gate:
   `npm run audit:generate`

5. Combined preflight:
   `npm run preflight:prod`

If any gate fails, deployment is blocked.

## Route Expectations

For each locale `en/ar/fr/es`:

- Must be `200`: `/{locale}`, `/{locale}/pricing`, `/{locale}/services`, `/{locale}/templates`, `/{locale}/showcase`, `/{locale}/signup`, `/{locale}/login`
- Protected route expected:
    - `/{locale}/customizer` and `/{locale}/dashboard` should be `200` (authenticated) or redirect to login (anonymous)

## SEO Expectations

- `robots.txt` must include:
    - `Sitemap: https://getyousite.com/sitemap.xml`
- `sitemap.xml` must not contain:
    - `localhost`

## Deployment Procedure

1. Sync latest code to default branch.
2. Validate required production env vars.
3. Run:
    - `npm ci`
    - `npm run preflight:prod`
4. Deploy.
5. Immediately run post-deploy:
    - `npm run audit:routes`
    - `npm run audit:seo`
    - `npm run audit:generate`
6. If any fail:
    - rollback or hotfix
    - rerun the three audits until all pass

## Root-Cause Shortlist for 404 on Localized Pages

- Routes exist locally but were not deployed (old build/live drift).
- Pages are not tracked/merged in branch used for deployment.
- Middleware/rewrite mismatch between environments.
- Platform caches stale output after route additions.

## Required Evidence for “Production Healthy” Status

- Screenshot or log for:
    - `npm run audit:routes` with `Fail: 0`
    - `npm run audit:seo` with no fail lines
    - `npm run audit:generate` pass
- Deployment URL and commit SHA
- Date/time in UTC
