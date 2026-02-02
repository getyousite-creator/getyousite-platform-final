import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import paypalClient from '@/lib/payments/paypal';

export async function POST(req: Request) {
    try {
        const { siteId, amount = "49.00" } = await req.json();

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                },
                custom_id: siteId // Crucial for tracking deployment
            }]
        } as any);

        const response = await paypalClient.client().execute(request);
        return NextResponse.json({ id: response.result.id });
    } catch (error) {
        console.error("PAYPAL_CREATE_ORDER_ERROR:", error);
        return NextResponse.json({ error: "PAYPAL_CREATION_FAILED" }, { status: 500 });
    }
}
