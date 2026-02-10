"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Brain, Target, Search, Globe, Zap, Shield, Sparkles, Cpu } from "lucide-react";

export default function AIEngine() {
    const t = useTranslations('AIEngine');
    const [lines, setLines] = useState<string[]>([]);

    const codeSnippet = [
        t('terminal.init'),
        t('terminal.loading'),
        t('terminal.mesh'),
        t('terminal.opt'),
        t('terminal.online'),
        t('terminal.ready')
    ];

    const features = [
        { icon: Brain, text: t('features.refinement'), token: "text-primary" },
        { icon: Target, text: t('features.arabic'), text_color: "text-primary" },
        { icon: Search, text: t('features.seo'), text_color: "text-primary" },
        { icon: Globe, text: t('features.edge'), text_color: "text-primary" },
        { icon: Zap, text: t('features.ux'), text_color: "text-[#10B981]" },
        { icon: Shield, text: t('features.security'), text_color: "text-[#10B981]" },
    ];

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < codeSnippet.length) {
                setLines(prev => [...prev, codeSnippet[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="ai-engine" className="py-32 bg-[#020617] border-y border-white/5 relative overflow-hidden">
            {/* High-Tech Background Elements */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24">

                    {/* Content Section */}
                    <div className="flex-1 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.2em]"
                        >
                            <Brain className="w-4 h-4" />
                            <span>{t('badge')}</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]"
                            dangerouslySetInnerHTML={{ __html: t('title') }}
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-xl leading-relaxed font-light max-w-xl"
                        >
                            {t('desc')}
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                        >
                            {features.map((feature) => (
                                <li key={feature.text} className="flex items-center gap-4 text-white/50 text-sm font-medium transition-colors hover:text-white group">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                                        <feature.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </motion.ul>

                        {/* Performance Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-8 pt-10 border-t border-white/5"
                        >
                            <div>
                                <div className="text-3xl font-bold text-white tracking-tight">100<span className="text-primary">/</span>100</div>
                                <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">{t('stats.lighthouse')}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white tracking-tight">Global</div>
                                <div className="text-primary text-[10px] font-bold uppercase tracking-widest mt-2">{t('stats.propagation')}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white tracking-tight">ISO-AI</div>
                                <div className="text-[#10B981] text-[10px] font-bold uppercase tracking-widest mt-2">{t('stats.standard')}</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Terminal/Logic Visualization */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#1e293b]/30 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden aspect-video relative group"
                        >
                            {/* Terminal OS Header */}
                            <div className="px-6 py-4 flex items-center gap-3 border-b border-white/5 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                    <div className="w-3 h-3 rounded-full bg-primary/20" />
                                </div>
                                <div className="ml-4 text-[10px] text-white/20 font-mono tracking-[0.2em] uppercase">GYS_CORE_LOGIC_V2.OS</div>
                                <div className="ml-auto">
                                    <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[9px] text-primary font-bold">SYSTEM ACTIVE</div>
                                </div>
                            </div>

                            {/* Logic Stream */}
                            <div className="p-10 font-mono text-[13px] min-h-[300px] leading-relaxed">
                                {lines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-4 flex gap-3"
                                    >
                                        <span className="text-primary font-bold">LOG_</span>
                                        <span className="text-white/40 tracking-wide">{line}</span>
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-2 h-5 bg-primary mt-2 shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                                />
                            </div>

                            {/* Data Mesh Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                        </motion.div>

                        {/* High-Tech Peripheral Badges */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 bg-[#020617]/80 backdrop-blur-2xl border border-primary/20 rounded-2xl p-5 shadow-2xl z-20 space-y-4"
                        >
                            <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t('gpt_active')}</span>
                                    <span className="text-[8px] text-white/30 uppercase tracking-widest">Neural Sync</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-[#10B981]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t('edge_synthesis')}</span>
                                    <span className="text-[8px] text-white/30 uppercase tracking-widest">Speed: 45ms</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
