"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ShowcaseGallery from "@/components/home/showcase/ShowcaseGallery";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export default function TemplatesPage() {
    const t = useTranslations('Showcase');

    return (
        <main className="bg-[#020617] min-h-screen selection:bg-primary/30 overflow-hidden">
            <Header />

            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-primary/5 blur-[160px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-emerald-500/5 blur-[140px] rounded-full delay-1000" />
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[#00D09C] text-[10px] font-black uppercase tracking-[0.4em] mb-12"
                    >
                        <Sparkles className="w-4 h-4" />
                        Sovereign Template Library
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter italic leading-[0.9]"
                    >
                        Master <span className="text-primary not-italic">Blueprints</span>
                    </motion.h1>

                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-20">
                        Select a high-frequency architectural foundation. Optimized for immediate market impact and technical dominance.
                    </p>
                </div>
            </section>

            <section className="py-32 px-6">
                <div className="container mx-auto">
                    <ShowcaseGallery />
                </div>
            </section>

            <Footer />
        </main>
    );
}
