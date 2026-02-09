"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Apple, Sparkles, ShieldCheck } from "lucide-react";
import { signInAction, signUpAction, signInWithOAuthAction, resetPasswordAction, updatePasswordAction } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface AuthHubProps {
    initialMode?: "signin" | "signup";
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

    // Check for error_message in URL
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

    // Sync search params error to local error state if no other error
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

    return (
        <div className={cn(
            "w-full max-w-[450px] mx-auto",
            isRtl ? "font-arabic" : "font-sans"
        )}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden p-10 rounded-[32px] bg-card/5 backdrop-blur-3xl border border-border shadow-2xl"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm" />

                <div className="flex flex-col items-center text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center gap-2 group cursor-default"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                            {t('sovereign_access')}
                        </span>
                    </motion.div>

                    <Logo className="mb-6 scale-110" showText={false} />
                    <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-1">
                        {mode === "signin" ? t('signin_title') : mode === "signup" ? t('signup_title') : mode === "reset-password" ? t('reset_password_title') : mode === "check-email" ? t('check_email_title') : t('forgot_password_title')}
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-blue-500/50" />
                        {mode === "forgot-password" || mode === "reset-password" ? t('security_link_msg') : mode === "check-email" ? t('verification_msg') : t('subtitle')}
                    </p>
                </div>

                {mode === "check-email" && (
                    <div className="space-y-6 text-center py-10">
                        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-10 h-10 text-blue-500 animate-pulse" />
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('check_email_desc')}
                        </p>
                        <Button
                            onClick={() => setMode("signin")}
                            variant="glow"
                            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[11px] rounded-2xl"
                        >
                            {t('back_to_login')}
                        </Button>

                        <div className="space-y-3 mt-4">
                            <AuthButton
                                icon={<GoogleIcon />}
                                label="Continue with Google"
                                onClick={() => handleOAuth('google')}
                                disabled={loading}
                            />
                            <AuthButton
                                icon={<Apple className="w-5 h-5 mb-0.5" />}
                                label="Continue with Apple"
                                onClick={() => handleOAuth('apple')}
                                disabled={loading}
                            />
                            <AuthButton
                                icon={<MicrosoftIcon />}
                                label="Continue with Microsoft"
                                onClick={() => handleOAuth('azure')}
                                disabled={loading}
                            />
                        </div>

                        {mode === "reset-password" && (
                            <div className="text-center py-2">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                                    {t('secure_session_active')}
                                </span>
                            </div>
                        )}

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-card px-4 text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                                    {t('or_divider')}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {mode !== "reset-password" && (
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                                        {t('email_label')}
                                    </Label>
                                    <Input
                                        {...register("email")}
                                        type="email"
                                        placeholder={t('email_placeholder')}
                                        className={cn(
                                            "bg-card/5 border-border h-12 text-sm focus:bg-card/7 transition-all rounded-xl",
                                            errors.email && "border-red-500/50 bg-red-500/5"
                                        )}
                                    />
                                    {errors.email?.message && (
                                        <p className="text-[8px] text-red-400 font-bold uppercase tracking-wider ml-1">
                                            {t(errors.email.message as any)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {mode !== "forgot-password" && (
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">
                                        {t('password_label')}
                                    </Label>
                                    <Input
                                        {...register("password")}
                                        type="password"
                                        placeholder={mode === "reset-password" ? t('new_password_placeholder') : "••••••••"}
                                        className={cn(
                                            "bg-card/5 border-border h-12 text-sm focus:bg-card/7 transition-all rounded-xl",
                                            errors.password && "border-red-500/50 bg-red-500/5"
                                        )}
                                    />
                                    {errors.password?.message && (
                                        <p className="text-[8px] text-red-400 font-bold uppercase tracking-wider ml-1">
                                            {t(errors.password.message as any)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {mode === "signin" && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot-password")}
                                        className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t('forgot_password_link')}
                                    </button>
                                </div>
                            )}

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] text-red-400 font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center uppercase tracking-wider"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {message && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-[10px] text-blue-400 font-bold bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-center uppercase tracking-wider"
                                >
                                    {message}
                                </motion.p>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-lg group overflow-hidden relative"
                                disabled={loading}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            {mode === "signin" ? t('login_button') : mode === "signup" ? t('signup_button') : mode === "reset-password" ? t('update_password_button') : t('continue')}
                                            <Sparkles className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </form>

                        <div className="pt-8 text-center flex flex-col items-center gap-4">
                            <div className="h-px w-full bg-card/5" />
                            <button
                                type="button"
                                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                className="text-[12px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all py-4 px-8 rounded-full border border-border hover:border-border hover:bg-card/5"
                            >
                                {mode === "signin" ? t('no_account') : mode === "signup" ? t('have_account') : t('recall_identity')}
                            </button>
                        </div>

                        <p className="text-[10px] text-muted-foreground text-center px-4 leading-relaxed">
                            {t('terms')}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function AuthButton({ icon, label, onClick, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, disabled?: boolean }) {
    return (
        <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-border bg-card hover:bg-secondary/10 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-3 justify-start px-6 rounded-xl transition-all"
            onClick={onClick}
            disabled={disabled}
        >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
        </Button>
    );
}

const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const MicrosoftIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
);
