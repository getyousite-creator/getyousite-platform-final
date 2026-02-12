"use client";

import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from "@/app/actions/paypal-actions";
import { useAuth } from "@/components/providers/SupabaseProvider";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutModuleProps {
    siteId: string;
    planId: string;
    siteType: string;
    amount: string;
    currency: string;
    onSuccess?: () => void;
}

export function CheckoutModule({ siteId, planId, amount, onSuccess }: CheckoutModuleProps) {
    const { profile } = useAuth();
    const t = useTranslations('Payment');
    const [provider, setProvider] = React.useState<'paypal' | 'stripe'>('paypal');

    return (
        <div className="p-8 rounded-[40px] bg-card border border-border space-y-8 max-w-lg mx-auto shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00D09C]/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#00D09C]" />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tightest text-foreground">{t('title')}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{t('protocol')}</p>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-secondary border border-border">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold">{t('plan')}</span>
                    <span className="text-foreground font-black uppercase text-xs">{planId}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground uppercase text-[10px] font-bold">{t('cost')}</span>
                    <span className="text-2xl font-black text-foreground">${amount} <span className="text-[10px] text-muted-foreground">USD</span></span>
                </div>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={() => setProvider('paypal')}
                    variant={provider === 'paypal' ? 'glow' : 'outline'}
                    className="flex-1 text-[10px] font-black uppercase tracking-widest h-12"
                >
                    {t('paypal')}
                </Button>
                <Button
                    onClick={() => setProvider('stripe')}
                    variant={provider === 'stripe' ? 'glow' : 'outline'}
                    className="flex-1 text-[10px] font-black uppercase tracking-widest h-12"
                >
                    Stripe
                </Button>
            </div>

            {provider === 'paypal' ? (
                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "pill",
                        label: "pay",
                        height: 54
                    }}
                    createOrder={() => createPayPalOrder(planId).then(res => res.orderID)}
                    onApprove={async (data) => {
                        if (!profile?.id) {
                            toast.error(t('auth_required'));
                            return;
                        }
                        const res = await capturePayPalOrder(data.orderID, profile.id, planId, siteId);
                        if (res?.success) {
                            toast.success(t('success'));
                            if (onSuccess) onSuccess();
                        } else {
                            toast.error(res?.error || t('error'));
                        }
                    }}
                />
            ) : (
                <Button
                    onClick={async () => {
                        const { createStripeCheckoutAction } = await import("@/app/actions/stripe-actions");
                        // Mapping planId to mock Stripe Price IDs for simulation
                        const res = await createStripeCheckoutAction(planId, siteId);
                        if (res.url) {
                            window.location.href = res.url;
                        } else {
                            toast.error(res.error || t('error'));
                        }
                    }}
                    className="w-full h-14 bg-[#00D09C] hover:bg-[#00B085] text-white font-black uppercase tracking-widest text-[11px] rounded-full shadow-[0_0_20px_rgba(0,208,156,0.3)] transition-all"
                >
                    {t('stripe')}
                </Button>
            )}

            <div className="flex justify-center items-center gap-2">
                <Zap className="w-3 h-3 text-muted-foreground" />
                <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest">{t('encrypted')}</span>
            </div>
        </div>
    );
}
