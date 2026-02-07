/**
 * Authentication Server Actions
 * 
 * These are 'use server' functions that components can call.
 * They interface with AuthService to perform authentication operations.
 */

'use server';

import { AuthService, SignUpData, SignInData } from '@/lib/services/auth-service';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface ActionResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Sign up a new user
 */
export async function signUpAction(email: string, password: string): Promise<ActionResult<any>> {
    try {
        const result = await AuthService.signUp({
            email,
            password,
        });

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Sign in existing user
 */
export async function signInAction(email: string, password: string): Promise<ActionResult> {
    try {
        const result = await AuthService.signIn({
            email,
            password,
        });

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        revalidatePath('/', 'layout');

        return {
            success: true,
        };
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuthAction(provider: 'google' | 'github' | 'azure' | 'apple'): Promise<ActionResult<{ url: string }>> {
    try {
        const result = await AuthService.signInWithOAuth(provider);

        if (result.error || !result.data) {
            return {
                success: false,
                error: result.error?.message || 'OAuth failed',
            };
        }

        // Redirect to OAuth provider
        redirect(result.data.url);
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Sign out current user
 */
export async function signOutAction(): Promise<ActionResult> {
    try {
        const result = await AuthService.signOut();

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        // Revalidate and redirect
        revalidatePath('/', 'layout');
        redirect('/');
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUserAction(): Promise<ActionResult<{ email: string; id: string } | null>> {
    try {
        const result = await AuthService.getCurrentUser();

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Request password reset
 */
export async function resetPasswordAction(email: string): Promise<ActionResult> {
    try {
        const result = await AuthService.resetPassword(email);

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Update user password (fulfillment)
 */
export async function updatePasswordAction(password: string): Promise<ActionResult> {
    try {
        const result = await AuthService.updatePassword(password);

        if (result.error) {
            return {
                success: false,
                error: result.error.message,
            };
        }

        revalidatePath('/', 'layout');
        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
