"use client";

import { Github, Twitter, Linkedin, Server } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-background border-t border-border py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold tracking-widest text-foreground">GETYOUSITE</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('tagline')}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-6">{t('platform')}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#services" className="hover:text-primary transition-colors">{t('aiEngine')}</a></li>
                            <li><a href="#pricing" className="hover:text-primary transition-colors">{t('pricing')}</a></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">{t('blog')}</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-6">{t('company')}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link></li>
                            <li><Link href="/help" className="hover:text-primary transition-colors">{t('help')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">{t('privacy')}</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">{t('terms')}</Link></li>
                        </ul>
                    </div>

                    {/* Status */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-6">{t('system')}</h4>
                        <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg border border-border">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <p className="text-xs text-foreground font-medium">{t('operational')}</p>
                                <p className="text-[10px] text-muted-foreground">{t('hosted')}</p>
                            </div>
                            <Server className="w-4 h-4 text-muted-foreground ml-auto" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">{t('copyright')}</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter size={18} /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={18} /></a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
