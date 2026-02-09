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
            analytics(views, visitors), 
            seo_audits(overall_score)
        `)
        .eq('user_id', userId);

    if (error || !stores) {
        console.error('Intelligence Action Error:', error);
        return [];
    }

    // 2. Map Intelligence Matrix
    return stores.map(store => {
        // Aggregating analytics records (if multiple exist for different dates)
        const analytics = (store.analytics as any[]) || [];
        const totalViews = analytics.reduce((acc, a) => acc + (a.views || 0), 0);

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
            status: store.status,
            health: seoScore > 80 ? 'Optimal' : seoScore > 50 ? 'Degraded' : 'Critical'
        };
    });
}

export async function triggerNeuralAuditAction(storeId: string) {
    // This will trigger the SEOService
    const { SEOService } = await import('@/lib/services/seo-service');
    return await SEOService.analyzeStore(storeId);
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
