"use client";

import { useTranslations } from "next-intl";
import { Check, Sparkles, Shield, Zap, Globe } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from "@/app/actions/paypal-actions";
import { useAuth } from "@/components/providers/SupabaseProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const plans = [
    {
        id: "starter",
        price: "19",
        icon: Globe,
        color: "zinc",
    },
    {
        id: "pro",
        price: "49",
        icon: Zap,
        color: "blue",
        popular: true,
    },
    {
        id: "business",
        price: "99",
        icon: Shield,
        color: "emerald",
    }
];

export default function PricingEngine() {
    const t = useTranslations("Pricing");

    return (
        <section id="pricing" className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tightest mb-4 text-foreground">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest max-w-2xl mx-auto">
                        {t("subtitle")}
                    </p>
                </div>

                <PayPalScriptProvider options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: "USD",
                    intent: "capture" // Fix: Must be 'capture' for one-time payments
                }}>
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} t={t} />
                        ))}
                    </div>
                </PayPalScriptProvider>
            </div>
        </section>
    );
}

function PlanCard({ plan, t }: { plan: any, t: any }) {
    const { profile } = useAuth();
    const router = useRouter();

    return (
        <div
            className={`p-10 rounded-[40px] border flex flex-col transition-all duration-500 ${plan.popular
                    ? 'bg-card border-primary/50 shadow-xl scale-105 z-10'
                    : 'bg-card border-border hover:border-primary/20'
                }`}
        >
            <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-secondary`}>
                    <plan.icon className={`w-6 h-6 text-foreground`} />
                </div>
                {plan.popular && (
                    <span className="bg-primary text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-primary-foreground">
                        {t("most_popular")}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-black uppercase tracking-widest mb-2 text-foreground">{t(plan.id)}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-foreground">${plan.price}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">/ lifelong</span>
            </div>
            <p className="text-xs text-muted-foreground mb-8 leading-relaxed">{t(`desc.${plan.id}`)}</p>

            <ul className="space-y-4 mb-10 flex-grow">
                {["basic_seo", "mobile", "delivery", "support"].map((feat) => (
                    <li key={feat} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{t(`features.${feat}`)}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "pill",
                        label: "pay",
                        height: 54
                    }}
                    createOrder={() => createPayPalOrder(plan.id, plan.price).then(res => res.orderID)}
                    onApprove={async (data) => {
                        if (!profile?.id) {
                            toast.error("Authentication required.");
                            return;
                        }
                        const res = await capturePayPalOrder(data.orderID, profile.id, plan.id);
                        if (res.success) {
                            toast.success("Payment Secured. Dashboard Access Granted.");
                            router.push("/dashboard?checkout=success");
                        } else {
                            toast.error("Security Verification Failed.");
                        }
                    }}
                />
            </div>
        </div>
    );
}
