import { PrismaClient } from '@prisma/client';

/**
 * DB Vault Protocol
 * Optimized connection pooling for high-concurrency Fastify context.
 */

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Models that support soft deletes
const SOFT_DELETE_MODELS = ['user', 'site'];

export const db = (globalThis.prisma ?? prismaClientSingleton()).$extends({
    query: {
        $allModels: {
            async findMany({ model, args, query }: { model: string, args: any, query: (args: any) => Promise<any> }) {
                if (SOFT_DELETE_MODELS.includes(model.toLowerCase())) {
                    args.where = { deletedAt: null, ...args.where };
                }
                return query(args);
            },
            async findFirst({ model, args, query }: { model: string, args: any, query: (args: any) => Promise<any> }) {
                if (SOFT_DELETE_MODELS.includes(model.toLowerCase())) {
                    args.where = { deletedAt: null, ...args.where };
                }
                return query(args);
            },
            async findUnique({ model, args, query }: { model: string, args: any, query: (args: any) => Promise<any> }) {
                if (SOFT_DELETE_MODELS.includes(model.toLowerCase())) {
                    args.where = { deletedAt: null, ...args.where };
                }
                return query(args);
            },
            async delete({ model, args }: { model: string, args: any }) {
                if (SOFT_DELETE_MODELS.includes(model.toLowerCase())) {
                    // Cast to any to access the model dynamically on the base client
                    const baseClient = (globalThis.prisma ?? prismaClientSingleton()) as any;
                    return baseClient[model].update({
                        ...args,
                        data: { deletedAt: new Date() },
                    });
                }
                // Fallback to real delete for models without soft-delete support
                const baseClient = (globalThis.prisma ?? prismaClientSingleton()) as any;
                return baseClient[model].delete(args);
            },
        },
    },
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db as any;
