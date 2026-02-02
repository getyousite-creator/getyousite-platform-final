"use client";

import { motion } from "framer-motion";
import { Terminal, Brain, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const codeSnippet = [
    "> Initializing Neural Core...",
    "> Loading modules: [Vision, NLP, Analytics]...",
    "> Connecting to Quantum Mesh...",
    "> OPTIMIZATION_LEVEL: MAXIMUM",
    "> Status: ONLINE",
    "> Ready to construct."
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
        <section id="ai-engine" className="py-24 bg-zinc-950/50 border-y border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Content */}
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium"
                        >
                            <Brain className="w-3 h-3" />
                            <span>Next-Gen Intelligence</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold text-white"
                        >
                            The Engine That <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Builds Itself.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-zinc-400 text-lg leading-relaxed"
                        >
                            Forget drag-and-drop. Our AI analyzes your intent, studies your competitors, and generates a conversion-optimized architecture in seconds. It writes code, writes copy, and optimizes images autonomously.
                        </motion.p>

                        <motion.ul
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                        >
                            {["Self-Healing Codebase", "Real-time AB Testing", "Semantic SEO Injection"].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-zinc-300">
                                    <Sparkles className="w-5 h-5 text-purple-500" />
                                    {item}
                                </li>
                            ))}
                        </motion.ul>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-black rounded-xl border border-zinc-800 shadow-2xl overflow-hidden aspect-video md:aspect-square lg:aspect-video"
                        >
                            {/* Window Header */}
                            <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-800">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="ml-4 text-xs text-zinc-500 font-mono">quantum_core.exe</div>
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
                                        <span className="text-zinc-300">{line}</span>
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
                    </div>

                </div>
            </div>
        </section>
    );
}
