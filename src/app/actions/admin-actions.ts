"use server";

import { PaymentService } from "@/lib/services/payment-service";
import { revalidatePath } from "next/cache";

/**
 * ADMIN: Approve Payment Request
 * Logic: Transitions status from 'pending' to 'approved' and activates the subscription.
 */
export async function approvePaymentRequestAction(requestId: string, adminNotes?: string) {
    // SECURITY NOTE: In a production environment, you would check admin Role here via Supabase metadata.
    const result = await PaymentService.processRequest(requestId, 'approved', adminNotes);
    if (result.success) {
        revalidatePath('/admin/payments');
        revalidatePath('/dashboard');
    }
    return result;
}

/**
 * ADMIN: Reject Payment Request
 * Logic: Transitions status to 'rejected' for audit and anti-fraud tallying.
 */
export async function rejectPaymentRequestAction(requestId: string, reason: string) {
    const result = await PaymentService.processRequest(requestId, 'rejected', reason);
    if (result.success) {
        revalidatePath('/admin/payments');
    }
    return result;
}

/**
 * ADMIN: Fetch Pending Requests
 */
export async function getPendingRequestsAction() {
    return await PaymentService.getPendingRequests();
}
