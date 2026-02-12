import { NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const relevantEvents = new Set([
    "product.created",
    "product.updated",
    "price.created",
    "price.updated",
    "checkout.session.completed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
]);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret)
            return new Response("Webhook secret or signature missing", { status: 400 });
        event = stripe!.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error(`❌ Webhook Error: ${errorMessage}`);
        return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            const supabase = await createClient();

            switch (event.type) {
                // 1. CHECKOUT COMPLETED -> Provision Access
                case "checkout.session.completed":
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === "subscription") {
                        const subscriptionId = checkoutSession.subscription as string;
                        const customerId = checkoutSession.customer as string;
                        const userId = checkoutSession.metadata?.userId;
                        const planId = checkoutSession.metadata?.planId;

                        // Logic: Update user tier and link Stripe info
                        if (userId) {
                            // Update Profile Table
                            await supabase
                                .from("profiles")
                                .update({
                                    stripe_customer_id: customerId,
                                    subscription_id: subscriptionId,
                                    subscription_status: "active",
                                    plan_id: planId,
                                })
                                .eq("id", userId);

                            // MISSION 5.3: TRUTHFUL PROVISIONING
                            const siteId = checkoutSession.metadata?.siteId;
                            if (siteId && siteId !== "temp") {
                                console.log(`[STRIPE_WEBHOOK] Activating site ${siteId} for user ${userId}`);

                                await supabase
                                    .from("stores")
                                    .update({ status: 'paid' })
                                    .eq('id', siteId)
                                    .eq('user_id', userId);

                                const { DeploymentEngine } = await import("@/lib/engine/deployment");
                                DeploymentEngine.deployToProduction(siteId).catch(e =>
                                    console.error("[STRIPE_DEPLOY_FAILURE]", e)
                                );
                            }
                        }
                    }
                    break;

                // 2. SUBSCRIPTION UPDATED -> Sync Status (DOWNGRADE LOGIC)
                case "customer.subscription.updated":
                case "customer.subscription.deleted":
                    const subscription = event.data.object as Stripe.Subscription;
                    const status = subscription.status;

                    // Logic: Downgrade if canceled/past_due
                    if (status === "canceled" || status === "unpaid" || status === "past_due") {
                        // Reverse lookup: Find user by subscription_id
                        const { data: profile } = await supabase
                            .from("profiles")
                            .select("id")
                            .eq("subscription_id", subscription.id)
                            .single();

                        if (profile) {
                            console.log(
                                `[STRIPE_SYNC] Downgrading user ${profile.id} due to ${status} subscription.`,
                            );

                            // Reset User Table
                            await supabase
                                .from("users")
                                .update({ tier: "starter" })
                                .eq("id", profile.id);

                            // Update Profile Table
                            await supabase
                                .from("profiles")
                                .update({
                                    subscription_status: status,
                                    plan_id: "starter",
                                })
                                .eq("id", profile.id);
                        }
                    }
                    break;

                default:
                // Unhandled event type
            }
        } catch (error) {
            console.error(error);
            return new Response("Webhook handler failed. View logs.", { status: 400 });
        }
    }

    return NextResponse.json({ received: true });
}
