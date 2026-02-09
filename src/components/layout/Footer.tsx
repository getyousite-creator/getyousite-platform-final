"use client";

import { Github, Twitter, Linkedin, Server } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-black border-t border-white/5 py-24">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">GETYOUSITE</h3>
                        <p className="text-blue-100/40 text-[10px] font-black uppercase tracking-[.2em] leading-relaxed">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6 underline decoration-[#00D09C]/40 underline-offset-8">{t('platform')}</h4>
                        <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <li><a href="#services" className="hover:text-[#00D09C] transition-colors">{t('aiEngine')}</a></li>
                            <li><a href="#pricing" className="hover:text-[#00D09C] transition-colors">{t('pricing')}</a></li>
                            <li><Link href="/blog" className="hover:text-[#00D09C] transition-colors">{t('blog')}</Link></li>
                            <li><Link href="/contact" className="hover:text-[#00D09C] transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6 underline decoration-[#00D09C]/40 underline-offset-8">{t('company')}</h4>
                        <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <li><Link href="/about" className="hover:text-[#00D09C] transition-colors">{t('about')}</Link></li>
                            <li><Link href="/help" className="hover:text-[#00D09C] transition-colors">{t('help')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-[#00D09C] transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-[#00D09C] transition-colors">{t('terms')}</Link></li>
                        </ul>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-6 underline decoration-[#00D09C]/40 underline-offset-8">{t('system')}</h4>
                        <div className="flex items-center gap-3 bg-[#0A2540]/20 p-4 rounded-2xl border border-white/5 backdrop-blur-md hover:border-[#00D09C]/30 transition-all group">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-[#00D09C] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,208,156,0.6)]"></div>
                            </div>
                            <div>
                                <p className="text-[10px] text-white font-black uppercase tracking-widest">{t('operational')}</p>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{t('hosted')}</p>
                            </div>
                            <Server className="w-4 h-4 text-[#00D09C] ml-auto group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">{t('copyright')}</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-600 hover:text-[#00D09C] transition-colors"><Twitter size={16} /></a>
                        <a href="#" className="text-gray-600 hover:text-[#00D09C] transition-colors"><Github size={16} /></a>
                        <a href="#" className="text-gray-600 hover:text-[#00D09C] transition-colors"><Linkedin size={16} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
