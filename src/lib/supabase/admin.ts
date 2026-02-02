import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server-Side Supabase Admin Client
 * Uses SERVICE_ROLE_KEY - bypasses RLS (use with extreme caution)
 * Only for trusted server-side operations (admin tasks, migrations)
 */
export async function createAdminClient() {
    const cookieStore = await cookies()

    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Handle cookie setting errors in server components
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Handle cookie removal errors
                    }
                },
            },
        }
    )
}

/**
 * Server-Side Supabase Client (User Context)
 * Uses ANON_KEY - respects RLS policies
 * Use for authenticated user operations
 */
export async function createServerClient() {
    const cookieStore = await cookies()

    return createSupabaseServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Handle cookie setting errors
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Handle cookie removal errors
                    }
                },
            },
        }
    )
}
