import { FastifyPluginAsync } from 'fastify';

const analyticsRoutes: FastifyPluginAsync = async (server) => {
    server.get('/', async () => {
        return { message: 'Analytics routes coming soon' };
    });
};

export default analyticsRoutes;
