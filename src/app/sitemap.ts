import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://getyousite.com';
    const locales = ['en', 'fr', 'es', 'ar'];
    const publicRoutes = [
        '',
        '/about',
        '/blog',
        '/contact',
        '/help',
        '/pricing',
        '/privacy',
        '/services',
        '/showcase',
        '/templates',
        '/terms',
        '/login',
        '/signup',
    ];

    return locales.flatMap((locale) =>
        publicRoutes.map((route) => ({
            url: `${baseUrl}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' ? 'daily' : 'weekly',
            priority: route === '' ? 1 : 0.8,
        }))
    );
}
