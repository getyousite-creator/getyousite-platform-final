"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Cpu, Shield } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useLaunchModal } from "@/hooks/use-launch-modal";

export default function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#020617]">
            {/* GYS-V2 HIGH-TECH BACKGROUND */}
            <div className="absolute inset-0 z-0">
                {/* Electric Blue & Deep Navy Mesh */}
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/20 blur-[130px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#10B981]/15 blur-[160px] rounded-full delay-1000" />

                {/* AI Neural Network/Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            <div className="container relative z-10 px-6 flex flex-col items-center text-center">
                {/* Logic Status Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[11px] font-bold text-white/80 tracking-[0.2em] uppercase">{t('badge')}</span>
                </motion.div>

                {/* THE BRAIN (H1) - Geometric Dominance */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tight text-white mb-8 max-w-5xl leading-[1.05]"
                >
                    {t('headline')}
                </motion.h1>

                {/* Subheadline - Logic Flow */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-[1.35rem] text-white/60 mb-14 max-w-3xl leading-relaxed font-light"
                >
                    {t('subheadline')}
                </motion.p>

                {/* THE LOGIC UI (PROMPT BOX) - HERO OF THE PAGE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="w-full max-w-3xl relative group mb-24"
                >
                    {/* OUTER GLOW (Electric Blue Pulse) */}
                    <div className="absolute -inset-1.5 bg-primary/30 rounded-2xl blur-2xl opacity-40 group-focus-within:opacity-100 group-focus-within:animate-pulse transition duration-500" />

                    <div className="relative flex items-center bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 group-focus-within:border-primary/50 group-focus-within:bg-[#1e293b]/70">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-white px-8 py-5 focus:outline-none placeholder:text-white/30 font-medium text-xl"
                        />
                        <Button
                            className="shrink-0 h-16 px-10 rounded-xl bg-gradient-to-br from-primary to-[#2563eb] hover:scale-[1.02] active:scale-[0.98] text-white shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-200 text-lg font-bold border-none"
                            onClick={() => {
                                if (inputValue.length > 5) {
                                    window.location.href = `/${locale}/customizer?vision=${encodeURIComponent(inputValue)}`;
                                }
                            }}
                        >
                            {t('generate')}
                        </Button>
                    </div>

                    {/* SMART SUGGESTIONS */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                        {['مطعم سمك فاخر', 'وكالة تسويق رقمي', 'عيادة أسنان عصرية', 'متجر أثاث مودرن'].map((hint) => (
                            <button
                                key={hint}
                                onClick={() => setInputValue(hint)}
                                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 uppercase font-black hover:bg-white/10 hover:text-white hover:border-white/30 transition-all active:scale-95"
                            >
                                + {hint}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* TRUST LOGIC MESH */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 text-white/40 text-[11px] font-bold tracking-[0.3em] uppercase"
                >
                    <div className="flex items-center justify-center gap-4 hover:text-primary transition-all duration-300 group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <span className="whitespace-nowrap">{t('badges.delivery')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 hover:text-[#10B981] transition-all duration-300 group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20 group-hover:border-[#10B981]/40 transition-colors">
                            <Cpu className="w-5 h-5 text-[#10B981]" />
                        </div>
                        <span className="whitespace-nowrap">{t('badges.core')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 hover:text-primary transition-all duration-300 group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <span className="whitespace-nowrap">{t('badges.logic')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
