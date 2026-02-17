# CRITICAL FIX COMMANDS - GetYouSite Platform

## Issue #1: FIX PRICING INCONSISTENCY (CRITICAL)

Replace the entire `src/config/subscription-plans.ts` file:

```typescript
// ============================================
// FIX COMMAND: Replace src/config/subscription-plans.ts
// ============================================

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    starter: {
        id: "starter",
        name: "Starter", // Changed from "Node Starter" to match homepage
        description: "Proof of Concept Protocol - Ideal for early visionaries.",
        price: 0, // FIXED: $0 (was $19)
        currency: "USD",
        features: [
            "Logic Community Support",
            "Standard GYS Branding",
            "GYS Subdomain Access",
            "Basic AI Unit Generation",
        ],
    },
    pro: {
        id: "pro",
        name: "Professional", // Changed from "Nexus Pro" to match homepage
        description: "Professional Growth Engine - High-status digital presence.",
        price: 19, // FIXED: $19 (was $49)
        currency: "USD",
        features: [
            "Neural Traffic Analytics",
            "Priority Engineering Support",
            "Total Brand Sovereignty",
            "Naked Domain Linking",
            "3 Sovereign Web Assets",
        ],
    },
    business: {
        id: "business",
        name: "Business", // Changed from "Empire Business" to match homepage
        description: "Digital Empire Infrastructure - Full architectural control.",
        price: 49, // FIXED: $49 (was $99)
        currency: "USD",
        features: [
            "API Access Protocol",
            "Redundant Security Backups",
            "Live Logic Support Chat",
            "Autonomous SEO Architect",
            "10 Sovereign Web Assets",
        ],
    },
};

export const getPlanById = (id: string): SubscriptionPlan => {
    return SUBSCRIPTION_PLANS[id] || SUBSCRIPTION_PLANS.starter;
};
```

---

## Issue #2: FIX ARABIC TRANSLATION GAPS

### Step 1: Audit missing keys in messages/ar.json

```bash
# Command to find untranslated English in Arabic page
# Check src/data/template-data.ts for feature arrays that need translation
```

### Step 2: Add missing Arabic translations

In `messages/ar.json`, add these keys (and any missing ones):

```json
{
    "templates": {
        "features": {
            "smartBooking": "حجز ذكي",
            "serviceBlueprints": "مخططات الخدمات",
            "clinicalGallery": "معرض العيادات",
            "highConvFunnels": "مسارات تحويل عالية",
            "glassCart": "عربة زجاجية",
            "oneClickCheckout": "الدفع بضغطة واحدة",
            "trustGrids": "شبكات الثقة",
            "globalOperations": "العمليات العالمية",
            "investorPortals": "بوابات المستثمرين",
            "programMatrices": "مصفوفات البرامج",
            "trainerProfiles": "ملفات المدربين",
            "progressTracking": "تتبع التقدم",
            "automatedLedger": "دفتر أتمتة",
            "taxCompliance": "الامتثال الضريبي",
            "invoicingEngine": "محرك الفواتير",
            "crmLogic": "منطق إدارة العملاء",
            "inventoryMatrices": "مصفوفات المخزون",
            "systemLogs": "سجلات النظام",
            "caseManagement": "إدارة الحالات",
            "partnerProfiles": "ملفات الشركاء",
            "secureIntake": "استقبال آمن",
            "dynamicMenus": "قوائم ديناميكية",
            "reservationEngine": "محرك الحجوزات",
            "criticsSection": "قسم النقاد",
            "masonryGrid": "شبكة Masonry",
            "cinematicReels": "شرائط سينمائية",
            "visionMatrices": "مصفوفات الرؤية",
            "dataVisuals": "مرئيات البيانات",
            "featureGrids": "شبكات الميزات",
            "leadDiscovery": "اكتشاف العملاء",
            "propertySearch": "بحث العقارات",
            "marketIntel": "استخبارات السوق",
            "virtual Tours": "جولات افتراضية",
            "courseMatrix": "مصفوفة الدورات",
            "learningPaths": "مسارات التعلم",
            "curriculumGrid": "منهج الشبكة",
            "newsGrid": "شبكة الأخبار",
            "readerFocus": "تركيز القارئ",
            "articleMatrix": "مصفوفة المقالات",
            "therapyMenu": "قائمة العلاج",
            "softVisuals": "مرئيات ناعمة",
            "calmBooking": "حجز هادئ",
            "quickLook": "نظرة سريعة",
            "sizeGuide": "دليل المقاسات",
            "streetVibes": "أجواء الشوارع",
            "attorneyProfiles": "ملفات المحامين",
            "practiceAreas": "مجالات الممارسة",
            "consultation": "استشارة",
            "seasonalMenu": "قائمة موسمية",
            "chefsTable": "طاولة الشيف",
            "eventBooking": "حجز الفعاليات",
            "portfolioGrid": "محفظة الشبكة",
            "investmentThesis": "أطروحة الاستثمار",
            "teamFocus": "تركيز الفريق",
            "smileGallery": "معرض الابتسامة",
            "patientForms": "نماذج المرضى",
            "emergencyInfo": "معلومات الطوارئ",
            "classSchedule": "جدول الفصول",
            "instructorBio": "سيرة المدرب",
            "newStudentOffer": "عرض الطالب الجديد",
            "techStack": "المجموعة التقنية",
            "caseStudies": "دراسات الحالة",
            "integrationApi": "واجهة برمجة التكامل",
            "neighborhoodGuide": "دليل الحي",
            "buyingGuide": "دليل الشراء",
            "mortgageCalc": "حساب الرهن",
            "breakingNews": "أخبار عاجلة",
            "trendingTopics": "المواضيع الرائجة",
            "newsletter": "النشرة الإخبارية",
            "skillTrack": "مسار المهارات",
            "certification": "شهادة",
            "teamAccess": "وصول الفريق"
        }
    }
}
```

---

## Issue #3: IMPLEMENT CREDIT SYSTEM

### Step 1: Add credits column to database

```sql
-- Run in Supabase SQL Editor
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 0;
```

### Step 2: Fix the generate route to actually deduct credits

In `src/app/api/generate/route.ts`, replace the credit section:

```typescript
// Replace this section:
/*
const { createClient } = await import("@/lib/supabase/server");
const supabase = await createClient();
const {
    data: { user },
} = await supabase.auth.getUser();

if (user?.id) {
    // Logic: Consume credit (Placeholder for now, or use direct DB call)
    // await AuthService.consumeCredit(user.id);
    console.log(`[SOVEREIGN_WALLET] Credit interaction for User: ${user.id}`);
}
*/

// WITH THIS:
const { createClient } = await import("@/lib/supabase/server");
const supabase = await createClient();
const {
    data: { user },
} = await supabase.auth.getUser();

if (user?.id) {
    // ACTUAL CREDIT DEDUCTION
    const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single();

    if (fetchError || !userData || userData.credits < 1) {
        return NextResponse.json(
            { error: "INSUFFICIENT_CREDITS", message: "Credit Logic Depleted. Top-up Required." },
            { status: 402 },
        );
    }

    // Deduct credit
    const { error: updateError } = await supabase
        .from("users")
        .update({ credits: userData.credits - 1 })
        .eq("id", user.id);

    if (updateError) {
        console.error("Credit deduction failed:", updateError);
    } else {
        console.log(
            `[SOVEREIGN_WALLET] Credit deducted for User: ${user.id}. Remaining: ${userData.credits - 1}`,
        );
    }
}
```

---

## Issue #4: FIX TESTIMONIAL DUPLICATION

In `src/components/home/Testimonials.tsx`:

```typescript
// Remove duplicate testimonials - keep only unique ones
const uniqueTestimonials = [
    testimonials[0],
    testimonials[1],
    testimonials[2],
    testimonials[3],
    // Remove: testimonials[4-11] which are duplicates
];
```

---

## Issue #5: REMOVE UNREALISTIC SAVINGS CLAIMS

In `src/components/home/showcase/TemplateCard.tsx`:

```typescript
// Remove or make conditional:
// "~ 2.5M savings" should be removed or wrapped in a feature flag
// for A/B testing

{/* REMOVE THIS LINE: */}
<span className="text-xs text-green-500">~ {template.savings} savings</span>
```

---

## VERIFICATION CHECKLIST

After applying fixes, verify:

- [ ] Pricing page shows $0 / $19 / $49
- [ ] Checkout uses correct prices
- [ ] Arabic template features are translated
- [ ] Credit is deducted after AI generation
- [ ] Testimonials are unique (not duplicated)
- [ ] "Savings" claims are removed or documented
