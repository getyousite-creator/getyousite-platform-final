"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, Cpu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useLaunchModal } from "@/hooks/use-launch-modal";

export default function Hero() {
    const t = useTranslations('Hero');
    const onOpen = useLaunchModal((state) => state.onOpen);
    const [inputValue, setInputValue] = useState("");

    const handleGenerate = () => {
        onOpen(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background - Clinical Void */}
            <div className="absolute inset-0 bg-slate-950 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            </div>

            <div className="container relative z-10 px-6 flex flex-col items-center text-center">
                {/* Refined Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 border border-white/5 shadow-2xl"
                >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">{t('badge')}</span>
                </motion.div>

                {/* Surgical Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-[8rem] font-black tracking-tighter text-white mb-8 max-w-6xl leading-[0.8] uppercase"
                    dangerouslySetInnerHTML={{
                        __html: t.raw('headline').replace('<gradient>', '<span class="text-blue-600">').replace('</gradient>', '</span>')
                    }}
                />

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed font-medium"
                >
                    {t('subheadline')}
                </motion.p>

                {/* Command Input - Scientific Housing */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full max-w-2xl relative group mb-16"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-slate-800 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative flex items-center bg-slate-950/80 rounded-2xl p-2 border border-slate-800 backdrop-blur-md shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-white px-6 py-4 focus:outline-none placeholder:text-slate-600 font-medium text-lg"
                        />
                        <Button className="shrink-0 h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all active:scale-95" onClick={handleGenerate}>
                            {t('generate')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>

                {/* High-Fi Tech Specs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center gap-12 justify-center text-slate-500 text-[11px] font-bold tracking-widest uppercase"
                >
                    <div className="flex items-center gap-2.5 transition-colors hover:text-slate-300 cursor-default">
                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                        <span>{t('gdpr')}</span>
                    </div>
                    <div className="flex items-center gap-2.5 transition-colors hover:text-slate-300 cursor-default">
                        <Zap className="w-4 h-4 text-slate-400" />
                        <span>{t('uptime')}</span>
                    </div>
                    <div className="flex items-center gap-2.5 transition-colors hover:text-slate-300 cursor-default">
                        <Cpu className="w-4 h-4 text-blue-500/50" />
                        <span>{t('aiCore')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
