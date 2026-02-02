"use server";

import { PaymentService, SubscriptionPlan } from "@/lib/services/payment-service";
import { AuthService } from "@/lib/services/auth-service";
import { revalidatePath } from "next/cache";

export type PaymentResult = {
    success: boolean;
    error?: string;
};

/**
 * Handle PayPal Success Result (Global)
 */
export async function handlePayPalSuccessAction(planId: SubscriptionPlan): Promise<PaymentResult> {
    try {
        const user = await AuthService.getCurrentUser();
        if (!user.data) return { success: false, error: "Authentication required" };

        const result = await PaymentService.handlePayPalCapture(user.data.id, planId);
        if (result.success) {
            revalidatePath('/dashboard');
            return { success: true };
        }
        return { success: false, error: "Failed to finalize subscription" };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

/**
 * Submit Proof of Payment (Morocco Manual)
 */
export async function submitPaymentProofAction(
    planId: SubscriptionPlan,
    method: 'cih' | 'barid' | 'cashplus',
    receiptUrl: string
): Promise<PaymentResult> {
    try {
        const user = await AuthService.getCurrentUser();
        if (!user.data) return { success: false, error: "Authentication required" };

        const result = await PaymentService.submitPaymentProof(user.data.id, planId, method, receiptUrl);
        if (result.success) {
            return { success: true };
        }
        return { success: false, error: "Failed to submit payment request" };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
