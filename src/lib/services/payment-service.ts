import { createClient } from '../supabase/server';

export type SubscriptionPlan = 'starter' | 'pro' | 'business' | 'enterprise';
export type SiteType = 'blog' | 'business' | 'store';

export interface UserSubscription {
    user_id: string;
    plan_id: SubscriptionPlan;
    allowed_site_type: SiteType;
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
                // Default Tier: Starter (Blog)
                return { user_id: userId, plan_id: 'starter', allowed_site_type: 'blog', status: 'active' };
            }

            return data as UserSubscription;
        } catch (e) {
            console.error("PaymentService.getUserSubscription Error:", e);
            return { user_id: userId, plan_id: 'starter', allowed_site_type: 'blog', status: 'active' };
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
        // STRIPE_TEMPORARILY_DISABLED (Strict Focus: PayPal + Bank Transfer)
        console.log(`Stripe disabled. Use PayPal/Bank for User ${userId}, Plan: ${planId}`);
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
        siteType: SiteType,
        method: 'cih' | 'barid' | 'cashplus',
        receiptUrl: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const pricingMAD: Record<SubscriptionPlan, number> = {
                starter: 499,
                pro: 999,
                business: 1499,
                enterprise: 2999
            };
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
                    site_type: siteType,
                    method,
                    amount: pricingMAD[planId],
                    currency_code: 'MAD',
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
     * SOVEREIGN COUPON ENGINE: Validate RAZANETEST bypass
     * Logic: If coupon is 'RAZANETEST', grant 100% discount for testing.
     */
    static validateCoupon(code: string): { valid: boolean; discount: number } {
        if (code.toUpperCase() === 'RAZANETEST') {
            return { valid: true, discount: 1.0 }; // 100% off
        }
        return { valid: false, discount: 0 };
    }

    /**
     * SOVEREIGN INSTANT: Activate subscription immediately (Coupon Bypass)
     */
    static async activateSubscriptionInstantly(userId: string, planId: SubscriptionPlan, siteType: SiteType): Promise<{ success: boolean; error?: string }> {
        try {
            const supabase = await createClient();
            const { error } = await supabase
                .from('user_subscriptions')
                .upsert({
                    user_id: userId,
                    plan_id: planId,
                    allowed_site_type: siteType,
                    status: 'active',
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            // Log as approved payment
            await supabase.from('payment_requests').insert({
                user_id: userId,
                plan_id: planId,
                site_type: siteType,
                method: 'coupon_bypass',
                amount: 0,
                currency_code: 'USD',
                status: 'approved',
                admin_notes: 'System Activated: RAZANETEST'
            });

            // SOVEREIGN SYNC: Promote all pending_payment stores for this user to 'paid'
            await supabase
                .from('stores')
                .update({ status: 'paid', paid_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('status', 'pending_payment');

            return { success: true };
        } catch (e) {
            return { success: false, error: (e as Error).message };
        }
    }

    /**
     * SOVEREIGN AUTO: Update subscription status after successful global capture
     */
    static async handlePayPalCapture(userId: string, planId: SubscriptionPlan, siteType: SiteType): Promise<{ success: boolean }> {
        try {
            const pricingUSD: Record<SubscriptionPlan, number> = {
                starter: 55,
                pro: 110,
                business: 165,
                enterprise: 330
            };
            const supabase = await createClient();

            // 1. Update user_subscriptions
            const { error: subError } = await supabase
                .from('user_subscriptions')
                .upsert({
                    user_id: userId,
                    plan_id: planId,
                    allowed_site_type: siteType,
                    status: 'active',
                    updated_at: new Date().toISOString()
                });

            if (subError) throw subError;

            // 2. Log payment locally
            await supabase.from('payment_requests').insert({
                user_id: userId,
                plan_id: planId,
                site_type: siteType,
                method: 'paypal',
                amount: pricingUSD[planId],
                currency_code: 'USD',
                status: 'approved'
            });

            // SOVEREIGN SYNC: Promote all pending_payment stores for this user to 'paid'
            await supabase
                .from('stores')
                .update({ status: 'paid', paid_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('status', 'pending_payment');

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
                        allowed_site_type: request.site_type,
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


