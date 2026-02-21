/**
 * Backend Sovereignty Protocol - Fastify API Server
 * 
 * High-performance API server capable of 10,000+ req/s
 * Uses Fastify over Express for superior JSON handling
 * Plugin-based architecture for microservices readiness
 */

import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { PrismaClient } from '@prisma/client';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ServerConfig {
    port: number;
    host: string;
    environment: 'development' | 'staging' | 'production';
}

export interface AppContext {
    prisma: PrismaClient;
    redis: any; // Redis client
}

// ============================================================================
// SERVER CREATION
// ============================================================================

export async function createServer(config: ServerConfig): Promise<FastifyInstance> {
    const server = Fastify({
        logger: {
            level: config.environment === 'production' ? 'info' : 'debug',
        },
        bodyLimit: 10485760, // 10MB limit
        maxParamLength: 500,
    });

    // Register plugins
    await registerPlugins(server, config);

    // Register routes
    await registerRoutes(server);

    // Graceful shutdown
    registerGracefulShutdown(server);

    return server;
}

// ============================================================================
// PLUGIN REGISTRATION
// ============================================================================

async function registerPlugins(server: FastifyInstance, config: ServerConfig) {
    // 1. CORS
    await server.register(cors, {
        origin: config.environment === 'production' 
            ? ['https://getyousite.com', 'https://www.getyousite.com']
            : true,
        credentials: true,
    });

    // 2. Security Headers (Helmet)
    await server.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", "https://*.supabase.co"],
            },
        },
    });

    // 3. Rate Limiting (100 req/min per user)
    await server.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute',
        keyGenerator: (request) => {
            // Use JWT user ID if available, otherwise IP
            const user = (request as any).user;
            return user?.userId || request.ip;
        },
        redis: global.redisClient, // Redis for distributed rate limiting
    });

    // 4. JWT Authentication
    await server.register(jwt, {
        secret: process.env.JWT_SECRET!,
        sign: {
            expiresIn: '15m', // Access token expires in 15 minutes
        },
        cookie: {
            cookieName: 'refreshToken',
            signed: false,
        },
    });

    // 5. Cookie Parser (for HttpOnly refresh tokens)
    await server.register(cookie, {
        secret: process.env.COOKIE_SECRET!,
    });

    // 6. Prisma Client
    const prisma = new PrismaClient({
        log: config.environment === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
    });
    
    await prisma.$connect();
    
    server.decorate('prisma', prisma);
    server.addHook('onClose', async () => {
        await prisma.$disconnect();
    });

    // 7. Redis Client
    global.redisClient = await createRedisClient();
    server.addHook('onClose', async () => {
        await global.redisClient.quit();
    });
}

// ============================================================================
// ROUTE REGISTRATION
// ============================================================================

async function registerRoutes(server: FastifyInstance) {
    // Health check
    server.get('/health', async (request, reply) => {
        return { 
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    });

    // Auth routes
    await server.register(import('./routes/auth.js'), { prefix: '/api/v1/auth' });
    
    // User routes
    await server.register(import('./routes/users.js'), { prefix: '/api/v1/users' });
    
    // Site routes
    await server.register(import('./routes/sites.js'), { prefix: '/api/v1/sites' });
    
    // Deployment routes
    await server.register(import('./routes/deploy.js'), { prefix: '/api/v1/deploy' });
    
    // Analytics routes
    await server.register(import('./routes/analytics.js'), { prefix: '/api/v1/analytics' });

    // 404 handler
    server.setNotFoundHandler((request, reply) => {
        reply.code(404).send({
            error: 'Not Found',
            message: `Route ${request.method} ${request.url} not found`,
            statusCode: 404,
        });
    });

    // Error handler
    server.setErrorHandler((error, request, reply) => {
        server.log.error(error);
        
        reply.code(error.statusCode || 500).send({
            error: error.name,
            message: error.message,
            statusCode: error.statusCode || 500,
        });
    });
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

function registerGracefulShutdown(server: FastifyInstance) {
    const signals = ['SIGINT', 'SIGTERM'];
    
    signals.forEach((signal) => {
        process.on(signal, async () => {
            server.log.info(`Received ${signal}, shutting down gracefully...`);
            
            try {
                await server.close();
                server.log.info('Server closed');
                process.exit(0);
            } catch (error) {
                server.log.error(error);
                process.exit(1);
            }
        });
    });
}

// ============================================================================
// REDIS CLIENT
// ============================================================================

async function createRedisClient() {
    const Redis = await import('ioredis');

    const redis = new Redis.default({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

    redis.on('error', (error: Error) => {
        console.error('[Redis] Error:', error);
    });

    redis.on('connect', () => {
        console.log('[Redis] Connected');
    });

    return redis;
}

// Declare global for redis client
declare global {
    var redisClient: any;
}

// Extend FastifyInstance type
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createServer,
};
