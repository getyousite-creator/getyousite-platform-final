/**
 * Environment Variable Validation
 * 
 * Validates required environment variables on application startup.
 * Fails fast with clear error messages instead of cryptic runtime failures.
 */

interface EnvConfig {
    // Public variables (exposed to browser)
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SITE_URL: string;

    // Server-only variables (never exposed to client)
    SUPABASE_SERVICE_ROLE_KEY?: string;
}

class EnvironmentValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EnvironmentValidationError';
    }
}

/**
 * Validates that all required environment variables are present
 * @throws {EnvironmentValidationError} If any required variable is missing
 */
export function validateEnv(): EnvConfig {
    const errors: string[] = [];

    // Required public variables
    const publicVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    };

    Object.entries(publicVars).forEach(([key, value]) => {
        if (!value || value.trim() === '') {
            errors.push(`Missing required environment variable: ${key}`);
        }
    });

    // Validate Supabase URL format
    if (publicVars.NEXT_PUBLIC_SUPABASE_URL &&
        !publicVars.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
        errors.push('NEXT_PUBLIC_SUPABASE_URL must start with https://');
    }

    // Server-only variables (validated only on server)
    const isServer = typeof window === 'undefined';
    if (isServer) {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey || serviceRoleKey.trim() === '') {
            console.warn(
                '⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. ' +
                'Admin operations will fail. This is required for production.'
            );
        }
    }

    if (errors.length > 0) {
        const errorMessage = [
            '',
            '❌ Environment Configuration Error',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            ...errors.map(err => `  • ${err}`),
            '',
            '📝 To fix this:',
            '  1. Copy .env.local.example to .env.local (if available)',
            '  2. Add the missing variables to .env.local',
            '  3. Restart the development server',
            '',
            '🔗 Get Supabase credentials from:',
            '   https://app.supabase.com/project/_/settings/api',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            ''
        ].join('\n');

        throw new EnvironmentValidationError(errorMessage);
    }

    return {
        NEXT_PUBLIC_SUPABASE_URL: publicVars.NEXT_PUBLIC_SUPABASE_URL!,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: publicVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        NEXT_PUBLIC_SITE_URL: publicVars.NEXT_PUBLIC_SITE_URL!,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
}

/**
 * Get validated environment config (cached after first call)
 */
let cachedConfig: EnvConfig | null = null;

export function getEnv(): EnvConfig {
    if (!cachedConfig) {
        cachedConfig = validateEnv();
    }
    return cachedConfig;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
    try {
        const env = getEnv();
        return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    } catch {
        return false;
    }
}
