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
        <section id="services" className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-8"
                    >
                        {t('title')}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-[5rem] font-black text-foreground mb-8 tracking-tighter uppercase leading-none"
                    >
                        {t('title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed"
                    >
                        {t('subtitle')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-10 rounded-3xl bg-[#0A2540]/5 border border-white/5 hover:border-[#00D09C]/30 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                        >
                            {/* Hover Flux Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00D09C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className={cn("mb-8 w-14 h-14 rounded-2xl bg-[#0A2540]/10 border border-white/10 flex items-center justify-center shadow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", service.color)}>
                                <service.icon className="w-7 h-7" />
                            </div>

                            <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-[#00D09C] transition-colors tracking-tight">
                                {t(`${service.id}.title`)}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                {t(`${service.id}.desc`)}
                            </p>

                            <div className="mt-8 w-12 h-1 bg-white/5 rounded-full group-hover:w-24 group-hover:bg-[#00D09C] transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
