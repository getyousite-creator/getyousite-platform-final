# Deployment Command Checklist (Copy/Paste)

Use this exactly before production deployment.

## 1) Confirm critical files are tracked

```powershell
git status --short
```

You must not deploy if these are untracked:

- `src/app/[locale]/pricing/page.tsx`
- `src/app/[locale]/services/page.tsx`
- `src/app/[locale]/templates/page.tsx`
- `middleware.ts`
- `scripts/audit-production-routes.ts`
- `scripts/audit-production-seo.ts`
- `scripts/audit-production-generate.ts`

## 2) Stage required route/guardrail files

```powershell
git add src/app/[locale]/pricing/page.tsx src/app/[locale]/services/page.tsx src/app/[locale]/templates/page.tsx
git add middleware.ts src/app/robots.ts src/app/[locale]/dashboard/page.tsx src/app/[locale]/api/generate/route.ts
git add scripts/audit-production-routes.ts scripts/audit-production-seo.ts scripts/audit-production-generate.ts scripts/preflight-production.ts
git add .github/workflows/ci-cd.yml .github/workflows/post-deploy-verification.yml
git add package.json docs/PRODUCTION_RUNBOOK.md docs/STRICT_SOP_GETYOUSITE.md
```

## 3) Preflight (must pass)

```powershell
npm ci
npm run build
npm run audit:routes
npm run audit:seo
npm run audit:generate
```

If any command fails, stop and fix before deploy.

## 4) Commit and push

```powershell
git commit -m "fix: production route parity, seo guards, and deployment quality gates"
git push origin main
```

## 5) Post-deploy verification (must pass)

```powershell
npm run audit:routes
npm run audit:seo
npm run audit:generate
```

## 6) Pass criteria

- `audit:routes` => `Fail: 0`
- `audit:seo` => no fail lines
- `audit:generate` => pass

If not, rollback or hotfix immediately.
