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
        value.includes("\u0631\u064a\u0627\u0636") ||
        value.includes("\u0631\u064a\u0627\u0636\u0629")
    ) {
        return "fitness";
    }
    if (
        value.includes("restaurant") ||
        value.includes("cafe") ||
        value.includes("\u0645\u0637\u0639\u0645")
    ) {
        return "restaurant";
    }
    if (
        value.includes("clinic") ||
        value.includes("medical") ||
        value.includes("\u0639\u064a\u0627\u062f\u0629")
    ) {
        return "medical";
    }
    return "general";
}

function mapThemeByNiche(niche: string) {
    const value = niche.toLowerCase();
    if (value.includes("finance") || value.includes("legal") || value.includes("law")) {
        return {
            primary: "#1E3A8A",
            secondary: "#1F2937",
            backgroundColor: "#0B1220",
            textColor: "#F8FAFC",
        };
    }
    if (value.includes("restaurant") || value.includes("food") || value.includes("cafe")) {
        return {
            primary: "#EA580C",
            secondary: "#F59E0B",
            backgroundColor: "#0F0A05",
            textColor: "#FFF7ED",
        };
    }
    if (value.includes("tech") || value.includes("ai") || value.includes("software")) {
        return {
            primary: "#7C3AED",
            secondary: "#09090B",
            backgroundColor: "#050509",
            textColor: "#E4E4E7",
        };
    }
    return {
        primary: "#3b82f6",
        secondary: "#1e293b",
        backgroundColor: "#0b1227",
        textColor: "#e5e7eb",
    };
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

    const profiles = {
        fitness: {
            hero: `${userData.businessName} - High-Performance Fitness Hub`,
            services: [
                {
                    title: "Flexible Monthly Membership",
                    description: "Full access to gym and cardio with clear membership plans.",
                },
                {
                    title: "Personal Coaching",
                    description: "1:1 coaching tailored to your transformation goal.",
                },
                {
                    title: "Nutrition Guidance",
                    description: "Actionable meal guidance for steady progress.",
                },
            ],
            gallery: [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
            ],
        },
        restaurant: {
            hero: `${userData.businessName} - A Dining Experience Worth Repeating`,
            services: [
                {
                    title: "Seasonal Menu",
                    description: "Fresh seasonal dishes with consistent premium quality.",
                },
                {
                    title: "Smart Reservations",
                    description: "Fast booking flow designed to reduce wait time.",
                },
                {
                    title: "Private Events",
                    description: "Host private events with complete hospitality support.",
                },
            ],
            gallery: [
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80",
            ],
        },
        medical: {
            hero: `${userData.businessName} - Precision Care, Trusted Results`,
            services: [
                {
                    title: "Specialized Consultations",
                    description: "Expert consultations with a clear treatment plan.",
                },
                {
                    title: "Fast Appointment Booking",
                    description: "Direct booking with instant appointment confirmation.",
                },
                {
                    title: "Post-Visit Follow-Up",
                    description: "Structured follow-up to ensure stable outcomes.",
                },
            ],
            gallery: [
                "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1631217868264-e6b90bb7e133?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
            ],
        },
        general: {
            hero: `${userData.businessName} - Practical Solutions For Faster Growth`,
            services: [
                {
                    title: "Professional Service",
                    description: "Tailored solutions focused on business outcomes.",
                },
                {
                    title: "Fast Execution",
                    description: "Rapid implementation with production quality.",
                },
                {
                    title: "Continuous Support",
                    description: "Operational support and continuous optimization.",
                },
            ],
            gallery: [
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
            ],
        },
    } as const;

    const profile = profiles[type] || profiles.general;

    return [
        {
            id: `hero_${Date.now()}`,
            type: "hero",
            animation: "fade-in",
            styles: {},
            content: {
                headline: profile.hero,
                subheadline:
                    userData.vision ||
                    `Professional ${userData.niche} solutions with a clear conversion-focused journey.`,
                cta: isAr ? "Start Now" : "Get Started",
                image: heroImageByType[type],
                anchor: "home",
            },
        },
        {
            id: `features_${Date.now()}`,
            type: "FEATURE_GRID",
            animation: "fade-in",
            styles: {},
            content: {
                title: "What You Get",
                items: profile.services,
                anchor: "services",
            },
        },
        {
            id: `services_${Date.now()}`,
            type: "services",
            animation: "fade-in",
            styles: {},
            content: {
                items: profile.services.map((item, index) => ({
                    name: item.title,
                    price: type === "fitness" ? `$${29 + index * 20}` : `From $${49 + index * 30}`,
                    description: item.description,
                })),
                anchor: "services",
            },
        },
        {
            id: `gallery_${Date.now()}`,
            type: "gallery",
            animation: "fade-in",
            styles: {},
            content: {
                images: profile.gallery,
                anchor: "gallery",
            },
        },
        {
            id: `testimonials_${Date.now()}`,
            type: "testimonials",
            animation: "fade-in",
            styles: {},
            content: {
                title: "Client Reviews",
                reviews: [
                    {
                        name: "Alex B.",
                        role: "Real Client",
                        text: "Professional experience with fast, measurable results.",
                    },
                    {
                        name: "Sarah M.",
                        role: "Business Owner",
                        text: "The site is clear and converts visitors into customers.",
                    },
                    {
                        name: "Youssef A.",
                        role: "Operations Lead",
                        text: "Structured design with direct conversion-focused messaging.",
                    },
                ],
                anchor: "testimonials",
            },
        },
        {
            id: `faq_${Date.now()}`,
            type: "faq",
            animation: "fade-in",
            styles: {},
            content: {
                title: "Frequently Asked Questions",
                items: [
                    {
                        q: "How fast can we start?",
                        a: "You can start immediately with same-day onboarding.",
                    },
                    {
                        q: "Do you offer clear plans?",
                        a: "Yes, plans are structured by your growth stage.",
                    },
                ],
                anchor: "faq",
            },
        },
        {
            id: `contact_${Date.now()}`,
            type: "contact",
            animation: "fade-in",
            styles: {},
            content: {
                title: "Contact Us",
                description: "Send your details and we will reach out within 24 hours.",
                phone: "+212 600 000 000",
                email: "hello@getyousite.com",
                address: "Casablanca, Morocco",
                anchor: "contact",
            },
        },
        {
            id: `cta_${Date.now()}`,
            type: "cta",
            animation: "fade-in",
            styles: {},
            content: {
                headline: "Ready To Launch?",
                subheadline: "Build a credible digital presence and start converting today.",
                anchor: "pricing",
            },
        },
    ];
} // CLINICAL HEURISTIC SYNTHESIS
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
        const mappedTheme = mapThemeByNiche(userData.niche);

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
                primary: mappedTheme.primary,
                secondary: mappedTheme.secondary,
                backgroundColor: mappedTheme.backgroundColor,
                textColor: mappedTheme.textColor,
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
