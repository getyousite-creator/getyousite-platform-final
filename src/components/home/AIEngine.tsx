"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Target, Search, Globe, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const codeSnippet = [
    "> Initializing Engine Core...",
    "> Loading modules: [Design, Content, Analytics]...",
    "> Connecting to High-Perf Mesh...",
    "> OPTIMIZATION_LEVEL: MAXIMUM",
    "> Status: ONLINE",
    "> Ready to construct."
];

const features = [
    { icon: Brain, text: "Self-Healing Codebase", token: "text-primary" },
    { icon: Target, text: "Real-time A/B Testing", token: "text-secondary" },
    { icon: Search, text: "Semantic SEO Injection", token: "text-success" },
    { icon: Globe, text: "Multi-Language Generation", token: "text-accent" },
    { icon: Zap, text: "Lightning Fast Deployment", token: "text-warning" },
    { icon: Shield, text: "Enterprise Security", token: "text-danger" },
];

export default function AIEngine() {
    const [lines, setLines] = useState<string[]>([]);

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
        <section id="ai-engine" className="py-24 bg-background/50 border-y border-border">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D09C]/10 border border-[#00D09C]/20 text-[#00D09C] text-xs font-black uppercase tracking-widest"
                        >
                            <Brain className="w-3.5 h-3.5" />
                            <span>Neural Architecture Synthesis</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight italic"
                        >
                            The Engine That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D09C] to-[#00D09C]/40">Manifests Reality.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground text-lg leading-relaxed font-medium"
                        >
                            Our automated design system analyzes your mission and generates a high-frequency architecture in seconds. It orchestrates layout, copy, and performance parameters for absolute dominance.
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {features.map((feature) => (
                                <li key={feature.text} className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                                    <feature.icon className={`w-4 h-4 text-[#00D09C]`} />
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </motion.ul>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5"
                        >
                            <div>
                                <div className="text-3xl font-black text-white italic">100/100</div>
                                <div className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest mt-1">Lighthouse Score</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white italic">Global</div>
                                <div className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest mt-1">Edge Propagation</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-white italic">ISO</div>
                                <div className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest mt-1">Sovereign Standard</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#0A2540]/50 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl overflow-hidden aspect-video md:aspect-square lg:aspect-video relative group"
                        >
                            {/* Window Header */}
                            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/5 bg-[#0A2540]/40">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-[#00D09C]/50" />
                                <div className="ml-4 text-[10px] text-gray-500 font-mono tracking-widest">SOVEREIGN_ENGINE_V1.EXE</div>
                            </div>

                            {/* Terminal Body */}
                            <div className="p-8 font-mono text-xs">
                                {lines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-3"
                                    >
                                        <span className="text-[#00D09C] mr-2">➜</span>
                                        <span className="text-blue-200/60 tracking-wider transition-colors group-hover:text-blue-100">{line}</span>
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2.5 h-5 bg-[#00D09C] mt-2 shadow-[0_0_15px_rgba(0,208,156,0.6)]"
                                />
                            </div>

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,208,156,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,208,156,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                        </motion.div>

                        {/* Floating badges */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -right-4 top-1/4 bg-[#0A2540]/90 backdrop-blur-xl border border-[#00D09C]/20 rounded-2xl p-4 shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-[#00D09C]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">GPT-4 Turbo active</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="absolute -left-4 bottom-1/4 bg-[#0A2540]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-20"
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-[#00D09C]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Edge Synthesis</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
