import { FastifyInstance } from 'fastify';
import { DeploymentService } from './deploy.service.js';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function deployRoutes(server: FastifyInstance<any, any, any, any, ZodTypeProvider>) {
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
            reply.code(401).send({ success: false as const, message: 'Unauthorized session.' });
        }
    });

    /**
     * Trigger Global Edge Deployment
     */
    server.post('/:siteId', {
        schema: {
            tags: ['Sovereign Edge'],
            params: z.object({ siteId: z.string() }),
            response: {
                202: z.object({
                    success: z.literal(true),
                    deploymentId: z.string(),
                    status: z.string(),
                }),
                400: errorSchema,
                401: errorSchema
            },
        },
    }, async (request, reply) => {
        const userId = (request.user as any).id;
        const { siteId } = request.params as any;

        try {
            const deployment = await DeploymentService.triggerDeployment(siteId, userId);
            return reply.code(202).send({
                success: true as const,
                deploymentId: deployment.id,
                status: deployment.buildStatus
            });
        } catch (err: any) {
            return reply.code(400).send({ success: false as const, message: err.message });
        }
    });

    /**
     * Check Active Deployment Status
     */
    server.get('/status/:id', {
        schema: {
            tags: ['Sovereign Edge'],
            params: z.object({ id: z.string() }),
            response: {
                200: z.object({
                    success: z.literal(true),
                    deployment: z.any()
                }),
                401: errorSchema
            }
        },
    }, async (request) => {
        const deployment = await DeploymentService.getDeploymentStatus((request.params as any).id);
        return { success: true as const, deployment };
    });
}
