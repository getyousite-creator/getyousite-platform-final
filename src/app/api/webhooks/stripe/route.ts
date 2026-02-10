import { headers } from "next/headers";
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
    const sig = headers().get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) return new Response("Webhook secret or signature missing", { status: 400 });
        event = stripe!.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Error message: ${err.message}`);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
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
                            await supabase
                                .from('users')
                                .update({
                                    tier: planId === 'price_pro' ? 'pro' : 'enterprise', // Simplified mapping logic
                                    credits: 100 // Grant credits on upgrade
                                })
                                .eq('id', userId);

                            await supabase
                                .from('profiles')
                                .update({
                                    stripe_customer_id: customerId,
                                    subscription_id: subscriptionId,
                                    subscription_status: 'active',
                                    plan_id: planId
                                })
                                .eq('id', userId);
                        }
                    }
                    break;

                // 2. SUBSCRIPTION UPDATED -> Sync Status
                case "customer.subscription.updated":
                    const subscription = event.data.object as Stripe.Subscription;
                    const status = subscription.status;

                    // Logic: Downgrade if canceled/past_due
                    if (status === 'canceled' || status === 'unpaid') {
                        // Find user by subscription_id and downgrade
                        // (Implementation requires a reverse lookup or storing user_id in subscription metadata)
                        console.log(`Subscription ${subscription.id} status changed to ${status}`);
                    }
                    break;

                default:
                // Unhandled event type
            }
        } catch (error) {
            console.error(error);
            return new Response('Webhook handler failed. View logs.', { status: 400 });
        }
    }

    return NextResponse.json({ received: true });
}
