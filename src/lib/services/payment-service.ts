import { createClient } from '../supabase/server';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface UserSubscription {
    user_id: string;
    plan_id: SubscriptionPlan;
    status: string;
    current_period_end?: string;
}

export class PaymentService {
    /**
     * Fetch user's current subscription status
     * (Sovereign Logic: Server-side check with RLS enforcement)
     */
    static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
        try {
            const supabase = await createClient();
            const { data, error } = await supabase
                .from('user_subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error || !data) {
                // If no entry, we assume 'free' tier by default
                return { user_id: userId, plan_id: 'free', status: 'active' };
            }

            return data as UserSubscription;
        } catch (e) {
            console.error("PaymentService.getUserSubscription Error:", e);
            return { user_id: userId, plan_id: 'free', status: 'active' };
        }
    }

    /**
     * Validate if user has access to a specific template/feature
     */
    static async hasProAccess(userId: string): Promise<boolean> {
        const sub = await this.getUserSubscription(userId);
        return sub?.plan_id === 'pro' || sub?.plan_id === 'enterprise';
    }

    /**
     * Logic for Stripe Checkout (Placeholder for future hookup)
     * (Strict Constraint: We handle pricing and redirect here)
     */
    static async createCheckoutSession(userId: string, planId: SubscriptionPlan): Promise<string | null> {
        // This will eventually call Stripe API
        console.log(`Creating Checkout Session for User ${userId}, Plan: ${planId}`);
        // Return dummy URL for now
        return "#checkout";
    }

    /**
     * Logic for Template Gating
     */
    static isTemplatePremium(template_id: string): boolean {
        const premiumTemplates = ['AlphaStorePro', 'LuxeCart', 'CyberPortfolio', 'VermaHospitality'];
        return premiumTemplates.includes(template_id);
    }

    /**
     * SOVEREIGN ANTI-FRAUD: Check for receipt spam
     * Logic: If a user has > 3 rejected requests in the last 24h, block submissions.
     */
    static async checkSpamProtection(userId: string): Promise<{ blocked: boolean; remainingStrikes: number }> {
        try {
            const supabase = await createClient();
            const { count } = await supabase
                .from('payment_requests')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'rejected')
                .gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

            const rejectedCount = count || 0;
            return {
                blocked: rejectedCount >= 3,
                remainingStrikes: Math.max(0, 3 - rejectedCount)
            };
        } catch {
            return { blocked: false, remainingStrikes: 3 };
        }
    }

    /**
     * SOVEREIGN HYBRID: Submit Proof of Payment (Manual Morocco Flow)
     */
    static async submitPaymentProof(
        userId: string,
        planId: SubscriptionPlan,
        method: 'cih' | 'barid' | 'cashplus',
        receiptUrl: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // 1. Check Spam protection
            const spam = await this.checkSpamProtection(userId);
            if (spam.blocked) {
                return { success: false, error: "Submission blocked. Too many rejected attempts. Contact support." };
            }

            const supabase = await createClient();
            const { error } = await supabase
                .from('payment_requests')
                .insert({
                    user_id: userId,
                    plan_id: planId,
                    method,
                    amount: planId === 'pro' ? 49 : 199,
                    receipt_url: receiptUrl,
                    status: 'pending'
                });

            if (error) throw error;
            return { success: true };
        } catch (e) {
            const error = e as Error;
            console.error("PaymentService.submitPaymentProof Error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * SOVEREIGN AUTO: Update subscription status after successful global capture
     */
    static async handlePayPalCapture(userId: string, planId: SubscriptionPlan): Promise<{ success: boolean }> {
        try {
            const supabase = await createClient();

            // 1. Update user_subscriptions
            const { error: subError } = await supabase
                .from('user_subscriptions')
                .upsert({
                    user_id: userId,
                    plan_id: planId,
                    status: 'active',
                    updated_at: new Date().toISOString()
                });

            if (subError) throw subError;

            // 2. Log payment locally
            await supabase.from('payment_requests').insert({
                user_id: userId,
                plan_id: planId,
                method: 'paypal',
                amount: planId === 'pro' ? 49 : 199,
                status: 'approved'
            });

            return { success: true };
        } catch (e) {
            console.error("PaymentService.handlePayPalCapture Error:", e);
            return { success: false };
        }
    }

    /**
     * ADMIN: Fetch all pending payment requests
     */
    static async getPendingRequests(): Promise<unknown[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('payment_requests')
            .select('*, profiles:user_id(email)')
            .eq('status', 'pending')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    }

    /**
     * ADMIN: Approve or Reject a manual request
     */
    static async processRequest(requestId: string, status: 'approved' | 'rejected', adminNotes?: string): Promise<{ success: boolean }> {
        try {
            const supabase = await createClient();

            // 1. Get request details
            const { data: request, error: fetchError } = await supabase
                .from('payment_requests')
                .select('*')
                .eq('id', requestId)
                .single();

            if (fetchError || !request) throw new Error("Request not found");

            // 2. Update Request Status
            const { error: updateError } = await supabase
                .from('payment_requests')
                .update({
                    status,
                    admin_notes: adminNotes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', requestId);

            if (updateError) throw updateError;

            // 3. If approved, activate subscription
            if (status === 'approved') {
                const { error: subError } = await supabase
                    .from('user_subscriptions')
                    .upsert({
                        user_id: request.user_id,
                        plan_id: request.plan_id,
                        status: 'active',
                        updated_at: new Date().toISOString()
                    });
                if (subError) throw subError;
            }

            return { success: true };
        } catch (e) {
            console.error("PaymentService.processRequest Error:", e);
            return { success: false };
        }
    }
}


