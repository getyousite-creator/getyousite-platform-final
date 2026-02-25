'use server';

import { AuthService } from '@/lib/services/auth-service';
import { StoreService } from '@/lib/services/store-service';
import { ActionResult } from './auth-actions';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * SOVEREIGN UPGRADE PROTOCOL
 * Logic: Orchestrates the transition from 'Seed' to 'Empire' (Pro tier).
 * Truth: In simulation mode, this auto-provisions access. In production, this starts a checkout.
 */
export async function initiateUpgradeAction(storeId: string): Promise<ActionResult<{ checkoutUrl?: string; isSimulated?: boolean }>> {
    try {
        const user = await AuthService.requireAuth();

        // 1. Simulation Check (Bypassing external complexity during rapid iteration)
        if (process.env.TRIAL_MODE === 'true' || process.env.NEXT_PUBLIC_ALLOW_SIMULATION === 'true') {

            const supabase = await createClient();

            // Update User to PRO Tier
            await supabase.from('users').update({
                tier: 'pro',
                credits: 999
            }).eq('id', user.id);

            // Update Store Status
            await StoreService.updateStore(storeId, { status: 'draft' });

            revalidatePath(`/dashboard`);
            revalidatePath(`/editor/${storeId}`);

            return {
                success: true,
                data: { isSimulated: true }
            };
        }

        // 2. Production Path: Stripe Orchestration
        // TODO: Integrate Stripe Checkout creation here
        return { success: false, error: "Stripe Production Circuit Not Wired. Use TRIAL_MODE=true for testing." };

    } catch (e) {
        return { success: false, error: e instanceof Error ? e.message : "Handshake failure in Upgrade Circuit" };
    }
}

/**
 * CHECK TIER LOGIC
 */
export async function getSubscriptionStatusAction(): Promise<ActionResult<{ tier: string; credits: number }>> {
    try {
        const user = await AuthService.requireAuth();
        const profile = await AuthService.getUserProfile(user.id);

        return {
            success: true,
            data: {
                tier: profile?.tier || 'starter',
                credits: profile?.credits || 0
            }
        };
    } catch (e) {
        return { success: false, error: "Auth failure" };
    }
}
