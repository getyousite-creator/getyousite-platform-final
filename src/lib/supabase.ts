import { createClient } from '@supabase/supabase-js';
import { getEnv, isSupabaseConfigured } from './env-validator';

/**
 * WARNING: This client should ONLY be used in client components.
 * For Server Components and API routes, use @/lib/supabase/server
 * 
 * This uses the ANON key which is safe to expose to the browser.
 * Row Level Security (RLS) must be enabled on all tables.
 */

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const env = getEnv();

    supabaseInstance = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
            },
        }
    );

    return supabaseInstance;
}

export const supabase = getSupabaseClient();

export { isSupabaseConfigured };
