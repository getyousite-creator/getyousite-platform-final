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
    title = "GetYouSite - AI-Powered Website Builder",
    description = "Create professional websites in minutes with our AI-powered website builder. No coding required. Fast, affordable, and stunning results.",
    keywords = ["website builder", "AI website", "create website", "drag and drop website", "professional web design"],
    image = "https://getyousite.com/images/og-default.jpg",
    url = "https://getyousite.com",
    type = "website",
    publishedTime,
    modifiedTime,
    author = "GetYouSite Team",
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
        publisher: "GetYouSite",
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
            siteName: "GetYouSite",
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
            creator: "@getyousite",
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
        name: 'GetYouSite',
        url: 'https://getyousite.com',
        logo: 'https://getyousite.com/logo.png',
        sameAs: [
            'https://facebook.com/getyousite',
            'https://twitter.com/getyousite',
            'https://instagram.com/getyousite',
            'https://linkedin.com/company/getyousite',
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
