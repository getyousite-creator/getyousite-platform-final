import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import paypalClient from '@/lib/payments/paypal';
import { PaymentService } from '@/lib/services/payment-service';
import { AuthService } from '@/lib/services/auth-service';

export async function POST(req: NextRequest) {
    try {
        const { orderId, planId, siteType } = await req.json();

        // 1. CONSTRUCT CAPTURE REQUEST
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        // 2. EXECUTE CAPTURE
        const client = paypalClient.client();
        const response = await client.execute(request);

        // 3. FULFILLMENT LOGIC: Update Supabase on success
        if (response.result.status === 'COMPLETED') {
            const { data: user } = await AuthService.getCurrentUser();
            if (!user) throw new Error("User unauthorized during capture");

            // Logic: Update user tier and log payment
            await PaymentService.handlePayPalCapture(user.id, planId, siteType);

            return NextResponse.json({
                success: true,
                orderId: response.result.id,
                status: response.result.status
            });
        }

        return NextResponse.json({ success: false, error: 'Capture failed or incomplete' });
    } catch (error) {
        console.error('PAYPAL_CAPTURE_ORDER_ERROR', error);
        return NextResponse.json({ error: 'Failed to capture order' }, { status: 500 });
    }
}
