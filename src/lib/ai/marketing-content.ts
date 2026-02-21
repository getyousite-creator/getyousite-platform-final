/**
 * Real Marketing Content Generator
 * 
 * SOVEREIGN CONTENT PROTOCOL: No Lorem Ipsum Ever
 * 
 * Generates authentic, high-conversion marketing copy based on the user's
 * business sector using Gemini 3 Flash's linguistic capabilities.
 * 
 * Implements:
 * - AIDA Model (Attention, Interest, Desire, Action)
 * - Modern Standard Arabic (for Arabic locale)
 * - Professional Business English (for English locale)
 * - Industry-specific terminology and pain points
 */

import { generateWithFallback } from "@/lib/ai/multi-provider";
import { Section } from "@/lib/schemas";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContentGenerationRequest {
    /** Business name */
    businessName: string;
    
    /** Business niche/industry */
    niche: string;
    
    /** Business vision/description */
    vision: string;
    
    /** Target locale (ar|en) */
    locale: string;
    
    /** Section type to generate content for */
    sectionType: string;
    
    /** Target audience demographics */
    audience?: string[];
    
    /** Brand voice tone */
    tone?: "authoritative" | "premium" | "friendly" | "technical" | "minimal";
}

export interface GeneratedContent {
    /** Headline (AIDA: Attention) */
    headline: string;
    
    /** Subheadline (AIDA: Interest) */
    subheadline: string;
    
    /** Body copy (AIDA: Desire) */
    body: string;
    
    /** Call-to-action (AIDA: Action) */
    cta: string;
    
    /** Secondary CTA (optional) */
    ctaSecondary?: string;
    
    /** Supporting points/features */
    features?: Array<{
        title: string;
        description: string;
    }>;
    
    /** Social proof elements */
    socialProof?: {
        testimonials?: string[];
        stats?: Array<{ value: string; label: string }>;
        clients?: string[];
    };
    
    /** SEO metadata */
    seo?: {
        title: string;
        description: string;
        keywords: string[];
    };
}

export interface ContentTemplate {
    sectionType: string;
    structure: string[];
    aidaMapping: {
        attention: string;
        interest: string;
        desire: string;
        action: string;
    };
}

// ============================================================================
// AIDA CONTENT TEMPLATES
// ============================================================================

const CONTENT_TEMPLATES: Record<string, ContentTemplate> = {
    hero: {
        sectionType: "hero",
        structure: ["headline", "subheadline", "cta", "ctaSecondary"],
        aidaMapping: {
            attention: "headline",
            interest: "subheadline",
            desire: "body",
            action: "cta",
        },
    },
    features: {
        sectionType: "features",
        structure: ["title", "features", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "features",
            desire: "features",
            action: "cta",
        },
    },
    pricing: {
        sectionType: "pricing",
        structure: ["title", "subtitle", "plans", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "subtitle",
            desire: "plans",
            action: "cta",
        },
    },
    about: {
        sectionType: "about",
        structure: ["title", "body", "stats", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "body",
            desire: "stats",
            action: "cta",
        },
    },
    testimonials: {
        sectionType: "testimonials",
        structure: ["title", "testimonials", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "testimonials",
            desire: "testimonials",
            action: "cta",
        },
    },
    contact: {
        sectionType: "contact",
        structure: ["title", "body", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "body",
            desire: "body",
            action: "cta",
        },
    },
    cta: {
        sectionType: "cta",
        structure: ["headline", "body", "cta"],
        aidaMapping: {
            attention: "headline",
            interest: "body",
            desire: "body",
            action: "cta",
        },
    },
    faq: {
        sectionType: "faq",
        structure: ["title", "questions", "cta"],
        aidaMapping: {
            attention: "title",
            interest: "questions",
            desire: "questions",
            action: "cta",
        },
    },
};

// ============================================================================
// INDUSTRY-SPECIFIC COPY PATTERNS
// ============================================================================

const INDUSTRY_PATTERNS: Record<string, { painPoints: string[]; benefits: string[]; tone: string }> = {
    // Technology & SaaS
    saas: {
        painPoints: [
            "معقدة وبطيئة",
            "مكلفة في الصيانة",
            "لا تتكامل مع أنظمتك الحالية",
            "تتطلب تدريباً طويلاً",
        ],
        benefits: [
            "تكامل سلس خلال دقائق",
            "أتمتة ذكية توفر 80% من الوقت",
            "تحليلات فورية لاتخاذ قرارات أسرع",
            "دعم فني 24/7 بخبراء متخصصين",
        ],
        tone: "technical",
    },
    
    // Medical & Healthcare
    medical: {
        painPoints: [
            "أوقات انتظار طويلة",
            "صعوبة حجز المواعيد",
            "قلة المتابعة بعد الزيارة",
            "عدم وضوح خطة العلاج",
        ],
        benefits: [
            "حجز مواعيد أونلاين خلال ثوانٍ",
            "متابعة مستمرة عبر المنصة",
            "خطط علاجية مخصصة وموثقة",
            "فريق طبي معتمد بخبرة 15+ سنة",
        ],
        tone: "friendly",
    },
    
    // Legal & Consulting
    legal: {
        painPoints: [
            "رسوم استشارة مرتفعة",
            "إجراءات معقدة وبطيئة",
            "عدم وضوح النتائج المتوقعة",
            "صعوبة التواصل مع المحامي",
        ],
        benefits: [
            "استشارة أولية مجانية",
            "إجراءات مبسطة وواضحة",
            "تقييم دقيق لقضيتك مجاناً",
            "تواصل مباشر مع محاميك المختص",
        ],
        tone: "authoritative",
    },
    
    // Real Estate
    realEstate: {
        painPoints: [
            "عمولات خفية مرتفعة",
            "عقارات غير مطابقة للوصف",
            "إجراءات بيع وشراء معقدة",
            "قلة الخيارات المناسبة",
        ],
        benefits: [
            "شفافية كاملة في الأسعار والعمولات",
            "صور وفيديو 360° لكل عقار",
            "إجراءات قانونية مبسطة",
            "أكثر من 5000 عقار متاح",
        ],
        tone: "premium",
    },
    
    // Food & Restaurant
    food: {
        painPoints: [
            "تأخير في التوصيل",
            "طعام بارد عند الوصول",
            "خيارات محدودة",
            "صعوبة تتبع الطلب",
        ],
        benefits: [
            "توصيل خلال 30 دقيقة أو الطلب مجاني",
            "تغليف حراري يحافظ على الحرارة",
            "قائمة طعام بأكثر من 100 صنف",
            "تتبع حي للطلب من المطبخ لبابك",
        ],
        tone: "friendly",
    },
    
    // E-commerce & Retail
    ecommerce: {
        painPoints: [
            "جودة منتجات منخفضة",
            "سياسة إرجاع معقدة",
            "تأخير في الشحن",
            "خدمة عملاء ضعيفة",
        ],
        benefits: [
            "ضمان جودة 100% أو استرداد كامل",
            "إرجاع مجاني خلال 30 يوم",
            "شحن مجاني للطلبات فوق 200 ريال",
            "دعم عملاء عبر الواتساب 24/7",
        ],
        tone: "premium",
    },
    
    // Education & Training
    education: {
        painPoints: [
            "محتوى نظري بدون تطبيق",
            "مدربون غير مؤهلين",
            "شهادات غير معتمدة",
            "جدول زمني غير مرن",
        ],
        benefits: [
            "تدريب عملي على مشاريع حقيقية",
            "مدربون معتمدون بخبرة 10+ سنوات",
            "شهادات معتمدة دولياً",
            "تعلم ذاتي بالسرعة التي تناسبك",
        ],
        tone: "technical",
    },
    
    // Fitness & Gym
    fitness: {
        painPoints: [
            "عدم رؤية نتائج سريعة",
            "عدم معرفة التمارين الصحيحة",
            "ملل من الروتين",
            "إصابات بسبب تمارين خاطئة",
        ],
        benefits: [
            "خطط تدريبية مخصصة تضمن النتائج",
            "مدرب شخصي يراقب أداءك",
            "تحديث أسبوعي للروتين",
            "تقنية حركة متطورة لمنع الإصابات",
        ],
        tone: "friendly",
    },
};

// ============================================================================
// CONTENT GENERATION ENGINE
// ============================================================================

export class MarketingContentGenerator {
    private readonly model: string;

    constructor(options?: { model?: string }) {
        this.model = options?.model || process.env.GEMINI_MODEL || "gemini-3-flash";
    }

    /**
     * Generate complete marketing content for a section
     */
    async generateContent(request: ContentGenerationRequest): Promise<GeneratedContent> {
        console.log("[Marketing Content] Generating content for:", {
            section: request.sectionType,
            locale: request.locale,
            tone: request.tone,
        });

        const template = CONTENT_TEMPLATES[request.sectionType] || CONTENT_TEMPLATES.hero;
        const industryPattern = this.findIndustryPattern(request.niche);

        const systemPrompt = this.buildSystemPrompt(request, industryPattern);
        const userPrompt = this.buildUserPrompt(request, template);

        const result = await generateWithFallback({
            prompt: userPrompt,
            systemPrompt,
            jsonMode: true,
            maxTokens: 4000,
            temperature: 0.6,
            geminiModel: this.model,
        });

        try {
            const content: GeneratedContent = JSON.parse(result.content);
            
            // Validate AIDA structure
            this.validateAIDA(content, template);
            
            console.log("[Marketing Content] Content generated successfully");
            return content;
        } catch (error) {
            console.error("[Marketing Content] Content generation failed:", error);
            throw new Error("CONTENT_GENERATION_FAILED: Invalid marketing copy");
        }
    }

    /**
     * Generate content for all sections in a layout
     */
    async generateLayoutContent(
        request: Omit<ContentGenerationRequest, "sectionType">,
        sectionTypes: string[]
    ): Promise<Record<string, GeneratedContent>> {
        const results: Record<string, GeneratedContent> = {};

        for (const sectionType of sectionTypes) {
            try {
                results[sectionType] = await this.generateContent({
                    ...request,
                    sectionType,
                });
            } catch (error) {
                console.error(`[Marketing Content] Failed to generate content for ${sectionType}:`, error);
                // Continue with other sections
            }
        }

        return results;
    }

    /**
     * Enhance existing section content with marketing copy
     */
    async enhanceSectionContent(
        section: Section,
        request: ContentGenerationRequest
    ): Promise<Section> {
        const generatedContent = await this.generateContent(request);

        // Merge generated content with existing section
        const enhancedContent = {
            ...section.content,
            // Map AIDA content to section content fields
            headline: generatedContent.headline || section.content.headline,
            subheadline: generatedContent.subheadline || section.content.subheadline,
            description: generatedContent.body || section.content.description,
            cta: generatedContent.cta || section.content.cta,
            ctaSecondary: generatedContent.ctaSecondary || section.content.ctaSecondary,
        };

        // Add features if generated
        if (generatedContent.features && generatedContent.features.length > 0) {
            enhancedContent.items = generatedContent.features;
        }

        // Add social proof if generated
        if (generatedContent.socialProof) {
            if (generatedContent.socialProof.testimonials) {
                enhancedContent.testimonials = generatedContent.socialProof.testimonials;
            }
            if (generatedContent.socialProof.stats) {
                enhancedContent.stats = generatedContent.socialProof.stats;
            }
        }

        return {
            ...section,
            content: enhancedContent,
        };
    }

    /**
     * Find matching industry pattern
     */
    private findIndustryPattern(niche: string): typeof INDUSTRY_PATTERNS[keyof typeof INDUSTRY_PATTERNS] {
        const nicheLower = niche.toLowerCase();
        
        for (const [key, pattern] of Object.entries(INDUSTRY_PATTERNS)) {
            if (nicheLower.includes(key)) {
                return pattern;
            }
        }
        
        // Default pattern
        return {
            painPoints: [
                "حلول تقليدية غير فعالة",
                "تكاليف عالية دون قيمة مضافة",
                "دعم فني ضعيف",
            ],
            benefits: [
                "حلول مبتكرة ومثبتة",
                "عائد استثمار واضح",
                "دعم متميز 24/7",
            ],
            tone: "balanced",
        };
    }

    /**
     * Build system prompt for content generation
     */
    private buildSystemPrompt(
        request: ContentGenerationRequest,
        industryPattern: typeof INDUSTRY_PATTERNS[keyof typeof INDUSTRY_PATTERNS]
    ): string {
        const isArabic = request.locale === "ar";

        return `
أنت "كاتب المحتوى السيادي" (Sovereign Copywriter) لمنصة GetYouSite.

مهمتك: كتابة محتوى تسويقي حقيقي عالي التحويل بناءً على نموذج AIDA.

**القواعد الصارمة:**

1. **ممنوع Lorem Ipsum أبداً**: استخدم محتوى حقيقي وذو معنى

2. **نموذج AIDA**:
   - Attention (الانتباه): عنوان يصيد الانتباه فوراً
   - Interest (الاهتمام): وصف يثير فضول القارئ
   - Desire (الرغبة): فوائد تخلق رغبة قوية في المنتج/الخدمة
   - Action (الإجراء): زر CTA واضح ومقنع

3. **${isArabic ? "اللغة العربية" : "اللغة الإنجليزية"}**:
   ${isArabic 
     ? `- فصحى حديثة (Modern Standard Arabic)
- تجنب العامية تماماً
- استخدام لغة استراتيجية تقنية
- طول الجملة: 10-20 كلمة كحد أقصى
- أفعال أمر قوية: "ابدأ"، "اكتشف"، "حقّق"`
     : `- Professional Business English
- Clear and concise
- Action-oriented verbs: "Start", "Discover", "Achieve"
- Sentence length: 10-20 words max`
   }

4. **نبرة الصوت**: ${request.tone || "professional"}
   - authoritative: سلطوية، تقنية، مطمئنة
   - premium: فاخرة، حصرية، راقية
   - friendly: ودودة، دافئة، قريبة
   - technical: دقيقة، متخصصة، واضحة
   - minimal: بسيطة، مباشرة، فعالة

5. **نقاط الألم والفوائد** (استخدم هذه في المحتوى):
   - نقاط الألم: ${industryPattern.painPoints.slice(0, 3).join(", ")}
   - الفوائد: ${industryPattern.benefits.slice(0, 3).join(", ")}

6. **السياق التجاري**:
   - الاسم: ${request.businessName}
   - القطاع: ${request.niche}
   - الرؤية: ${request.vision}

أخرج JSON صارم فقط بدون أي نص إضافي.
`;
    }

    /**
     * Build user prompt for content generation
     */
    private buildUserPrompt(
        request: ContentGenerationRequest,
        template: ContentTemplate
    ): string {
        return `
قم بتوليد محتوى تسويقي لقسم "${template.sectionType}" باستخدام هيكل AIDA.

الهيكل المطلوب:
${JSON.stringify(template.structure, null, 2)}

تفاصيل القسم:
- نوع القسم: ${template.sectionType}
- الجمهور المستهدف: ${request.audience?.join(", ") || "عملاء محتملين عاليي النية"}
- خريطة AIDA:
  * Attention: ${template.aidaMapping.attention}
  * Interest: ${template.aidaMapping.interest}
  * Desire: ${template.aidaMapping.desire}
  * Action: ${template.aidaMapping.action}

أخرج JSON بهذا الهيكل:
{
  "headline": "...",
  "subheadline": "...",
  "body": "...",
  "cta": "...",
  "ctaSecondary": "...",
  "features": [{"title": "...", "description": "..."}],
  "socialProof": {
    "testimonials": ["..."],
    "stats": [{"value": "...", "label": "..."}]
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": ["..."]
  }
}
`;
    }

    /**
     * Validate AIDA structure in generated content
     */
    private validateAIDA(content: GeneratedContent, template: ContentTemplate): void {
        const requiredFields = template.structure;
        
        for (const field of requiredFields) {
            const contentRecord = content as unknown as Record<string, unknown>;
            if (!contentRecord[field]) {
                console.warn(`[Marketing Content] Missing AIDA field: ${field}`);
            }
        }

        // Validate headline length
        if (content.headline && content.headline.length > 100) {
            console.warn("[Marketing Content] Headline too long (max 100 chars recommended)");
        }

        // Validate CTA presence
        if (!content.cta) {
            throw new Error("AIDA_VALIDATION_FAILED: Missing CTA (Action)");
        }
    }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick content generation function
 */
export async function generateMarketingContent(
    request: ContentGenerationRequest
): Promise<GeneratedContent> {
    const generator = new MarketingContentGenerator();
    return generator.generateContent(request);
}

/**
 * Generate hero section content specifically
 */
export async function generateHeroContent(
    businessName: string,
    niche: string,
    vision: string,
    locale: string = "ar"
): Promise<GeneratedContent> {
    return generateMarketingContent({
        businessName,
        niche,
        vision,
        locale,
        sectionType: "hero",
    });
}

/**
 * Generate features section content specifically
 */
export async function generateFeaturesContent(
    businessName: string,
    niche: string,
    vision: string,
    locale: string = "ar"
): Promise<GeneratedContent> {
    return generateMarketingContent({
        businessName,
        niche,
        vision,
        locale,
        sectionType: "features",
    });
}
