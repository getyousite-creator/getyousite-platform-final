"use server";

import { createClient } from '@/lib/supabase/server';
import { getEnv, isSupabaseConfigured } from '@/lib/env-validator';
import { redirect } from 'next/navigation';

/**
 * Server-side authentication actions
 * All actions use Supabase Auth via server-side client for security
 */

export type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

import { User } from '@supabase/supabase-js';

type AuthResponse = {
  success: boolean;
  error?: string;
  user?: User | null;
  redirectTo?: string;
};

/**
 * Logic: Construct redirect URL dynamically
 * We use headers to detect the current origin, ensuring it works in Local, Preview, and Prod.
 */
async function getSiteUrl() {
  const { headers } = await import('next/headers');
  const headerList = await headers();
  const host = headerList.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL || '');
}

/**
 * Sign up a new user with email and password
 */
export async function signUpAction(email: string, password: string, locale: string = 'en'): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication service not available. Contact system administrator.',
      };
    }

    const supabase = await createClient();
    const siteUrl = await getSiteUrl();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/${locale}/dashboard`,
      },
    });

    if (error) {
      console.error('[AUTH-SIGNUP] Supabase error:', error.message);
      return {
        success: false,
        error: error.message || 'Sign up failed. Please try again.',
      };
    }

    console.log('[AUTH-SIGNUP] Success:', data.user?.id);

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    console.error('[AUTH-SIGNUP] Exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signInAction(email: string, password: string, locale: string = 'en'): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication service not available.',
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Invalid logical identity credentials.',
      };
    }

    return {
      success: true,
      user: data.user,
      redirectTo: `/${locale}/dashboard`,
    };
  } catch (err) {
    console.error('[AUTH-SIGNIN] Exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Sign in with OAuth provider (Google, Apple, Microsoft)
 */
export async function signInWithOAuthAction(provider: 'google' | 'apple' | 'azure', locale: string = 'en'): Promise<AuthResponse> {
  let redirectUrl: string | null = null;
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Authentication service not available.' };
    }

    const supabase = await createClient();
    const siteUrl = await getSiteUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=/${locale}/dashboard`,
      },
    });

    if (error) {
      console.error('[AUTH-OAUTH] Supabase error:', error.message);
      return {
        success: false,
        error: error.message || 'OAuth sign in failed',
      };
    }

    if (data.url) {
      redirectUrl = data.url;
    }
  } catch (err) {
    // Logic: In Next.js, redirect() throws a special error. 
    // We must check if the error is a redirect and re-throw it.
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
      throw err;
    }

    console.error('[AUTH-OAUTH] Exception:', err);
    return {
      success: false,
      error: 'OAuth sign in failed. Please try again.',
    };
  }

  // Final Action: Perform redirect outside the try-catch
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return {
    success: true,
  };
}

/**
 * Request a password reset email
 */
export async function resetPasswordAction(email: string, locale: string = 'en'): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Authentication service not available.' };
    }

    const supabase = await createClient();
    const siteUrl = await getSiteUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/${locale}/reset-password`,
    });

    return {
      success: true,
    };
  } catch (err) {
    console.error('[AUTH-RESET] Exception:', err);
    return {
      success: true,
      error: undefined,
    };
  }
}

/**
 * Update user password (after reset or in account settings)
 */
export async function updatePasswordAction(newPassword: string): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication service not available.',
      };
    }

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    const supabase = await createClient();

    console.log('[AUTH-UPDATE-PASSWORD] Updating password');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('[AUTH-UPDATE-PASSWORD] Supabase error:', error.message);
      return {
        success: false,
        error: error.message || 'Password update failed',
      };
    }

    console.log('[AUTH-UPDATE-PASSWORD] Success');

    return {
      success: true,
    };
  } catch (err) {
    console.error('[AUTH-UPDATE-PASSWORD] Exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
