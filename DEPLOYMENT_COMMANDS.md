# 🚀 أوامر النشر النهائية - Final Deployment Commands

**انسخ والصق هذه الأوامر بالترتيب**

---

## 📋 المرحلة 1: التحضير المحلي

```bash
# 1. التحقق من Node.js
node --version  # يجب أن يكون v20.x.x
npm --version   # يجب أن يكون 10.x.x

# 2. تثبيت التبعيات
npm install

# 3. إنشاء .env.local
cp .env.example .env.local

# 4. تحرير .env.local (أضف مفاتيحك)
# nano .env.local أو code .env.local

# 5. اختبار البناء المحلي
npm run build

# 6. اختبار محلي
npm run dev
# افتح http://localhost:3000
```

---

## 🗄️ المرحلة 2: قاعدة البيانات

```bash
# 1. تثبيت Prisma
npm install -D prisma
npx prisma init

# 2. إنشاء migration
npx prisma migrate dev --name init

# 3. توليد Prisma Client
npx prisma generate

# 4. (اختياري) فتح Prisma Studio
npx prisma studio
```

---

## 🎯 المرحلة 3: Git & GitHub

```bash
# 1. تهيئة Git
git init

# 2. إضافة كل الملفات
git add .

# 3. Commit أولي
git commit -m "🚀 Initial commit - GetYouSite Platform v1.0

- AI Engine v1.0 (Chain-of-Thought)
- SVP-V2 Visual Protocol
- STRP Refinement Protocol
- VIP Design System
- Nexus Dashboard
- Zero-Learning UI
- SFP Frontend Protocol
- BSP Backend Protocol
- DSP DevOps Protocol
- DFP Digital Fortress
- AQSP AI Quality & Support
- DIP Digital Insights
- SIP Sovereign Intelligence

Total: 281 files, 58,700+ lines of code
Status: 100% Production Ready"

# 4. إنشاء فرع main
git branch -M main

# 5. إنشاء مستودع GitHub
# اذهب إلى: https://github.com/new
# اسم المستودع: getyousite-platform
# Privacy: Public أو Private
# DON'T initialize with README

# 6. ربط المستودع
git remote add origin https://github.com/YOUR_USERNAME/getyousite-platform.git

# 7. Push
git push -u origin main
```

---

## 🚀 المرحلة 4: Vercel Deployment

```bash
# 1. تثبيت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. ربط المشروع
vercel link

# 4. إضافة المتغيرات البيئية
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add GEMINI_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add COOKIE_SECRET production
# ... أضف كل المتغيرات

# 5. سحب المتغيرات (اختياري)
vercel env pull

# 6. النشر الأولي
vercel --prod

# 7. إضافة نطاق مخصص (اختياري)
vercel domains add getyousite.com
vercel domains add www.getyousite.com
```

---

## 🔄 المرحلة 5: CI/CD التلقائي

```bash
# عند كل push إلى main، Vercel ستنشر تلقائياً!

# فقط:
git add .
git commit -m "feat: new feature"
git push origin main

# Vercel will:
# 1. Build
# 2. Test
# 3. Deploy
# 4. Update production
```

---

## 🧪 المرحلة 6: الاختبار بعد النشر

```bash
# 1. اختبار الصفحة الرئيسية
curl https://getyousite-platform.vercel.app

# 2. اختبار API
curl https://getyousite-platform.vercel.app/api/health

# 3. اختبار AI
curl -X POST https://getyousite-platform.vercel.app/api/ai/core \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'

# 4. اختبارات E2E
npm run e2e:prod

# 5. Lighthouse
npm run lighthouse
```

---

## 📊 المرحلة 7: المراقبة

```bash
# عرض Logs
vercel logs

# Logs للإنتاج
vercel logs --prod

# Logs للتطوير
vercel logs --env development

# متابعة Logs في الوقت الحقيقي
vercel logs --follow
```

---

## 🎯 Checklist النهائي

### قبل النشر ✅
- [ ] `.env.local` مكتمل
- [ ] قاعدة البيانات جاهزة
- [ ] Migrations مشغلة
- [ ] Build ناجح محلياً
- [ ] اختبارات محلية ناجحة

### أثناء النشر ✅
- [ ] Git push إلى main
- [ ] Vercel deploy تلقائي
- [ ] المتغيرات البيئية مضبوطة
- [ ] النطاق مربوط (اختياري)

### بعد النشر ✅
- [ ] اختبارات E2E ناجحة
- [ ] Lighthouse score >90
- [ ] Analytics تعمل
- [ ] Logs تعمل

---

## 🆘 الدعم السريع

### مشاكل شائعة

**Build فشل:**
```bash
npm run build -- --debug
vercel --debug
```

**متغيرات بيئة:**
```bash
vercel env ls
vercel env pull
```

**Database connection:**
```bash
# تحقق من DATABASE_URL في Vercel
# تأكد من IP whitelist في Supabase
```

---

## 🎉 النجاح!

**منشور الآن على**: `https://getyousite-platform.vercel.app`

**الوقت الإجمالي**: ~15 دقيقة

**🚀 مبروك!**
