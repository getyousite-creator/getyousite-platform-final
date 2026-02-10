"use client";

import { motion } from "framer-motion";
import { MessageSquare, Cpu, Globe, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            id: "step1",
            icon: MessageSquare,
            gradient: "from-blue-500/20 to-transparent",
            iconColor: "text-blue-400",
        },
        {
            id: "step2",
            icon: Cpu,
            gradient: "from-[#00D09C]/20 to-transparent",
            iconColor: "text-[#00D09C]",
        },
        {
            id: "step3",
            icon: Globe,
            gradient: "from-blue-600/20 to-transparent",
            iconColor: "text-blue-500",
        },
    ];

    return (
        <section id="how-it-works" className="py-32 bg-[#020617] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-white/50 mb-8"
                    >
                        Logic Flow
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative group flex flex-col items-center text-center z-10"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-primary group-hover:border-primary/40 transition-all">
                                0{index + 1}
                            </div>

                            <div className={`mb-10 w-24 h-24 rounded-3xl bg-gradient-to-br ${step.gradient} border border-white/5 flex items-center justify-center relative group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                                <div className="absolute inset-0 bg-white/5 rounded-3xl group-hover:blur-xl transition-all" />
                                <step.icon className={`w-10 h-10 ${step.iconColor} relative z-10`} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-5 group-hover:text-primary transition-colors tracking-tight">
                                {t(`steps.${step.id}.title`)}
                            </h3>
                            <p className="text-white/40 text-base leading-relaxed font-light max-w-[280px]">
                                {t(`steps.${step.id}.desc`)}
                            </p>

                            {/* Arrow Indicator (Mobile/Desktop) */}
                            {index < 2 && (
                                <div className="mt-10 md:hidden flex justify-center">
                                    <ArrowRight className="w-6 h-6 text-white/10 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
