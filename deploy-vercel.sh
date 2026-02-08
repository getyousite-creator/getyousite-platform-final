#!/bin/bash
# QUICK DEPLOYMENT SCRIPT FOR VERCEL

echo "🚀 Starting deployment to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
echo "📝 Ensure you are logged in to Vercel..."
vercel login

# Deploy to production
echo ""
echo "📦 Building and deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site is now live!"
