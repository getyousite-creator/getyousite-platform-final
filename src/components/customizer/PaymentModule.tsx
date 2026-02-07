"use client";

import React from 'react';
import { CheckoutModule } from '../payment/CheckoutModule';

export function PaymentModule({ siteId }: { siteId: string }) {
    return (
        <div className="mt-6 border-t border-white/5 pt-8">
            <div className="mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Publishing Infrastructure</h4>
                <p className="text-[10px] text-zinc-600">Your site is in draft mode. Activate the Sovereign node to go live.</p>
            </div>
            <CheckoutModule
                siteId={siteId}
                planId="pro"
                amount="49.00"
                currency="USD"
                siteType="business"
            />
        </div>
    );
}
