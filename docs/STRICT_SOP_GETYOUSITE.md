# GetYouSite Strict SOP (Execution-Grade)

Last update: 2026-02-15
Scope: Product reliability, conversion flow, localization, deployment integrity, SEO integrity.

## 1) Truth Baseline

- Build status: PASS (`npm run build`)
- Lint status: FAIL (`216 errors`, `293 warnings`)
- Live probe: domain reachable (`https://getyousite.com` -> `200`)
- Critical live routing mismatch observed:
  - `https://getyousite.com/en/pricing` -> `404`
  - `https://getyousite.com/en/templates` -> `404`
  - `https://getyousite.com/en/services` -> `404`
- SEO/live config mismatch observed:
  - `sitemap.xml` was serving `localhost` URLs (environment issue)
  - `robots.txt` had wrong sitemap domain (code issue, fixed in code)

## 2) Non-Negotiable Gates

### Gate A: Runtime Integrity

Pass criteria:
- `npm run build` passes in CI and local.
- No auth flow runtime errors in server actions.

Command set:
- `npm run build`

### Gate B: Live Route Integrity

Pass criteria:
- All primary locale routes return 200 or valid auth redirect.
- No 404 on menu-critical pages.

Required pages:
- `/{locale}`
- `/{locale}/pricing`
- `/{locale}/services`
- `/{locale}/templates`
- `/{locale}/showcase`
- `/{locale}/signup`
- `/{locale}/login`
- `/{locale}/customizer`

Validation:
- Probe script with status + redirect checks.
- Fail deployment if any critical route returns 404.

### Gate C: Conversion Flow Integrity

Pass criteria:
- Anonymous user:
  - can open landing -> signup/login -> customizer pages.
  - protected pages redirect to locale login.
- Authenticated user:
  - can generate blueprint.
  - can reach dashboard.
  - payment path creates or captures orders without server exceptions.

Validation:
- E2E smoke (Playwright/Cypress) with one user journey per locale.

### Gate D: Localization Integrity

Pass criteria:
- No mojibake in rendered strings.
- EN keys are source-of-truth; AR/FR/ES are 1:1 key-complete.
- Locale redirects preserve locale path.

Validation:
- Key parity script.
- Runtime snapshot tests for EN/AR/FR/ES auth + nav.

### Gate E: SEO Integrity

Pass criteria:
- `robots.txt` points to canonical production sitemap.
- `sitemap.xml` contains production absolute URLs (not localhost).
- Canonical and alternates are correct for all locales.

Validation:
- HTTP probe in CI on preview/prod.

## 3) Priority Fix Backlog (Ordered)

P0 (ship blockers):
1. Fix production deployment mismatch causing 404 for `/en/pricing`, `/en/templates`, `/en/services`.
2. Ensure production `NEXT_PUBLIC_SITE_URL=https://getyousite.com` (avoid localhost in sitemap).
3. Confirm auth redirect locale correctness in production (`/en/dashboard` should redirect to `/en/login` for anonymous).

P1 (quality blockers):
1. Reduce lint errors from 216 -> <30 in first pass (focus on `no-explicit-any` hotspots in runtime paths).
2. Remove `window.location.href` hard redirects in locale-sensitive UI.
3. Normalize translation policy keys and copy safety.

P2 (scale readiness):
1. Add CI quality pipeline (build + route probe + i18n parity + e2e smoke).
2. Add route health dashboard + alerting for 404 spikes.
3. Add conversion funnel metrics by locale and page.

## 4) CI Protocol (Mandatory)

Run in order:
1. `npm ci`
2. `npm run build`
3. `npm run lint`
4. Run route probe against preview URL
5. Run E2E smoke for one locale (expand to all locales)

Fail-fast rules:
- Any build error -> block merge
- Any critical route 404 -> block deploy
- Any SEO canonical/sitemap mismatch -> block deploy

## 5) Assistant Prompts (Ready-to-Use)

### Prompt A: Production Route Auditor

"Audit all public routes on production and preview (all locales). Return a table of status code, redirect target, TTFB, and route category. Mark any 404 on critical routes as P0 and generate exact remediation patches."

### Prompt B: Localization Hardening

"Use `messages/en.json` as source of truth. Generate a parity report for AR/FR/ES (missing, extra, corrupted keys). Auto-fix encoding corruption and produce a deterministic key-sync patch."

### Prompt C: Conversion Flow E2E

"Implement E2E smoke for anonymous and authenticated journeys: landing -> signup/login -> customizer -> generate -> dashboard. Include locale-preservation assertions and payment failure-safe assertions."

### Prompt D: Lint Debt Burn-Down

"Prioritize lint error reduction in runtime-critical code paths first (`app routes`, `actions`, `auth`, `payment`, `customizer`). Eliminate `no-explicit-any` in critical files with proper interfaces/types."

### Prompt E: SEO Correctness

"Validate and fix `robots`, `sitemap`, canonical, and hreflang outputs to always use production domain from environment. Add test coverage to prevent localhost leakage."

## 6) KPI Targets (30 Days)

- Critical route availability: 99.95%
- Build success in CI: 100%
- Lint errors: 216 -> <20
- Auth funnel drop-off (landing -> signup completion): improve by +20%
- Generate success rate (authenticated): >98%
- API error rate (`/api/generate`): <2% (excluding auth-required responses)

