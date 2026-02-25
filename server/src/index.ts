import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { env } from './lib/config.js';
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import helmet from '@fastify/helmet';
// @ts-ignore
import metrics from 'fastify-metrics';
import Redis from 'ioredis';
import { db } from './lib/database.js';

// Type Declaration Protocol
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: any, reply: any) => Promise<void>;
    }
}

/**
 * Sovereign Observability Protocol
 */
Sentry.init({
    dsn: env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

import { ZodTypeProvider } from 'fastify-type-provider-zod';

const server = Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>();

// Zod Type Provider Configuration
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

/**
 * Sovereign Core Protocols
 */
async function bootstrap() {
    // 1. Documentation Protocol (Swagger)
    await server.register(swagger, {
        openapi: {
            info: {
                title: 'GYS Sovereign Core Protocol',
                description: 'High-performance behavioral engine for the GetYouSite platform.',
                version: '3.1.0',
            },
            servers: [{ url: 'http://localhost:3001' }],
        },
        transform: jsonSchemaTransform,
    });

    await server.register(swaggerUi, {
        routePrefix: '/documentation',
    });

    // 2. Security Protocol (Iron Shield)
    await server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "validator.swagger.io"],
                scriptSrc: ["'self'", "https:", "'unsafe-inline'"],
            },
        },
    });

    await server.register(metrics, { endpoint: '/metrics' });

    await server.register(cors, {
        origin: env.NEXT_PUBLIC_SITE_URL || true,
        credentials: true,
    });

    await server.register(cookie, {
        secret: env.COOKIE_SECRET,
        parseOptions: {},
    });

    await server.register(jwt, {
        secret: env.JWT_SECRET,
        cookie: {
            cookieName: 'refreshToken',
            signed: true,
        },
        sign: {
            expiresIn: '15m',
        },
    });

    // Authentication Decorator Protocol
    server.decorate('authenticate', async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // 3. Resilience Protocol (Rate Limiting)
    await server.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        redis: env.REDIS_URL ? new Redis(env.REDIS_URL) : undefined,
    });

    // 4. Register Modules
    const { authRoutes } = await import('./modules/auth/auth.controller.js');
    const { siteRoutes } = await import('./modules/site/site.controller.js');
    const { deployRoutes } = await import('./modules/deploy/deploy.controller.js');

    await server.register(authRoutes, { prefix: '/api/v1/auth' });
    await server.register(siteRoutes, { prefix: '/api/v1/sites' });
    await server.register(deployRoutes, { prefix: '/api/v1/deploy' });

    // Health Check
    server.get('/health', {
        schema: {
            description: 'System identity verification',
            tags: ['System'],
            response: {
                200: z.object({
                    status: z.string(),
                    timestamp: z.string(),
                    version: z.string(),
                    database: z.string(),
                }),
            },
        },
    }, async () => {
        let dbStatus = 'CONNECTED';
        try {
            await (db as any).$queryRaw`SELECT 1`;
        } catch (e) {
            dbStatus = 'DISCONNECTED';
            Sentry.captureException(e);
        }

        return {
            status: 'SOVEREIGN_OPERATIONAL',
            timestamp: new Date().toISOString(),
            version: '3.1.0 (Gold)',
            database: dbStatus,
        };
    });

    // Error Handling Protocol
    server.setErrorHandler((error: any, request, reply) => {
        Sentry.captureException(error);
        server.log.error(error);

        const statusCode = error.statusCode || 500;

        reply.status(statusCode).send({
            success: false,
            message: error.message || 'Internal System Error. Incident logged by Sovereign Core.',
            incidentId: Sentry.lastEventId(),
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    });

    // Start System
    try {
        const port = parseInt(env.PORT || '3001');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`\n🛡️ [IRON_SHIELD] ACTIVE: System protected by Global Security Protocol.`);
        console.log(`🚀 [ENGINE] ONLINE: http://localhost:${port}`);
        console.log(`📜 [BLUEPRINT] DOCS: http://localhost:${port}/documentation\n`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

bootstrap();
