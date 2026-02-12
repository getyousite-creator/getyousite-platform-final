"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CTA() {
    const t = useTranslations('CTA');

    return (
        <section className="py-32 relative overflow-hidden flex items-center justify-center bg-[#020617]">
            {/* GYS-V2 HIGH-DENSITY GLOW */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-[#10B981]/5 blur-[120px] rounded-full" />
            </div>

            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            <div className="container relative z-10 text-center px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-8xl font-bold text-white mb-10 tracking-tight leading-[1.05]"
                    dangerouslySetInnerHTML={{ __html: t.raw('title') }}
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-2xl text-white/40 mb-14 max-w-3xl mx-auto font-light leading-relaxed"
                >
                    {t('subtitle')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        onClick={() => window.location.href = '/signup'}
                        className="text-xl px-14 py-8 rounded-[1.2rem] bg-primary hover:bg-[#2563eb] text-[#020617] font-bold shadow-[0_0_50px_rgba(59,130,246,0.5)] hover:shadow-[0_0_70px_rgba(59,130,246,0.7)] transition-all hover:scale-[1.03] active:scale-[0.97] border-none"
                    >
                        {t('button')} <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                </motion.div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
    );
}
