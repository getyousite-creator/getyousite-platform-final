import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getyousite.com';

    // Generate entries for each locale (Synced with routing.ts)
    const locales = ['en', 'fr', 'es', 'ar'];

    return locales.map((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
