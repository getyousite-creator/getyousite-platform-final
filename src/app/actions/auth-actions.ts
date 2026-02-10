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

type AuthResponse = {
  success: boolean;
  error?: string;
  user?: any;
  redirectTo?: string;
};

/**
 * Sign up a new user with email and password
 */
export async function signUpAction(email: string, password: string): Promise<AuthResponse> {
  try {
    // Validate Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('[AUTH] Supabase not configured');
      return {
        success: false,
        error: 'Authentication service not available. Please contact support.',
      };
    }

    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    const supabase = await createClient();

    console.log('[AUTH-SIGNUP] Attempting signup for:', email);

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback`,
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
export async function signInAction(email: string, password: string): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      console.error('[AUTH] Supabase not configured');
      return {
        success: false,
        error: 'Authentication service not available. Please contact support.',
      };
    }

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      };
    }

    const supabase = await createClient();

    console.log('[AUTH-SIGNIN] Attempting signin for:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AUTH-SIGNIN] Supabase error:', error.message);
      return {
        success: false,
        error: error.message || 'Invalid email or password',
      };
    }

    console.log('[AUTH-SIGNIN] Success:', data.user?.id);

    return {
      success: true,
      user: data.user,
      redirectTo: '/dashboard',
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
export async function signInWithOAuthAction(provider: 'google' | 'apple' | 'azure'): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      console.error('[AUTH] Supabase not configured');
      return {
        success: false,
        error: 'Authentication service not available.',
      };
    }

    const supabase = await createClient();

    console.log('[AUTH-OAUTH] Initiating OAuth with provider:', provider);

    // Map parameter names to Supabase provider names
    const providerMap: Record<string, 'google' | 'apple' | 'azure'> = {
      google: 'google',
      apple: 'apple',
      azure: 'azure',
    };

    const providerName = providerMap[provider];
    if (!providerName) {
      return {
        success: false,
        error: 'Invalid OAuth provider',
      };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: providerName,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth/callback?next=/dashboard`,
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
      redirect(data.url);
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('[AUTH-OAUTH] Exception:', err);
    return {
      success: false,
      error: 'OAuth sign in failed. Please try again.',
    };
  }
}

/**
 * Request a password reset email
 */
export async function resetPasswordAction(email: string): Promise<AuthResponse> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'Authentication service not available.',
      };
    }

    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    const supabase = await createClient();

    console.log('[AUTH-RESET] Requesting password reset for:', email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/reset-password`,
    });

    if (error) {
      console.error('[AUTH-RESET] Supabase error:', error.message);
      // Don't expose whether email exists for security
      return {
        success: true,
        error: undefined,
      };
    }

    console.log('[AUTH-RESET] Email sent successfully');

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
