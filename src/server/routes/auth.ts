/**
 * Authentication Routes
 * 
 * JWT with Refresh Tokens stored in HttpOnly cookies
 * Argon2 password hashing
 * Rate limiting applied
 */

import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RegisterBody {
    email: string;
    password: string;
    name: string;
}

interface LoginBody {
    email: string;
    password: string;
}

interface RefreshTokenBody {
    refreshToken?: string;
}

// ============================================================================
// AUTH ROUTES
// ============================================================================

export const authRoutes: FastifyPluginAsync = async (server) => {
    const prisma = server.prisma;

    // POST /register
    server.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
        const { email, password, name } = request.body;

        // Validate input
        if (!email || !password || !name) {
            return reply.code(400).send({
                error: 'Bad Request',
                message: 'Email, password, and name are required',
            });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return reply.code(409).send({
                error: 'Conflict',
                message: 'User with this email already exists',
            });
        }

        // Hash password with Argon2
        const passwordHash = await argon2.hash(password, {
            type: argon2.argon2id, // Most secure variant
            memoryCost: 65536, // 64 MB
            timeCost: 3, // 3 iterations
            parallelism: 4, // 4 parallel threads
        });

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const accessToken = server.jwt.sign({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = server.jwt.sign({
            userId: user.id,
            type: 'refresh',
        }, {
            expiresIn: '30d', // Refresh token expires in 30 days
        });

        // Store refresh token in database
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            },
        });

        // Set HttpOnly cookie for refresh token
        reply.setCookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        });

        return reply.code(201).send({
            success: true,
            data: {
                user,
                accessToken,
            },
        });
    });

    // POST /login
    server.post<{ Body: LoginBody }>('/login', async (request, reply) => {
        const { email, password } = request.body;

        // Validate input
        if (!email || !password) {
            return reply.code(400).send({
                error: 'Bad Request',
                message: 'Email and password are required',
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Invalid email or password',
            });
        }

        // Verify password with Argon2
        const validPassword = await argon2.verify(user.passwordHash, password);

        if (!validPassword) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const accessToken = server.jwt.sign({
            userId: user.id,
            email: user.email,
        });

        const refreshToken = server.jwt.sign({
            userId: user.id,
            type: 'refresh',
        }, {
            expiresIn: '30d',
        });

        // Store refresh token
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        // Set HttpOnly cookie
        reply.setCookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
        });

        return reply.send({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                accessToken,
            },
        });
    });

    // POST /logout
    server.post('/logout', async (request, reply) => {
        // Get refresh token from cookie
        const refreshToken = request.cookies.refreshToken;

        if (refreshToken) {
            // Delete refresh token from database
            await prisma.refreshToken.deleteMany({
                where: { token: refreshToken },
            });
        }

        // Clear cookie
        reply.clearCookie('refreshToken', {
            path: '/',
        });

        return reply.send({
            success: true,
            message: 'Logged out successfully',
        });
    });

    // POST /refresh
    server.post<{ Body: RefreshTokenBody }>('/refresh', async (request, reply) => {
        // Get refresh token from cookie or body
        const refreshToken = request.cookies.refreshToken || request.body.refreshToken;

        if (!refreshToken) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Refresh token required',
            });
        }

        try {
            // Verify refresh token
            const decoded = server.jwt.verify(refreshToken) as any;

            if (decoded.type !== 'refresh') {
                throw new Error('Invalid token type');
            }

            // Check if token exists in database
            const storedToken = await prisma.refreshToken.findUnique({
                where: { token: refreshToken },
            });

            if (!storedToken || storedToken.expiresAt < new Date()) {
                throw new Error('Token expired or invalid');
            }

            // Generate new access token
            const accessToken = server.jwt.sign({
                userId: decoded.userId,
                email: decoded.email,
            });

            return reply.send({
                success: true,
                data: {
                    accessToken,
                },
            });
        } catch (error) {
            return reply.code(401).send({
                error: 'Unauthorized',
                message: 'Invalid or expired refresh token',
            });
        }
    });

    // GET /me (protected route)
    server.get('/me', {
        preHandler: [server.authenticate],
    }, async (request, reply) => {
        const user = await prisma.user.findUnique({
            where: { id: (request as any).user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });

        if (!user) {
            return reply.code(404).send({
                error: 'Not Found',
                message: 'User not found',
            });
        }

        return reply.send({
            success: true,
            data: user,
        });
    });
};

// ============================================================================
// EXPORTS
// ============================================================================

export default authRoutes;
