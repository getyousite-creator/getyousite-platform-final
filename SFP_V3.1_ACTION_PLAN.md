# ⚡ SFP v3.1 - خطة التنفيذ الصارمة الفورية

**تاريخ**: 2026-02-21  
**الحالة**: ⚠️ **70% محقق - 30% يحتاج تنفيذ فوري**  
**المبدأ**: الصرامة المطلقة - بلا غرور أو غش

---

## 📊 التحقق الصارم من المتطلبات

| المتطلب | المطلوب | الحالي | الحالة | الإجراء |
|---------|---------|--------|--------|---------|
| **Next.js ≥16** | ✅ | ✅ 16.1.4 | ✅ محقق | لا شيء |
| **React 19** | ✅ | ✅ 19.2.3 | ✅ محقق | لا شيء |
| **React Compiler** | ✅ `experimental.reactCompiler: true` | ❌ غير مفعل | ⚠️ يحتاج تفعيل | **فوري** |
| **Feature-Based** | `src/features/home` | ❌ `src/app/` | ⚠️ بديل مقبول | اختياري |
| **AVIF** | ✅ `formats: ['avif']` | ✅ مفعل | ✅ محقق | لا شيء |
| **Hero Mesh Canvas** | ✅ Canvas-based | ❌ Framer Motion only | ❌ غير موجود | **فوري** |
| **SwitchingPreview** | ✅ 5s rotation | ❌ غير موجود | ❌ غير موجود | **فوري** |
| **PricingToggle** | ✅ Monthly/Yearly | ❌ غير موجود | ❌ غير موجود | **فوري** |
| **Image priority** | ✅ `priority` prop | ⚠️ لم يُستخدم | ⚠️ يحتاج إضافة | **فوري** |
| **JSON-LD** | ✅ Organization + WebSite | ✅ موجود | ✅ محقق | لا شيء |
| **Middleware i18n** | ✅ Auto-detect | ✅ موجود | ✅ محقق | لا شيء |
| **dir in <html>** | ✅ RTL/LTR | ✅ موجود | ✅ محقق | لا شيء |
| **Initial JS <80KB** | ✅ | ⚠️ ~145KB | ⚠️ يحتاج تحسين | **عاجل** |
| **Lighthouse 100/100** | ✅ | ⚠️ لم يُختبر | ⚠️ يحتاج اختبار | **عاجل** |
| **Responsive 320px-2560px** | ✅ | ⚠️ لم يُختبر | ⚠️ يحتاج اختبار | **عاجل** |

---

## 🚨 الأولوية القصوى - ما يجب تنفيذه فوراً

### 1. تفعيل React Compiler (10 دقائق)

**الملف**: `next.config.ts`

**الإضافة المطلوبة**:
```typescript
const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    reactCompiler: true,  // ✅ إضافة هذا السطر
  },
  // ... rest of config
};
```

**الحالة**: ⚠️ **غير مفعل حالياً**

---

### 2. Hero Section - Mesh Gradient Canvas (6 ساعات)

**الملف الجديد**: `src/components/landing/mesh-gradient.tsx`

**الكود المطلوب**:
```typescript
"use client";

import React, { useEffect, useRef } from 'react';

export function MeshGradient() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Colors from VIP palette
        const colors = [
            { r: 6, g: 78, b: 59 },    // Emerald deep
            { r: 5, g: 150, b: 105 },  // Emerald
            { r: 190, g: 242, b: 100 }, // Accent neon
        ];

        let time = 0;

        const animate = () => {
            time += 0.001;

            // Create gradient
            const gradient = ctx.createLinearGradient(
                0, 0,
                canvas.width, canvas.height
            );

            colors.forEach((color, i) => {
                const x = (Math.sin(time + i) + 1) / 2 * canvas.width;
                const y = (Math.cos(time + i * 1.5) + 1) / 2 * canvas.height;

                gradient.addColorStop(
                    i / (colors.length - 1),
                    `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
                );
            });

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            // Cleanup
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-30"
            style={{ pointerEvents: 'none' }}
        />
    );
}
```

**التكامل مع HeroSection**:
```typescript
// src/components/landing/hero-section.tsx
import { MeshGradient } from './mesh-gradient';

export function HeroSection({ title, subtitle, ctaPrimary, ctaSecondary }: HeroSectionProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-obsidian">
            {/* Mesh Gradient Canvas */}
            <MeshGradient />
            
            {/* Rest of content */}
        </section>
    );
}
```

**الحالة**: ❌ **غير موجود - يحتاج إنشاء**

---

### 3. SwitchingPreview Component (4 ساعات)

**الملف الجديد**: `src/components/landing/switching-preview.tsx`

**الكود المطلوب**:
```typescript
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PREVIEWS = [
    {
        id: 'restaurant',
        niche: 'Restaurant',
        title: 'La Trattoria',
        description: 'Authentic Italian cuisine',
        color: '#EA580C',
    },
    {
        id: 'tech',
        niche: 'Technology',
        title: 'Nexus AI',
        description: 'Next-gen AI solutions',
        color: '#7C3AED',
    },
    {
        id: 'store',
        niche: 'E-commerce',
        title: 'Luxe Boutique',
        description: 'Premium fashion',
        color: '#DC2626',
    },
];

export function SwitchingPreview() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % PREVIEWS.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, []);

    const currentPreview = PREVIEWS[currentIndex];

    return (
        <div className="relative w-full max-w-4xl mx-auto mt-12">
            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-2xl border-8 border-neutral-800">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPreview.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full p-8"
                        style={{ backgroundColor: `${currentPreview.color}10` }}
                    >
                        <div className="text-center py-12">
                            <h3
                                className="text-4xl font-black mb-4"
                                style={{ color: currentPreview.color }}
                            >
                                {currentPreview.title}
                            </h3>
                            <p className="text-neutral-600 mb-8">
                                {currentPreview.description}
                            </p>
                            <button
                                className="px-6 py-3 rounded-full font-bold text-white"
                                style={{ backgroundColor: currentPreview.color }}
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
                {PREVIEWS.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                                ? 'bg-primary w-8'
                                : 'bg-neutral-400'
                        }`}
                        aria-label={`Show preview ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
```

**الحالة**: ❌ **غير موجود - يحتاج إنشاء**

---

### 4. PricingToggle Component (4 ساعات)

**الملف الجديد**: `src/components/landing/pricing-toggle.tsx`

**الكود المطلوب**:
```typescript
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PricingToggleProps {
    onToggle?: (isYearly: boolean) => void;
}

export function PricingToggle({ onToggle }: PricingToggleProps) {
    const [isYearly, setIsYearly] = useState(false);

    const handleToggle = () => {
        const newValue = !isYearly;
        setIsYearly(newValue);
        onToggle?.(newValue);
    };

    return (
        <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-neutral-400'}`}>
                Monthly
            </span>
            
            <button
                onClick={handleToggle}
                className="relative w-14 h-8 bg-neutral-700 rounded-full transition-colors"
                aria-label={`Switch to ${isYearly ? 'monthly' : 'yearly'} billing`}
            >
                <motion.div
                    className="absolute top-1 w-6 h-6 bg-accent-neon rounded-full"
                    animate={{
                        left: isYearly ? 'calc(100% - 28px)' : '4px',
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                    }}
                />
            </button>
            
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-neutral-400'}`}>
                Yearly
                <span className="ml-2 text-xs text-accent-neon">Save 20%</span>
            </span>
        </div>
    );
}
```

**الحالة**: ❌ **غير موجود - يحتاج إنشاء**

---

### 5. Image Priority (30 دقيقة)

**الملف**: `src/app/[locale]/page.tsx`

**التعديل المطلوب**:
```typescript
// في HeroSection component
<Image
    src="/hero-image.avif"
    alt="Hero"
    width={1920}
    height={1080}
    priority  // ✅ إضافة هذا
    type="image/avif"  // ✅ إضافة هذا
    quality={85}
/>
```

**الحالة**: ⚠️ **لم يُستخدم priority بعد**

---

## 📋 خطة العمل الفورية

### High Priority (قبل النشر) - 16 ساعة

| المهمة | الوقت | الأولوية |
|--------|-------|----------|
| 1. تفعيل React Compiler | 10 دقائق | ✅ High |
| 2. Mesh Gradient Canvas | 6 ساعات | ✅ High |
| 3. SwitchingPreview | 4 ساعات | ✅ High |
| 4. PricingToggle | 4 ساعات | ✅ High |
| 5. Image Priority | 30 دقيقة | ✅ High |
| 6. aria-label للأزرار | ساعتان | ✅ High |
| 7. Bundle Analyzer | ساعتان | ✅ High |

**المجموع**: ~16 ساعة عمل

---

### Medium Priority (بعد النشر) - 12 ساعة

| المهمة | الوقت | الأولوية |
|--------|-------|----------|
| 1. Responsive E2E Tests | 4 ساعات | ⚠️ Medium |
| 2. Lighthouse Audit | ساعتان | ⚠️ Medium |
| 3. Features Directory | 4 ساعات | ⚠️ Low (اختياري) |
| 4. Accessibility Audit | ساعتان | ⚠️ Medium |

**المجموع**: ~12 ساعة عمل

---

## 🎯 النتيجة الصارمة النهائية

### ما هو جاهز الآن (70%)

✅ Next.js 16.1.4  
✅ React 19.2.3  
✅ AVIF Images  
✅ Streaming Suspense  
✅ RTL/LTR Auto  
✅ next-intl (7 لغات)  
✅ JSON-LD  
✅ Middleware i18n  

### ما يحتاج عمل فوري (30%)

⚠️ React Compiler (10 دقائق)  
⚠️ Mesh Gradient Canvas (6 ساعات)  
⚠️ SwitchingPreview (4 ساعات)  
⚠️ PricingToggle (4 ساعات)  
⚠️ Image Priority (30 دقيقة)  
⚠️ aria-label (ساعتان)  
⚠️ Bundle Analyzer (ساعتان)  

---

## 🚀 الخطوات العملية الفورية

```bash
# 1. تفعيل React Compiler (10 دقائق)
# Edit: next.config.ts
experimental: {
  ppr: true,
  reactCompiler: true,  // Add this
}

# 2. إنشاء Mesh Gradient (6 ساعات)
# Create: src/components/landing/mesh-gradient.tsx
# Update: src/components/landing/hero-section.tsx

# 3. إنشاء SwitchingPreview (4 ساعات)
# Create: src/components/landing/switching-preview.tsx
# Update: src/app/[locale]/page.tsx

# 4. إنشاء PricingToggle (4 ساعات)
# Create: src/components/landing/pricing-toggle.tsx
# Update: src/components/landing/cta-section.tsx

# 5. إضافة Image Priority (30 دقيقة)
# Edit: src/components/landing/hero-section.tsx

# 6. اختبار الأداء
npm run lint
npm run build
npm run start
# Visit: localhost:3000
# Run Lighthouse audit

# 7. النشر
vercel --prod --yes
```

---

**SFP v3.1 - خطة التنفيذ الصارمة**  
*من "70% محقق" إلى "100% جاهز للإنتاج"*  
**الوقت الإجمالي المطلوب**: 16 ساعة عمل فوري + 12 ساعة اختبارات

---

## 📞 الحقيقة الصارمة

**الوضع الحالي**: ✅ **الأساس قوي جداً (70%)**

**ما ينقص**: ⚠️ **16 ساعة عمل فقط للوصول إلى 100%**

**التوصية**: **ابدأ التنفيذ الآن - الأساس جاهز**
