import { SITE_TEMPLATES, TemplateTheme } from "../templates";
import { SiteBlueprint, Section } from "../schemas";
import { applyPersonaMicrocopy } from "@/lib/ai/persona-microcopy";

export interface UserPromptData {
    businessName: string;
    niche: string;
    vision: string;
    selectedId: string;
}

interface SpecializedContent {
    headline: string;
    subheadline: string;
    features: string[];
    injectionSection?: {
        type: Section["type"];
        content: Record<string, unknown>;
    };
}

function detectBusinessType(input: string) {
    const value = input.toLowerCase();
    if (
        value.includes("gym") ||
        value.includes("fitness") ||
        value.includes("رياض") ||
        value.includes("رياضة")
    ) {
        return "fitness";
    }
    if (value.includes("restaurant") || value.includes("cafe") || value.includes("مطعم")) {
        return "restaurant";
    }
    if (value.includes("clinic") || value.includes("medical") || value.includes("عيادة")) {
        return "medical";
    }
    return "general";
}

function buildRichFallbackLayout(userData: UserPromptData, locale: string): Section[] {
    const isAr = locale === "ar";
    const type = detectBusinessType(`${userData.niche} ${userData.vision}`);

    const heroImageByType: Record<string, string> = {
        fitness:
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
        restaurant:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
        medical:
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
        general:
            "https://images.unsplash.com/photo-1522204538344-922f76eba0a4?auto=format&fit=crop&w=1600&q=80",
    };

    const serviceItems =
        type === "fitness"
            ? [
                  {
                      title: isAr ? "اشتراك شهري مرن" : "Flexible Monthly Membership",
                      description: isAr
                          ? "وصول كامل لصالة الحديد والكارديو مع خطط مناسبة."
                          : "Full access to gym and cardio with clear membership plans.",
                  },
                  {
                      title: isAr ? "تدريب شخصي" : "Personal Coaching",
                      description: isAr
                          ? "برنامج تدريبي فردي حسب الهدف البدني."
                          : "1:1 coaching tailored to your transformation goal.",
                  },
                  {
                      title: isAr ? "متابعة التغذية" : "Nutrition Guidance",
                      description: isAr
                          ? "خطة غذائية عملية تدعم الأداء والاستمرارية."
                          : "Actionable meal guidance for steady progress.",
                  },
              ]
            : [
                  {
                      title: isAr ? "خدمة احترافية" : "Professional Service",
                      description: isAr
                          ? "حلول مصممة بدقة لرفع نتائج العمل."
                          : "Tailored solutions focused on business outcomes.",
                  },
                  {
                      title: isAr ? "تنفيذ سريع" : "Fast Execution",
                      description: isAr
                          ? "إطلاق سريع مع جودة إنتاج عالية."
                          : "Rapid implementation with production quality.",
                  },
                  {
                      title: isAr ? "دعم متواصل" : "Continuous Support",
                      description: isAr
                          ? "مرافقة تشغيلية وتحسين مستمر."
                          : "Operational support and continuous optimization.",
                  },
              ];

    return [
        {
            id: `hero_${Date.now()}`,
            type: "hero",
            animation: "fade-in",
            styles: {},
            content: {
                headline: isAr
                    ? `${userData.businessName} - وجهتك الأولى للنتائج الحقيقية`
                    : `${userData.businessName} - Built For Real Results`,
                subheadline: isAr
                    ? userData.vision ||
                      `حلول احترافية في ${userData.niche} مع تجربة عميل واضحة وموثوقة.`
                    : userData.vision ||
                      `Professional ${userData.niche} solutions with a clear, trustworthy customer journey.`,
                cta: isAr ? "ابدأ الآن" : "Get Started",
                image: heroImageByType[type],
            },
        },
        {
            id: `features_${Date.now()}`,
            type: "FEATURE_GRID",
            animation: "fade-in",
            styles: {},
            content: {
                title: isAr ? "ماذا ستحصل عليه" : "What You Get",
                items: serviceItems,
            },
        },
        {
            id: `services_${Date.now()}`,
            type: "services",
            animation: "fade-in",
            styles: {},
            content: {
                items: serviceItems.map((item, index) => ({
                    name: item.title,
                    price:
                        type === "fitness"
                            ? isAr
                                ? `${149 + index * 100} درهم`
                                : `$${29 + index * 20}`
                            : isAr
                              ? `ابتداءً من ${199 + index * 150} درهم`
                              : `From $${49 + index * 30}`,
                    description: item.description,
                })),
            },
        },
        {
            id: `gallery_${Date.now()}`,
            type: "gallery",
            animation: "fade-in",
            styles: {},
            content: {
                images:
                    type === "fitness"
                        ? [
                              "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
                          ]
                        : [
                              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80",
                              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
                          ],
            },
        },
        {
            id: `testimonials_${Date.now()}`,
            type: "testimonials",
            animation: "fade-in",
            styles: {},
            content: {
                reviews: [
                    {
                        name: isAr ? "أحمد ب." : "Alex B.",
                        role: isAr ? "عميل فعلي" : "Real Client",
                        text: isAr
                            ? "تجربة احترافية والنتائج ظهرت بسرعة."
                            : "Professional experience with fast, measurable results.",
                    },
                    {
                        name: isAr ? "سارة م." : "Sarah M.",
                        role: isAr ? "صاحبة مشروع" : "Business Owner",
                        text: isAr
                            ? "الموقع واضح ويحوّل الزوار إلى عملاء."
                            : "The site is clear and converts visitors into customers.",
                    },
                    {
                        name: isAr ? "يوسف ع." : "Youssef A.",
                        role: isAr ? "مدير عمليات" : "Operations Lead",
                        text: isAr
                            ? "تصميم منظم ورسائل تسويقية مباشرة."
                            : "Structured design with direct conversion-focused messaging.",
                    },
                ],
            },
        },
        {
            id: `faq_${Date.now()}`,
            type: "faq",
            animation: "fade-in",
            styles: {},
            content: {
                items: [
                    {
                        q: isAr ? "كم يستغرق البدء؟" : "How fast can we start?",
                        a: isAr
                            ? "يمكن بدء التنفيذ فوراً خلال نفس اليوم."
                            : "You can start immediately with same-day onboarding.",
                    },
                    {
                        q: isAr ? "هل توجد باقات واضحة؟" : "Do you offer clear plans?",
                        a: isAr
                            ? "نعم، توجد باقات مرنة حسب حجم الاحتياج."
                            : "Yes, plans are structured by your growth stage.",
                    },
                ],
            },
        },
        {
            id: `contact_${Date.now()}`,
            type: "contact",
            animation: "fade-in",
            styles: {},
            content: {
                title: isAr ? "تواصل معنا" : "Contact Us",
                description: isAr
                    ? "اترك بياناتك وسنعاود التواصل خلال 24 ساعة."
                    : "Send your details and we will reach out within 24 hours.",
                phone: "+212 600 000 000",
                email: "hello@getyousite.com",
                address: isAr ? "الدار البيضاء، المغرب" : "Casablanca, Morocco",
            },
        },
        {
            id: `cta_${Date.now()}`,
            type: "cta",
            animation: "fade-in",
            styles: {},
            content: {
                headline: isAr ? "جاهز للانطلاق؟" : "Ready To Launch?",
                subheadline: isAr
                    ? "ابنِ حضوراً رقمياً مقنعاً وابدأ جلب العملاء."
                    : "Build a credible digital presence and start converting today.",
            },
        },
    ];
}

// CLINICAL HEURISTIC SYNTHESIS
const HeuristicSovereignGenerator = {
    synthesize(userData: UserPromptData, locale: string = "en") {
        const niche = userData.niche.toLowerCase();
        const vision = userData.vision.toLowerCase();
        const biz = userData.businessName;
        const isAr = locale === "ar";

        // 1. Primary Niche Vectors
        if (niche.includes("health") || niche.includes("doctor") || vision.includes("medical")) {
            return {
                headline: isAr
                    ? `التميز الطبي لـ ${biz}: رعاية المرضى أولاً`
                    : `Clinical Excellence for ${biz}: Patient-First Care`,
                subheadline: isAr
                    ? `بنية تحتية للرعاية الصحية مصممة لتحسين نتائج المرضى وبناء الثقة.`
                    : `High-fidelity healthcare infrastructure designed for optimal patient outcomes and trust.`,
                features: ["Sovereign-Health-v1", "HIPAA-Standard-Logic", "Global-Clinical-Reach"],
            };
        }

        if (niche.includes("tech") || niche.includes("ai") || vision.includes("future")) {
            return {
                headline: isAr
                    ? `تنظيم المستقبل بذكاء ${biz}`
                    : `Orchestrating the Future with ${biz} Intelligence`,
                subheadline: isAr
                    ? `بنية عصبية في الوقت الفعلي ونشر عالي التردد للنظام الرقمي العالمي.`
                    : `Real-time neural architecture and high-frequency deployment for the global digital ecosystem.`,
                features: ["Neural-Feed-v3", "Logic-Hardened-API", "Autonomous-Expansion-Nodes"],
            };
        }

        if (niche.includes("estate") || niche.includes("property") || niche.includes("house")) {
            return {
                headline: isAr
                    ? `عمارة فاخرة. ملكية سيادية.`
                    : `Luxury Architecture. Sovereign Ownership.`,
                subheadline: isAr
                    ? `تقييم وتنسيق البيئات السكنية والتجارية عالية القيمة لعملاء ${biz}.`
                    : `Curating high-value residential and commercial ecosystems for ${biz} clients.`,
                features: [
                    "Precision-Blueprints",
                    "Asset-Security-Protocol",
                    "Geometric-Layout-Optimization",
                ],
                injectionSection: {
                    type: "CINEMATIC_VIDEO",
                    content: {
                        prompt: `Modern luxury villa for ${biz}`,
                        videoUrl:
                            "https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-in-a-sunny-day-36314-large.mp4",
                    },
                },
            };
        }

        // 2. Intent-Based Synthesis (Catch-All)
        return {
            headline: isAr
                ? `بناء التميز: بروتوكول ${biz}`
                : `Constructing Excellence: The ${biz} Protocol`,
            subheadline: isAr
                ? `أصل رقمي سيادي مصمم للهيمنة القصوى على السوق في قطاع ${userData.niche}.`
                : `A sovereign digital asset engineered for maximum market dominance in the ${userData.niche} sector.`,
            features: [
                isAr ? "كفاءة هيكلية" : "Structural-Efficiency",
                isAr ? "سرعة النمو" : "Growth-Velocity-v1",
                isAr ? "معايير العمارة النظيفة" : "Clean-ArchitectureStandard",
            ],
        };
    },
};

/**
 * SOVEREIGN CUSTOMIZATION ENGINE
 *
 * The core transformation logic that merges user intent with architectural blueprints.
 * Follows the principle of "Algebraic Transformation" (Template + Logic = Unique Platform).
 */
export const CustomizerEngine = {
    /**
     * Generates a final, personalized blueprint by either mutating a base template
     * or calling the Generative AI engine.
     */
    async generateFinalBlueprint(userData: UserPromptData): Promise<SiteBlueprint> {
        const locale =
            typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en";

        // Logic: Try AI generation first for "Legendary" output
        try {
            const response = await fetch(`/${locale}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...userData, locale }),
            });

            if (response.ok) {
                const aiBlueprint = await response.json();
                console.log("ENGINE_EVOLUTION: Generative AI Blueprint Synthesized.");
                return aiBlueprint;
            }
            console.warn(
                "ENGINE_FALLBACK: AI Generation failed, falling back to heuristic customization.",
            );
        } catch (e) {
            console.error("ENGINE_RECOVERY: AI Error, using heuristic fallback.", e);
        }

        const template = this.findTemplate(userData.selectedId);
        if (!template) {
            console.error(
                `ENGINE_CRITICAL_FAILURE: Template ID '${userData.selectedId}' not found.`,
            );
            throw new Error(`CRITICAL_ERROR: Template_ID_Not_Found: ${userData.selectedId}`);
        }

        // 1. EXECUTE HEURISTIC SYNTHESIS
        const specializedContent = HeuristicSovereignGenerator.synthesize(
            userData,
            locale,
        ) as SpecializedContent;

        // 2. Deep Architectural Merge (Logic-First)
        const baseLayout = [...template.blueprint.layout];

        // LOGIC: Inject specialized sections if requested by the heuristic
        if (specializedContent.injectionSection) {
            // Find insertion point (usually after hero)
            const heroIndex = baseLayout.findIndex(
                (s) => s.type === "hero" || s.type === "HERO_PRIME",
            );
            const newSection: Section = {
                id: `inject_${Date.now()}`,
                animation: "fade-in" as const,
                styles: {},
                ...specializedContent.injectionSection,
            };
            baseLayout.splice(heroIndex + 1, 0, newSection);
        }

        const finalBlueprint: SiteBlueprint = {
            ...template.blueprint, // Base DNA
            id: `site_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: userData.businessName,
            description: userData.vision,
            ai_insight: `Focus on ${userData.niche.toLowerCase()} trends and local visibility for ${userData.businessName}. Synthetic heuristic applied. [LOCALE: ${locale}]`,
            theme: {
                ...template.blueprint.theme,
                primary: template.blueprint.theme.primary,
                secondary: template.blueprint.theme.secondary || "#1e293b",
            },
            layout:
                baseLayout.length < 5
                    ? buildRichFallbackLayout(userData, locale)
                    : baseLayout.map((section) => ({
                          ...section,
                          content: {
                              ...section.content,
                              headline:
                                  section.type === "hero" || section.type === "HERO_PRIME"
                                      ? specializedContent.headline
                                      : section.content.headline,
                              subheadline:
                                  section.type === "hero" || section.type === "HERO_PRIME"
                                      ? specializedContent.subheadline
                                      : section.content.subheadline,
                              features:
                                  section.type === "features" || section.type === "FEATURE_GRID"
                                      ? specializedContent.features
                                      : section.content.features,
                          },
                      })),
            navigation: {
                ...template.blueprint.navigation,
                logo: userData.businessName,
                links: [
                    { label: locale === "ar" ? "الرئيسية" : "Home", href: "#home" },
                    { label: locale === "ar" ? "الخدمات" : "Services", href: "#services" },
                    { label: locale === "ar" ? "الأسعار" : "Pricing", href: "#pricing" },
                    { label: locale === "ar" ? "تواصل" : "Contact", href: "#contact" },
                ],
            },
            footer: {
                ...template.blueprint.footer,
                copyright: `© ${new Date().getFullYear()} ${userData.businessName}. All rights reserved.`,
                links: [
                    { label: locale === "ar" ? "الخصوصية" : "Privacy", href: "/privacy" },
                    { label: locale === "ar" ? "الشروط" : "Terms", href: "/terms" },
                ],
            },
            metadata: {
                ...template.blueprint.metadata,
                generated_at: new Date().toISOString(),
                engine_version: "Sovereign-v1.4-Heuristic-Synthesis",
                niche: userData.niche,
                seo: {
                    title: `${userData.businessName} | Optimal ${userData.niche}`,
                    description:
                        userData.vision.substring(0, 160) ||
                        `World-class ${userData.niche} services by ${userData.businessName}.`,
                    keywords: [userData.niche, "sovereign", "intelligence"],
                },
            },
            economic_impact: template.blueprint.economic_impact || {
                estimated_savings: "$2.4M",
                valuation: 3200000,
                logic_verified: true,
            },
            whiteLabel: template.blueprint.whiteLabel || false,
            timestamp: new Date().toISOString(),
        };

        return applyPersonaMicrocopy(finalBlueprint, userData, locale);
    },

    findTemplate(id: string): TemplateTheme | null {
        for (const cat of SITE_TEMPLATES.categories) {
            const found = cat.themes.find((t) => t.id === id);
            if (found) return found;
        }
        return null;
    },
};
