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
                        ? "bg-background/80 backdrop-blur-xl border-b border-border py-4 shadow-sm"
                        : "bg-transparent py-8"
                )}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Logo onClick={() => router.push('/')} />

                    {/* Desktop Navigation - Refined Structure */}
                    <nav className="hidden lg:flex items-center gap-10">
                        <a href="#services" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">{t('services')}</a>
                        <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">{t('pricing')}</a>
                        <a href="#showcase" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">{t('portfolio')}</a>
                        <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all font-mono">{t('blog')}</Link>
                        <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all font-mono">{t('contact')}</Link>
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Lang Selector */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors uppercase">
                                <Globe className="w-4 h-4" />
                                <span>{locale}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-32 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLocale(lang.code)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.code.toUpperCase()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!loading && user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 hover:text-primary/80 transition-colors"
                                >
                                    <UserIcon className="w-3.5 h-3.5" />
                                    {t('dashboard')}
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-destructive gap-2 h-9"
                                    onClick={async () => {
                                        const supabase = createClient();
                                        await supabase.auth.signOut();
                                        window.location.href = '/';
                                        toast.success("Security sequence: Session Terminated.");
                                    }}
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    {t('signout')}
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
                                    onClick={() => router.push('/login')}
                                >
                                    {t('login')}
                                </Button>
                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-10 px-6 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                                    onClick={() => router.push('/signup')}
                                >
                                    {t('launch')}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-background border-b border-border"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            <a href="#services" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('services')}</a>
                            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('pricing')}</a>
                            <a href="#showcase" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('portfolio')}</a>
                            <Link href="/blog" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('blog')}</Link>
                            <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('contact')}</Link>
                            <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                <Button variant="outline" className="w-full border-border text-[10px] font-black uppercase tracking-[0.3em] text-foreground" onClick={() => router.push('/login')}>{t('login')}</Button>
                                <Button className="w-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em]" onClick={() => router.push('/signup')}>{t('launch')}</Button>
                            </div>

                            <div className="flex gap-4 mt-4 pt-4 border-t border-border justify-center">
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
