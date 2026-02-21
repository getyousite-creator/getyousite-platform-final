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
    const baseUrl = locale === "en" ? "https://getyousite.com" : `https://getyousite.com/${locale}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isRTL ? "GetYouSite" : "GetYouSite",
        alternateName: isRTL ? "جيت يو سايت" : "Get You Site",
        url: baseUrl,
        description: isRTL
            ? "أول منصة في العالم تبني موقعك بالذكاء الاصطناعي في ثوانٍ"
            : "World's first AI-powered website builder that creates your site in seconds",
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
                  "بناء مواقع بالذكاء الاصطناعي",
                  "تصاميم فريدة",
                  "نشر فوري",
                  "تعديلات غير محدودة",
              ]
            : [
                  "AI-powered website building",
                  "Unique designs",
                  "Instant deployment",
                  "Unlimited revisions",
              ],
        screenshot: `${baseUrl}/og-image.png`,
        downloadUrl: `${baseUrl}/signup`,
        author: {
            "@type": "Organization",
            name: "GetYouSite",
            url: baseUrl,
        },
        keywords: isRTL
            ? [
                  "بناء مواقع",
                  "ذكاء اصطناعي",
                  "بدون برمجة",
                  "مواقع جاهزة",
              ]
            : [
                  "website builder",
                  "AI website",
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
