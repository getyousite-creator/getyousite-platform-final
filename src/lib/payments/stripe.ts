import Stripe from 'stripe';

const getServerSideStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
        // Log skip instead of crash during build
        console.warn('STRIPE_SECRET_KEY is missing. Logic: Payment bridge will be inactive.');
        return null;
    }
    return new Stripe(key, {
        apiVersion: '2026-01-28.clover',
        typescript: true,
    });
};

export const stripe = getServerSideStripe();
