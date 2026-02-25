import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInternalAdmin } from '../config/identity';

export async function updateSession(request: NextRequest, response?: NextResponse) {
    let supabaseResponse = response || NextResponse.next({
        request,
    })

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

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname;
    const isAdminPath = pathname.startsWith('/admin') || pathname.includes('/admin/');

    // Clinical Locale Extraction
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'en';

    if (isAdminPath) {
        if (!user || !isInternalAdmin(user.email)) {
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/404`;
            return NextResponse.redirect(url);
        }
    }

    // Protocol Boundaries: Protected Routes
    const protectedSegments = ['/customizer', '/success', '/dashboard', '/settings'];
    const isProtectedRoute = protectedSegments.some(segment => pathname.includes(segment));

    const authSegments = ['/login', '/signup', '/forgot-password', '/auth', '/reset-password'];
    const isAuthRoute = authSegments.some(segment => pathname.includes(segment));

    if (!user && isProtectedRoute && !isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/login`
        url.search = request.nextUrl.search;
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
