"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Users } from "lucide-react";

export default function AboutPage() {
    const t = useTranslations('About');

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8"
                        >
                            <Users className="w-3 h-3" />
                            {t('badge')}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase mb-8 leading-none"
                        >
                            {t('title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-10 bg-card border border-border rounded-3xl"
                        >
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                                <Target className="text-primary" />
                            </div>
                            <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">{t('mission_title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">{t('mission_text')}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-10 bg-card border border-border rounded-3xl"
                        >
                            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-6">
                                <Eye className="text-accent" />
                            </div>
                            <h2 className="text-3xl font-black italic uppercase mb-4 tracking-tighter">{t('vision_title')}</h2>
                            <p className="text-muted-foreground leading-relaxed">{t('vision_text')}</p>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
