import { FastifyInstance, FastifyRequest } from 'fastify';
import { SiteService, siteCreateSchema, siteUpdateSchema } from './site.service.js';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function siteRoutes(server: FastifyInstance<any, any, any, any, ZodTypeProvider>) {
    const errorSchema = z.object({
        success: z.literal(false),
        message: z.string()
    });
    /**
     * Access Guard
     */
    server.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.code(401).send({ success: false as const, message: 'Unauthorized access.' });
        }
    });

    /**
     * Retrieve all sites for the authenticated operator
     */
    server.get('/', {
        schema: {
            tags: ['Vault'],
            response: {
                200: z.object({
                    success: z.literal(true),
                    sites: z.array(z.any()),
                }),
                401: errorSchema
            },
        },
    }, async (request) => {
        const userId = (request.user as any).id;
        const sites = await SiteService.getSites(userId);
        return { success: true as const, sites };
    });

    /**
     * Retrieve a specific site blueprint
     */
    server.get('/:id', {
        schema: {
            tags: ['Vault'],
            params: z.object({ id: z.string() }),
            response: {
                200: z.object({
                    success: z.literal(true),
                    site: z.any(),
                }),
                401: errorSchema
            },
        },
    }, async (request) => {
        const userId = (request.user as any).id;
        const { id } = request.params as any;
        const site = await SiteService.getSiteById(id, userId);
        return { success: true as const, site };
    });

    /**
     * Synthesize new site blueprint
     */
    server.post('/', {
        schema: {
            tags: ['Vault'],
            body: siteCreateSchema,
            response: {
                201: z.object({
                    success: z.literal(true),
                    site: z.any(),
                }),
                401: errorSchema
            },
        },
    }, async (request, reply) => {
        const userId = (request.user as any).id;
        const site = await SiteService.createSite(userId, request.body as any);

        const { AuditService } = await import('../../lib/audit.js');
        await AuditService.log({
            userId,
            action: 'CREATE',
            resource: 'SITE',
            resourceId: site.id,
            newValue: site
        });

        return reply.code(201).send({ success: true as const, site });
    });

    /**
     * Update existing blueprint
     */
    server.patch('/:id', {
        schema: {
            tags: ['Vault'],
            params: z.object({ id: z.string() }),
            body: siteUpdateSchema,
            response: {
                200: z.object({
                    success: z.literal(true),
                    site: z.any()
                }),
                401: errorSchema
            }
        },
    }, async (request) => {
        const userId = (request.user as any).id;
        const { id } = request.params as any;
        const site = await SiteService.updateSite(id, userId, request.body as any);

        const { AuditService } = await import('../../lib/audit.js');
        await AuditService.log({
            userId,
            action: 'UPDATE',
            resource: 'SITE',
            resourceId: id,
            newValue: site
        });

        return { success: true as const, site };
    });

    /**
     * Terminate site node (Delete)
     */
    server.delete('/:id', {
        schema: {
            tags: ['Vault'],
            params: z.object({ id: z.string() }),
            response: {
                200: z.object({
                    success: z.literal(true),
                    message: z.string()
                }),
                401: errorSchema
            }
        },
    }, async (request) => {
        const userId = (request.user as any).id;
        const { id } = request.params as any;
        await SiteService.deleteSite(id, userId);

        const { AuditService } = await import('../../lib/audit.js');
        await AuditService.log({
            userId,
            action: 'DELETE',
            resource: 'SITE',
            resourceId: id
        });

        return { success: true as const, message: 'Node terminated.' };
    });
}
