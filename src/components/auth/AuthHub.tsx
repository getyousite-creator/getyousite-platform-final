"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Globe, Apple, LucideIcon, Sparkles, ShieldCheck } from "lucide-react";
import { signInAction, signUpAction, signInWithOAuthAction } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

interface AuthHubProps {
    initialMode?: "signin" | "signup";
}

const BingIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L4 5V19L12 23L20 19V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 1L4 5L12 9L20 5L12 1Z" fill="currentColor" fillOpacity="0.3" />
    </svg>
);

export default function AuthHub({ initialMode = "signin" }: AuthHubProps) {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const router = useRouter();
    const isRtl = locale === 'ar';

    const [mode, setMode] = useState<"signin" | "signup">(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOAuth = async (provider: 'google' | 'apple' | 'azure') => {
        setLoading(true);
        setError(null);
        try {
            await signInWithOAuthAction(provider);
        } catch (err) {
            setError("Authentication failed. Please try again.");
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = mode === "signin"
            ? await signInAction(email, password)
            : await signUpAction(email, password);

        if (!result.success) {
            setError(result.error || "Authentication failure");
            setLoading(false);
        } else {
            if (mode === "signin") {
                router.push("/dashboard");
                router.refresh();
            } else {
                setMode("signin");
                setLoading(false);
            }
        }
    };

    return (
        <div className={cn(
            "w-full max-w-[450px] mx-auto",
            isRtl ? "font-arabic" : "font-sans"
        )}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-10 rounded-[32px] bg-black/40 backdrop-blur-3xl border border-white/5 shadow-2xl"
            >
                {/* Visual Accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />

                <div className="flex flex-col items-center text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center gap-2 group cursor-default"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                            Sovereign_Access_Unlocked
                        </span>
                    </motion.div>

                    <Logo className="mb-6 scale-110" showText={false} />
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">
                        {mode === "signin" ? t('signin_title') : t('signup_title')}
                    </h1>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-blue-500/50" />
                        {t('subtitle')}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Social Stack */}
                    <div className="grid gap-3">
                        <AuthButton
                            icon={<svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>}
                            label={t('google')}
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                        />
                        <AuthButton
                            icon={<Apple className="w-4 h-4" />}
                            label={t('apple')}
                            onClick={() => handleOAuth('apple')}
                            disabled={loading}
                        />
                        <AuthButton
                            icon={<BingIcon />}
                            label={t('microsoft')}
                            onClick={() => handleOAuth('azure')}
                            disabled={loading}
                        />
                    </div>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#0c0c0c] px-4 text-[8px] font-black uppercase tracking-[0.5em] text-zinc-600">
                                {t('or_divider')}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
                                {t('email_label')}
                            </Label>
                            <Input
                                type="email"
                                placeholder={t('email_placeholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/[0.03] border-white/5 h-12 text-sm focus:bg-white/[0.07] transition-all rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">
                                {t('password_label')}
                            </Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/[0.03] border-white/5 h-12 text-sm focus:bg-white/[0.07] transition-all rounded-xl"
                                required
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] text-red-400 font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center uppercase tracking-wider"
                            >
                                {error}
                            </motion.p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] group overflow-hidden relative"
                            disabled={loading}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        {mode === "signin" ? t('login_button') : t('signup_button')}
                                        <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </span>
                        </Button>
                    </form>

                    <div className="pt-6 text-center">
                        <button
                            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-all underline underline-offset-8 decoration-zinc-800 hover:decoration-blue-500"
                        >
                            {mode === "signin" ? t('no_account') : t('have_account')}
                        </button>
                    </div>

                    <p className="text-[10px] text-zinc-700 text-center px-4 leading-relaxed">
                        {t('terms')}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

function AuthButton({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) {
    return (
        <Button
            variant="outline"
            className="w-full h-12 border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-white font-bold uppercase tracking-widest text-[9px] gap-3 justify-start px-6 rounded-xl transition-all"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
        </Button>
    );
}
