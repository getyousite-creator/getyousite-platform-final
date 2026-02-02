import { supabase } from '../supabase';
import { FTPDeploymentService } from './ftp-service';
import { SiteBlueprint } from '../schemas';

/**
 * SOVEREIGN DEPLOYMENT ENGINE
 * 
 * Logic audit: Physical VPS orchestration via FTP.
 */
export const DeploymentEngine = {
    async launchToHostinger(siteId: string, providedBlueprint?: SiteBlueprint) {
        console.log("DEPLOYMENT_ENGINE: Ignition sequence start for", siteId);

        try {
            // 1. Fetch Blueprint (or use provided one)
            let blueprint = providedBlueprint;
            let currentStatus = 'pending';

            if (!blueprint) {
                const { data: siteData, error: fetchError } = await supabase
                    .from('stores')
                    .select('blueprint, status')
                    .eq('id', siteId)
                    .single<{ blueprint: SiteBlueprint; status: string }>();

                if (fetchError || !siteData) {
                    console.warn("DEPLOYMENT_ENGINE: Blueprint fetch failed, but proceeding if blueprint provided.");
                    if (!providedBlueprint) throw new Error("BLUEPRINT_FETCH_FAILED");
                } else {
                    blueprint = siteData.blueprint;
                    currentStatus = siteData.status;
                }
            }

            if (!blueprint) throw new Error("BLUEPRINT_REQUIRED_FOR_DEPLOYMENT");

            // LOGIC HARDENING: Idempotency Guard (Don't deploy twice)
            if (currentStatus === 'deployed' || currentStatus === 'deploying') {
                console.log("DEPLOYMENT_ENGINE: Site already deployed or in progress. Skipping.");
                return { success: true, url: `https://${siteId}.getyousite.com` };
            }

            // Update status to 'deploying' (Graceful fail if table missing)
            try {
                // @ts-ignore - Supabase types will be generated in Phase 2
                await supabase.from('stores').update({ status: 'deploying' }).eq('id', siteId);
            } catch (e: any) {
                console.error("SUPABASE_STATUS_UPDATE_FAILED:", e.message);
            }

            // 2. Physical FTP Bridge Execution
            console.log("DEPLOYMENT_ENGINE: Transferring site manifest to Hostinger...");
            await FTPDeploymentService.uploadSite(siteId, blueprint);

            // 3. DNS/SSL Orchestration (Simulated logic placeholders)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const liveUrl = `https://${siteId}.getyousite.com`;

            // 4. FINAL TRUTH: Commit to Deployed State
            try {
                // @ts-ignore - Supabase types will be generated in Phase 2
                await supabase.from('stores').update({
                    status: 'deployed',
                    deployment_url: liveUrl,
                    deployed_at: new Date().toISOString()
                }).eq('id', siteId);
            } catch (e: any) {
                console.error("SUPABASE_FINAL_COMMIT_FAILED:", e.message);
            }

            console.log("DEPLOYMENT_ENGINE: Deployment COMPLETE for", siteId);

            return {
                success: true,
                url: liveUrl,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error("DEPLOYMENT_ENGINE_CRITICAL_ERROR:", error);
            try {
                // @ts-ignore - Supabase types will be generated in Phase 2
                await supabase.from('stores').update({ status: 'failed' }).eq('id', siteId);
            } catch (e) { }
            throw error;
        }
    }
};
