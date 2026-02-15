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
 * SOVEREIGN LEAD CAPTURE ACTION
 * Logic: Captures visitor data and persists it to the store's vault.
 * Supports both FormData (for forms) and raw objects (for direct orchestration).
 */
export async function captureStoreLeadAction(input: LeadCaptureData | FormData) {
    const supabase = await createClient();

    let data: LeadCaptureData;

    if (input instanceof FormData) {
        data = {
            storeId: input.get('store_id') as string,
            email: input.get('email') as string,
            fullName: input.get('full_name') as string,
            message: input.get('message') as string,
        };
    } else {
        data = input;
    }

    if (!data.storeId || !data.email) {
        return { success: false, error: "PROTOCOL_ERROR: Required fields missing." };
    }

    const { error } = await supabase
        .from('store_leads')
        .insert({
            store_id: data.storeId,
            email: data.email,
            full_name: data.fullName,
            message: data.message,
            metadata: {
                user_agent: "Detected",
                source: "SmartForm_v1"
            }
        });

    if (error) {
        console.error("LEAD_CAPTURE_ERROR:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
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
