/**
 * Store Server Actions
 * 
 * Secure interface for store operations.
 * Uses StoreService and AuthService to enforce logic and security.
 */

'use server';

import { StoreService } from '@/lib/services/store-service';
import { AuthService } from '@/lib/services/auth-service';
import { SiteBlueprint } from '@/lib/schemas';
import { ActionResult } from './auth-actions';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Save a store blueprint
 * If storeId is provided, it updates. If not, it creates a new store.
 */
export async function saveStoreAction(
    blueprint: SiteBlueprint,
    name: string,
    description?: string,
    storeId?: string
): Promise<ActionResult<{ id: string }>> {
    try {
        // 1. Verify Auth
        const user = await AuthService.getCurrentUser();
        if (!user.data) {
            return {
                success: false,
                error: 'Unauthorized. Please login to save your store.',
            };
        }

        // 2. Create or Update
        if (storeId) {
            const result = await StoreService.updateStore(storeId, {
                name,
                description,
                blueprint,
            });

            if (result.error) return { success: false, error: result.error.message };
            revalidatePath(`/customizer`);
            return { success: true, data: { id: result.data!.id } };

        } else {
            const result = await StoreService.createStore({
                name,
                description,
                blueprint,
            });

            if (result.error) return { success: false, error: result.error.message };
            return { success: true, data: { id: result.data!.id } };
        }

    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Update store status (e.g., after user initiates checkout)
 * LOGIC HARDENING: Only non-critical status transitions are allowed via client actions.
 * Statuses like 'paid', 'deploying', or 'deployed' MUST be set via server-side webhooks.
 */
export async function updateStoreStatusAction(storeId: string, status: string): Promise<ActionResult> {
    const ALLOWED_CLIENT_STATUSES = ['draft', 'pending_payment'];

    try {
        const user = await AuthService.getCurrentUser();
        if (!user.data) {
            return { success: false, error: 'Unauthorized' };
        }

        // 1. Security Gate: Prevent status spoofing
        if (!ALLOWED_CLIENT_STATUSES.includes(status)) {
            console.error(`SECURITY_VIOLATION: User ${user.data.id} attempted to manually set status ${status} for store ${storeId}`);
            return {
                success: false,
                error: 'Restricted transition. This status must be verified by a secure provider.'
            };
        }

        // 2. Ownership Gate: Handled by StoreService.updateStore (Prisma RLS/Where)
        const result = await StoreService.updateStore(storeId, { status: status as any });

        if (result.error) return { success: false, error: result.error.message };

        revalidatePath(`/dashboard`);
        revalidatePath(`/customizer`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Get store status
 */
export async function getStoreStatusAction(storeId: string): Promise<ActionResult<{ status: string; deployment_url?: string | null }>> {
    try {
        const result = await StoreService.getStoreById(storeId);

        if (result.error) {
            return { success: false, error: result.error.message };
        }

        if (!result.data) {
            return { success: false, error: 'Store not found' };
        }

        return {
            success: true,
            data: {
                status: result.data.status,
                deployment_url: result.data.deployment_url
            }
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Get full store data securely
 */
export async function getStoreAction(storeId: string): Promise<ActionResult<{ id: string; user_id: string; name: string; blueprint: SiteBlueprint; vision?: string }>> {
    try {
        const result = await StoreService.getStoreById(storeId);
        if (result.error) return { success: false, error: result.error.message };
        if (!result.data) return { success: false, error: 'Store not found' };

        // Infer vision from description or blueprint if needed
        const vision = result.data.description || "";

        return {
            success: true,
            data: {
                id: result.data.id,
                user_id: result.data.user_id, // Expose for Client-Side RLS logic
                name: result.data.name,
                blueprint: result.data.blueprint,
                vision
            }
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
/**
 * Get public stores for showcase
 */
export async function getPublicStoresAction(limit: number = 20): Promise<ActionResult<any[]>> {
    try {
        const result = await StoreService.getPublicStores(limit);
        if (result.error) return { success: false, error: result.error.message };

        return {
            success: true,
            data: result.data || []
        };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * verifyDomainAction
 * Logic: Interfaces with Vercel to check DNS/SSL propagation for a custom domain.
 */
export async function verifyDomainAction(storeId: string): Promise<ActionResult<{ verified: boolean }>> {
    try {
        const user = await AuthService.getCurrentUser();
        if (!user.data) return { success: false, error: 'Unauthorized' };

        // 1. Fetch store and ensure user owns it
        const { data: store, error: fetchError } = await StoreService.getStoreById(storeId);
        if (fetchError || !store) return { success: false, error: 'Store node not found.' };
        if (store.user_id !== user.data.id) return { success: false, error: 'Permission denied for this asset.' };

        const hostname = store.custom_domain || (store.slug ? `${store.slug}.getyousite.com` : null);
        if (!hostname) return { success: false, error: 'No hostname assigned to this node.' };

        // 2. Perform Vercel Verification
        const { VercelService } = await import('@/lib/services/vercel-service');
        const verification = await VercelService.verifyDomain(hostname);

        if (!verification.success) {
            return { success: false, error: verification.error || "Dynamic verification link failure." };
        }

        return {
            success: true,
            data: { verified: verification.verified }
        };
    } catch (error) {
        return { success: false, error: "Network anomaly in verifyDomainAction." };
    }
}

/**
 * SIMULATION ACTION: Manually activate store for Dev/Demo
 * ONLY works if NODE_ENV is development or simulation mode is explicit.
 */
export async function activateStoreSimulationAction(storeId: string): Promise<ActionResult> {
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_ALLOW_SIMULATION) {
        return { success: false, error: "Simulation not allowed in production." };
    }

    try {
        const user = await AuthService.getCurrentUser();
        if (!user.data) return { success: false, error: 'Unauthorized' };

        await StoreService.updateStore(storeId, {
            status: 'deployed',
            deployment_url: `https://${storeId}.simulated-empire.com`
        });

        const supabase = await createClient();
        await supabase.from('users').update({ tier: 'pro' }).eq('id', user.data.id);

        revalidatePath(`/success/${storeId}`);
        revalidatePath(`/dashboard`);
        return { success: true };
    } catch (e) {
        return { success: false, error: "Simulation Failed" };
    }
}
