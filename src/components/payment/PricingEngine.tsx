"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Shield, Zap, Globe } from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrder, capturePayPalOrder } from "@/app/actions/paypal-actions";
import { useAuth } from "@/components/providers/SupabaseProvider";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { trackExperimentEvent } from "@/lib/analytics/experiment-tracker";

const plans = [
    {
        id: "starter",
        price: { USD: "0", SAR: "0", AED: "0" },
        icon: Globe,
        color: "zinc",
        features: ["ai_generation_basic", "subdomain_access", "gys_branding", "community_support"],
    },
    {
        id: "pro",
        price: { USD: "19", SAR: "75", AED: "75" },
        icon: Zap,
        color: "blue",
        popular: true,
        features: [
            "3_sovereign_sites",
            "custom_domain_link",
            "brand_removal",
            "priority_logic_support",
            "advanced_analytics",
        ],
    },
    {
        id: "business",
        price: { USD: "49", SAR: "185", AED: "185" },
        icon: Shield,
        color: "emerald",
        features: [
            "10_sovereign_sites",
            "ai_seo_sovereign",
            "live_logic_chat",
            "nightly_backups",
            "api_access_token",
        ],
    },
];

export default function PricingEngine() {
    const t = useTranslations("Pricing");
    const tCommon = useTranslations("Common");

    return (
        <section id="pricing" className="py-32 bg-[#020617] relative overflow-hidden">
            {/* Logic Mesh */}
            <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mb-10"
                    >
                        {t("badge")}
                    </motion.div>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                        {t("title")}
                    </h2>
                    <p className="text-white/40 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                <PayPalScriptProvider
                    options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                        currency: "USD",
                        intent: "capture",
                    }}
                >
                    <div className="grid md:grid-cols-3 gap-10">
                        {plans.map((plan) => (
                            <PlanCard key={plan.id} plan={plan} t={t} tCommon={tCommon} />
                        ))}
                    </div>
                </PayPalScriptProvider>
            </div>
        </section>
    );
}

type Plan = (typeof plans)[number];
type TFunc = (key: string) => string;

function PlanCard({ plan, t, tCommon }: { plan: Plan; t: TFunc; tCommon: TFunc }) {
    const { profile } = useAuth();
    const router = useRouter();

    const currency = (t("currency_code") || "USD") as keyof typeof plan.price;
    const priceValue = plan.price[currency] || plan.price["USD"];

    return (
        <div
            className={`p-10 rounded-[2rem] border transition-all duration-500 flex flex-col relative group ${
                plan.popular
                    ? "bg-[#1e293b]/50 border-primary/50 shadow-[0_0_60px_rgba(59,130,246,0.15)] scale-105 z-10 backdrop-blur-2xl"
                    : "bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.04]"
            }`}
        >
            {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-[#020617] text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-lg shadow-primary/20">
                        {t("most_popular")}
                    </span>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div
                    className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors`}
                >
                    <plan.icon className={`w-6 h-6 text-primary`} />
                </div>
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-widest mb-3 text-white">
                {t(`${plan.id}`)}
            </h3>
            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-bold text-white tracking-tighter">
                    {currency === "USD" ? "$" : ""}
                    {priceValue}
                    {currency !== "USD" ? ` ${currency}` : ""}
                </span>
                <div className="flex flex-col">
                    <span className="text-xs text-white/30 font-medium uppercase tracking-widest">
                        {t("per_month")}
                    </span>
                    <span className="text-[10px] text-white/20 font-medium uppercase tracking-widest">
                        {t("billed_yearly")}
                    </span>
                </div>
            </div>
            <p className="text-sm text-white/40 mb-10 leading-relaxed font-light">
                {t(`desc.${plan.id}`)}
            </p>

            <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feat: string) => (
                    <li key={feat} className="flex items-center gap-4">
                        <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                        </div>
                        <span className="text-xs text-white/60 font-medium tracking-wide">
                            {t(`features.${feat}`)}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="mt-auto">
                {priceValue === "0" ? (
                    <button
                        onClick={() => {
                            trackExperimentEvent({
                                experimentKey: "exp_pricing_value_v1",
                                eventName: "funnel_pricing_plan_selected",
                                variant: plan.id,
                                intent: "free_start",
                                metadata: { amount: priceValue, currency },
                            });
                            router.push(`/live-demo?source=pricing-engine&plan=${plan.id}`);
                        }}
                        className="w-full h-[58px] rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all"
                    >
                        {t("start_free")}
                    </button>
                ) : (
                    <PayPalButtons
                        style={{
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "pay",
                            height: 55,
                        }}
                        createOrder={() => {
                            trackExperimentEvent({
                                experimentKey: "exp_pricing_value_v1",
                                eventName: "funnel_payment_started",
                                variant: plan.id,
                                intent: "paypal_start",
                                metadata: { amount: priceValue, currency },
                            });
                            return createPayPalOrder(plan.id).then((res) => res.orderID);
                        }}
                        onApprove={async (data) => {
                            if (!profile?.id) {
                                toast.error(tCommon("auth_required") || "Authentication required.");
                                return;
                            }
                            const res = await capturePayPalOrder(data.orderID, profile.id, plan.id);
                            if (res?.success) {
                                trackExperimentEvent({
                                    experimentKey: "exp_pricing_value_v1",
                                    eventName: "funnel_payment_success",
                                    variant: plan.id,
                                    intent: "paypal_success",
                                    metadata: { amount: priceValue, currency },
                                });
                                toast.success("Identity Verified. Dashboard Access Granted.");
                                router.push("/dashboard?checkout=success");
                            } else {
                                trackExperimentEvent({
                                    experimentKey: "exp_pricing_value_v1",
                                    eventName: "funnel_payment_error",
                                    variant: plan.id,
                                    intent: "paypal_error",
                                    metadata: { amount: priceValue, currency },
                                });
                                toast.error("Security Authentication Failed.");
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}
