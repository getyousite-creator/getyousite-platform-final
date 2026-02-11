"use server";

import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// MAPPING: Secure Server-Side Price ID Resolution
const STRIPE_PRICE_MAP: Record<string, string> = {
    starter: process.env.STRIPE_PRICE_STARTER || "price_1QjXXXX_MOCK_STARTER",
    pro: process.env.STRIPE_PRICE_PRO || "price_1QjXXXX_MOCK_PRO",
    business: process.env.STRIPE_PRICE_BUSINESS || "price_1QjXXXX_MOCK_BUSINESS",
};

/**
 * MISSION 7.1: INDUSTRIAL MONETIZATION ACTION
 * Logic: Generates a secure Stripe Checkout session.
 * Redundancy: This acts as the primary financial failover to PayPal.
 */
export async function createStripeCheckoutAction(planId: string, siteId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required for checkout protocol.");
    }

    const host = (await headers()).get("origin");

    try {
        if (!stripe) {
            throw new Error("Stripe Protocol Inactive: Missing Secret Key.");
        }

        // Logic: Resolve secure price ID from plan mapping
        const securePriceId = STRIPE_PRICE_MAP[planId.toLowerCase()] || STRIPE_PRICE_MAP["starter"];

        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            line_items: [
                {
                    price: securePriceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${host}/success/${siteId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${host}/dashboard`,
            metadata: {
                userId: user.id,
                siteId: siteId,
                planId: planId,
            },
        });

        if (!session.url) {
            throw new Error("Stripe Session URL generation failure.");
        }

        return { url: session.url };
    } catch (error) {
        console.error("[STRIPE_ERROR] Checkout session creation failed:", error);

        // SOVEREIGN FALLBACK: Simulation Mode (Dev Only)
        // CRITICAL SEC: We disable simulation in production to prevent accidental free access.
        if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ SOVEREIGN SIMULATION: Redirecting to success (Mock Payment)");
            return {
                url: `${host}/success/${siteId}?session_id=mock_session_${Date.now()}&simulated=true`,
            };
        }

        return { error: "Monetization bridge failed. Protocol terminated." };
    }
}
