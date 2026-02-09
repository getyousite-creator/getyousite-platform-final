"use server";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * MISSION 7.1: INDUSTRIAL MONETIZATION ACTION
 * Logic: Generates a secure Stripe Checkout session.
 * Redundancy: This acts as the primary financial failover to PayPal.
 */
export async function createStripeCheckoutAction(priceId: string, siteId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required for checkout protocol.");
    }

    const host = (await headers()).get("origin");

    try {
        if (!stripe) {
            throw new Error("Stripe Protocol Inactive: Missing Secret Key.");
        }

        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${host}/success/${siteId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${host}/dashboard`,
            metadata: {
                userId: user.id,
                siteId: siteId,
                planId: priceId
            },
        });

        if (!session.url) {
            throw new Error("Stripe Session URL generation failure.");
        }

        return { url: session.url };
    } catch (error) {
        console.error("[STRIPE_ERROR] Checkout session creation failed:", error);
        return { error: "Monetization bridge failed. Protocol terminated." };
    }
}
