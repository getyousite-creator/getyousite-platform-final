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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">

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
                    className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter text-white mb-6 max-w-5xl leading-[0.9]"
                >
                    {t('headline')}
                </motion.h1>

                {/* Subheadline - Logic Flow (Simplified for Zero Friction) */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-white/40 mb-16 max-w-2xl leading-relaxed font-medium uppercase tracking-[0.3em]"
                >
                    {t('subheadline')}
                </motion.p>

                {/* THE EXPLOSION BOX (PROMPT UI) - Protocol 2.1 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="w-full max-w-4xl relative group mb-32"
                >
                    {/* NEURAL GLOW */}
                    <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-all duration-1000" />

                    <div className="relative flex flex-col md:flex-row items-center bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 shadow-[0_32px_120px_rgba(0,0,0,0.8)] transition-all duration-500 group-focus-within:border-primary/40 group-focus-within:bg-white/[0.05]">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-white px-8 py-6 focus:outline-none placeholder:text-white/20 font-medium text-2xl lg:text-3xl tracking-tight"
                        />
                        <Button
                            className="w-full md:w-auto shrink-0 h-20 px-12 rounded-[1.8rem] bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all duration-300 text-xl font-black uppercase tracking-widest border-none group/btn"
                            onClick={() => {
                                if (inputValue.length > 2) {
                                    window.location.href = `/${locale}/customizer?vision=${encodeURIComponent(inputValue)}`;
                                }
                            }}
                        >
                            {t('generate')}
                            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </div>

                    {/* QUICK SUGGESTIONS (NLP_ASSIST) */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                        {[
                            { ar: 'مطعم فاخر في الرياض', en: 'Luxury Fine Dining in London' },
                            { ar: 'وكالة تسويق سيادية', en: 'Sovereign Growth Agency' },
                            { ar: 'عيادة تجميل ذكية', en: 'Smart Aesthetic Clinic' },
                            { ar: 'منصة عقارات بأسلوب تقني', en: 'Tech-First Real Estate Hub' }
                        ].map((hint) => (
                            <button
                                key={hint.en}
                                onClick={() => setInputValue(locale === 'ar' ? hint.ar : hint.en)}
                                className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 uppercase font-black tracking-widest hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all active:scale-95"
                            >
                                <span className="opacity-40 mr-2">/</span>
                                {locale === 'ar' ? hint.ar : hint.en}
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
