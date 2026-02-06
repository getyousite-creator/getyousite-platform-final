import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import paypalClient from '@/lib/payments/paypal';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'USD' } = await req.json();

        // 1. CONSTRUCT ORDER REQUEST
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount
                }
            }]
        });

        // 2. EXECUTE ORDER CREATION
        const client = paypalClient.client();
        const response = await client.execute(request);

        // 3. RETURN ORDER ID
        return NextResponse.json({ id: response.result.id });
    } catch (error) {
        console.error('PAYPAL_CREATE_ORDER_ERROR', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
