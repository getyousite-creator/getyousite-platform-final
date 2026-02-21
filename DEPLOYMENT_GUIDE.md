# 🚀 دليل النشر الشامل - Complete Deployment Guide

**الإصدار**: 1.0  
**الحالة**: ✅ جاهز للإنتاج  
**الوقت المتوقع**: 15 دقيقة

---

## 📋 المتطلبات المسبقة

### 1. حسابات ضرورية

- ✅ [GitHub](https://github.com/signup)
- ✅ [Vercel](https://vercel.com/signup)
- ✅ [Supabase](https://supabase.com/signup) أو [Neon](https://neon.tech/signup)
- ✅ [Stripe](https://stripe.com/signup) (للمدفوعات)
- ✅ [Google Gemini](https://makersuite.google.com/app/apikey) (للذكاء الاصطناعي)

### 2. أدوات محلية

```bash
# تثبيت Node.js 20+
node --version  # v20.x.x

# تثبيت npm
npm --version  # 10.x.x

# تثبيت Vercel CLI
npm install -g vercel

# تثبيت Git
git --version  # 2.x.x
```

---

## 🔧 الخطوة 1: إعداد المتغيرات البيئية

### 1.1 إنشاء `.env.local`

```bash
# من الجذر
cp .env.example .env.local
```

### 1.2 ملء المتغيرات الأساسية

```bash
# .env.local

# DATABASE
DATABASE_URL="postgresql://xxx:xxx@xxx.supabase.co:5432/postgres"

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx"
SUPABASE_SERVICE_ROLE_KEY="eyJxxx"

# AUTH
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# AI
GEMINI_API_KEY="xxx"
OPENAI_API_KEY="xxx"

# PAYMENTS
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"

# VERCEL
VERCEL_TOKEN="xxx"
```

---

## 🗄️ الخطوة 2: إعداد قاعدة البيانات

### 2.1 إنشاء قاعدة بيانات على Supabase

```bash
# 1. اذهب إلى https://supabase.com
# 2. Create New Project
# 3. احصل على DATABASE_URL من Settings > Database
```

### 2.2 تشغيل Prisma Migrations

```bash
# تثبيت Prisma
npm install -D prisma
npx prisma init

# إنشاء migration
npx prisma migrate dev --name init

# توليد Prisma Client
npx prisma generate

# فتح Prisma Studio (اختياري)
npx prisma studio
```

---

## 🎨 الخطوة 3: الإعداد المحلي

### 3.1 تثبيت التبعيات

```bash
npm install
```

### 3.2 تشغيل التطوير

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

### 3.3 اختبار البناء

```bash
npm run build
npm run start
```

---

## 🚀 الخطوة 4: النشر على Vercel

### 4.1 ربط المشروع بـ GitHub

```bash
# تهيئة Git
git init
git add .
git commit -m "Initial commit - GetYouSite Platform v1.0"

# إنشاء مستودع GitHub
# اذهب إلى https://github.com/new
# أنشئ مستودع جديد

# ربط المستودع
git remote add origin https://github.com/YOUR_USERNAME/getyousite-platform.git
git branch -M main
git push -u origin main
```

### 4.2 النشر عبر Vercel CLI

```bash
# تسجيل الدخول
vercel login

# النشر الأولي
vercel --prod

# إضافة المتغيرات البيئية
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# ... أضف كل المتغيرات
```

### 4.3 النشر عبر Vercel Dashboard

```bash
# 1. اذهب إلى https://vercel.com/new
# 2. Import Git Repository
# 3. اختر مستودع getyousite-platform
# 4. أضف كل المتغيرات البيئية
# 5. Deploy
```

---

## ⚙️ الخطوة 5: إعداد Vercel Project

### 5.1 إعدادات البناء

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### 5.2 إعدادات البيئة

أضف في Vercel Dashboard > Settings > Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | من Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | من Supabase |
| `GEMINI_API_KEY` | من Google |
| `STRIPE_SECRET_KEY` | من Stripe |
| ... | ... |

---

## 🔄 الخطوة 6: سير عمل CI/CD

### 6.1 عند كل Push إلى main

```yaml
# .github/workflows/ci-cd.yaml

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 6.2 النشر التلقائي

```bash
# عند كل push إلى main
git push origin main

# Vercel ستنشر تلقائياً!
```

---

## 🌐 الخطوة 7: إعداد النطاق المخصص

### 7.1 إضافة النطاق في Vercel

```bash
# Vercel Dashboard > Project Settings > Domains
# أضف: getyousite.com
# أضف: www.getyousite.com
```

### 7.2 إعداد DNS

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 7.3 SSL تلقائي

✅ Vercel توفر SSL تلقائياً!

---

## 📊 الخطوة 8: المراقبة والتحليلات

### 8.1 Vercel Analytics

```bash
# Vercel Dashboard > Analytics
# Enable Web Analytics
# Enable Speed Insights
```

### 8.2 Sentry (Error Tracking)

```bash
npm install @sentry/nextjs

# .env.local
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

### 8.3 Logs

```bash
# عرض Logs
vercel logs

# Logs للإنتاج
vercel logs --prod

# Logs للتطوير
vercel logs --env development
```

---

## 🧪 الخطوة 9: اختبار ما بعد النشر

### 9.1 اختبارات أساسية

```bash
# اختبار الصفحة الرئيسية
curl https://getyousite.com

# اختبار API
curl https://getyousite.com/api/health

# اختبار AI
curl -X POST https://getyousite.com/api/ai/core \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

### 9.2 اختبارات E2E

```bash
npm run e2e:prod
```

### 9.3 اختبار السرعة

```bash
# Lighthouse
npm run lighthouse

# WebPageTest
# اذهب إلى https://www.webpagetest.org
```

---

## 🔐 الخطوة 10: الأمان

### 10.1 حماية API Routes

```typescript
// src/app/api/protected/route.ts
import { withAuth } from '@/lib/auth';

export const POST = withAuth(async (req) => {
  // Protected route
});
```

### 10.2 Rate Limiting

```typescript
// Middleware
import { RateLimiter } from '@/lib/rate-limiter';

export const config = {
  matcher: '/api/:path*',
};

export default RateLimiter.middleware;
```

### 10.3 Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
];
```

---

## 📈 الخطوة 11: التحسين

### 11.1 Image Optimization

```typescript
// next.config.ts
images: {
  domains: ['images.unsplash.com', 'cdn.supabase.co'],
  formats: ['image/avif', 'image/webp'],
},
```

### 11.2 Caching

```typescript
// Cache headers
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour
```

### 11.3 Edge Functions

```typescript
// Middleware على Edge
export const config = {
  matcher: '/api/:path*',
};

export default function middleware(req: NextRequest) {
  // Edge processing
}
```

---

## 🎯 Checklist النهائي

### قبل النشر

- [ ] `.env.local` مكتمل
- [ ] قاعدة البيانات جاهزة
- [ ] Migrations مشغلة
- [ ] اختبارات محلية ناجحة
- [ ] Build ناجح محلياً

### أثناء النشر

- [ ] Git push إلى main
- [ ] Vercel deploy تلقائي
- [ ] المتغيرات البيئية مضبوطة
- [ ] النطاق المخصص مربوط
- [ ] SSL مفعل

### بعد النشر

- [ ] اختبارات E2E ناجحة
- [ ] Lighthouse score >90
- [ ] Analytics تعمل
- [ ] Error tracking مفعل
- [ ] Logs تعمل

---

## 🆘 الدعم

### مشاكل شائعة

**1. Build فشل**
```bash
npm run build -- --debug
```

**2. متغيرات بيئة ناقصة**
```bash
vercel env ls
vercel env pull
```

**3. Database connection فشل**
```bash
# تحقق من DATABASE_URL
# تأكد من IP whitelist في Supabase
```

**4. API Routes لا تعمل**
```bash
# تحقق من CORS
# تحقق من Authentication
```

---

## 📞 روابط مفيدة

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Docs](https://prisma.io/docs)

---

**الحالة**: ✅ **جاهز للنشر**  
**الوقت**: 15 دقيقة  
**الصعوبة**: ⭐⭐⭐ (متوسط)

**🚀 انشر الآن!**
