import { updateSession } from './lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // 1. Update session / Refresh token
    const supabaseResponse = await updateSession(request);

    // LOGIC GUARD: If Supabase middleware returned a redirect (e.g. auth required), return it immediately.
    // This prevents MIDDLEWARE_INVOCATION_FAILED caused by conflicting response headers.
    if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
        return supabaseResponse;
    }

    // 2. Handle Localization
    const response = intlMiddleware(request);

    // 3. Merge cookies from Supabase response to the final response
    // Logic: Ensure the refreshed session persists even after intl middleware
    supabaseResponse.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, cookie);
    });

    return response;
}

export const config = {
    matcher: [
        '/',
        '/(fr|en|es|ar)/:path*',
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
};
