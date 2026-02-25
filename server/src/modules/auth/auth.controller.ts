import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { signupSchema, loginSchema, AuthService } from './auth.service.js';
import { z } from 'zod';
import { env } from '../../lib/config.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function authRoutes(server: FastifyInstance<any, any, any, any, ZodTypeProvider>) {
    const errorSchema = z.object({
        success: z.literal(false),
        message: z.string()
    });

    /**
     * Register Identity
     */
    server.post('/signup', {
        schema: {
            tags: ['Authentication'],
            body: signupSchema,
            response: {
                201: z.object({
                    success: z.literal(true),
                    user: z.object({
                        id: z.string(),
                        email: z.string(),
                    }),
                }),
                400: errorSchema
            },
        },
    }, async (request, reply) => {
        try {
            const user = await AuthService.register(request.body);
            return reply.code(201).send({ success: true as const, user });
        } catch (err: any) {
            return reply.code(400).send({ success: false as const, message: err.message });
        }
    });

    /**
     * Authenticate Identity (Login)
     */
    server.post('/login', {
        config: {
            rateLimit: {
                max: 5,
                timeWindow: '1 minute'
            }
        },
        schema: {
            tags: ['Authentication'],
            body: loginSchema,
            response: {
                200: z.object({
                    success: z.literal(true),
                    accessToken: z.string(),
                }),
                401: errorSchema
            },
        },
    }, async (request, reply) => {
        try {
            const payload = await AuthService.authenticate(request.body);

            const accessToken = server.jwt.sign(payload);
            const refreshToken = server.jwt.sign(payload, { expiresIn: '7d' });

            reply.setCookie('refreshToken', refreshToken, {
                path: '/',
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                signed: true,
            });

            return { success: true as const, accessToken };
        } catch (err: any) {
            return reply.code(401).send({ success: false as const, message: err.message });
        }
    });

    /**
     * Refresh Dimension Access Token
     */
    server.post('/refresh', {
        schema: {
            tags: ['Authentication'],
            response: {
                200: z.object({
                    success: z.literal(true),
                    accessToken: z.string(),
                }),
                401: errorSchema
            },
        },
    }, async (request, reply) => {
        try {
            const cookie = request.cookies.refreshToken;
            if (!cookie) throw new Error('No refresh token provided.');

            const unsigned = request.unsignCookie(cookie);
            if (!unsigned.valid || !unsigned.value) {
                return reply.code(401).send({ success: false, message: 'Invalid session signature.' });
            }

            const payload = server.jwt.verify(unsigned.value);
            const newAccessToken = server.jwt.sign({
                id: (payload as any).id,
                email: (payload as any).email,
                role: (payload as any).role
            });

            return { success: true as const, accessToken: newAccessToken };
        } catch (err: any) {
            return reply.code(401).send({ success: false as const, message: err.message || 'Access denied.' });
        }
    });

    /**
     * Terminate Session (Logout)
     */
    server.post('/logout', {
        schema: {
            tags: ['Authentication'],
            response: {
                200: z.object({
                    success: z.literal(true),
                    message: z.string()
                })
            }
        },
    }, async (request, reply) => {
        reply.clearCookie('refreshToken');
        return { success: true as const, message: 'Session terminated.' };
    });
}
