import { SiteBlueprint } from "@/lib/schemas";

type PersonaType =
    | "medical"
    | "legal"
    | "hospitality"
    | "retail"
    | "creator"
    | "corporate"
    | "default";

interface PersonaInput {
    niche?: string;
    vision?: string;
    businessName?: string;
}

interface PersonaCopy {
    primaryCta: string;
    secondaryCta: string;
    contactSubmit: string;
    leadHint: string;
}

function detectPersona(input: PersonaInput): PersonaType {
    const signal =
        `${input.niche || ""} ${input.vision || ""} ${input.businessName || ""}`.toLowerCase();

    if (/(medical|clinic|dental|doctor|health|عيادة|طبيب|صحة)/.test(signal)) return "medical";
    if (/(law|legal|attorney|محام|قانون)/.test(signal)) return "legal";
    if (/(restaurant|cafe|food|مطعم|مقهى)/.test(signal)) return "hospitality";
    if (/(store|shop|retail|ecommerce|متجر|تجارة)/.test(signal)) return "retail";
    if (/(portfolio|creator|artist|influencer|مؤثر|مبدع)/.test(signal)) return "creator";
    if (/(agency|consult|saas|enterprise|شركة|استشارات)/.test(signal)) return "corporate";

    return "default";
}

function getPersonaCopy(persona: PersonaType, locale: string): PersonaCopy {
    const isArabic = locale === "ar";

    if (persona === "medical") {
        return isArabic
            ? {
                  primaryCta: "احجز موعدك الآن",
                  secondaryCta: "اكتشف خدماتنا العلاجية",
                  contactSubmit: "أرسل طلب الاستشارة الطبية",
                  leadHint: "اكتب الأعراض أو هدف الزيارة لنخدمك بدقة",
              }
            : {
                  primaryCta: "Book Your Appointment",
                  secondaryCta: "Explore Medical Services",
                  contactSubmit: "Send Medical Consultation Request",
                  leadHint: "Share symptoms or your visit goal for precise care",
              };
    }

    if (persona === "legal") {
        return isArabic
            ? {
                  primaryCta: "احجز استشارة قانونية",
                  secondaryCta: "اطلع على مجالات الخبرة",
                  contactSubmit: "أرسل ملفك القانوني",
                  leadHint: "اكتب باختصار موضوع القضية أو الاستشارة",
              }
            : {
                  primaryCta: "Book Legal Consultation",
                  secondaryCta: "View Practice Areas",
                  contactSubmit: "Submit Your Legal Case",
                  leadHint: "Describe your legal matter in a few lines",
              };
    }

    if (persona === "hospitality") {
        return isArabic
            ? {
                  primaryCta: "احجز طاولتك الملكية",
                  secondaryCta: "شاهد قائمة الأطباق",
                  contactSubmit: "أرسل طلب الحجز",
                  leadHint: "حدد عدد الضيوف ووقت الحجز المفضل",
              }
            : {
                  primaryCta: "Reserve Your Table",
                  secondaryCta: "View Menu Highlights",
                  contactSubmit: "Send Reservation Request",
                  leadHint: "Tell us guest count and preferred time",
              };
    }

    if (persona === "retail") {
        return isArabic
            ? {
                  primaryCta: "ابدأ التسوق الآن",
                  secondaryCta: "اكتشف العروض الحصرية",
                  contactSubmit: "أرسل طلبك وسنتواصل فورًا",
                  leadHint: "اكتب المنتج الذي تبحث عنه أو استفسارك",
              }
            : {
                  primaryCta: "Start Shopping Now",
                  secondaryCta: "Discover Exclusive Offers",
                  contactSubmit: "Send Order Inquiry",
                  leadHint: "Tell us the product you need",
              };
    }

    if (persona === "creator") {
        return isArabic
            ? {
                  primaryCta: "ابدأ مشروعك الإبداعي",
                  secondaryCta: "استعرض آخر الأعمال",
                  contactSubmit: "لنبدأ التعاون الإبداعي",
                  leadHint: "اكتب فكرتك وسنحوّلها لهوية مميزة",
              }
            : {
                  primaryCta: "Start Your Creative Project",
                  secondaryCta: "Browse Latest Work",
                  contactSubmit: "Let's Collaborate",
                  leadHint: "Share your idea and desired style",
              };
    }

    if (persona === "corporate") {
        return isArabic
            ? {
                  primaryCta: "ابدأ التحول الرقمي",
                  secondaryCta: "اطلب عرضًا مخصصًا",
                  contactSubmit: "أرسل طلب الشراكة",
                  leadHint: "اذكر هدف النمو أو التحدي الرئيسي لديك",
              }
            : {
                  primaryCta: "Start Digital Transformation",
                  secondaryCta: "Request Custom Proposal",
                  contactSubmit: "Send Partnership Request",
                  leadHint: "Share your main growth objective",
              };
    }

    return isArabic
        ? {
              primaryCta: "ابدأ الآن",
              secondaryCta: "تعرّف أكثر",
              contactSubmit: "أرسل رسالتك",
              leadHint: "اكتب تفاصيل طلبك وسنعود إليك سريعًا",
          }
        : {
              primaryCta: "Get Started",
              secondaryCta: "Learn More",
              contactSubmit: "Send Your Message",
              leadHint: "Share your request and we will get back quickly",
          };
}

function shouldOverride(existingValue: unknown): boolean {
    const value = String(existingValue || "")
        .trim()
        .toLowerCase();
    if (!value) return true;
    return /(click here|get started|learn more|contact us|send|ابدأ|تواصل|اضغط)/.test(value);
}

export function applyPersonaMicrocopy(
    blueprint: SiteBlueprint,
    input: PersonaInput,
    locale: string,
): SiteBlueprint {
    const persona = detectPersona(input);
    const copy = getPersonaCopy(persona, locale);

    const nextLayout = blueprint.layout.map((section) => {
        const content = { ...(section.content || {}) };

        if (section.type === "hero" || section.type === "HERO_PRIME") {
            if (shouldOverride(content.ctaText)) content.ctaText = copy.primaryCta;
            if (shouldOverride(content.primaryCta)) content.primaryCta = copy.primaryCta;
            if (shouldOverride(content.secondaryCta)) content.secondaryCta = copy.secondaryCta;
            if (shouldOverride(content.buttonText)) content.buttonText = copy.primaryCta;
        }

        if (
            section.type === "contact" ||
            section.type === "SMART_FORM" ||
            section.type === "APPOINTMENT_WIDGET" ||
            section.type === "contact_map"
        ) {
            if (shouldOverride(content.submitLabel)) content.submitLabel = copy.contactSubmit;
            if (shouldOverride(content.messagePlaceholder))
                content.messagePlaceholder = copy.leadHint;
            if (shouldOverride(content.ctaText)) content.ctaText = copy.contactSubmit;
        }

        return {
            ...section,
            content,
        };
    });

    return {
        ...blueprint,
        layout: nextLayout,
        metadata: {
            ...(blueprint.metadata || {}),
            persona,
            microcopy: copy,
        },
    };
}
