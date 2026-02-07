import { createClient } from "@/lib/supabase/server";

export class PaymentService {
    static async processRequest(requestId: string, status: 'approved' | 'rejected', notes?: string) {
        const supabase = await createClient();

        // 1. Fetch the request to get user and plan info
        const { data: request, error: fetchError } = await supabase
            .from('payment_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !request) return { success: false, error: "Request not found." };

        // 2. Atomic Update of Request
        const { error: updateError } = await supabase
            .from('payment_requests')
            .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
            .eq('id', requestId);

        if (updateError) return { success: false, error: updateError.message };

        // 3. If approved, activate subscription
        if (status === 'approved') {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    subscription_status: 'active',
                    plan_id: request.plan_id
                })
                .eq('id', request.user_id);

            if (profileError) return { success: false, error: "Profile activation failed." };
        }

        return { success: true };
    }

    static async getPendingRequests() {
        const supabase = await createClient();
        return await supabase
            .from('payment_requests')
            .select('*')
            .eq('status', 'pending');
    }
}
