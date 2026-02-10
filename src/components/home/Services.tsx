"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Cpu, Shield, Smartphone, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function Services() {
    const t = useTranslations('Services');

    const services = [
        {
            icon: Zap,
            id: "velocity",
            color: "text-[#00D09C]",
        },
        {
            icon: Cpu,
            id: "ai",
            color: "text-[#00D09C]",
        },
        {
            icon: Globe,
            id: "cdn",
            color: "text-[#00D09C]",
        },
        {
            icon: Shield,
            id: "security",
            color: "text-[#00D09C]",
        },
        {
            icon: Smartphone,
            id: "responsive",
            color: "text-[#00D09C]",
        },
        {
            icon: Rocket,
            id: "growth",
            color: "text-[#00D09C]",
        },
    ];

    return (
        <section id="services" className="py-32 bg-[#020617] relative overflow-hidden">
            {/* Subtle Gradient Glows */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-[#10B981]/5 blur-[100px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-8"
                    >
                        {t('title')}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-none"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/40 max-w-2xl mx-auto text-xl font-light leading-relaxed"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group relative p-12 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-2xl"
                        >
                            {/* Hover Inner Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className={cn("mb-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/10 group-hover:border-primary/20", "text-primary")}>
                                <service.icon className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-5 group-hover:text-primary transition-colors tracking-tight">
                                {t(`${service.id}.title`)}
                            </h3>
                            <p className="text-white/40 text-base leading-relaxed font-light">
                                {t(`${service.id}.desc`)}
                            </p>

                            <div className="mt-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                <span className="text-xs font-bold text-primary tracking-widest uppercase">{t('explore')}</span>
                                <div className="w-8 h-[1px] bg-primary" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
