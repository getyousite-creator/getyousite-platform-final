import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL
    // Default to /dashboard if not provided, to ensure user lands in the app
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            // Logic: Detect locale from the 'next' parameter or default to 'en'
            let redirectPath = next;

            // If next doesn't start with a locale, prepend default locale
            const locales = ['en', 'ar', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh'];
            const hasLocale = locales.some(loc => next.startsWith(`/${loc}/`));

            if (!hasLocale && !next.startsWith('/auth')) {
                redirectPath = `/en${next}`;
            }

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            }
        } else {
            console.error('[AUTH-CALLBACK] Error exchanging code for session:', error.message)
        }
    }

    // If we reach here, it means there was an error with the code exchange or no code was provided
    const loginUrl = new URL(`${origin}/login`)
    loginUrl.searchParams.set('error_message', 'Your confirmation link has expired or is invalid. Please try logging in directly, or sign up again.')
    return NextResponse.redirect(loginUrl)
}
