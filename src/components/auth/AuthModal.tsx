"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle, Globe } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client"; // REFACTORED: Direct client
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured) return;
        setLoading(true);
        setError(null);

        const supabase = createClient();
        try {
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
        } catch (err) {
            setError("Google auth failed. Please try again.");
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured) return;
        setLoading(true);
        setError(null);

        const supabase = createClient();
        let result;

        if (mode === "signin") {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            result = { success: !signInError, error: signInError?.message };
        } else {
            const { error: signUpError } = await supabase.auth.signUp({ email, password });
            result = { success: !signUpError, error: signUpError?.message };
        }

        if (!result.success) {
            setError(result.error || "Authentication failed");
            setLoading(false);
        } else {
            // Success
            if (mode === "signin") {
                onClose();
                router.refresh();
            } else {
                // For signup, we usually wait for email verification or auto-login
                // Assuming auto-login or redirect to verify page
                onClose();
                router.push("/customizer"); // Or verify-email page
                router.refresh();
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-background border-border p-0 overflow-hidden outline-none shadow-lg">
                <div className="p-10">
                    <DialogHeader className="mb-10 flex flex-col items-center text-center">
                        <Logo className="mb-8" showText={false} />
                        <DialogTitle className="text-3xl font-black text-foreground tracking-tighter uppercase mb-2">
                            {mode === "signin" ? "Commander_Access" : "Architect_Registration"}
                        </DialogTitle>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">
                            Sovereign Identity Protocol
                        </p>
                    </DialogHeader>

                    {!isSupabaseConfigured && (
                        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            <p className="text-[10px] text-destructive font-bold uppercase tracking-widest">Supabase Keys Missing</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <Button
                            variant="outline"
                            className="w-full h-14 border-border bg-secondary hover:bg-secondary/80 text-foreground font-black uppercase tracking-widest text-[10px] gap-3"
                            onClick={handleGoogleLogin}
                            disabled={loading || !isSupabaseConfigured}
                        >
                            <Globe className="w-4 h-4 text-primary" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground"><span className="bg-background px-4">OR_ORCHESTRATE_DIRECTLY</span></div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Identity_Link</Label>
                                <Input
                                    type="email"
                                    placeholder="commander@getyousite.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-secondary/50 border-border h-12 text-foreground"
                                    disabled={!isSupabaseConfigured}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Access_Key</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-secondary/50 border-border h-12 text-foreground"
                                    disabled={!isSupabaseConfigured}
                                />
                            </div>

                            {error && <p className="text-[10px] text-destructive font-bold">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg"
                                disabled={loading || !isSupabaseConfigured}
                            >
                                {loading ? "Verifying..." : mode === "signin" ? "Authorize_Access" : "Finalize_Registration"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {mode === "signin" ? "Missing Access? Register" : "Have Identity? Authorize"}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
