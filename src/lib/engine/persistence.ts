import { supabase } from '../supabase';
import { SiteBlueprint } from '../schemas';

export const BlueprintPersistence = {
    /**
     * ARCHIVE BLUEPRINT
     * Logic: Save the site configuration as 'pending' before payment.
     */
    async archive(blueprint: SiteBlueprint) {
        if (!blueprint.id) throw new Error("BLUEPRINT_ID_MISSING");

        console.log("PERSISTENCE: Archiving site", blueprint.id);

        const { error } = await supabase
            .from('stores')
            .upsert({
                id: blueprint.id,
                blueprint: blueprint,
                status: 'pending_payment',
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("PERSISTENCE_FAILURE:", error.message);
            // Non-blocking but logged
        }
    },

    /**
     * FETCH STATUS
     * Logic: Get the current deployment state from the source of truth.
     */
    async getStatus(siteId: string): Promise<{ status: string; deployment_url?: string }> {
        const { data, error } = await supabase
            .from('stores')
            .select('status, deployment_url')
            .eq('id', siteId)
            .single();

        if (error || !data) return { status: 'unknown' };
        return data as { status: string; deployment_url?: string };
    },

    /**
     * MARK PAID
     * Logic: Transition site to paid state to trigger deployment logic.
     */
    async markAsPaid(siteId: string) {
        await supabase
            .from('stores')
            .update({ status: 'paid', paid_at: new Date().toISOString() })
            .eq('id', siteId);
    }
};
