import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response?: NextResponse) {
    let supabaseResponse = response || NextResponse.next({
        request,
    })

    // EDGE GUARD: Ensure environment variables exist to prevent runtime crash
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("MIDDLEWARE_CRITICAL: Missing Supabase Environment Variables.");
        return supabaseResponse;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

                    // If we have a passed response, updates cookies on it
                    supabaseResponse = response || NextResponse.next({
                        request,
                    })

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser().
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const AUTHORIZED_EMAIL = "u110877386@getyousite.com";
    const isAdminPath = request.nextUrl.pathname.includes('/admin');

    // Helper to get locale from path
    const getLocale = () => {
        const match = request.nextUrl.pathname.match(/^\/([a-z]{2})\//);
        return match ? match[1] : 'en'; // Default to 'en' or use logic to detect
    };
    const locale = getLocale();

    if (isAdminPath) {
        if (!user || user.email !== AUTHORIZED_EMAIL) {
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/404`;
            return NextResponse.redirect(url);
        }
    }

    // Protected Routes Logic
    const isProtectedRoute = (
        request.nextUrl.pathname.includes('/customizer') ||
        request.nextUrl.pathname.includes('/success') ||
        request.nextUrl.pathname.includes('/dashboard')
    );

    const isAuthRoute = (
        request.nextUrl.pathname.includes('/login') ||
        request.nextUrl.pathname.includes('/signup') ||
        request.nextUrl.pathname.includes('/forgot-password') ||
        request.nextUrl.pathname.includes('/auth') ||
        request.nextUrl.pathname.includes('/reset-password')
    );

    if (!user && isProtectedRoute && !isAuthRoute) {
        // no user, redirect to login with locale
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/login`
        // Preserve query params (like return address)
        url.search = request.nextUrl.search;
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
