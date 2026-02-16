"use client";

import { Github, Twitter, Linkedin, Server } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-[#020617] border-t border-white/5 py-32 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold tracking-tighter text-white">GET<span className="text-primary italic font-light">YOU</span>SITE</h3>
                        <p className="text-white/30 text-[11px] font-bold uppercase tracking-[.25em] leading-relaxed max-w-[200px]">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Navigation Cluster */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-8 flex items-center gap-3">
                            {t('platform')}
                            <div className="h-px flex-1 bg-white/5" />
                        </h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
                            <li><Link href="/services" className="hover:text-primary transition-colors">{t('aiEngine')}</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">{t('pricing')}</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">{t('blog')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Cluster */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-8 flex items-center gap-3">
                            {t('company')}
                            <div className="h-px flex-1 bg-white/5" />
                        </h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link></li>
                            <li><Link href="/help" className="hover:text-primary transition-colors">{t('help')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">{t('terms')}</Link></li>
                        </ul>
                    </div>

                    {/* Active Intelligence Status */}
                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 mb-8 flex items-center gap-3">
                            {t('system')}
                            <div className="h-px flex-1 bg-white/5" />
                        </h4>
                        <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 backdrop-blur-xl hover:border-primary/20 transition-all group cursor-default">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full animate-ping absolute top-0 left-0 opacity-40"></div>
                                </div>
                                <p className="text-[11px] text-white font-bold uppercase tracking-[0.1em]">{t('operational')}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{t('hosted')}</p>
                                <Server className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Footer Row */}
                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/10">{t('copyright')}</p>
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-white/20 hover:text-primary transition-all hover:scale-110"><Twitter size={18} /></a>
                        <a href="#" className="text-white/20 hover:text-primary transition-all hover:scale-110"><Github size={18} /></a>
                        <a href="#" className="text-white/20 hover:text-primary transition-all hover:scale-110"><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
