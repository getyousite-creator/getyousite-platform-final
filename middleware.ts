import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

const PLATFORM_DOMAINS = new Set([
    'gysglobal.com',
    'www.gysglobal.com',
    'getyousite.com',
    'www.getyousite.com',
    'getyousite-platform.vercel.app',
    'localhost:3000',
    'localhost:3001'
]);

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // Logic: Sovereign Domain Determination
    const isMainDomain = PLATFORM_DOMAINS.has(hostname);

    // Mission 11.2: Tenant Domain Rewriting (Bypassing static assets and APIs)
    const isCoreRequest = url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/_next') ||
        url.pathname.startsWith('/_vercel') ||
        url.pathname.includes('.');

    if (!isMainDomain && !isCoreRequest) {
        url.pathname = `/_site-renderer/${hostname}${url.pathname === '/' ? '' : url.pathname}`;
    }

    // 1. Unified Localization Engine
    const handleI18n = createMiddleware(routing);
    const response = handleI18n(request);

    // 2. Sovereign Session Management
    return await updateSession(request, response);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
