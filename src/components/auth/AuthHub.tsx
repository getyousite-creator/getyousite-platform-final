"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Apple, Sparkles, ShieldCheck, Lock, ArrowRight, Quote, Star } from "lucide-react";
import { signInAction, signUpAction, signInWithOAuthAction, resetPasswordAction, updatePasswordAction } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface AuthHubProps {
    initialMode?: "signin" | "signup" | "forgot-password" | "reset-password";
}

const authSchema = z.object({
    email: z.string().email("error_invalid_email"),
    password: z.string().min(8, "error_password_too_short").optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthHub({ initialMode = "signin" }: AuthHubProps) {
    const t = useTranslations("Auth");
    const locale = useLocale();
    const router = useRouter();
    const isRtl = locale === 'ar';

    const [searchParamsError, setSearchParamsError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const errorMsg = params.get("error_message");
            if (errorMsg) {
                setSearchParamsError(errorMsg);
            }
        }
    }, []);

    const [mode, setMode] = useState<"signin" | "signup" | "forgot-password" | "reset-password" | "check-email">(
        initialMode === "signin"
            ? (typeof window !== "undefined" && window.location.pathname.includes("reset-password") ? "reset-password" : "signin")
            : initialMode
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (searchParamsError && !error) {
            setError(searchParamsError);
        }
    }, [searchParamsError, error]);

    const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema)
    });

    const handleOAuth = async (provider: 'google' | 'apple' | 'azure') => {
        setLoading(true);
        setError(null);
        try {
            await signInWithOAuthAction(provider);
        } catch (err) {
            console.error(err);
            setError("Authentication failed. Please try again.");
            setLoading(false);
        }
    };

    const onSubmit = async (data: AuthFormData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const mapError = (err: string) => {
            if (err.includes("already registered") || err.includes("already exists")) return t('error_user_exists');
            if (err.includes("Invalid login credentials")) return t('error_invalid_credentials');
            if (err.includes("Password should be at least")) return t('error_password_too_short');
            return t('error_generic');
        };

        if (mode === "reset-password") {
            const result = await updatePasswordAction(data.password!);
            if (!result.success) {
                setError(mapError(result.error || ""));
            } else {
                setMessage(t('update_success_msg'));
                setTimeout(() => setMode("signin"), 2000);
            }
            setLoading(false);
            return;
        }

        if (mode === "forgot-password") {
            const result = await resetPasswordAction(data.email);
            if (!result.success) {
                setError(mapError(result.error || ""));
            } else {
                setMessage(t('reset_success_msg'));
            }
            setLoading(false);
            return;
        }

        const result = mode === "signin"
            ? await signInAction(data.email, data.password!)
            : await signUpAction(data.email, data.password!);

        if (!result.success) {
            setError(mapError(result.error || ""));
            setLoading(false);
        } else {
            if (mode === "signin") {
                router.push(`/${locale}/dashboard`);
                router.refresh();
            } else {
                setMode("check-email");
                setLoading(false);
            }
        }
    };

    const toggleMode = () => {
        setMode(mode === "signin" ? "signup" : "signin");
        setError(null);
        setMessage(null);
    };

    // TRUST PANE CONTENT
    const TrustPane = () => (
        <div className="hidden lg:flex flex-col justify-between p-12 bg-[#0A2540] text-white relative overflow-hidden h-full">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8 opacity-80">
                    <ShieldCheck className="w-5 h-5 text-[#00D09C]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D09C]">Sovereign Trust Protocol</span>
                </div>

                <div className="space-y-8">
                    <Quote className="w-10 h-10 text-[#00D09C] opacity-50" />
                    <h2 className="text-3xl font-bold leading-relaxed">
                        "GETYOUSITE.COM didn't just give me a website, it gave me a growth engine. Simplicity and power in one place. My business doubled in three months."
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10" />
                        <div>
                            <p className="font-bold text-lg">Alex Sterling</p>
                            <p className="text-sm text-blue-200">CEO, Apex Ventures</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-12">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Trusted by Market Leaders</p>
                <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logic for Logos */}
                    <div className="h-8 w-24 bg-white/20 rounded" />
                    <div className="h-8 w-24 bg-white/20 rounded" />
                    <div className="h-8 w-24 bg-white/20 rounded" />
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn(
            "w-full max-w-6xl mx-auto rounded-[32px] overflow-hidden shadow-2xl bg-card border border-border flex flex-col lg:flex-row min-h-[700px]",
            isRtl ? "font-arabic" : "font-sans"
        )}>
            {/* ACTION PANE (Left) */}
            <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-background relative">
                <div className="absolute top-0 right-0 p-8">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {mode === "signin" ? t('no_account') : t('have_account')}{" "}
                        <button onClick={toggleMode} className="text-[#00D09C] hover:underline ml-2">
                            {mode === "signin" ? t('signup_button') : t('signin_title')}
                        </button>
                    </span>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <Logo className="mb-8" showText={true} />

                    <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">
                        {mode === "signin" ? t('signin_title') : mode === "signup" ? "Create your professional site in minutes" : "Reset Password"}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {mode === "signin" ? "Welcome back to your command center." : "Join thousands of sovereign creators."}
                    </p>

                    {/* SOCIAL LOGIN (Protocol 2: ZERO FRICTION) */}
                    {mode !== "check-email" && mode !== "reset-password" && (
                        <div className="space-y-4 mb-10">
                            <AuthButton
                                icon={<GoogleIcon />}
                                label="Instant Access with Google"
                                onClick={() => handleOAuth('google')}
                                disabled={loading}
                            />
                        </div>
                    )}

                    {mode !== "check-email" && mode !== "reset-password" && (
                        <div className="relative mb-10">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">
                                <span className="bg-background px-4">Sovereign Link Alternative</span>
                            </div>
                        </div>
                    )}


                    {/* FORM */}
                    {mode === "check-email" ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-[#00D09C]/10 flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-10 h-10 text-[#00D09C] animate-pulse" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Check your email</h3>
                            <p className="text-muted-foreground mb-6">{t('check_email_desc')}</p>
                            <Button onClick={() => setMode('signin')} variant="outline" className="w-full">Back to Login</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {mode !== "reset-password" && (
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Identity Access</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            {...register("email")}
                                            type="email"
                                            placeholder="commander@getyousite.com"
                                            className={cn(
                                                "pl-12 h-14 bg-white/[0.02] border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all rounded-xl text-sm",
                                                errors.email && "border-red-500/50 ring-4 ring-red-500/10"
                                            )}
                                        />
                                    </div>
                                    {errors.email?.message && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{t(errors.email.message as any)}</p>}
                                </div>
                            )}

                            {mode !== "forgot-password" && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Security Key</Label>
                                        {mode === "signin" && (
                                            <button type="button" onClick={() => setMode("forgot-password")} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors">
                                                Recovery?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            {...register("password")}
                                            type="password"
                                            placeholder="••••••••"
                                            className={cn(
                                                "pl-12 h-14 bg-white/[0.02] border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all rounded-xl text-sm",
                                                errors.password && "border-red-500/50 ring-4 ring-red-500/10"
                                            )}
                                        />
                                    </div>
                                    {errors.password?.message && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{t(errors.password.message as any)}</p>}
                                </div>
                            )}


                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold text-center">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#00D09C] hover:bg-[#00D09C]/90 text-white font-bold text-base rounded-xl shadow-[0_4px_14px_0_rgba(0,208,156,0.39)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <span className="flex items-center gap-2">
                                        {mode === "signin" ? t('login_button') : mode === "signup" ? "Create My Account" : "Submit"}
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* TRUST PANE (Right) */}
            <TrustPane />
        </div>
    );
}

function AuthButton({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) {
    return (
        <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-border bg-white text-gray-800 hover:bg-gray-50 font-bold text-sm gap-3 justify-center px-6 rounded-xl transition-all shadow-sm"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
            <span>{label}</span>
        </Button>
    );
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);
