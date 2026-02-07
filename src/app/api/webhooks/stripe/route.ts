import { NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import { createClient } from "@/lib/supabase/server";

/**
 * MISSION 7.3: MONETIZATION WEBHOOK
 * Logic: Synchronizes the physical world transaction with the digital profile.
 * Goal: Zero-latency subscription updates.
 */
export async function POST(req: Request) {
    if (!stripe) {
        return new NextResponse("Stripe protocol inactive.", { status: 503 });
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.warn("[WEBHOOK_ERROR] STRIPE_WEBHOOK_SECRET missing.");
        return new NextResponse("Webhook secret missing.", { status: 500 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (err: any) {
        console.error(`[WEBHOOK_ERROR] Signature verification failure: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = await createClient();

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as any;
            const userId = session.metadata.userId;
            const planId = session.metadata.planId;

            const { error } = await supabase
                .from("profiles")
                .update({
                    subscription_status: "active",
                    plan_id: planId,
                    stripe_customer_id: session.customer as string,
                })
                .eq("id", userId);

            if (error) {
                console.error("[WEBHOOK_SYNC_ERROR]", error);
                return new NextResponse("Database sync failed.", { status: 500 });
            }
            break;

        case "customer.subscription.deleted":
            const subscription = event.data.object as any;
            // logic to deactivate user in Supabase
            break;
    }

    return NextResponse.json({ received: true });
}
