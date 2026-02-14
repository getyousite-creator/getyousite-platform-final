import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware for locale handling
    const handleI18n = createMiddleware(routing);
    const response = handleI18n(request);

    // 2. Run Supabase middleware for session management
    // Pass the i18n response to ensure cookies are set on the correct response
    return await updateSession(request, response);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
