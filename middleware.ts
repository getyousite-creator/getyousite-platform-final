import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';

    // LOGIC: Identify Sovereign Tenants
    // Standard domains that should NOT be rewritten to the renderer
    const mainDomains = [
        'getyousite.com',
        'www.getyousite.com',
        'getyousite-platform.vercel.app',
        'localhost:3000'
    ];

    const isMainDomain = mainDomains.some(d => hostname.includes(d));

    // MISSION 11.2: Tenant Domain Rewriting
    if (!isMainDomain && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
        // We rewrite to the internal renderer. 
        // Locale is handled subsequently by next-intl or is defaulted.
        url.pathname = `/_site-renderer/${hostname}${url.pathname === '/' ? '' : url.pathname}`;
        // Note: next-intl will still wrap this if we're not careful.
        // But for absolute rigor, we want the site renderer to be reachable.
    }

    // 1. Run next-intl middleware for locale handling
    const handleI18n = createMiddleware(routing);
    const response = handleI18n(request);

    // 2. Run Supabase middleware for session management
    return await updateSession(request, response);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
