import { db } from '../../lib/database.js';
import { z } from 'zod';
import { BillingService } from './billing.service.js';

/**
 * Sovereign Blueprint Schema
 * Ensuring every digital asset follows precise architectural standards.
 */
export const blueprintSchema = z.object({
    theme: z.object({
        primaryColor: z.string(),
        fontFamily: z.string(),
        mode: z.enum(['dark', 'light', 'glass']),
    }),
    layout: z.array(z.object({
        id: z.string(),
        type: z.string(),
        props: z.any()
    })),
    seo: z.object({
        title: z.string(),
        description: z.string(),
        keywords: z.array(z.string())
    })
});

export const siteCreateSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    vision: z.string().optional(),
    blueprint: blueprintSchema,
    subdomain: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Subdomain contains illegal characters.'),
});

export const siteUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    vision: z.string().optional(),
    blueprint: blueprintSchema.optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isPublished: z.boolean().optional(),
});

/**
 * Vault Protocol - Site Logic
 * Optimized for rapid retrieval and atomic JSONB updates.
 */
export const SiteService = {
    async getSites(userId: string) {
        return (db as any).site.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    },

    async getSiteById(id: string, userId: string) {
        const site = await (db as any).site.findUnique({
            where: { id, userId },
        });

        if (!site) {
            throw new Error('Protocol breach: Site not found or access denied.');
        }

        return site;
    },

    async createSite(userId: string, data: z.infer<typeof siteCreateSchema>) {
        // 1. Quota Verification
        await BillingService.verifyQuota(userId);

        // 2. Check for subdomain collision
        const existing = await (db as any).site.findUnique({
            where: { subdomain: data.subdomain },
        });

        if (existing) {
            throw new Error('Subdomain collision detected in the network.');
        }

        return (db as any).site.create({
            data: {
                ...data,
                userId,
                status: 'DRAFT'
            },
        });
    },

    async updateSite(id: string, userId: string, data: z.infer<typeof siteUpdateSchema>) {
        // Ensure ownership before update
        await this.getSiteById(id, userId);

        return (db as any).site.update({
            where: { id },
            data: {
                ...data,
                updatedAt: new Date(),
            },
        });
    },

    async archiveSite(id: string, userId: string) {
        await this.getSiteById(id, userId);

        return (db as any).site.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        });
    },

    async deleteSite(id: string, userId: string) {
        await this.getSiteById(id, userId);

        // This will trigger the soft delete extension
        return (db as any).site.delete({
            where: { id },
        });
    },
};
