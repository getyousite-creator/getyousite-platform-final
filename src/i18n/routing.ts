import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'fr', 'es', 'ar', 'de', 'it', 'ru'],
    defaultLocale: 'en',
    localeDetection: true
});

// Lightweight wrappers around Next.js' navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
