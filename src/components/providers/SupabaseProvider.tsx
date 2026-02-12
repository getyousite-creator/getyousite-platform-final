"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type SupabaseClient, type User, type AuthChangeEvent, type Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type Profile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    subscription_status: string | null;
    plan_id: string | null;
    tier?: 'starter' | 'pro' | 'enterprise'; // Added for Gate Logic
    credits?: number;
};

type SupabaseContext = {
    supabase: SupabaseClient;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [supabase] = useState(() => createClient());
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId: string) => {
        // 1. Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        // 2. Fetch User Metadata (Tier/Credits) from public.users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('tier, credits')
            .eq('id', userId)
            .single();

        if (!profileError && profileData) {
            setProfile({
                ...profileData,
                tier: userData?.tier || 'starter',
                credits: userData?.credits || 0
            });
        }
    };

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }

            setLoading(false);

            if (event === 'SIGNED_IN') router.refresh();
            if (event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        // Initial check
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: User | null } }) => {
            if (user) {
                setUser(user);
                fetchProfile(user.id).finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router]);

    return (
        <Context.Provider value={{ supabase, user, profile, loading }}>
            {children}
        </Context.Provider>
    );
}

// ALIAS for consistency across the platform
export const useAuth = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useAuth must be used inside SupabaseProvider');
    }
    return context;
};

export const useSupabase = useAuth;
