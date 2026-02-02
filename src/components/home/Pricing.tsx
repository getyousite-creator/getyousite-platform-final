"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function Pricing() {
    const t = useTranslations('Pricing');

    const plans = [
        {
            id: "starter",
            price: "$50",
            features: ["single_page", "basic_seo", "mobile", "delivery"],
            highlight: false,
        },
        {
            id: "pro",
            price: "$150",
            features: ["pages", "cms", "analytics", "support"],
            highlight: true,
        },
        {
            id: "business",
            price: "$350",
            features: ["ecommerce", "chatbot", "multilingual", "animations", "monitoring"],
            highlight: false,
        },
        {
            id: "enterprise",
            price: "custom",
            features: ["team", "whitelabel", "custom_ai", "sla", "onpremise"],
            highlight: false,
        },
    ];

    return (
        <section id="pricing" className="py-32 bg-slate-950/50 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-800/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">{t('title')}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={cn(
                                "relative p-10 rounded-[2rem] border transition-all duration-500 flex flex-col group",
                                plan.highlight
                                    ? "bg-slate-900/60 border-blue-500/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_-10px_rgba(59,130,246,0.1)] backdrop-blur-xl"
                                    : "bg-slate-950/40 border-slate-800/50 hover:bg-slate-900/50 hover:border-slate-700/50 backdrop-blur-md"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-600 text-[10px] font-black tracking-[0.2em] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                    CORE STACK
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-4 group-hover:text-blue-400 transition-colors">{t(plan.id)}</h3>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-black text-white tracking-tighter">
                                        {plan.price === "custom" ? t('price_custom') : plan.price}
                                    </span>
                                    {plan.price !== "custom" && <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">{t('per_project')}</span>}
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

                            <ul className="mb-10 space-y-5 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-4 text-[13px] text-slate-400 font-semibold group-hover:text-slate-300 transition-colors">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-blue-500" />
                                        </div>
                                        {t(`features.${feature}`)}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.highlight ? "glow" : "outline"}
                                className={cn(
                                    "w-full h-14 rounded-xl font-black tracking-widest uppercase text-xs transition-all duration-300",
                                    plan.highlight ? "bg-blue-600 hover:bg-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.35)]" : "border-slate-800 hover:bg-slate-800"
                                )}
                            >
                                {t('choose')}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
