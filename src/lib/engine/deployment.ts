import { SiteBlueprint } from '../schemas';
import { StoreService } from '../services/store-service';
import { SentryService } from '../services/sentry-service';

/**
 * SOVEREIGN DEPLOYMENT ENGINE
 * 
 * Logic audit: Production orchestration via Vercel REST API.
 */
export const DeploymentEngine = {
    async deployToProduction(siteId: string, providedBlueprint?: SiteBlueprint) {
        console.log("DEPLOYMENT_ENGINE: Ignition sequence start for", siteId);

        await SentryService.logSecurityEvent({
            level: 'info',
            source: 'DeploymentEngine',
            message: `Initiating provisioning for site node: ${siteId}`,
            metadata: { siteId }
        });

        try {
            // 1. Logic Hardening: Environment check
            const vercelToken = process.env.VERCEL_TOKEN;
            if (!vercelToken && process.env.NODE_ENV === 'production') {
                throw new Error("VERCEL_TOKEN_MISSING: Deployment aborted.");
            }

            // 2. Fetch Blueprint & Verify Integrity
            const { data: store, error: fetchError } = await StoreService.getStoreById(siteId);

            if (fetchError || !store) {
                throw new Error(`STORE_NOT_FOUND: Cannot provision non-existent asset [${siteId}]`);
            }

            // 3. Status Guard: Enforce sequence [paid -> deploying -> deployed]
            // Logic: We do not deploy unpaid assets unless in debug/dev mode.
            if (store.status !== 'paid' && store.status !== 'deploying' && process.env.NODE_ENV === 'production') {
                throw new Error(`STATUS_BYPASS_DETECTED: Asset ${siteId} must be [paid] before deployment.`);
            }

            if (store.status === 'deployed') {
                console.log("DEPLOYMENT_ENGINE: Asset already established. Synchronizing metadata...");
                return { success: true, url: store.deployment_url };
            }

            // 4. Provision Slug (Subdomain)
            // Logic: If slug is missing, we synthesize one from the business name.
            let slug = store.slug;
            if (!slug) {
                slug = store.name.toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                // Append entropy for uniqueness if needed (Real implementation would check collisions)
                slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
            }

            // 5. Update Status to Provisioning
            await StoreService.updateStore(siteId, {
                status: 'deploying',
                slug
            });

            // 6. PROVISIONING ARCHITECTURE (Orchestrating Global Edge)
            const hostname = store.custom_domain || `${slug}.getyousite.com`;
            console.log(`DEPLOYMENT_ENGINE: Provisioning Edge Node for ${hostname}`);

            // Trigger the absolute truth provisioning action via VercelService
            const { VercelService } = await import('../services/vercel-service');
            const provisionResult = await VercelService.addDomain(hostname);

            if (!provisionResult.success) {
                console.error("[DEPLOYMENT_CRITICAL] Edge provisioning failed:", provisionResult.error);
                await StoreService.updateStore(siteId, {
                    status: 'failed'
                });
                return {
                    success: false,
                    error: provisionResult.error || "Edge provisioning failed."
                };
            }

            const liveUrl = `https://${hostname}`;

            // 7. NEURAL METADATA PROPAGATION
            // Logic: Synchronize blueprint SEO data with store columns for Truth-Based Scoring.
            const blueprint = store.blueprint as any;
            const seoTags = blueprint?.metadata?.seo || {};

            // 8. FINAL TRUTH: Establish Sovereign Presence
            await StoreService.updateStore(siteId, {
                status: 'deployed',
                deployment_url: liveUrl,
                deployed_at: new Date(),
                seo_title: seoTags.title || store.name,
                seo_description: seoTags.description || store.description,
                seo_keywords: seoTags.keywords || []
            });

            console.log("DEPLOYMENT_ENGINE: Establish Protocol SUCCESS for", siteId);

            // 9. SEO AUTO-PILOT: Notify crawlers (Protocol 11)
            // Fire-and-forget to avoid blocking the user response
            const { SEOAutomationService } = await import('../services/seo-automation-service');
            SEOAutomationService.pingSearchEngines(hostname).catch(e => console.error("SEO_PING_FAILURE:", e));

            await SentryService.logSecurityEvent({
                level: 'info',
                source: 'DeploymentEngine',
                message: `Sovereign Presence established for ${hostname}`,
                metadata: { siteId, liveUrl }
            });

            return {
                success: true,
                url: liveUrl,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await SentryService.logSecurityEvent({
                level: 'critical',
                source: 'DeploymentEngine',
                message: `Deployment Anomaly detected for ${siteId}`,
                metadata: { siteId, error: error instanceof Error ? error.message : 'Unknown' }
            });
            await StoreService.updateStore(siteId, { status: 'failed' });
            throw error;
        }
    }
};
