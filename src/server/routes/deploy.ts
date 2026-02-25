import { FastifyPluginAsync } from 'fastify';

const deployRoutes: FastifyPluginAsync = async (server) => {
    server.get('/', async () => {
        return { message: 'Deployment routes coming soon' };
    });
};

export default deployRoutes;
