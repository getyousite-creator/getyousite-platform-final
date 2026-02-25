import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Sovereign Configuration Protocol (SCP-1)
 * Ensures 100% environmental integrity before system activation.
 */

dotenv.config({ path: path.join(process.cwd(), '../.env.local') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3001'),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    COOKIE_SECRET: z.string().min(32),
    REDIS_URL: z.string().url().optional(),
    SENTRY_DSN: z.string().url().optional(),
    NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ [CRITICAL] Sovereign Configuration Violation:');
    console.error(_env.error.format());
    process.exit(1);
}

export const env = _env.data;
