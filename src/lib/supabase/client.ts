import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("CRITICAL: Supabase Environment Variables Missing. Authentication disabled.");
        // Return a dummy client to prevent crash
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: { message: "Missing Env Vars" } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithOAuth: async () => ({ error: { message: "Missing Env Vars" } }),
                signOut: async () => ({ error: { message: "Missing Env Vars" } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: { message: "Missing Env Vars" } }),
                        maybeSingle: async () => ({ data: null, error: { message: "Missing Env Vars" } })
                    })
                })
            })
        } as any;
    }

    return createBrowserClient(url, key);
};
