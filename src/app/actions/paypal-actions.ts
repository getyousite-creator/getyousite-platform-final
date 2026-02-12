"use server";

import { paypalClient } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// MISSION 8.1: ZERO-TRUST PRICING AUTH
// Logic: Server-side validation of all transaction amounts.
const PLAN_PRICES: Record<string, string> = {
    starter: "0.00",
    pro: "19.00",
    business: "49.00",
};

export async function createPayPalOrder(planId: string) {
    const verifiedAmount = PLAN_PRICES[planId.toLowerCase()];

    if (!verifiedAmount) {
        throw new Error("Security Alert: Invalid Plan ID detected.");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: verifiedAmount,
                },
                description: `GetYouSite - ${planId.charAt(0).toUpperCase() + planId.slice(1)} Subscription`,
            },
        ],
    });

    try {
        const response = await paypalClient.execute(request);
        return { orderID: response.result.id };
    } catch (err) {
        console.error("[PAYPAL_GUARD] Order Creation Failed:", err);
        throw new Error("Financial Protocol Error.");
    }
}

export async function capturePayPalOrder(orderID: string, userId: string, planId: string, siteId?: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const response = await paypalClient.execute(request);

        if (response.result.status === "COMPLETED") {
            const supabase = await createClient();

            // 1. Logic Pillar: Standardize Profile Subscription (Global Access)
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    subscription_status: "active",
                    plan_id: planId,
                })
                .eq("id", userId);

            if (profileError) throw profileError;

            // 2. Logic Pillar: Activate the Target Asset (Sovereign Order)
            if (siteId && siteId !== "temp") {
                console.log(`[PAYMENT_LOGIC] Moving site ${siteId} to PAID status.`);
                const { error: storeError } = await supabase
                    .from("stores")
                    .update({ status: 'paid' })
                    .eq('id', siteId)
                    .eq('user_id', userId);

                if (storeError) console.error("Store status update failure:", storeError);

                // 3. MISSION 5.3: TRUTHFUL PROVISIONING
                const { DeploymentEngine } = await import("@/lib/engine/deployment");
                console.log(`[SOVEREIGN_IGNITION] Initiating atomic deployment for site: ${siteId}`);
                await DeploymentEngine.deployToProduction(siteId);
            }

            revalidatePath("/dashboard");
            return { success: true };
        }
    } catch (err) {
        console.error("PayPal Capture Failed:", err);
        return { success: false, error: "Payment capture failed." };
    }
}
