"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShowcaseGallery from "@/components/home/showcase/ShowcaseGallery";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles, Globe, Cpu, Zap } from "lucide-react";

export default function ShowcasePage() {
    const t = useTranslations('Showcase');

    return (
        <main className="bg-[#020617] min-h-screen selection:bg-primary/30 overflow-hidden">
            <Header />

            {/* CINEMATIC HERO SECTION */}
            <section className="relative pt-48 pb-32 px-6">
                {/* Neural Mesh Background */}
                <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-primary/5 blur-[160px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-emerald-500/5 blur-[140px] rounded-full delay-1000" />

                    {/* Perspective Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
                        }}
                    />
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#00D09C] text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl"
                    >
                        <Sparkles className="w-4 h-4" />
                        Sovereign Architectural Showcase
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter italic leading-[0.9]"
                    >
                        Digital <span className="text-primary NOT-italic">Excellence</span> <br />
                        <span className="text-white/20">Synthesized.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-20"
                    >
                        Explore the high-frequency business assets engineered by our AI Design Core. Optimized for zero-latency commerce and absolute market dominance.
                    </motion.p>

                    {/* Tech Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-t border-white/5 pt-12"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-white mb-2">99.9%</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Hydration Stability</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-primary mb-2">&lt;150ms</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Edge Response</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-emerald-400 mb-2">100/100</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">SEO Authority</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-black text-white mb-2">256-bit</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Encryption Core</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section className="py-32 px-6">
                <div className="container mx-auto">
                    <ShowcaseGallery />
                </div>
            </section>

            {/* CALL TO ACTION DROID */}
            <section className="py-40 bg-gradient-to-b from-transparent to-primary/5 border-t border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter uppercase italic">Ready to Synthesize Your Own?</h2>
                    <p className="text-white/40 text-lg mb-12">Deployment takes less than 48 hours. Logic is permanent.</p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <button className="h-16 px-16 bg-primary hover:bg-[#2563eb] text-[#020617] font-black tracking-widest uppercase text-xs rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all">
                            Initialize Neural Build
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
