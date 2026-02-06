import paypal from '@paypal/checkout-server-sdk';

/**
 * SOVEREIGN PAYPAL CLIENT
 * 
 * Logic audit: Secure environment authentication.
 */
function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

function environment() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

    // SOVEREIGN OVERRIDE: Prioritize Explicit Mode setting
    if (process.env.NEXT_PUBLIC_PAYPAL_MODE === 'live' || process.env.NODE_ENV === 'production') {
        return new paypal.core.LiveEnvironment(clientId, clientSecret);
    }
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

export default { client };
