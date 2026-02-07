"use server";

import { paypalClient } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPayPalOrder(planId: string, amount: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount
            },
            description: `GetYouSite - ${planId} Subscription`
        }]
    });

    try {
        const response = await paypalClient.execute(request);
        return { orderID: response.result.id };
    } catch (err) {
        console.error("PayPal Order Creation Failed:", err);
        throw new Error("Could not initiate PayPal transaction.");
    }
}

export async function capturePayPalOrder(orderID: string, userId: string, planId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const response = await paypalClient.execute(request);

        if (response.result.status === 'COMPLETED') {
            const supabase = await createClient();

            const { error } = await supabase
                .from('profiles')
                .update({
                    subscription_status: 'active',
                    plan_id: planId,
                })
                .eq('id', userId);

            if (error) throw error;

            revalidatePath('/dashboard');

            // MISSION 5.3: TRUTHFUL PROVISIONING
            // We fetch the site hostname and trigger the Edge loop
            const { data: sites } = await supabase
                .from('sites')
                .select('subdomain, custom_domain')
                .eq('user_id', userId)
                .is('published', true);

            if (sites && sites.length > 0) {
                const { provisionSiteOnEdge } = await import('@/app/actions/provisioning-actions');
                for (const site of sites) {
                    const hostname = site.custom_domain || `${site.subdomain}.getyousite.main.app`;
                    await provisionSiteOnEdge(hostname);
                }
            }

            return { success: true };
        }
    } catch (err) {
        console.error("PayPal Capture Failed:", err);
        return { success: false, error: "Payment capture failed." };
    }
}
