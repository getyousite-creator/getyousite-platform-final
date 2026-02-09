"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export default function HelpPage() {
    const t = useTranslations('Help');
    const router = useRouter();

    const faqs = [
        { q: t('faqs.q1'), a: t('faqs.a1') },
        { q: t('faqs.q2'), a: t('faqs.a2') },
        { q: t('faqs.q3'), a: t('faqs.a3') },
        { q: t('faqs.q4'), a: t('faqs.a4') }
    ];

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
                            <HelpCircle className="w-3 h-3" />
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

                    <div className="max-w-3xl mx-auto space-y-6 mb-16">
                        <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter text-center">{t('faq_title')}</h2>
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-secondary border border-border rounded-2xl text-start"
                            >
                                <h3 className="text-lg font-bold mb-3 text-foreground">{faq.q}</h3>
                                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="max-w-2xl mx-auto text-center">
                        <div className="p-10 bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-3xl">
                            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-black italic uppercase mb-4 tracking-tighter">{t('no_answer_title')}</h3>
                            <p className="text-muted-foreground mb-6">{t('no_answer_desc')}</p>
                            <Button
                                onClick={() => router.push('/contact')}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                {t('contact_support')}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
