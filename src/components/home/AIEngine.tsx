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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
                        >
                            <Brain className="w-3 h-3" />
                            <span>Next-Gen Intelligence</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-foreground"
                        >
                            The Engine That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Builds Itself.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground text-lg leading-relaxed"
                        >
                            Our automated design system analyzes your niche and generates a conversion-optimized architecture in seconds. It coordinates layout, copy, and performance parameters for maximum business impact.
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {features.map((feature) => (
                                <li key={feature.text} className="flex items-center gap-3 text-muted-foreground">
                                    <feature.icon className={`w-5 h-5 ${feature.token}`} />
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
                            className="grid grid-cols-3 gap-6 pt-6 border-t border-border/10"
                        >
                            <div>
                                <div className="text-3xl font-black text-foreground">Lighthouse</div>
                                <div className="text-muted-foreground text-sm">95+ Performance</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-foreground">Global</div>
                                <div className="text-muted-foreground text-sm">CDN Edge Ready</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-foreground">ISO</div>
                                <div className="text-muted-foreground text-sm">Safety Standard</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden aspect-video md:aspect-square lg:aspect-video"
                        >
                            {/* Window Header */}
                            <div className="px-4 py-3 flex items-center gap-2 border-b border-border bg-secondary/5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="ml-4 text-xs text-muted-foreground font-mono">engine_core.exe</div>
                            </div>

                            {/* Terminal Body */}
                            <div className="p-6 font-mono text-sm">
                                {lines.map((line, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-2"
                                    >
                                        <span className="text-green-500 mr-2">➜</span>
                                        <span className="text-muted-foreground">{line}</span>
                                    </motion.div>
                                ))}
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2 h-4 bg-green-500 mt-2"
                                />
                            </div>

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                        </motion.div>

                        {/* Floating badges */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="absolute -right-4 top-1/4 bg-card/80 backdrop-blur border border-border rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-mono text-foreground">GPT-4 Powered</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="absolute -left-4 bottom-1/4 bg-card/80 backdrop-blur border border-border rounded-lg p-3"
                        >
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-mono text-foreground">Edge Cached</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
