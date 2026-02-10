"use client";

import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";

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

    const { user, loading } = useSupabase();
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
                        ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl"
                        : "bg-transparent py-8"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Logo onClick={() => router.push('/')} />

                    {/* Desktop Navigation - GYS-V2 Protocol */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <a href="#services" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('services')}</a>
                        <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('pricing')}</a>
                        <a href="#showcase" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('portfolio')}</a>
                        <Link href="/blog" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('blog')}</Link>
                        <Link href="/contact" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('contact')}</Link>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Lang Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                                <Globe className="w-4 h-4" />
                                <span>{locale}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-3 w-40 bg-[#020617]/95 border border-white/10 rounded-2xl shadow-3xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 backdrop-blur-2xl overflow-hidden p-1.5">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className="w-full text-left px-4 py-3 text-[10px] font-bold rounded-xl hover:bg-primary/10 flex items-center gap-3 text-white/40 hover:text-white transition-all tracking-wider"
                                    >
                                        <span className="text-base">{lang.flag}</span>
                                        <span>{lang.label.toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!loading && user ? (
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/dashboard"
                                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 hover:scale-[1.05] transition-all"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    {t('dashboard')}
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-red-500 hover:bg-red-500/5 gap-2 h-10 px-4 rounded-xl transition-all"
                                    onClick={async () => {
                                        const supabase = createClient();
                                        await supabase.auth.signOut();
                                        window.location.href = '/';
                                        toast.success("Security sequence: Session Terminated.");
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    {t('signout')}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 h-10 px-6 rounded-xl transition-all"
                                    onClick={() => router.push('/login')}
                                >
                                    {t('login')}
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-[#2563eb] text-[#020617] h-10 px-8 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all transform hover:scale-[1.02]"
                                    onClick={() => router.push('/signup')}
                                >
                                    {t('launch')}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-white/60 hover:text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-[#020617] border-b border-white/5 backdrop-blur-3xl"
                    >
                        <div className="flex flex-col p-8 gap-8">
                            <a href="#services" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('services')}</a>
                            <a href="#pricing" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('pricing')}</a>
                            <a href="#showcase" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('portfolio')}</a>
                            <Link href="/blog" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('blog')}</Link>
                            <Link href="/contact" className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-primary transition-all">{t('contact')}</Link>
                            <div className="flex flex-col gap-4 pt-8 border-t border-white/5">
                                <Button variant="ghost" className="w-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 h-12 rounded-xl" onClick={() => router.push('/login')}>{t('login')}</Button>
                                <Button className="w-full bg-primary text-[#020617] text-[11px] font-bold uppercase tracking-[0.2em] h-12 rounded-xl shadow-lg" onClick={() => router.push('/signup')}>{t('launch')}</Button>
                            </div>

                            <div className="flex gap-6 mt-4 pt-8 border-t border-white/5 justify-center">
                                {languages.map((lang) => (
                                    <button key={lang.code} onClick={() => changeLocale(lang.code)} className="text-3xl hover:scale-110 transition-transform grayscale hover:grayscale-0">
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
