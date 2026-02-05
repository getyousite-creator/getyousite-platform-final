import { prisma } from '@/lib/prisma';
import { Store, User } from '@prisma/client';
import { SiteBlueprint } from '@/lib/schemas';

/**
 * SOVEREIGN STORE REPOSITORY
 * Logic: Type-safe, atomic operations via Prisma ORM.
 */
export const PrismaStoreRepository = {
    /**
     * Create a new Sovereign Store
     */
    async createStore(userId: string, data: { name: string; description?: string; blueprint: SiteBlueprint }) {
        return await prisma.store.create({
            data: {
                user_id: userId,
                name: data.name,
                description: data.description,
                status: 'draft',
                blueprint: data.blueprint as any, // Cast to JSON
            },
        });
    },

    /**
     * Get User Empire (All Stores)
     */
    async getUserStores(userId: string) {
        return await prisma.store.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            include: { analytics: true } // Eager load intelligence
        });
    },

    /**
     * Get Store by ID (Sovereign Access Check)
     */
    async getStoreById(id: string) {
        return await prisma.store.findUnique({
            where: { id },
        });
    }
};
