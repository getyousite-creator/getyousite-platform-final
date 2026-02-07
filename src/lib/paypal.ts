import paypal from '@paypal/checkout-server-sdk';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

const environment = process.env.NEXT_PUBLIC_PAYPAL_MODE === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

export const paypalClient = new paypal.core.PayPalHttpClient(environment);
