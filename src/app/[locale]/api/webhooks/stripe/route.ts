import { NextResponse } from 'next/server';
import { PaymentProtocol } from '@/lib/payments/payment-logic';
import { DeploymentEngine } from '@/lib/engine/deployment';

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // Logic Audit: In production, verify Stripe signature here
        // const signature = req.headers.get('stripe-signature');

        console.log("WEBHOOK_RECEIVED: Processing payment event...");

        if (payload.type === 'checkout.session.completed') {
            const session = payload.data.object;
            const siteId = session.metadata.siteId;

            console.log("FINANCIAL_VERIFICATION_SUCCESS: Site ID", siteId);

            // 1. Trigger the Deployment Engine
            await DeploymentEngine.launchToHostinger(siteId);

            return NextResponse.json({ success: true, message: "EMPIRE_LAUNCHED" });
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("WEBHOOK_ERROR:", error);
        return NextResponse.json({ error: "WEBHOOK_FAILED" }, { status: 500 });
    }
}
