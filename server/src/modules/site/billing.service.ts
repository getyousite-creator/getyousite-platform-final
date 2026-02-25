import { db } from '../../lib/database.js';

/**
 * Sovereign Billing & Resource Governance Protocol (SBRG-1)
 * Ensures 100% adherence to resource limits and commercial loyalty.
 */
export const BillingService = {
    async getUserQuota(userId: string) {
        const subscription = await (db as any).subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' }
        });

        if (!subscription) {
            return {
                plan: 'FREE',
                sitesLimit: 1,
                sitesCount: await (db as any).site.count({ where: { userId } })
            };
        }

        return {
            plan: subscription.plan,
            sitesLimit: subscription.sitesLimit,
            sitesCount: await (db as any).site.count({ where: { userId } })
        };
    },

    async verifyQuota(userId: string) {
        const quota = await this.getUserQuota(userId);
        if (quota.sitesCount >= quota.sitesLimit) {
            throw new Error('Sovereign Limit Exceeded: Please upgrade your digital vault capacity.');
        }
        return true;
    }
};
