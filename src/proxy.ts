import { updateSession } from "./lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";
import { SentryService } from './lib/services/sentry-service';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    return proxy(request);
}

export async function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";
    const pathname = url.pathname;

    console.log(`[SOVEREIGN_PROXY] Request: ${hostname}${pathname}`);

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
        'getyousite-platform-final-p8dr.vercel.app'
    ];

    // Logic: If it contains 'vercel.app' and doesn't match a custom domain protocol, 
    // it's treated as main platform infrastructure.
    const isMainDomain = mainDomains.some(d => hostname === d || hostname.endsWith(`.${d}`)) ||
        hostname.includes('vercel.app') ||
        hostname.includes('vercel') ||
        hostname === 'getyousite-platform-final-p8dr-getyousites-projects.vercel.app';

    const isRoot = isMainDomain;

    // Keep Supabase callback route non-localized.
    if (pathname.startsWith('/auth/callback') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // 2. TENANT NODE ROUTING (Mission 2.1)
    if (!isRoot) {
        const path = pathname;
        const isSeoAsset = path.endsWith('/sitemap.xml') || path.endsWith('/robots.txt');

        if ((path.startsWith('/_next') || (path.includes('.') && !isSeoAsset))) {
            return NextResponse.next();
        }

        const localeMatch = path.match(/^\/(en|ar|fr|es|de|it|ru)(\/|$)/);
        const locale = localeMatch ? localeMatch[1] : 'ar';
        const cleanPath = localeMatch ? path.replace(/^\/(en|ar|fr|es|de|it|ru)/, '') : path;

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
    // If it's a main domain, use the intlMiddleware
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
