import { updateSession } from './lib/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";

    // MISSION 6.3: SHIELD PROTOCOL (WAF LITE)
    // Logic: Block suspicious high-frequency requests to rendered sites.
    // In production, this would use Redis/Upstash for global coordination.
    const isBot = request.headers.get("user-agent")?.toLowerCase().includes("bot");
    if (isBot && !hostname.includes("localhost")) {
        console.warn(`[SHIELD_TRIGGER] Blocked bot request from ${request.ip} to ${hostname}`);
        return new NextResponse("Access Denied: Shield Protocol Active.", { status: 403 });
    }

    // 1. Detect Subdomain or Custom Domain
    // Logic: If hostname is not the main app domain and not localhost (or configured), 
    // we find the siteId associated with this hostname/subdomain.
    const isMainApp = hostname.includes("getyousite.main.app") || hostname.includes("localhost:3000");

    if (!isMainApp) {
        const subdomain = hostname.split('.')[0];
        // Note: For absolute rigor, we would fetch the siteId from Supabase here,
        // but since middleware must be edge-fast, we'll use a rewrite pattern 
        // that the renderer uses to fetch data.

        // Rewrite to /[locale]/_site-renderer/[hostname]
        url.pathname = `/_site-renderer/${hostname}`;
        return NextResponse.rewrite(url);
    }

    // 2. Update session / Refresh token
    const supabaseResponse = await updateSession(request);

    if (supabaseResponse.status >= 300 && supabaseResponse.status < 400) {
        return supabaseResponse;
    }

    // 3. Handle Localization
    const response = intlMiddleware(request);

    // 4. Merge cookies
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
