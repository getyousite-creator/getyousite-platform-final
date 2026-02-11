import { updateSession } from "./lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get("host") || "";

    // MISSION 6.3: SHIELD PROTOCOL (SEO-Aware WAF)
    // Logic: Allow legitimate search engines and social crawlers, block malicious bots.
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";

    // Whitelist: Legitimate crawlers for SEO and social sharing
    const legitimateBots = [
        "googlebot",
        "bingbot",
        "slackbot",
        "twitterbot",
        "facebookexternalhit",
        "linkedinbot",
        "whatsapp",
        "telegrambot",
        "discordbot",
        "slurp", // Yahoo
        "duckduckbot",
        "baiduspider",
        "yandexbot",
        "applebot",
    ];

    const isLegitimateBot = legitimateBots.some((bot) => userAgent.includes(bot));
    const isSuspiciousBot = userAgent.includes("bot") && !isLegitimateBot;

    if (isSuspiciousBot && !hostname.includes("localhost")) {
        console.warn(`[SHIELD_TRIGGER] Blocked suspicious bot: ${userAgent.substring(0, 100)}`);
        return new NextResponse("Access Denied: Shield Protocol Active.", { status: 403 });
    }

    // 1. Detect Subdomain or Custom Domain
    // Logic: If hostname is not the main app domain and not localhost (or configured),
    // we find the siteId associated with this hostname/subdomain.
    // SOVEREIGN FIX: Expanded allowed domains to prevent false positive redirects on Vercel/Production.
    const allowedDomains = [
        "localhost:3000",
        "getyousite.main.app",
        "vercel.app",
        "getyuosite.com",
        "getyousite.com",
        "www.getyuosite.com",
        "www.getyousite.com",
    ];
    const isMainApp = allowedDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    if (!isMainApp && !hostname.startsWith("localhost:")) {
        // MISSION: Instant Subdomain Deployment
        const siteSlug = hostname.split(".")[0];
        url.pathname = `/ar/_site-renderer/${siteSlug}`;
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
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, cookie);
    });

    return response;
}

export const config = {
    matcher: [
        "/",
        "/(fr|en|es|ar)/:path*",
        "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
