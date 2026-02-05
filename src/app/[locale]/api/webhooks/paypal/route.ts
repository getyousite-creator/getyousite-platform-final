import { NextResponse } from 'next/server';
import { DeploymentEngine } from '@/lib/engine/deployment';
import { StoreService } from '@/lib/services/store-service';

/**
 * PAYPAL WEBHOOK HANDLER (Sovereign Security Version)
 */
export async function POST(req: Request) {
    const headers = req.headers;
    const transmissionId = headers.get('paypal-transmission-id');
    const timestamp = headers.get('paypal-transmission-time');
    const signature = headers.get('paypal-transmission-sig');
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    try {
        const body = await req.json();
        const eventType = body.event_type;

        console.log("PAYPAL_WEBHOOK_RECEIVED:", eventType);

        // 1. Signature Verify (Logical Gate)
        if (process.env.NODE_ENV === 'production' && (!signature || !webhookId)) {
            console.error("PAYPAL_WEBHOOK_UNAUTHORIZED: Missing signature or webhook ID");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // TODO: In a full production build, call PayPal Verify API here
        // const isValid = await PayPal.verifyWebhook(headers, body, webhookId);
        // if (!isValid) return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });

        // 2. Process Capture
        if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = body.resource;
            const siteId = resource.custom_id;

            if (!siteId) {
                console.error("PAYPAL_WEBHOOK_ERROR: Missing custom_id (siteId)");
                return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
            }

            // 3. State Invariant Check
            const { data: store } = await StoreService.getStoreById(siteId);
            if (!store) {
                console.error("PAYPAL_WEBHOOK_ERROR: Store not found", siteId);
                return NextResponse.json({ error: "Store not found" }, { status: 404 });
            }

            if (store.status === 'paid' || store.status === 'deployed') {
                console.log("PAYPAL_WEBHOOK_DUPLICATE: Order already processed for", siteId);
                return NextResponse.json({ received: true, duplicate: true });
            }

            console.log("PAYPAL_WEBHOOK_SUCCESS: Processing payment for", siteId);

            // 4. Update Status to 'paid' (Atomic transition)
            await StoreService.updateStore(siteId, { status: 'paid' });

            // 5. Trigger Deployment Orchestration
            // We do this asynchronously to avoid webhook timeout
            DeploymentEngine.deployToProduction(siteId).catch(err => {
                console.error("PAYPAL_WEBHOOK_DEPLOY_FAIL:", err);
            });
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("PAYPAL_WEBHOOK_ERROR:", error);
        return NextResponse.json({ error: "WEBHOOK_INTERNAL_ERROR" }, { status: 500 });
    }
}
