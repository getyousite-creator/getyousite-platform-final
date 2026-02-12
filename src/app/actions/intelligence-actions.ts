"use server";

import { createClient } from '@/lib/supabase/server';

export async function getGlobalPerformanceAction(userId: string) {
    const supabase = await createClient();

    // 1. Fetch all user sites (stores)
    const { data: stores, error } = await supabase
        .from('stores')
        .select(`
            id, 
            name, 
            status, 
            analytics(views, visitors, session_duration), 
            seo_audits(overall_score)
        `)
        .eq('user_id', userId);

    if (error || !stores) {
        console.error('Intelligence Action Error:', error);
        return [];
    }

    // 2. Map Intelligence Matrix
    return stores.map(store => {
        const analytics = (store.analytics as any[]) || [];
        const totalViews = analytics.reduce((acc, a) => acc + (a.views || 0), 0);
        const totalDuration = analytics.reduce((acc, a) => acc + (a.session_duration || 0), 0);
        const sessions = analytics.length;

        // Logic: Resonance is high if avg session > 45 seconds
        const avgSession = sessions > 0 ? totalDuration / sessions : 0;
        const logicalResonance = Math.min(100, Math.round((avgSession / 45) * 100));

        // Getting the most recent SEO score
        const seoAudits = (store.seo_audits as any[]) || [];
        const latestAudit = seoAudits.sort((a, b) =>
            new Date(b.analyzed_at || 0).getTime() - new Date(a.analyzed_at || 0).getTime()
        )[0];

        const seoScore = latestAudit?.overall_score || 0;

        return {
            id: store.id,
            name: store.name,
            views: totalViews,
            seoScore,
            logicalResonance,
            status: store.status,
            health: seoScore > 80 ? 'Optimal' : seoScore > 50 ? 'Degraded' : 'Critical'
        };
    });
}

export async function triggerNeuralAuditAction(storeId: string) {
    const supabase = await createClient();

    // 1. Fetch Store Blueprint
    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

    if (!store || !store.settings?.blueprint) {
        throw new Error("Store blueprint not found");
    }

    // 2. Execute Neural Audit
    const { NeuralAuditEngine } = await import('@/lib/ai/neural-audit');
    const auditResult = await NeuralAuditEngine.auditBlueprint(store.settings.blueprint, store.settings.locale || 'en');

    // 3. Save Deep Analysis
    const { error } = await supabase.from('seo_audits').insert({
        store_id: storeId,
        overall_score: auditResult.overall_score,
        seo_score: auditResult.vectors.seo.score,
        performance_score: auditResult.vectors.conversion.score, // Mapping conversion to performance slot for now
        accessibility_score: auditResult.vectors.visual.score,
        best_practices_score: auditResult.vectors.content.score,
        issues: [
            ...auditResult.vectors.seo.issues.map((i: string) => ({ type: 'error', category: 'SEO', message: i, priority: 1 })),
            ...auditResult.vectors.conversion.issues.map((i: string) => ({ type: 'warning', category: 'Conversion', message: i, priority: 2 }))
        ],
        recommendations: auditResult.action_plan,
        analyzed_at: new Date().toISOString(),
        details: auditResult // New JSONB column usage if available, else ignored
    });

    if (error) console.error("Audit Save Failed:", error);

    return auditResult;
}

export async function getAuditDetailsAction(storeId: string) {
    const supabase = await createClient();

    const { data: audits, error } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('store_id', storeId)
        .order('analyzed_at', { ascending: false })
        .limit(1);

    if (error || !audits || audits.length === 0) {
        return null;
    }

    return audits[0];
}

/**
 * getSecurityPulseAction
 * Logic: Fetch global security anomalies for the Command Center.
 */
export async function getSecurityPulseAction() {
    const supabase = await createClient();

    const { data: logs, error } = await supabase
        .from('system_logs')
        .select('*')
        .or('level.eq.critical,level.eq.error')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("SEC_PULSE_FETCH_FAILURE:", error);
        return [];
    }

    return logs || [];
}
