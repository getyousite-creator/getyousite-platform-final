"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Cpu, Shield } from "lucide-react";
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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-background">
            {/* Wix-Style INNOVATIVE BACKGROUND */}
            <div className="absolute inset-0 z-0">
                {/* Dynamic Mesh Gradients */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[150px] rounded-full delay-1000" />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay" />
            </div>

            <div className="container relative z-10 px-6 flex flex-col items-center text-center">
                {/* Innovative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-secondary border border-border backdrop-blur-md shadow-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-foreground/70 tracking-[0.1em] uppercase">{t('badge')}</span>
                </motion.div>

                {/* HEADING (H1) - Clarity First */}
                {/* Protocol: 3.75rem (60px) on LG. No Italic. No All-Caps. */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl lg:text-[3.75rem] font-bold tracking-tight text-foreground mb-6 max-w-4xl leading-[1.1]"
                >
                    {t('headline')}
                </motion.h1>

                {/* Subheadline - Functional Support */}
                {/* Protocol: 1.25rem (20px). Color: Neutral Secondary (#8A8A8E / muted-foreground) */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-[1.25rem] text-muted-foreground mb-12 max-w-2xl leading-relaxed font-normal"
                >
                    {t('subheadline')}
                </motion.p>

                {/* GENIUS AI COMMAND CENTER - REFINED */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                    className="w-full max-w-2xl relative group mb-20"
                >
                    {/* Simplified Glow */}
                    <div className="absolute -inset-1 bg-primary/20 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

                    <div className="relative flex items-center bg-card border border-border rounded-[1.5rem] p-2 shadow-xl overflow-hidden">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t('placeholder')}
                            className="w-full bg-transparent text-foreground px-6 py-4 focus:outline-none placeholder:text-muted-foreground font-medium text-lg"
                        />
                        <Button
                            className="shrink-0 h-14 px-8 rounded-xl bg-[#00D09C] hover:bg-[#00B085] text-white shadow-[0_0_30px_rgba(0,208,156,0.3)] transition-all text-base font-semibold border-none"
                            onClick={handleGenerate}
                        >
                            {t('generate')}
                        </Button>
                    </div>
                </motion.div>

                {/* TRUST INFRASTRUCTURE */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap items-center gap-16 justify-center text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase"
                >
                    <div className="flex items-center gap-3 hover:text-foreground transition-colors cursor-default group">
                        <Zap className="w-4 h-4 text-[#00D09C] group-hover:scale-125 transition-transform" />
                        <span>{t('badges.delivery')}</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-foreground transition-colors cursor-default group">
                        <Cpu className="w-4 h-4 text-[#00D09C] group-hover:scale-125 transition-transform opacity-70" />
                        <span>{t('badges.core')}</span>
                    </div>
                    <div className="flex items-center gap-3 hover:text-foreground transition-colors cursor-default group">
                        <Shield className="w-4 h-4 text-[#00D09C] group-hover:scale-125 transition-transform opacity-50" />
                        <span>{t('badges.logic')}</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
