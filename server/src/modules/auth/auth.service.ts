import argon2 from 'argon2';
import { db } from '../../lib/database';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
});

export async function hashPassword(password: string) {
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
    });
}

export async function verifyPassword(hashed: string, plain: string) {
    return argon2.verify(hashed, plain);
}

/**
 * Sovereign Auth Logic
 * Implements strict, no-nonsense verification.
 */
export const AuthService = {
    async register(data: z.infer<typeof signupSchema>) {
        const existing = await db.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            throw new Error('Entity already exists in dimensions.');
        }

        const passwordHash = await hashPassword(data.password);

        const user = await db.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        const { AuditService } = await import('../../lib/audit.js');
        await AuditService.log({
            userId: user.id,
            action: 'CREATE',
            resource: 'USER',
            resourceId: user.id,
            newValue: { email: user.email }
        });

        return user;
    },

    async authenticate(data: z.infer<typeof loginSchema>) {
        const user = await db.user.findFirst({
            where: {
                email: data.email,
                deletedAt: null // Sovereign Soft Delete Check
            },
        });

        if (!user) {
            throw new Error('Access denied. Invalid credentials.');
        }

        if (!user.passwordHash) {
            throw new Error('This account requires an alternative authentication method.');
        }

        const isValid = await verifyPassword(user.passwordHash, data.password);

        const { AuditService } = await import('../../lib/audit.js');

        if (!isValid) {
            await AuditService.log({
                action: 'SECURITY_ALERT',
                resource: 'SYSTEM',
                newValue: { message: 'FAILED_LOGIN_ATTEMPT', email: data.email }
            });
            throw new Error('Access denied. Invalid credentials.');
        }

        await AuditService.log({
            userId: user.id,
            action: 'LOGIN',
            resource: 'USER',
            resourceId: user.id
        });

        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    },
};
