import { prisma } from '@/lib/prisma';
import { Site, User } from '@prisma/client';
import { SiteBlueprint } from '@/lib/schemas';

/**
 * SOVEREIGN SITE REPOSITORY
 * Logic: Type-safe, atomic operations via Prisma ORM.
 */
export const PrismaStoreRepository = {
    /**
     * Create a new Sovereign Site
     */
    async createStore(userId: string, data: { name: string; description?: string; blueprint: SiteBlueprint }) {
        return await prisma.site.create({
            data: {
                userId: userId,
                name: data.name,
                description: data.description,
                status: 'DRAFT',
                blueprint: data.blueprint as any, // Cast to JSON
                subdomain: `site-${Date.now()}`, // Temporary subdomain
            },
        });
    },

    /**
     * Get User Empire (All Sites)
     */
    async getUserStores(userId: string) {
        return await prisma.site.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
            include: { analytics: true } // Eager load intelligence
        });
    },

    /**
     * Get Site by ID (Sovereign Access Check)
     */
    async getStoreById(id: string) {
        return await prisma.site.findUnique({
            where: { id },
        });
    }
};
