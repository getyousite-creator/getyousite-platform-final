import { NextResponse } from 'next/server';
import { DeploymentEngine } from '@/lib/engine/deployment';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const eventType = body.event_type;

        console.log("PAYPAL_WEBHOOK_RECEIVED:", eventType);

        // Logic Audit: Verify webhook signature in production using PAYPAL_WEBHOOK_ID
        // For now, we process key event types
        if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = body.resource;
            const siteId = resource.custom_id;

            if (siteId) {
                console.log("PAYPAL_WEBHOOK_CAPTURE_SUCCESS: Site ID", siteId);
                await DeploymentEngine.launchToHostinger(siteId);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("PAYPAL_WEBHOOK_ERROR:", error);
        return NextResponse.json({ error: "WEBHOOK_FAILED" }, { status: 500 });
    }
}
