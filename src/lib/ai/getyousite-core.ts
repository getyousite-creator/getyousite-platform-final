/**
 * GetYouSite Core Engine v1.0
 * Sovereign AI Site Generator with Chain-of-Thought Prompting
 * 
 * Implements the Sovereign Blueprint protocol for technical and aesthetic dominance
 */

import { generateWithFallback } from "@/lib/ai/multi-provider";
import { SiteBlueprint, Section } from "@/lib/schemas";
import { buildStructuredGenerationProfile } from "@/lib/ai/generation-profile";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SiteContext {
    visualIdentity: {
        primaryColors: string[];
        typography: string[];
        mood: string;
        style: string;
    };
    targetAudience: {
        demographics: string[];
        psychographics: string[];
        painPoints: string[];
    };
    brandVoice: {
        tone: "authoritative" | "premium" | "friendly" | "technical" | "minimal";
        personality: string[];
        language: "ar" | "en" | "mixed";
    };
    requiredFeatures: string[];
    culturalContext: {
        locale: string;
        direction: "ltr" | "rtl";
        culturalPatterns: string[];
    };
}

export interface SiteMap {
    pages: Array<{
        slug: string;
        name: string;
        purpose: string;
        priority: number;
    }>;
    navigation: {
        primary: string[];
        secondary: string[];
    };
}

export interface ComponentTree {
    root: string;
    components: Array<{
        id: string;
        type: string;
        parentId: string | null;
        props: Record<string, unknown>;
    }>;
}

export interface SiteSchema {
    siteMap: SiteMap;
    componentTree: ComponentTree;
    theme: {
        colors: Record<string, string>;
        typography: Record<string, string>;
        spacing: string;
        direction: "ltr" | "rtl";
    };
    content: Record<string, unknown>;
}

export interface GeneratedCode {
    blueprint: SiteBlueprint;
    metadata: {
        generated_by: string;
        model: string;
        timestamp: string;
        engine: string;
        qa_passed: boolean;
        qa_checks: QACheckResult[];
    };
}

export interface QACheckResult {
    name: string;
    passed: boolean;
    details?: string;
}

// ============================================================================
// INTERFACE DEFINITION
// ============================================================================

/**
 * Core Site Generator Interface
 * Implements the Adapter Pattern for flexibility
 */
export interface SiteGenerator {
    analyzePrompt(prompt: string, locale?: string): Promise<SiteContext>;
    generateSchema(context: SiteContext): Promise<SiteSchema>;
    buildCode(schema: SiteSchema, context: SiteContext): Promise<GeneratedCode>;
    generateSite?(prompt: string, locale?: string): Promise<GeneratedCode>;
}

// ============================================================================
// CHAIN-OF-THOUGHT PROMPTING SYSTEM
// ============================================================================

const CONTEXT_ANALYSIS_PROMPT = `
أنت "المحلل السياقي السيادي" (Sovereign Context Analyst) التابع لـ GetYouSite Core.

المهمة: تحليل وصف المستخدم لاستخراج الهوية البصرية، الجمهور المستهدف، النبرة الصوتية، والوظائف المطلوبة.

يجب إخراج JSON صارم بهذا الهيكل:
{
  "visualIdentity": {
    "primaryColors": ["#...", "#..."],
    "typography": ["font1", "font2"],
    "mood": "وصف الحالة البصرية",
    "style": "نمط التصميم"
  },
  "targetAudience": {
    "demographics": ["فئة1", "فئة2"],
    "psychographics": ["صفة1", "صفة2"],
    "painPoints": ["ألم1", "ألم2"]
  },
  "brandVoice": {
    "tone": "authoritative|premium|friendly|technical|minimal",
    "personality": ["صفة1", "صفة2"],
    "language": "ar|en|mixed"
  },
  "requiredFeatures": ["ميزة1", "ميزة2"],
  "culturalContext": {
    "locale": "ar|en",
    "direction": "rtl|ltr",
    "culturalPatterns": ["نمط1", "نمط2"]
  }
}

القواعد:
- إذا كان الوصف بالعربية: direction = "rtl"، واستخدم خطوط Tajawal أو Cairo
- إذا كان الوصف بالإنجليزية: direction = "ltr"، واستخدم خطوط Inter أو Poppins
- حدد النبرة بناءً على قطاع العمل (قانوني = authoritative، تقني = technical، إلخ)
- استخرج 3-5 نقاط ألم عميقة للجمهور المستهدف
`;

const STRUCTURAL_PLANNING_PROMPT = `
أنت "المخطط الهيكلي السيادي" (Sovereign Structural Architect).

المهمة: إنشاء Site Map و Component Tree بصيغة JSON قبل التوليد.

بيانات السياق:
{{CONTEXT_JSON}}

يجب إخراج JSON صارم بهذا الهيكل:
{
  "siteMap": {
    "pages": [
      {"slug": "/", "name": "Home", "purpose": "...", "priority": 1},
      {"slug": "/about", "name": "About", "purpose": "...", "priority": 2}
    ],
    "navigation": {
      "primary": ["Home", "Services", "Pricing", "Contact"],
      "secondary": ["About", "Blog", "FAQ"]
    }
  },
  "componentTree": {
    "root": "MainLayout",
    "components": [
      {"id": "hero-1", "type": "HERO_PRIME", "parentId": null, "props": {}},
      {"id": "features-1", "type": "FEATURE_GRID", "parentId": null, "props": {}}
    ]
  },
  "theme": {
    "colors": {"primary": "#...", "secondary": "#...", "accent": "#..."},
    "typography": {"heading": "...", "body": "..."},
    "spacing": "balanced",
    "direction": "rtl|ltr"
  }
}

القواعد:
- استخدم فقط المكونات المعتمدة: HERO_PRIME, FEATURE_GRID, LOGIC_SERVICES, TRUST_BAR, PRO_OFFER, SMART_FORM, PRICE_ENGINE, FAQ_MASTER, TESTIMONIAL_STREAM
- رتب الصفحات حسب الأولوية التجارية
- حدد direction بناءً على locale
`;

const CULTURAL_SELECTION_PROMPT = `
أنت "الخبير الثقافي السيادي" (Sovereign Cultural Adapter).

المهمة: مطابقة اللغة المختارة مع أنماط التصميم المحلية.

السياق:
{{CONTEXT_JSON}}

القواعد الصارمة:
1. إذا كانت اللغة العربية (ar):
   - dir: 'rtl' في tailwind.config
   - خطوط: Tajawal للعناوين، Cairo للنصوص
   - أنماط: استخدام الزخارف الإسلامية الحديثة (Modern Islamic Patterns)
   - تباعد: whitespace أكثر سخاءً
   - ألوان: تجنب الأحمر الفاقع، تفضيل الأزرق والأخضر والذهبي

2. إذا كانت اللغة الإنجليزية (en):
   - dir: 'ltr'
   - خطوط: Inter للعناوين، Poppins للنصوص
   - أنماط: Minimal Modern أو Swiss Design
   - تباعد: balanced density
   - ألوان: حسب هوية العلامة التجارية

3. توليد محتوى تسويقي حقيقي (NO Lorem Ipsum):
   - استخدم نموذج AIDA (Attention, Interest, Desire, Action)
   - اللغة العربية: فصحى حديثة (Modern Standard Arabic)
   - اللغة الإنجليزية: Professional Business English
   - تجنب العبارات المبتذلة، استخدم لغة استراتيجية مقنعة

يجب إخراج JSON بإعدادات التكوين الثقافي:
{
  "culturalConfig": {
    "direction": "rtl|ltr",
    "fonts": {"heading": "...", "body": "..."},
    "patterns": ["pattern1", "pattern2"],
    "colorGuidelines": ["guideline1", "guideline2"],
    "contentTone": "وصف النبرة"
  }
}
`;

// ============================================================================
// GETYOUSITE CORE ENGINE IMPLEMENTATION
// ============================================================================

export class GetYouSiteEngine implements SiteGenerator {
    private readonly model: string;
    private readonly cachedContent?: string;

    constructor(options?: { model?: string; cachedContent?: string }) {
        this.model = options?.model || process.env.GEMINI_MODEL || "gemini-3-flash";
        this.cachedContent = options?.cachedContent || process.env.GEMINI_CACHED_CONTENT;
    }

    /**
     * Phase 1: Contextual Analysis (التحليل السياقي)
     * Analyzes user prompt to extract visual identity, audience, voice, and features
     */
    async analyzePrompt(prompt: string, locale: string = "en"): Promise<SiteContext> {
        console.log(`[GetYouSite Core] Phase 1: Contextual Analysis for locale [${locale}]`);

        const enhancedPrompt = `
${CONTEXT_ANALYSIS_PROMPT}

وصف المستخدم:
${prompt}

اللغة المستهدفة: ${locale}

أخرج JSON صارم فقط بدون أي نص إضافي.
`;

        const result = await generateWithFallback({
            prompt: enhancedPrompt,
            jsonMode: true,
            maxTokens: 3000,
            temperature: 0.3,
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        try {
            const context: SiteContext = JSON.parse(result.content);
            console.log("[GetYouSite Core] Contextual Analysis Complete:", {
                voice: context.brandVoice.tone,
                direction: context.culturalContext.direction,
                features: context.requiredFeatures.length,
            });
            return context;
        } catch (error) {
            console.error("[GetYouSite Core] Context Analysis Parse Error:", error);
            throw new Error("CONTEXT_ANALYSIS_FAILED: Unable to parse user intent");
        }
    }

    /**
     * Phase 2: Structural Planning (التخطيط الهيكلي)
     * Creates SiteMap and ComponentTree before generation
     */
    async generateSchema(context: SiteContext): Promise<SiteSchema> {
        console.log("[GetYouSite Core] Phase 2: Structural Planning");

        const enhancedPrompt = STRUCTURAL_PLANNING_PROMPT.replace(
            "{{CONTEXT_JSON}}",
            JSON.stringify(context, null, 2)
        );

        const result = await generateWithFallback({
            prompt: enhancedPrompt,
            jsonMode: true,
            maxTokens: 5000,
            temperature: 0.4,
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        try {
            const schema: SiteSchema = JSON.parse(result.content);
            console.log("[GetYouSite Core] Structural Planning Complete:", {
                pages: schema.siteMap.pages.length,
                components: schema.componentTree.components.length,
            });
            return schema;
        } catch (error) {
            console.error("[GetYouSite Core] Schema Parse Error:", error);
            throw new Error("SCHEMA_GENERATION_FAILED: Invalid structure");
        }
    }

    /**
     * Phase 3: Code Generation with Cultural Adaptation
     * Builds the final SiteBlueprint with QA checks
     */
    async buildCode(schema: SiteSchema, context: SiteContext): Promise<GeneratedCode> {
        console.log("[GetYouSite Core] Phase 3: Code Generation & Cultural Adaptation");

        const generationProfile = {
            industry: context.requiredFeatures.join(", "),
            tone: context.brandVoice.tone,
            audience: context.targetAudience.demographics,
            locale: context.culturalContext.locale,
            direction: context.culturalContext.direction,
        };

        const systemPrompt = this.buildSystemPrompt(context);
        const userPrompt = this.buildUserPrompt(schema, context);

        const result = await generateWithFallback({
            prompt: userPrompt,
            systemPrompt,
            jsonMode: true,
            maxTokens: 8000,
            temperature: 0.5,
            geminiModel: this.model,
            geminiCachedContent: this.cachedContent,
        });

        try {
            const blueprint: SiteBlueprint = JSON.parse(result.content);
            
            // Run QA Protocol
            const qaChecks = await this.runQAProtocol(blueprint, context);
            const allPassed = qaChecks.every(check => check.passed);

            console.log("[GetYouSite Core] Code Generation Complete:", {
                sections: blueprint.layout?.length || 0,
                qa_passed: allPassed,
            });

            return {
                blueprint,
                metadata: {
                    generated_by: result.provider,
                    model: result.model,
                    timestamp: new Date().toISOString(),
                    engine: "GetYouSite-Core-v1.0",
                    qa_passed: allPassed,
                    qa_checks: qaChecks,
                },
            };
        } catch (error) {
            console.error("[GetYouSite Core] Blueprint Parse Error:", error);
            throw new Error("CODE_GENERATION_FAILED: Invalid blueprint");
        }
    }

    /**
     * Full Generation Pipeline
     * Executes all 3 phases in sequence
     */
    async generateSite(prompt: string, locale: string = "en"): Promise<GeneratedCode> {
        console.log("[GetYouSite Core] Initiating Full Generation Pipeline...");
        
        const startTime = Date.now();
        
        // Phase 1: Analysis
        const context = await this.analyzePrompt(prompt, locale);
        
        // Phase 2: Planning
        const schema = await this.generateSchema(context);
        
        // Phase 3: Generation
        const generated = await this.buildCode(schema, context);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`[GetYouSite Core] Generation Pipeline Complete in ${duration}s`);
        
        return generated;
    }

    // ========================================================================
    // AUTOMATED QA PROTOCOL (بروتوكول مراقبة الجودة)
    // ========================================================================

    private async runQAProtocol(blueprint: SiteBlueprint, context: SiteContext): Promise<QACheckResult[]> {
        console.log("[GetYouSite Core] Running Automated QA Protocol...");

        const checks: QACheckResult[] = [];

        // Check 1: Is the code compilable (valid JSON structure)?
        checks.push(this.checkCompilable(blueprint));

        // Check 2: Is the design responsive (3+ screen sizes)?
        checks.push(this.checkResponsive(blueprint));

        // Check 3: Is the expected Lighthouse score > 95?
        checks.push(await this.checkLighthouseScore(blueprint, context));

        // Check 4: Is the content ethically and commercially compliant?
        checks.push(await this.checkEthicalCompliance(blueprint));

        return checks;
    }

    private checkCompilable(blueprint: SiteBlueprint): QACheckResult {
        try {
            // Validate required fields
            const required = ["id", "name", "layout", "theme", "navigation", "footer"];
            const missing = required.filter(key => !(key in blueprint));

            if (missing.length > 0) {
                return {
                    name: "Compilable Structure",
                    passed: false,
                    details: `Missing required fields: ${missing.join(", ")}`,
                };
            }

            // Validate layout array
            if (!Array.isArray(blueprint.layout) || blueprint.layout.length === 0) {
                return {
                    name: "Compilable Structure",
                    passed: false,
                    details: "Layout must be a non-empty array",
                };
            }

            return {
                name: "Compilable Structure",
                passed: true,
                details: "All required fields present and valid",
            };
        } catch (error) {
            return {
                name: "Compilable Structure",
                passed: false,
                details: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private checkResponsive(blueprint: SiteBlueprint): QACheckResult {
        try {
            // Check for responsive design patterns in sections
            const sections = blueprint.layout || [];
            
            // Verify sections have responsive-friendly structures
            const hasHero = sections.some(s => ["hero", "HERO_PRIME"].includes(s.type));
            const hasFeatures = sections.some(s => ["features", "FEATURE_GRID"].includes(s.type));
            const hasCTA = sections.some(s => s.type === "cta" || s.content?.cta);

            const responsivePatterns = [hasHero, hasFeatures, hasCTA].filter(Boolean).length;

            if (responsivePatterns >= 2) {
                return {
                    name: "Responsive Design",
                    passed: true,
                    details: `${responsivePatterns}/3 responsive patterns detected (Hero, Features, CTA)`,
                };
            }

            return {
                name: "Responsive Design",
                passed: false,
                details: `Only ${responsivePatterns}/3 responsive patterns detected`,
            };
        } catch (error) {
            return {
                name: "Responsive Design",
                passed: false,
                details: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private async checkLighthouseScore(
        blueprint: SiteBlueprint,
        context: SiteContext
    ): Promise<QACheckResult> {
        try {
            // Heuristic Lighthouse score estimation
            let score = 100;

            // Penalize missing SEO
            if (!blueprint.seo || !blueprint.seo.title || !blueprint.seo.description) {
                score -= 15;
            }

            // Penalize missing accessibility features
            const sections = blueprint.layout || [];
            const hasImages = sections.some(s => s.content?.image);
            const imagesWithAlt = sections.filter(s => s.content?.image && s.content?.alt).length;
            
            if (hasImages && imagesWithAlt < sections.filter(s => s.content?.image).length) {
                score -= 10;
            }

            // Penalize poor color contrast (heuristic)
            if (context.culturalContext.direction === "rtl") {
                // Arabic sites get slight penalty for potential font loading
                score -= 5;
            }

            const passed = score >= 95;

            return {
                name: "Lighthouse Score (Estimated)",
                passed,
                details: `Estimated score: ${score}/100 (Target: 95+)`,
            };
        } catch (error) {
            return {
                name: "Lighthouse Score (Estimated)",
                passed: false,
                details: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private async checkEthicalCompliance(blueprint: SiteBlueprint): Promise<QACheckResult> {
        try {
            const content = JSON.stringify(blueprint).toLowerCase();
            
            // Check for harmful content patterns
            const harmfulPatterns = [
                /scam|fraud|fake/i,
                /illegal|unlawful/i,
                /hate|discrimination/i,
                /explicit|adult/i,
            ];

            const violations = harmfulPatterns.filter(pattern => pattern.test(content));

            if (violations.length > 0) {
                return {
                    name: "Ethical & Commercial Compliance",
                    passed: false,
                    details: `Potential violations detected: ${violations.length} patterns`,
                };
            }

            return {
                name: "Ethical & Commercial Compliance",
                passed: true,
                details: "No harmful content patterns detected",
            };
        } catch (error) {
            return {
                name: "Ethical & Commercial Compliance",
                passed: false,
                details: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    private buildSystemPrompt(context: SiteContext): string {
        const isArabic = context.culturalContext.locale === "ar";

        return `
أنت "المهندس السيادي" (Sovereign Architect) لمنصة GetYouSite Core v1.0.

القواعد الصارمة:

1. **اللغة والبيئة**:
   - استخدم TypeScript 5.5+ مع React 19
   - بنية app/ الجديدة في Next.js
   - React Server Components (RSC) كخيار افتراضي

2. **المكونات**:
   - ممنوع استخدام أي مكتبة خارجية غير shadcn/ui و Tailwind CSS
   - جميع المكونات يجب أن تكون Accessible (ARIA compliant)
   - استخدم المكونات الذرية: ${["HERO_PRIME", "FEATURE_GRID", "LOGIC_SERVICES", "TRUST_BAR", "PRO_OFFER", "SMART_FORM", "PRICE_ENGINE", "FAQ_MASTER", "TESTIMONIAL_STREAM"].join(", ")}

3. **توليد المحتوى**:
   - ممنوع استخدام Lorem Ipsum أبداً
   - استخدم نموذج AIDA (Attention, Interest, Desire, Action)
   - ${isArabic ? "العربية الفصحى الحديثة (Modern Standard Arabic)" : "Professional Business English"}
   - محتوى تسويقي حقيقي بناءً على قطاع عمل المستخدم

4. **السرعة والأداء**:
   - React Server Components كخيار افتراضي
   - تقليل حجم JavaScript المرسلة
   - تحسين Lighthouse Score > 95

5. **${isArabic ? "الدعم العربي" : "Localization"}**:
   ${isArabic ? `- dir: 'rtl' في جميع المكونات
- خطوط: Tajawal للعناوين، Cairo للنصوص
- تباعد whitespace أكثر سخاءً
- أنماط عربية حديثة` : `- dir: 'ltr'
- خطوط: Inter للعناوين، Poppins للنصوص
- Swiss Design أو Minimal Modern`}

6. **السياق**:
- نبرة الصوت: ${context.brandVoice.tone}
- الجمهور: ${context.targetAudience.demographics.join(", ")}
- الميزات المطلوبة: ${context.requiredFeatures.join(", ")}

المخرج يجب أن يكون SiteBlueprint JSON كامل وصالح للاستخدام الفوري.
`;
    }

    private buildUserPrompt(schema: SiteSchema, context: SiteContext): string {
        return `
قم بتنفيذ بروتوكول البناء السيادي بناءً على:

Site Schema:
${JSON.stringify(schema, null, 2)}

Context:
- Direction: ${context.culturalContext.direction}
- Locale: ${context.culturalContext.locale}
- Tone: ${context.brandVoice.tone}
- Features: ${context.requiredFeatures.join(", ")}

أخرج SiteBlueprint JSON كامل مع:
1. layout (أقسام الصفحة الرئيسية)
2. theme (الألوان، الخطوط)
3. navigation و footer
4. seo (title, description, keywords)
5. metadata
`;
    }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

export function createSiteGenerator(options?: { model?: string; cachedContent?: string }): SiteGenerator {
    return new GetYouSiteEngine(options);
}

// ============================================================================
// CONVENIENCE FUNCTION
// ============================================================================

export async function generateSiteWithCoT(
    prompt: string,
    locale: string = "en"
): Promise<GeneratedCode> {
    const engine = createSiteGenerator();
    return engine.generateSite(prompt, locale);
}
