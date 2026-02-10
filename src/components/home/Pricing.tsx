"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Pricing() {
    const t = useTranslations('Pricing');
    const router = useRouter();
    const [currency, setCurrency] = useState<'MAD' | 'USD'>('MAD');

    const plans = [
        {
            id: "starter",
            name: t('starter'),
            niche: t('niche.blog'),
            priceMAD: "499 DH",
            priceUSD: "$55",
            description: t('desc.starter'),
            features: ["single_page", "basic_seo", "mobile", "delivery"],
            highlight: false,
        },
        {
            id: "pro",
            name: t('pro'),
            niche: t('niche.business'),
            priceMAD: "999 DH",
            priceUSD: "$110",
            description: t('desc.pro'),
            features: ["pages", "cms", "analytics", "support", "domain_free"],
            highlight: true,
            popular: true,
        },
        {
            id: "business",
            name: t('business'),
            niche: t('niche.store'),
            priceMAD: "1499 DH",
            priceUSD: "$165",
            description: t('desc.business'),
            features: ["ecommerce", "inventory", "reports", "multilingual", "monitoring"],
            highlight: false,
        },
        {
            id: "enterprise",
            name: t('enterprise'),
            niche: t('niche.agency'),
            priceMAD: "2999 DH",
            priceUSD: "$330",
            description: t('desc.enterprise'),
            features: ["whitelabel", "team", "whatsapp_support", "high_security", "unlimited"],
            highlight: false,
        },
    ];

    return (
        <section id="pricing" className="py-32 bg-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-black text-foreground mb-6 uppercase tracking-tightest italic">{t('title')}</h2>

                    {/* Currency Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", currency === 'MAD' ? "text-primary" : "text-muted-foreground")}>
                            {currency === 'MAD' ? t('currency.mad') : t('currency.usd')}
                        </span>
                        <button
                            onClick={() => setCurrency(currency === 'MAD' ? 'USD' : 'MAD')}
                            className="w-14 h-7 bg-secondary rounded-full relative p-1 transition-all border border-border"
                        >
                            <motion.div
                                animate={{ x: currency === 'MAD' ? 0 : 28 }}
                                className="w-5 h-5 bg-primary-foreground rounded-full shadow-lg"
                            />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative p-8 rounded-[2.5rem] border transition-all duration-500 group flex flex-col text-start",
                                plan.highlight
                                    ? "bg-card border-border shadow-lg"
                                    : "bg-card border-border hover:border-primary/20"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 ltr:left-10 rtl:right-10 px-4 py-1.5 rounded-full bg-primary text-[8px] font-black tracking-widest text-primary-foreground">
                                    {t('most_popular')}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={cn("text-[10px] font-black uppercase tracking-[0.3em] mb-2", plan.highlight ? "text-primary" : "text-muted-foreground")}>
                                    {plan.niche}
                                </div>
                                <h3 className={cn("text-2xl font-black italic uppercase tracking-tighter mb-4 text-foreground")}>
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className={cn("text-5xl font-black tracking-tightest text-foreground")}>
                                        {currency === 'MAD' ? plan.priceMAD : plan.priceUSD}
                                    </span>
                                </div>
                                <p className={cn("mt-6 text-xs font-bold leading-relaxed text-muted-foreground")}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className={cn("flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground")}>
                                        <Check className={cn("w-3.5 h-3.5 text-primary")} />
                                        {t(`features.${feature}`)}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => router.push('/signup')}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-black tracking-widest uppercase text-[10px] transition-all",
                                    plan.highlight
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-card text-foreground hover:bg-primary/10 border border-border"
                                )}
                            >
                                {t('choose')}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {currency === 'MAD' && (
                    <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                        * {t('payment_notice')}
                    </p>
                )}
            </div>
        </section>
    );
}
