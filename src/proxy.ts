import { updateSession } from "./lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";
import { SentryService } from './lib/services/sentry-service';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";
    const pathname = url.pathname;

    // 0. SOVEREIGN SENTRY (DEFENSE PROTOCOL SPD-1)
    // Logic: Identify and neutralize non-human or malicious resonance.
    const { blocked, reason } = await SentryService.analyzeIntegrity(request);

    if (blocked) {
        return new NextResponse(JSON.stringify({ error: "Sovereign Access Denied", reason }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 1. SOVEREIGN DOMAIN RESOLUTION
    const mainDomains = [
        'getyousite.com',
        'localhost:3000',
        'getyousite-platform.vercel.app',
        'getyousite.vercel.app'
    ];
    const isMainDomain = mainDomains.some(d => hostname === d || hostname.endsWith(`.${d}`));
    const isRoot = mainDomains.includes(hostname);

    // Keep Supabase callback route non-localized. It must stay at /auth/callback.
    if (pathname.startsWith('/auth/callback')) {
        return NextResponse.next();
    }

    // 2. TENANT NODE ROUTING (Mission 2.1)
    if (!isRoot && !isMainDomain) {
        const path = pathname;
        const isSeoAsset = path.endsWith('/sitemap.xml') || path.endsWith('/robots.txt');

        if ((path.startsWith('/_next') || path.startsWith('/api') || (path.includes('.') && !isSeoAsset))) {
            return NextResponse.next();
        }

        const localeMatch = path.match(/^\/(en|ar|fr|es)(\/|$)/);
        const locale = localeMatch ? localeMatch[1] : 'ar';
        const cleanPath = localeMatch ? path.replace(/^\/(en|ar|fr|es)/, '') : path;

        if (isSeoAsset) {
            return NextResponse.rewrite(new URL(`/_internal-seo/${hostname}${cleanPath}`, request.url));
        }

        return NextResponse.rewrite(new URL(`/${locale}/_site-renderer/${hostname}${cleanPath}`, request.url));
    }

    // 3. AUTH & SESSION RECOVERY
    const supabaseResponse = await updateSession(request);
    if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
        return supabaseResponse;
    }

    // 4. INTERNATIONALIZATION (Main Platform)
    const response = intlMiddleware(request);

    // 5. COOKIE SYNCHRONIZATION
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, cookie);
    });

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+(?<!sitemap\\.xml|robots\\.txt)).*)']
};
