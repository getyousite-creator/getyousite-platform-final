"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Services from "@/components/home/Services";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Zap, Cpu, Globe, Shield, Smartphone, Rocket } from "lucide-react";

export default function ServicesPage() {
    const t = useTranslations('Services');

    return (
        <main className="bg-[#020617] min-h-screen selection:bg-primary/30">
            <Header />

            <section className="relative pt-48 pb-20 px-6">
                <div className="container mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase italic"
                    >
                        Sovereign <span className="text-primary not-italic">Systems</span>
                    </motion.h1>
                    <p className="text-white/40 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-12">
                        Advanced architectural logic synthesized for extreme business performance.
                    </p>
                </div>
            </section>

            <Services />

            <section className="py-32 px-6 border-t border-white/5">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-8 uppercase tracking-tighter">Proprietary Deployment Logic</h2>
                            <p className="text-white/40 text-lg leading-relaxed mb-10">
                                Every site is deployed onto our proprietary high-frequency edge network. This isn't just hosting; it's digital sovereign defense.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Edge Propagation < 150ms",
                                    "Neural Cache Optimization",
                                    "Military-Grade SSL Synthesis",
                                    "Real-Time Logic Monitoring"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white font-bold tracking-widest text-xs">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        {item.toUpperCase()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 rounded-[2rem] border border-white/10 p-12 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Business Intelligence Core</h3>
                            <p className="text-white/30 leading-relaxed italic">
                                "The difference between a website and a digital asset is the intelligence behind it. We provide the intelligence."
                            </p>
                            <div className="mt-10 pt-10 border-t border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Cpu className="text-primary w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-bold uppercase tracking-widest">Neural Engine 4.0</p>
                                    <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Active & Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
