"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, Shield, Cpu, Activity, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";

const languages = [
    { code: "en", label: "English", tag: "EN" },
    { code: "ar", label: "Arabic", tag: "AR" },
    { code: "fr", label: "French", tag: "FR" },
    { code: "es", label: "Spanish", tag: "ES" },
];

import Logo from "@/shared/components/ui/Logo";

export default function Header() {
    const t = useTranslations('Header');
    const tAuth = useTranslations('Auth');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

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
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out",
                    isScrolled
                        ? "bg-[#020617]/40 backdrop-blur-2xl border-b border-white/5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                        : "bg-transparent py-8"
                )}
            >
                <div className="container mx-auto px-8 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Logo onClick={() => router.push('/')} />

                        {/* Desktop Navigation - Sovereign Core Protocol */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {[
                                { name: t('services'), href: '/services' },
                                { name: t('pricing'), href: '/pricing' },
                                { name: t('portfolio'), href: '/templates' },
                                { name: t('blog'), href: '/blog' },
                                { name: t('contact'), href: '/contact' },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group relative px-2 py-1"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40 group-hover:text-primary transition-colors duration-300">
                                        {item.name}
                                    </span>
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                                    />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* System Operations & Actions */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Sovereign Protocol Status */}
                        <div className="hidden xl:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
                            <div className="relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-400 blur-sm animate-pulse" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
                                {t('sovereign_access')}
                            </span>
                        </div>

                        {/* Lang Selector - Protocol Translation Engine */}
                        <div className="relative group">
                            <button
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest border border-transparent hover:border-white/10"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{locale}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-3 w-48 bg-[#020617]/98 border border-white/10 rounded-2xl shadow-3xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 backdrop-blur-3xl overflow-hidden p-2">
                                <div className="px-3 py-2 border-b border-white/5 mb-1 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
                                    Region Protocol
                                </div>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-[10px] font-black rounded-xl flex items-center justify-between group/item transition-all",
                                            locale === lang.code ? "bg-primary/10 text-primary" : "text-white/40 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs opacity-50">{lang.tag}</span>
                                            <span className="tracking-widest uppercase">{lang.label}</span>
                                        </div>
                                        {locale === lang.code && <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!loading && user ? (
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Activity className="w-3.5 h-3.5" />
                                    {t('dashboard')}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-white/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                    onClick={async () => {
                                        const supabase = createClient();
                                        await supabase.auth.signOut();
                                        router.push('/');
                                        router.refresh();
                                        toast.success(tAuth('signout_success'));
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 h-10 px-6 rounded-xl transition-all"
                                    onClick={() => router.push('/login')}
                                >
                                    {t('login')}
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-[#2563eb] text-[#020617] h-10 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all transform hover:scale-[1.05] active:scale-[0.98]"
                                    onClick={() => router.push('/live-demo?source=header')}
                                >
                                    <Cpu className="w-4 h-4 mr-2" />
                                    {t('launch')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle - Command Interface */}
                    <button
                        className="md:hidden text-white/60 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu - System Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="md:hidden fixed inset-x-0 top-[72px] bg-[#020617]/98 backdrop-blur-3xl border-b border-white/5 shadow-3xl overflow-hidden z-[90]"
                        >
                            <div className="flex flex-col p-8 gap-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                                {[
                                    { name: t('services'), href: '/services' },
                                    { name: t('pricing'), href: '/pricing' },
                                    { name: t('portfolio'), href: '/templates' },
                                    { name: t('blog'), href: '/blog' },
                                    { name: t('contact'), href: '/contact' },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-sm font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-all pb-4 border-b border-white/[0.03]"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                <div className="flex flex-col gap-3 mt-4">
                                    <Button
                                        variant="ghost"
                                        className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-white/40 h-14 rounded-2xl bg-white/5 group border border-white/5 hover:border-white/10"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            router.push('/login');
                                        }}
                                    >
                                        {t('login')}
                                    </Button>
                                    <Button
                                        className="w-full bg-primary text-[#020617] text-[10px] font-black uppercase tracking-[0.3em] h-14 rounded-2xl shadow-vip-glow"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            router.push('/live-demo?source=header-mobile');
                                        }}
                                    >
                                        <Zap className="w-4 h-4 mr-2" />
                                        {t('launch')}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-4 gap-3 mt-6">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                changeLocale(lang.code);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={cn(
                                                "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border",
                                                locale === lang.code
                                                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                                    : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10 hover:text-white"
                                            )}
                                        >
                                            <span className="text-[10px] font-black">{lang.tag}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
}

