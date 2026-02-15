"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingEngine from "@/components/payment/PricingEngine";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Shield, User } from "lucide-react";

export default function PricingPage() {
    return (
        <main className="bg-[#020617] min-h-screen selection:bg-primary/30 outline-none">
            <Header />

            <section className="relative pt-48 pb-20 px-6">
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-2xl"
                    >
                        <Shield className="w-4 h-4" />
                        Sovereign Investment Logic
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-9xl font-black text-white mb-10 tracking-tighter uppercase italic leading-none"
                    >
                        Scalable <span className="text-primary not-italic">Power</span>
                    </motion.h1>

                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-20">
                        Transparent, military-grade pricing for businesses that command their market.
                    </p>
                </div>
            </section>

            <div className="pb-32">
                <PricingEngine />
            </div>

            <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">No Hidden Fees</h4>
                            <p className="text-white/30 text-[11px] leading-relaxed uppercase tracking-widest">Logic is absolute. What you see is exactly what you deploy.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">SLA Guaranteed</h4>
                            <p className="text-white/30 text-[11px] leading-relaxed uppercase tracking-widest">99.9% Hydration stability for your digital empire.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs">Global Scalability</h4>
                            <p className="text-white/30 text-[11px] leading-relaxed uppercase tracking-widest">Scale to millions of users with zero friction.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
