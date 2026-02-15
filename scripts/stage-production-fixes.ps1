$ErrorActionPreference = "Stop"

$paths = @(
    "src/app/[locale]/pricing/page.tsx",
    "src/app/[locale]/services/page.tsx",
    "src/app/[locale]/templates/page.tsx",
    "middleware.ts",
    "src/app/robots.ts",
    "src/app/[locale]/dashboard/page.tsx",
    "src/app/[locale]/api/generate/route.ts",
    "scripts/audit-production-routes.ts",
    "scripts/audit-production-seo.ts",
    "scripts/audit-production-generate.ts",
    "scripts/preflight-production.ts",
    ".github/workflows/ci-cd.yml",
    ".github/workflows/post-deploy-verification.yml",
    "package.json",
    "docs/PRODUCTION_RUNBOOK.md",
    "docs/STRICT_SOP_GETYOUSITE.md",
    "docs/DEPLOYMENT_COMMAND_CHECKLIST.md"
)

Write-Host "Staging production-critical files..."
foreach ($path in $paths) {
    if (Test-Path -LiteralPath $path) {
        git add -- $path
        Write-Host "  + $path"
    } else {
        Write-Warning "Missing path, skipped: $path"
    }
}

Write-Host "`nCurrent status:"
git status --short
