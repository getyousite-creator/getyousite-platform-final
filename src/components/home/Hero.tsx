"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Cpu } from "lucide-react";
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-slate-950">
            {/* Wix-Style INNOVATIVE BACKGROUND */}
            <div className="absolute inset-0 z-0">
                {/* Dynamic Mesh Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full delay-1000" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay" />
            </div>

            <div className="container relative z-10 px-6 flex flex-col items-center text-center">
                {/* Innovative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                    <span className="text-[10px] font-black text-white/70 tracking-[0.3em] uppercase">{t('badge')}</span>
                </motion.div>

                {/* SUPREME TYPOGRAPHY - WIX STUDIO INSPIRED */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-10 max-w-6xl leading-[0.9] uppercase italic"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        {t('headline')}
                    </span>
                </motion.h1>

                {/* Subheadline - Innovative Simplicity */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-slate-400 mb-14 max-w-3xl leading-relaxed font-medium"
                >
                    {t('subheadline')}
                </motion.p>

                {/* GENIUS AI COMMAND CENTER */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="w-full max-w-3xl relative group mb-20"
                >
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 via-slate-800 to-blue-600/30 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-[2rem] p-3 backdrop-blur-2xl shadow-[0_0_50px_rgba(37,99,235,0.1)] overflow-hidden">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-white px-8 py-5 focus:outline-none placeholder:text-slate-600 font-bold text-xl"
                        />
                        <Button
                            className="shrink-0 h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-2xl transition-all active:scale-95 text-lg font-black uppercase tracking-widest group/btn"
                            onClick={handleGenerate}
                        >
                            {t('generate')}
                            <ArrowRight className="ml-3 w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>

                {/* TRUST INFRASTRUCTURE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center gap-16 justify-center text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase"
                >
                    <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default group">
                        <Zap className="w-4 h-4 text-blue-500 group-hover:scale-125 transition-transform" />
                        <span>Sovereign Delivery</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default group">
                        <Cpu className="w-4 h-4 text-purple-500 group-hover:scale-125 transition-transform" />
                        <span>Genius AI Core</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-white transition-colors cursor-default group">
                        <Sparkles className="w-4 h-4 text-yellow-500 group-hover:scale-125 transition-transform" />
                        <span>Innovative Logic</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
