import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://getyousite.platform'; // Production URL placeholder

    // Generate entries for each locale
    const locales = ['en', 'fr', 'es'];

    return locales.map((locale) => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
