import { db } from '../../lib/database.js';
import crypto from 'node:crypto';

/**
 * Sovereign API Access Protocol (SAAP-2)
 * Manages high-privilege programmatic access to the Sovereign Core.
 */
export const ApiKeyService = {
    async generateKey(userId: string, name: string, permissions: string[] = ['sites:read']) {
        const rawKey = `gys_${crypto.randomBytes(32).toString('hex')}`;
        const prefix = rawKey.substring(0, 12);
        const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

        const apiKey = await (db as any).apiKey.create({
            data: {
                userId,
                name,
                key: keyHash,
                prefix,
                permissions,
            },
        });

        // We only return the raw key ONCE during creation
        return {
            ...apiKey,
            rawKey,
        };
    },

    async validateKey(key: string) {
        const keyHash = crypto.createHash('sha256').update(key).digest('hex');
        const apiKey = await (db as any).apiKey.findUnique({
            where: { key: keyHash },
            include: { user: true },
        });

        if (!apiKey || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
            return null;
        }

        // Update last used timestamp (async)
        (db as any).apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        }).catch(console.error);

        return apiKey;
    }
};
