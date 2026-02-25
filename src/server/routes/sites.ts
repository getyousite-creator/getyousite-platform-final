import { FastifyPluginAsync } from 'fastify';

const siteRoutes: FastifyPluginAsync = async (server) => {
    server.get('/', async () => {
        return { message: 'Site routes coming soon' };
    });
};

export default siteRoutes;
