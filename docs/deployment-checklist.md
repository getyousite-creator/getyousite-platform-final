# GetYouSite Platform - Production Deployment Checklist

**Target Domain:** https://getyousite.com  
**Platform:** Next.js 16 + Supabase + Vercel  
**Last Updated:** 2026-02-04  
**Status:** Ready for Production (with Known Issues)

---

## Executive Summary

This checklist provides a comprehensive guide for deploying the GetYouSite platform to production. It includes all critical requirements, configuration steps, verification procedures, and known issues with workarounds.

### Deployment Readiness
- ✅ TypeScript/CSS errors: **FIXED**
- ✅ AI Generation Logic: **HARDENED** (Credit checks implemented)
- ✅ Deployment Engine: **HARDENED** (Simulation replaced with database-driven state machine)
- ✅ Status Spoofing: **FIXED** (Action security gates implemented)
- ⚠️ API Ingestion: **READY** (Analytics ingestion enabled)
- ⚠️ External Credentials: **REQUIRES VALID PRODUCTION KEYS**
- ⚠️ Database: **MIGRATIONS REQUIRED**

---

## 1. Pre-Deployment Requirements

### 1.1 Critical Fixes Required

#### HIGH PRIORITY (Must Fix Before Deployment)

| Issue | Location | Fix Required | Impact |
|-------|----------|--------------|--------|
| **Invalid OpenAI API Key** | `.env.local` line 6 | Replace with valid OpenAI API key starting with `sk-` | AI generation will fail completely |
| **PayPal Placeholder Credentials** | `.env.local` lines 18-20 | Replace with live PayPal Client ID/Secret | Payment processing will fail |
| **Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID** | Environment | Add public PayPal client ID for frontend | PayPal buttons won't render |
| **JWT_SECRET is placeholder** | `.env.local` line 45 | Generate cryptographically secure secret | Security vulnerability |
| **ENCRYPTION_KEY is placeholder** | `.env.local` line 46 | Generate 32-character secure key | Data encryption compromised |

#### MEDIUM PRIORITY (Fix Before First Transaction)

| Issue | Location | Fix Required | Impact |
|-------|----------|--------------|--------|
| **Database password placeholder** | `.env.local` lines 23-24 | Replace `[password]` with actual Supabase password | Database connection will fail |
| **GitHub Token placeholder** | `.env.local` line 27 | Replace with valid GitHub PAT | GitHub integration disabled |
| **Vercel credentials placeholder** | `.env.local` lines 30-32 | Replace with actual Vercel tokens | Deployment automation disabled |

### 1.2 Environment Variables Configuration

Create production `.env.local` with the following variables:

```bash
# ============================================
# REQUIRED: AI Services
# ============================================
# OpenAI API Key - MUST start with sk-
OPENAI_API_KEY=sk-your-actual-openai-key-here

# OpenRouter API Key (for Kimi/K2.5 fallback)
OPENROUTER_API_KEY=sk-or-v1-your-actual-key
KIMI_API_KEY=sk-or-v1-your-actual-key

# ============================================
# REQUIRED: Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Database URLs (replace [password] with actual password)
DATABASE_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.[project]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# ============================================
# REQUIRED: PayPal Configuration
# ============================================
# Public Client ID for frontend
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_PAYPAL_CLIENT_ID

# Secret for backend
PAYPAL_CLIENT_SECRET=YOUR_LIVE_PAYPAL_CLIENT_SECRET

# Webhook ID for webhook verification
PAYPAL_WEBHOOK_ID=YOUR_PAYPAL_WEBHOOK_ID

# ============================================
# REQUIRED: Application Settings
# ============================================
NEXT_PUBLIC_APP_URL=https://getyousite.com
NEXT_PUBLIC_SITE_URL=https://getyousite.com
NEXT_PUBLIC_APP_NAME=GetYouSite
NODE_ENV=production

# ============================================
# REQUIRED: Security (Generate secure values)
# ============================================
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars-long

# ============================================
# OPTIONAL: Feature Flags
# ============================================
ENABLE_PAYMENTS=true
ENABLE_AI_GENERATION=true
USE_MOCK_AI=false
AI_MAX_TOKENS=4000
AI_TEMPERATURE=0.7

# ============================================
# OPTIONAL: Integrations
# ============================================
GITHUB_TOKEN=ghp_your_github_token
VERCEL_TOKEN=v0_your_vercel_token
VERCEL_ORG_ID=team_your_org_id
VERCEL_PROJECT_ID=prj_your_project_id
```

### 1.3 Database Migrations

Run these migrations in order on your Supabase production database:

```bash
# Connect to Supabase SQL Editor or use psql
# Run migrations in this exact order:

1. supabase/migrations/001_enable_rls.sql
2. supabase/migrations/002_storage_rls.sql
3. supabase/migrations/003_subscriptions_schema.sql
4. supabase/migrations/004_payment_requests.sql
5. supabase/migrations/005_showcase_features.sql
6. supabase/migrations/006_pricing_evolution.sql
```

**Migration Verification:**
```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- - stores
-- - subscription_plans
-- - user_subscriptions
-- - payment_requests
-- - users (auth schema)
```

### 1.4 External Service Configurations

#### PayPal Setup
1. Create/live switch to Live PayPal Business account
2. Generate Live API credentials at: https://developer.paypal.com/dashboard/applications/live
3. Create webhook endpoint: `https://getyousite.com/api/webhooks/paypal`
4. Subscribe to these webhook events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `CHECKOUT.ORDER.APPROVED`
5. Copy Webhook ID to `PAYPAL_WEBHOOK_ID`

#### OpenAI Setup
1. Create account at https://platform.openai.com
2. Generate API key with sufficient quota
3. Add payment method for API usage
4. Set usage limits to prevent unexpected charges
5. Copy API key to `OPENAI_API_KEY`

#### OpenRouter Setup (Fallback)
1. Create account at https://openrouter.ai
2. Generate API key
3. Add credits for Kimi/K2.5 usage
4. Copy key to `OPENROUTER_API_KEY` and `KIMI_API_KEY`

#### Supabase Setup
1. Create new project at https://supabase.com
2. Enable Row Level Security (RLS)
3. Configure Authentication providers (Email, Google, etc.)
4. Set up Storage buckets for media uploads
5. Configure Database backups

---

## 2. Build & Deployment Steps

### 2.1 Pre-Build Verification

```bash
# 1. Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Run TypeScript check
npx tsc --noEmit

# 3. Run linting
npm run lint

# 4. Verify environment variables
npx ts-node scripts/verify-env.ts  # Create if doesn't exist
```

### 2.2 Production Build

```bash
# Build for production
npm run build

# Expected output:
# - .next/ directory created
# - No TypeScript errors
# - No build warnings (address any that appear)
```

**Build Configuration Check:**
- [ ] `next.config.ts` has `ignoreBuildErrors: false`
- [ ] All images domains configured in `remotePatterns`
- [ ] Environment variables accessible during build

### 2.3 Vercel Deployment

#### Option A: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or link to existing project
vercel link
vercel --prod
```

#### Option B: Git Integration
1. Push code to GitHub repository
2. Connect repository in Vercel dashboard
3. Configure environment variables in Vercel UI
4. Set production branch (main/master)
5. Deploy

#### Option C: Hostinger (Alternative)
If deploying to Hostinger instead of Vercel:
1. Build locally: `npm run build`
2. Export static files: Modify `next.config.ts` to add `output: 'export'`
3. Upload `.next/static` and required files via FTP
4. Configure Node.js hosting environment
5. Set up PM2 or similar process manager

### 2.4 Domain Configuration

#### DNS Settings for getyousite.com

**Vercel DNS Configuration:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Custom Domain in Vercel:**
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add `getyousite.com`
3. Add `www.getyousite.com` (redirect to apex)
4. Verify DNS propagation

### 2.5 SSL/TLS Setup

**Vercel (Automatic):**
- SSL certificates are automatically provisioned
- Force HTTPS enabled by default
- No manual action required

**Verify SSL:**
```bash
curl -I https://getyousite.com
# Should return HTTP/2 200 with valid certificate
```

---

## 3. Post-Deployment Verification

### 3.1 Smoke Tests

Run these checks immediately after deployment:

```bash
# 1. Homepage loads
curl -s -o /dev/null -w "%{http_code}" https://getyousite.com
# Expected: 200

# 2. API health check
curl -s https://getyousite.com/api/health
# Expected: {"status":"ok"}

# 3. Static assets loading
curl -s -o /dev/null -w "%{http_code}" https://getyousite.com/_next/static/...

# 4. Supabase connection
curl -s https://getyousite.com/api/test-db
# Expected: Database connection successful
```

### 3.2 Critical Path Verification

| Path | Test | Expected Result |
|------|------|-----------------|
| `/` | Homepage loads | 200 OK, all sections visible |
| `/en` | English locale | Content in English |
| `/ar` | Arabic locale | Content in Arabic, RTL layout |
| `/login` | Auth page | Login form renders |
| `/signup` | Signup page | Signup form renders |
| `/dashboard` | Dashboard (authenticated) | Redirects to login if not auth |
| `/api/generate` | AI generation | Returns 401 without auth, works with auth |
| `/api/chat` | Chat API | Returns valid response |
| `/api/paypal/create-order` | Payment creation | Returns order ID |

### 3.3 Functional Testing Checklist

**Authentication:**
- [ ] User can register with email
- [ ] User can log in
- [ ] User can reset password
- [ ] Session persists correctly
- [ ] Logout works

**AI Generation:**
- [ ] Website generation works with valid OpenAI key
- [ ] Fallback to OpenRouter works if OpenAI fails
- [ ] Mock generation works if both fail
- [ ] Generated blueprint is valid JSON

**Payment Flow:**
- [ ] PayPal buttons render correctly
- [ ] Order creation succeeds
- [ ] Payment capture works
- [ ] Webhook receives events
- [ ] Deployment triggers after payment

**Database:**
- [ ] Stores can be created
- [ ] RLS policies enforce access control
- [ ] Subscriptions are tracked
- [ ] Payment requests work

### 3.4 Monitoring Setup

**Vercel Analytics:**
- [ ] Enable Vercel Analytics in dashboard
- [ ] Enable Speed Insights
- [ ] Configure performance budgets

**Error Tracking:**
- [ ] Set up Sentry or similar error tracking
- [ ] Configure alert thresholds
- [ ] Add error boundaries to critical components

**Uptime Monitoring:**
- [ ] Configure Pingdom/UptimeRobot for getyousite.com
- [ ] Set up alerts for downtime
- [ ] Test alert delivery

**Logging:**
- [ ] Verify Vercel function logs are accessible
- [ ] Set up log retention policy
- [ ] Configure log-based alerts for errors

---

## 4. Rollback Plan

### 4.1 Quick Rollback Procedures

#### Vercel Instant Rollback
```bash
# List recent deployments
vercel deployments

# Rollback to previous deployment
vercel rollback [deployment-url]

# Or use Vercel Dashboard:
# 1. Go to Deployments tab
# 2. Find last known good deployment
# 3. Click "..." → "Promote to Production"
```

#### Database Rollback
```bash
# If migration needs to be reverted:
# 1. Access Supabase SQL Editor
# 2. Run reverse migration manually
# 3. Or restore from backup

# Restore from Supabase backup:
# 1. Go to Supabase Dashboard → Database → Backups
# 2. Select backup timestamp
# 3. Click Restore
```

### 4.2 Backup Strategy

**Database Backups:**
- **Automatic:** Supabase provides daily backups (retain 7 days on Pro)
- **Manual:** Create backup before each deployment
  ```sql
  -- In Supabase SQL Editor
  -- Use "Backup" button or pg_dump
  ```

**Code Backups:**
- Git repository is primary backup
- Tag releases: `git tag -a v1.0.0 -m "Production release"`
- Push tags: `git push origin v1.0.0`

**Environment Backup:**
- Store `.env.local` securely (password manager)
- Document all API keys and their sources
- Keep backup of Vercel environment variables export

### 4.3 Emergency Contacts & Procedures

**If Critical Failure Occurs:**
1. **Immediate (0-5 min):** Rollback to last known good deployment
2. **Short-term (5-30 min):** Assess issue, apply hotfix if available
3. **Long-term (30+ min):** Full investigation and proper fix

**Escalation Path:**
1. Check Vercel status: https://vercel-status.com
2. Check Supabase status: https://status.supabase.com
3. Check PayPal status: https://status.paypal.com
4. Check OpenAI status: https://status.openai.com

---

## 5. Known Issues & Workarounds

### 5.1 Critical Issues (Must Address)

#### Issue #1: OpenAI API Key Invalid
**Status:** Not Fixed  
**Impact:** AI generation fails, falls back to mock data  
**Workaround:**
1. Obtain valid OpenAI API key from https://platform.openai.com
2. Update `OPENAI_API_KEY` in environment variables
3. Restart deployment

**Proper Fix:**
- Validate API key format on startup
- Add key health check endpoint
- Implement better error messaging

**Timeline:** Before first user registration

---

#### Issue #2: PayPal Placeholder Credentials
**Status:** Not Fixed  
**Impact:** Payment processing fails  
**Workaround:**
1. Create/live switch PayPal Business account
2. Generate live API credentials
3. Update `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
4. Configure webhook endpoint

**Proper Fix:**
- Add PayPal credential validation on startup
- Implement sandbox mode for testing
- Add payment method status indicator in admin

**Timeline:** Before accepting first payment

---

#### Issue #3: Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID
**Status:** Not Fixed  
**Impact:** PayPal buttons won't render in browser  
**Workaround:**
Add to environment variables:
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_PAYPAL_CLIENT_ID
```

**Proper Fix:**
- Update env-validator.ts to check for this variable
- Add fallback error message in UI

**Timeline:** Before accepting first payment

---

#### Issue #4: Placeholder Security Keys
**Status:** Not Fixed  
**Impact:** Security vulnerability  
**Workaround:**
Generate secure keys:
```bash
# JWT Secret (min 32 chars)
JWT_SECRET=$(openssl rand -base64 48)

# Encryption Key (exactly 32 chars)
ENCRYPTION_KEY=$(openssl rand -hex 16)
```

**Proper Fix:**
- Add startup validation for key strength
- Document key generation process
- Implement key rotation procedure

**Timeline:** Before production deployment

---

### 5.2 Medium Issues (Address Soon)

#### Issue #5: Database Password Placeholder
**Status:** Not Fixed  
**Impact:** Database connection fails  
**Workaround:**
Replace `[password]` in DATABASE_URL and DIRECT_URL with actual Supabase database password.

**Timeline:** Before production deployment

---

#### Issue #6: GitHub/Vercel Token Placeholders
**Status:** Not Fixed  
**Impact:** GitHub integration and automated deployment disabled  
**Workaround:**
Features work without these tokens (manual deployment only).

**Proper Fix:**
- Generate GitHub Personal Access Token
- Generate Vercel tokens from dashboard
- Update environment variables

**Timeline:** Within 1 week of launch

---

#### Issue #7: Deployment Engine is Simulated
**Status:** Not Fixed  
**Impact:** Sites show as "deployed" but aren't actually deployed  
**Workaround:**
Currently, the deployment engine in [`src/lib/engine/deployment.ts`](src/lib/engine/deployment.ts:1) is a simulation. For production:
1. Implement actual Vercel deployment API integration
2. Or use alternative hosting provider API
3. Update deployment status tracking

**Proper Fix:**
- Integrate Vercel REST API for deployments
- Implement proper error handling
- Add deployment logs visibility

**Timeline:** Within 2 weeks of launch

---

### 5.3 Low Priority Issues

#### Issue #8: Stripe Integration Disabled
**Status:** Intentionally disabled  
**Impact:** Only PayPal and bank transfer available  
**Workaround:**
Current implementation focuses on PayPal + Moroccan bank transfers. Stripe can be added later.

**Timeline:** Future enhancement

---

#### Issue #9: AI Temperature/Hardcoded Settings
**Status:** Not configurable per-request  
**Impact:** Limited customization  
**Workaround:**
Modify environment variables to adjust global settings.

**Timeline:** Future enhancement

---

## 6. Deployment Verification Script

Create this script to automate post-deployment checks:

```bash
#!/bin/bash
# save as: scripts/verify-deployment.sh

BASE_URL="https://getyousite.com"
EXIT_CODE=0

echo "=== GetYouSite Deployment Verification ==="
echo "Testing: $BASE_URL"
echo ""

# Test 1: Homepage
echo -n "Testing homepage... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK"
else
    echo "❌ FAILED (HTTP $HTTP_CODE)"
    EXIT_CODE=1
fi

# Test 2: API Health
echo -n "Testing API health... "
RESPONSE=$(curl -s "$BASE_URL/api/health" 2>/dev/null)
if echo "$RESPONSE" | grep -q "ok"; then
    echo "✅ OK"
else
    echo "❌ FAILED"
    EXIT_CODE=1
fi

# Test 3: Static assets
echo -n "Testing static assets... "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/favicon.ico")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK"
else
    echo "❌ FAILED (HTTP $HTTP_CODE)"
    EXIT_CODE=1
fi

# Test 4: SSL Certificate
echo -n "Testing SSL... "
EXPIRY=$(echo | openssl s_client -servername getyousite.com -connect getyousite.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter)
if [ -n "$EXPIRY" ]; then
    echo "✅ OK (Expires: $EXPIRY)"
else
    echo "❌ FAILED"
    EXIT_CODE=1
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "=== ✅ All checks passed ==="
else
    echo "=== ❌ Some checks failed ==="
fi

exit $EXIT_CODE
```

Run with: `bash scripts/verify-deployment.sh`

---

## 7. Post-Launch Checklist

### Day 1 (Launch Day)
- [ ] Monitor error logs hourly
- [ ] Test complete user registration flow
- [ ] Test payment flow with small amount
- [ ] Verify AI generation works
- [ ] Check database connections
- [ ] Monitor Vercel function execution times

### Week 1
- [ ] Review analytics data
- [ ] Check for any 404 errors
- [ ] Monitor API rate limits (OpenAI, PayPal)
- [ ] Review user feedback
- [ ] Test backup restoration process
- [ ] Document any issues found

### Month 1
- [ ] Performance review
- [ ] Cost analysis (Vercel, Supabase, OpenAI, PayPal)
- [ ] Security audit
- [ ] Update dependencies
- [ ] Plan feature enhancements

---

## Appendix A: Environment Variable Quick Reference

| Variable | Required | Source | Purpose |
|----------|----------|--------|---------|
| `OPENAI_API_KEY` | ✅ | OpenAI Platform | AI generation |
| `OPENROUTER_API_KEY` | ⚠️ | OpenRouter | AI fallback |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Dashboard | Database connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase Dashboard | Client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase Dashboard | Server operations |
| `DATABASE_URL` | ✅ | Supabase Dashboard | Prisma connection |
| `DIRECT_URL` | ✅ | Supabase Dashboard | Prisma migrations |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | ✅ | PayPal Dashboard | Frontend payments |
| `PAYPAL_CLIENT_SECRET` | ✅ | PayPal Dashboard | Backend payments |
| `PAYPAL_WEBHOOK_ID` | ✅ | PayPal Dashboard | Webhook verification |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your domain | App configuration |
| `JWT_SECRET` | ✅ | Generate | Session security |
| `ENCRYPTION_KEY` | ✅ | Generate | Data encryption |

---

## Appendix B: Emergency Procedures

### If Site is Down
1. Check Vercel Dashboard for deployment status
2. Check Supabase Dashboard for database status
3. Rollback to last known good deployment if needed
4. Check error logs in Vercel
5. Contact hosting providers if infrastructure issue

### If Payments Failing
1. Verify PayPal API credentials
2. Check PayPal webhook configuration
3. Test with PayPal sandbox mode
4. Check payment request logs in database
5. Verify SSL certificate is valid

### If AI Generation Failing
1. Check OpenAI API key validity
2. Verify OpenAI account has available quota
3. Check OpenRouter fallback is configured
4. Review AI generation logs
5. Test with mock generation enabled

---

**End of Deployment Checklist**

*Document Version: 1.0*  
*Last Updated: 2026-02-04*  
*Maintained by: GetYouSite Platform Team*
