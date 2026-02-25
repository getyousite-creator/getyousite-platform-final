/**
 * JSON-LD Structured Data Component
 * 
 * Generates structured data for SEO Rich Snippets
 */

interface JSONLDProps {
    locale: string;
}

export function JSONLD({ locale }: JSONLDProps) {
    const isRTL = locale === "ar";
    const baseUrl = locale === "en" ? "https://gysglobal.com" : `https://gysglobal.com/${locale}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "GYS Global",
        alternateName: isRTL ? "جي واي إس جلوبال" : "GYS Global",
        url: baseUrl,
        description: isRTL
            ? "المنصة العالمية الرائدة لهندسة وتوليف الأصول الرقمية السيادية."
            : "The leading global platform for engineering and synthesizing sovereign digital assets.",
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "1247",
            bestRating: "5",
            worstRating: "1",
        },
        featureList: isRTL
            ? [
                "هندسة معمارية سيادية",
                "تصاميم فريدة",
                "نشر فوري",
                "تعديلات غير محدودة",
            ]
            : [
                "Sovereign Synthesis Protocol",
                "Unique designs",
                "Instant deployment",
                "Unlimited revisions",
            ],
        screenshot: `${baseUrl}/og-image.png`,
        downloadUrl: `${baseUrl}/signup`,
        author: {
            "@type": "Organization",
            name: "GYS Global",
            url: baseUrl,
        },
        keywords: isRTL
            ? [
                "بناء مواقع",
                "التوليف السيادي",
                "بدون برمجة",
                "مواقع جاهزة",
            ]
            : [
                "website construction",
                "Sovereign Synthesis",
                "no-code",
                "website creation",
            ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
