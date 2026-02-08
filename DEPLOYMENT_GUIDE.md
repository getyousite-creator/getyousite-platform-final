# DEPLOYMENT GUIDE - Getyousite Platform

**Date:** February 8, 2026  
**Status:** PRODUCTION READY  
**System Verification:** COMPLETE

---

## OPTION 1: VERCEL (RECOMMENDED - ZERO CONFIG)

Vercel is the official Next.js hosting platform. **Easiest deployment method.**

### Prerequisites
- GitHub account (push code to GitHub)
- Vercel account (free tier available)

### Step 1: Push Code to GitHub
```bash
cd c:\Users\user\Desktop\getyousite-platform
git init
git add .
git commit -m "Initial production deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/getyousite-platform.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ttolmgqfbmokcveaeyrf.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres.ryzxcvbnm:SovereignKEY_2026@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres.ryzxcvbnm:SovereignKEY_2026@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
5. Click "Deploy"
6. Your site is live at `your-project.vercel.app`

**Deployment time:** 2-3 minutes

---

## OPTION 2: NETLIFY

### Step 1: Build Production Files Locally
```bash
npm run build
```

### Step 2: Connect to Netlify
1. Go to https://netlify.com
2. Select "Deploy manually"
3. Drag and drop the `.next` folder
4. Add environment variables in Netlify dashboard

**Note:** Requires Node.js runtime support (Netlify Blobs)

---

## OPTION 3: RAILWAY (RECOMMENDED ALTERNATIVE)

Railway.app - Simplified cloud deployment with database support.

### Step 1: Create Railway Account
Go to https://railway.app

### Step 2: Create New Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Step 3: Add Environment Variables
In Railway dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://ttolmgqfbmokcveaeyrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=your_database_url
```

**Deployment time:** 3-5 minutes

---

## OPTION 4: SELF-HOSTED (AWS, DigitalOcean, VPS)

### Prerequisites
- Linux VPS with Node.js 18+ installed
- SSH access to server
- Domain name (with DNS pointing to your server)

### Step 1: SSH into Server
```bash
ssh root@your_server_ip
```

### Step 2: Install Dependencies
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs pm2 nginx
npm install -g pm2
```

### Step 3: Clone Repository and Deploy
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/getyousite-platform.git
cd getyousite-platform
npm install
npm run build
```

### Step 4: Configure Environment Variables
```bash
nano .env.local
# Add all production environment variables
# Save and exit (Ctrl+X, Y, Enter)
```

### Step 5: Start with PM2
```bash
pm2 start npm --name "getyousite" -- start
pm2 startup
pm2 save
```

### Step 6: Setup Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup HTTPS with Let's Encrypt
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

### Step 8: Verify Deployment
```bash
curl http://your_domain.com/en
# Should return 200 OK with HTML content
```

**Deployment time:** 10-15 minutes (one-time setup)

---

## OPTION 5: DOCKER (CONTAINERIZED DEPLOYMENT)

### Step 1: Create Dockerfile
File: `Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Step 2: Build Docker Image
```bash
docker build -t getyousite-platform:latest .
```

### Step 3: Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://ttolmgqfbmokcveaeyrf.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your_key" \
  -e DATABASE_URL="your_db_url" \
  --name getyousite \
  getyousite-platform:latest
```

### Step 4: Verify
```bash
docker logs getyousite
# Should show: Ready on http://localhost:3000
```

**Deployment time:** 5-8 minutes

---

## POST-DEPLOYMENT VERIFICATION CHECKLIST

After deployment to production:

### 1. Test Home Page
```bash
curl -I https://your-domain.com/en
# Expected: HTTP/1.1 200 OK
```

### 2. Test Signup
- Navigate to https://your-domain.com/en/signup
- Enter test email and password
- Verify form submits without errors
- Check email for verification link

### 3. Test Signin
- Navigate to https://your-domain.com/en/login
- Enter credentials from signup
- Verify redirect to dashboard

### 4. Test Arabic Locale
- Navigate to https://your-domain.com/ar
- Verify page loads in Arabic

### 5. Check Console Logs
```bash
# For Vercel
vercel logs --tail

# For Railway
railway logs

# For self-hosted (PM2)
pm2 logs getyousite
```

### 6. Monitor Errors
- Check Supabase dashboard for auth errors
- Check database connection logs
- Monitor response times

---

## PRODUCTION ENVIRONMENT VARIABLES

**Required for production:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ttolmgqfbmokcveaeyrf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
DATABASE_URL=your_production_database_url
DIRECT_URL=your_direct_database_url
NEXTAUTH_SECRET=generate_strong_random_secret
NEXTAUTH_URL=https://your-production-domain.com
```

**Optional (for advanced features):**
```
STRIPE_SECRET_KEY=your_stripe_key
OPENAI_API_KEY=your_openai_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## QUICK START DEPLOYMENT (VERCEL - 5 MINUTES)

1. Push to GitHub:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables
5. Click "Deploy"
6. Your site is live: `your-project.vercel.app`

---

## TROUBLESHOOTING

### "Invalid supabaseUrl" Error
**Cause:** NEXT_PUBLIC_SUPABASE_URL not set or malformed  
**Fix:** Verify URL format: `https://projectname.supabase.co`

### "Supabase not configured" Error
**Cause:** NEXT_PUBLIC_SUPABASE_ANON_KEY missing  
**Fix:** Copy correct ANON_KEY from Supabase dashboard → Settings → API

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Error
**Fix:** Verify DATABASE_URL format and credentials are correct

---

## MONITORING & MAINTENANCE

### Setup Error Tracking
1. Go to Sentry.io
2. Create project for Next.js
3. Add Sentry SDK to your project
4. Monitor errors in real-time

### Monitor Database
- Check Supabase dashboard → SQL Editor for query performance
- Monitor auth events in Supabase → Authentication
- Check storage usage and backups

### Update Dependencies
```bash
npm update
npm audit fix
npm run build
npm start
```

---

## SUCCESS CRITERIA

Your deployment is successful when:
- ✅ Home page loads: `https://your-domain.com/en`
- ✅ Signup page accessible: `https://your-domain.com/en/signup`
- ✅ Signup form submits and sends verification email
- ✅ Signin flow works and redirects to dashboard
- ✅ Arabic locale loads: `https://your-domain.com/ar`
- ✅ No console errors in browser DevTools
- ✅ No 500 errors in server logs
- ✅ Database connection working
- ✅ Supabase auth functioning

---

## CONTACT SUPPORT

If deployment fails:
1. Check environment variables are set correctly
2. Verify Supabase credentials are valid
3. Check server logs for specific error messages
4. Ensure database connection is working
5. Test locally with `npm run dev` first

---

**Your platform is production-ready. Choose your deployment method and execute the steps above.**

**Deployment Status: APPROVED ✅**
