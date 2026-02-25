/**
 * SEO Head Component
 * 
 * Comprehensive SEO meta tags generation for all pages.
 * Supports Open Graph, Twitter Cards, and structured data.
 */

import { Metadata } from 'next';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
    locale?: string;
    noindex?: boolean;
    nofollow?: boolean;
}

export function generateSEO({
    title = "GYS Global - Sovereign Engineering Architecture",
    description = "Deploy mission-critical digital infrastructure with GYS Global. High-performance, low-latency, and sovereign architectural systems for the modern enterprise.",
    keywords = ["sovereign engineering", "digital infrastructure", "enterprise architecture", "high-performance web", "GYS Global"],
    image = "https://gysglobal.com/images/og-default.jpg",
    url = "https://gysglobal.com",
    type = "website",
    publishedTime,
    modifiedTime,
    author = "GYS Engineering Division",
    section,
    locale = "en",
    noindex = false,
    nofollow = false,
}: SEOProps): Metadata {
    const robotsDirective = [
        noindex ? 'noindex' : 'index',
        nofollow ? 'nofollow' : 'follow',
    ].join(', ');

    return {
        metadataBase: new URL(url),
        title: {
            default: title,
            template: `%s | ${title}`,
        },
        description,
        keywords: keywords.join(', '),
        authors: [{ name: author }],
        creator: author,
        publisher: "GYS Global",
        robots: {
            index: !noindex,
            follow: !nofollow,
        },
        openGraph: {
            type,
            locale,
            url,
            title,
            description,
            siteName: "GYS Global",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && { authors: [author] }),
            ...(section && { section }),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@gysglobal",
        },
        alternates: {
            canonical: url,
        },
    };
}

/**
 * Generate JSON-LD Structured Data for Organization
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GYS Global',
        url: 'https://gysglobal.com',
        logo: 'https://gysglobal.com/logo.png',
        sameAs: [
            'https://facebook.com/gysglobal',
            'https://twitter.com/gysglobal',
            'https://instagram.com/gysglobal',
            'https://linkedin.com/company/gysglobal',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+212-5XX-XXXXXX',
            contactType: 'customer service',
            availableLanguage: ['English', 'Arabic', 'French', 'Spanish'],
        },
    };
}

/**
 * Generate JSON-LD Structured Data for Breadcrumb
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/**
 * Generate JSON-LD Structured Data for WebSite with Search
 */
export function generateWebsiteSchema(name: string, url: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        url,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${url}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}
