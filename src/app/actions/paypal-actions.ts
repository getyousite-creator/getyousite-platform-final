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

export async function capturePayPalOrder(orderID: string, userId: string, planId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const response = await paypalClient.execute(request);

        if (response.result.status === "COMPLETED") {
            const supabase = await createClient();

            const { error } = await supabase
                .from("profiles")
                .update({
                    subscription_status: "active",
                    plan_id: planId,
                })
                .eq("id", userId);

            if (error) throw error;

            revalidatePath("/dashboard");

            // MISSION 5.3: TRUTHFUL PROVISIONING
            // We fetch the store associated with the transaction (if any) or all user stores requesting deployment
            const { data: stores } = await supabase
                .from("stores")
                .select("id, slug, custom_domain, status")
                .eq("user_id", userId)
                .in("status", ["paid", "deploying"]);

            if (stores && stores.length > 0) {
                const { DeploymentEngine } = await import("@/lib/engine/deployment");
                for (const store of stores) {
                    console.log(
                        `[SOVEREIGN_IGNITION] Automatically initiating deployment for store: ${store.id}`,
                    );
                    await DeploymentEngine.deployToProduction(store.id);
                }
            }

            return { success: true };
        }
    } catch (err) {
        console.error("PayPal Capture Failed:", err);
        return { success: false, error: "Payment capture failed." };
    }
}
