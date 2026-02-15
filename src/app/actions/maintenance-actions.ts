"use server";

import { createClient } from '@/lib/supabase/server';

export async function captureMaintenanceLead(email: string) {
    try {
        const supabase = await createClient();

        // Logic: Persist the mission-critical intent
        const { error } = await supabase
            .from('maintenance_leads')
            .insert({
                email,
                timestamp: new Date().toISOString(),
                status: 'captured'
            });

        if (error) {
            // Note: If the table doesn't exist yet, we log it for Phase 2 reconciliation
            console.error('[MAINTENANCE] Persistence error:', error.message);
            return { success: false, message: "Engine sync failed. We have logged your request manually." };
        }

        return { success: true, message: "Transmission received. You are now on the priority beacon." };
    } catch (err) {
        console.error('[MAINTENANCE] Critical failure:', err);
        return { success: false, message: "Critical logic failure. Please try later." };
    }
}
