import { FastifyPluginAsync } from 'fastify';

const userRoutes: FastifyPluginAsync = async (server) => {
    server.get('/', async () => {
        return { message: 'User routes coming soon' };
    });
};

export default userRoutes;
