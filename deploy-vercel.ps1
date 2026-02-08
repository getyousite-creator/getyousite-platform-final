# WINDOWS DEPLOYMENT SCRIPT FOR VERCEL
# Run this from PowerShell as Administrator

Write-Host "🚀 Starting deployment to Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if logged in
Write-Host "📝 Checking Vercel login..." -ForegroundColor Yellow
vercel whoami

# Confirm before deployment
$confirm = Read-Host "Ready to deploy to production? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 1
}

# Build locally first
Write-Host ""
Write-Host "🔨 Building application locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to production
Write-Host ""
Write-Host "📤 Deploying to Vercel production..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Your site is now live!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    exit 1
}
