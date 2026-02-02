"use client";

import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLaunchModal } from "@/hooks/use-launch-modal";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
];

import Logo from "@/components/ui/Logo";

import { useAuthModal } from "@/hooks/use-auth-modal";

export default function Header() {
    const t = useTranslations('Header');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const onOpenLaunch = useLaunchModal((state) => state.onOpen);
    const onOpenAuth = useAuthModal((state) => state.onOpen);

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const changeLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <>
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
                    isScrolled
                        ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl"
                        : "bg-transparent py-8"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Logo onClick={() => router.push('/')} />

                    {/* Desktop Navigation - Refined Structure */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <a href="#services" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-all">{t('services')}</a>
                        <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-all">{t('pricing')}</a>
                        <a href="#showcase" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-400 transition-all">{t('portfolio')}</a>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Lang Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors uppercase">
                                <Globe className="w-4 h-4" />
                                <span>{locale}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2 text-zinc-300 hover:text-white"
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.code.toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white"
                            onClick={() => onOpenAuth()}
                        >
                            Log_In
                        </Button>
                        <Button
                            variant="glow"
                            className="bg-blue-600 hover:bg-blue-500 text-white border-0 h-10 px-6 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                            onClick={() => onOpenLaunch()}
                        >
                            {t('launch')}
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-slate-950 border-b border-white/5"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            <a href="#services" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('services')}</a>
                            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('pricing')}</a>
                            <a href="#showcase" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('portfolio')}</a>
                            <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                                <Button variant="outline" className="w-full border-white/10 text-[10px] font-black uppercase tracking-[0.3em]" onClick={() => onOpenAuth()}>{t('login') || 'Log_In'}</Button>
                                <Button className="w-full bg-blue-600 text-[10px] font-black uppercase tracking-[0.3em]" onClick={() => onOpenLaunch()}>{t('launch')}</Button>
                            </div>

                            <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 justify-center">
                                {languages.map((lang) => (
                                    <button key={lang.code} onClick={() => changeLocale(lang.code)} className="text-2xl">
                                        {lang.flag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.header>
        </>
    );
}
