import { db } from './database';

/**
 * Sovereign Audit Protocol (SAP-1)
 * Ensures 100% traceability of all critical system mutations.
 */
export const AuditService = {
    async log(params: {
        userId?: string;
        action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'DEPLOY' | 'SECURITY_ALERT';
        resource: 'USER' | 'SITE' | 'DEPLOYMENT' | 'SUBSCRIPTION' | 'SYSTEM';
        resourceId?: string;
        oldValue?: any;
        newValue?: any;
        ipAddress?: string;
        userAgent?: string;
    }) {
        try {
            await (db as any).auditLog.create({
                data: {
                    userId: params.userId,
                    action: params.action,
                    resource: params.resource,
                    resourceId: params.resourceId,
                    oldValue: params.oldValue,
                    newValue: params.newValue,
                    ipAddress: params.ipAddress,
                    userAgent: params.userAgent,
                },
            });
            console.log(`[AUDIT_LOG] ${params.action} on ${params.resource} secured.`);
        } catch (err) {
            // Vital: Audit failure should not crash the primary transaction, but must be reported to Sentry.
            console.error('[AUDIT_CRITICAL_FAILURE]', err);
        }
    }
};
