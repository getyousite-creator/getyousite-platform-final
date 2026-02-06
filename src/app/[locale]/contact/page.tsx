"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Mail, MessageSquare, Shield, Globe, Send, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
    const t = useTranslations('Contact');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Logical Simulation of Transmission
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast.success(t('form.success'));
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* AUTHORITY HEADER */}
                    <div className="max-w-4xl mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8"
                        >
                            <Shield className="w-3 h-3" />
                            {t('badge')}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase mb-8 leading-none"
                        >
                            {t('title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* TRANSMISSION FORM */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                            <form
                                onSubmit={handleSubmit}
                                className="relative bg-slate-900/50 border border-white/10 rounded-3xl p-10 backdrop-blur-3xl space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('form.name')}</label>
                                        <Input
                                            required
                                            className="bg-slate-950/50 border-white/5 h-14 rounded-xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-start"
                                            placeholder={t('form.name_placeholder')}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('form.email')}</label>
                                        <Input
                                            required
                                            type="email"
                                            className="bg-slate-950/50 border-white/5 h-14 rounded-xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-start"
                                            placeholder={t('form.email_placeholder')}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('form.subject')}</label>
                                    <Input
                                        required
                                        className="bg-slate-950/50 border-white/5 h-14 rounded-xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-start"
                                        placeholder={t('form.subject_placeholder')}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('form.message')}</label>
                                    <Textarea
                                        required
                                        className="bg-slate-950/50 border-white/5 min-h-[160px] rounded-xl focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-start"
                                        placeholder={t('form.message_placeholder')}
                                    />
                                </div>
                                <Button
                                    disabled={isSubmitting}
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-lg font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 group/btn"
                                >
                                    {isSubmitting ? t('form.sending') : t('form.send')}
                                    <Send className="mx-3 w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </Button>
                            </form>
                        </motion.div>

                        {/* STRATEGIC NODES */}
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-10">
                                    {t('info.title')}
                                </h2>

                                <div className="space-y-10">
                                    <NodeItem
                                        icon={Mail}
                                        label={t('info.support')}
                                        value="support@getyousite.com"
                                        link="mailto:support@getyousite.com"
                                    />
                                    <NodeItem
                                        icon={MessageSquare}
                                        label={t('info.commercial')}
                                        value="partners@getyousite.com"
                                        link="mailto:partners@getyousite.com"
                                    />
                                    <NodeItem
                                        icon={Globe}
                                        label={t('info.hq')}
                                        value={t('info.address')}
                                        link="#"
                                    />
                                </div>
                            </motion.div>

                            {/* CTAs */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-12 border-t border-white/5 space-y-6"
                            >
                                <a
                                    href="https://wa.me/212661000000"
                                    target="_blank"
                                    className="flex items-center justify-between p-6 rounded-2xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-green-500/70 mb-1">{t('whatsapp.title')}</p>
                                            <p className="text-lg font-bold">{t('whatsapp.label')}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-green-500 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function NodeItem({ icon: Icon, label, value, link }: any) {
    return (
        <a href={link} className="flex items-center gap-6 group hover:translate-x-2 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                <p className="text-xl font-bold group-hover:text-blue-400 transition-colors">{value}</p>
            </div>
        </a>
    );
}
