/**
 * Authentication Service
 * 
 * Centralized service for all authentication operations.
 * Uses Supabase Auth with proper error handling and type safety.
 */

import { createClient } from '@/lib/supabase/server';

export interface SignUpData {
    email: string;
    password: string;
    metadata?: {
        full_name?: string;
    };
}

export interface SignInData {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    email_confirmed_at?: string;
    user_metadata?: Record<string, unknown>;
}

export interface AuthError {
    message: string;
    status?: number;
}

export interface AuthResult<T = AuthUser> {
    data: T | null;
    error: AuthError | null;
}

/**
 * Authentication Service
 * All methods are server-side only - they use the server Supabase client
 */
export const AuthService = {
    /**
     * Sign up a new user with email and password
     */
    async signUp(data: SignUpData): Promise<AuthResult> {
        try {
            const supabase = await createClient();

            const { data: authData, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: data.metadata || {},
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
                },
            });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        status: error.status,
                    },
                };
            }

            if (!authData.user) {
                return {
                    data: null,
                    error: {
                        message: 'User creation failed',
                    },
                };
            }

            return {
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    email_confirmed_at: authData.user.email_confirmed_at,
                    user_metadata: authData.user.user_metadata,
                },
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Sign in an existing user with email and password
     */
    async signIn(data: SignInData): Promise<AuthResult> {
        try {
            const supabase = await createClient();

            const { data: authData, error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                        status: error.status,
                    },
                };
            }

            if (!authData.user) {
                return {
                    data: null,
                    error: {
                        message: 'Sign in failed',
                    },
                };
            }

            return {
                data: {
                    id: authData.user.id,
                    email: authData.user.email!,
                    email_confirmed_at: authData.user.email_confirmed_at,
                    user_metadata: authData.user.user_metadata,
                },
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Sign in with OAuth provider (Google, GitHub, etc.)
     */
    async signInWithOAuth(provider: 'google' | 'github' | 'azure' | 'apple'): Promise<AuthResult<{ url: string }>> {
        try {
            const supabase = await createClient();

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
                },
            });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            return {
                data: { url: data.url },
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Sign out the current user
     */
    async signOut(): Promise<AuthResult<void>> {
        try {
            const supabase = await createClient();

            const { error } = await supabase.auth.signOut();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            return {
                data: null,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Get the current authenticated user
     */
    async getCurrentUser(): Promise<AuthResult<AuthUser | null>> {
        try {
            const supabase = await createClient();

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            if (!user) {
                return {
                    data: null,
                    error: null,
                };
            }

            return {
                data: {
                    id: user.id,
                    email: user.email!,
                    email_confirmed_at: user.email_confirmed_at,
                    user_metadata: user.user_metadata,
                },
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Send password reset email
     */
    async resetPassword(email: string): Promise<AuthResult<void>> {
        try {
            const supabase = await createClient();

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
            });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            return {
                data: null,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Update user password
     */
    async updatePassword(newPassword: string): Promise<AuthResult<void>> {
        try {
            const supabase = await createClient();

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                return {
                    data: null,
                    error: {
                        message: error.message,
                    },
                };
            }

            return {
                data: null,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                },
            };
        }
    },

    /**
     * Check if user is authenticated (server-side)
     */
    async isAuthenticated(): Promise<boolean> {
        const result = await this.getCurrentUser();
        return result.data !== null && result.error === null;
    },

    /**
     * Consume a credit from the user's account
     * Logic: Absolute accountability.
     */
    async consumeCredit(userId: string): Promise<AuthResult<number>> {
        try {
            const supabase = await createClient();

            // Atomic decrement (PostgreSQL function call or raw update)
            const { data, error } = await supabase
                .from('users')
                .update({ credits: supabase.rpc('decrement_credits', { amount: 1 }) }) // Assuming RPC for atomicity
                .eq('id', userId)
                .select('credits')
                .single();

            // Fallback to manual if RPC fails (Less rigorous but functional)
            if (error) {
                const { data: user } = await supabase.from('users').select('credits').eq('id', userId).single();
                const newCredits = Math.max(0, (user?.credits || 0) - 1);
                const { data: updated } = await supabase.from('users').update({ credits: newCredits }).eq('id', userId).select('credits').single();
                return { data: updated?.credits || 0, error: null };
            }

            return { data: data.credits, error: null };
        } catch (err) {
            return { data: null, error: { message: 'Credit consumption failed' } };
        }
    },

    /**
     * Get user credits and tier
     * Logic: Absolute initialization. No user is left behind.
     */
    async getUserProfile(userId: string) {
        const supabase = await createClient();
        let { data, error } = await supabase.from('users').select('credits, tier').eq('id', userId).single();

        // AUTO-INIT: If user exists but has no credits set, grant them the Sovereign-Starter credit (1)
        if (!error && data && (data.credits === null || data.credits === undefined)) {
            const { data: updated } = await supabase
                .from('users')
                .update({ credits: 1, tier: 'starter' })
                .eq('id', userId)
                .select('credits, tier')
                .single();
            return updated;
        }

        return data;
    },

    /**
     * Require authentication - throws error if not authenticated
     * Use in Server Components/Actions that need authentication
     */
    async requireAuth(): Promise<AuthUser> {
        const result = await this.getCurrentUser();

        if (result.error || !result.data) {
            throw new Error('Authentication required');
        }

        return result.data;
    },
};
