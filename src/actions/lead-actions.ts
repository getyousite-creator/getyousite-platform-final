"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface LeadCaptureData {
    storeId: string;
    email: string;
    fullName?: string;
    message?: string;
}

/**
 * Capture a lead for a specific store
 */
export async function captureStoreLeadAction(data: LeadCaptureData) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('store_leads')
        .insert({
            store_id: data.storeId,
            email: data.email,
            full_name: data.fullName,
            message: data.message,
            metadata: {
                user_agent: "Sovereign-Browser",
                ip_source: "Neural-Link"
            }
        });

    if (error) {
        console.error("LEAD_CAPTURE_ERROR:", error.message);
        return { success: false, message: error.message };
    }

    return { success: true };
}

/**
 * Fetch leads for the current user's stores
 */
export async function getStoreLeadsAction() {
    const supabase = await createClient();

    const { data: leads, error } = await supabase
        .from('store_leads')
        .select(`
            *,
            stores(name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("FETCH_LEADS_ERROR:", error.message);
        return [];
    }

    return leads;
}

/**
 * Update lead status (e.g., mark as contacted)
 */
export async function updateLeadStatusAction(leadId: string, status: 'new' | 'contacted' | 'archived') {
    const supabase = await createClient();

    const { error } = await supabase
        .from('store_leads')
        .update({ status })
        .eq('id', leadId);

    if (error) {
        return { success: false, message: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true };
}
