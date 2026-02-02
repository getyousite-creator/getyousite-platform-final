"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle, ShieldCheck, Mail, Globe } from "lucide-react";
import Logo from "@/components/ui/Logo";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured) return;
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
        if (error) setError(error.message);
        setLoading(false);
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseConfigured) return;
        setLoading(true);
        setError(null);

        const { error } = mode === "signin"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
        } else {
            onClose();
        }
        setLoading(true); // Wait for redirect/refresh
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-slate-950 border-white/5 p-0 overflow-hidden outline-none">
                <div className="p-10">
                    <DialogHeader className="mb-10 flex flex-col items-center text-center">
                        <Logo className="mb-8" showText={false} />
                        <DialogTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
                            {mode === "signin" ? "Commander_Access" : "Architect_Registration"}
                        </DialogTitle>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            Sovereign Identity Protocol
                        </p>
                    </DialogHeader>

                    {!isSupabaseConfigured && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Supabase Keys Missing</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <Button
                            variant="outline"
                            className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] gap-3"
                            onClick={handleGoogleLogin}
                            disabled={loading || !isSupabaseConfigured}
                        >
                            <Globe className="w-4 h-4 text-blue-500" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
                            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.5em] text-slate-600"><span className="bg-slate-950 px-4">OR_ORCHESTRATE_DIRECTLY</span></div>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Identity_Link</Label>
                                <Input
                                    type="email"
                                    placeholder="commander@getyousite.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10 h-12 text-zinc-100"
                                    disabled={!isSupabaseConfigured}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Access_Key</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-white/5 border-white/10 h-12 text-zinc-100"
                                    disabled={!isSupabaseConfigured}
                                />
                            </div>

                            {error && <p className="text-[10px] text-red-400 font-bold">{error}</p>}

                            <Button
                                type="submit"
                                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl"
                                disabled={loading || !isSupabaseConfigured}
                            >
                                {loading ? "Verifying..." : mode === "signin" ? "Authorize_Access" : "Finalize_Registration"}
                            </Button>
                        </form>

                        <div className="text-center">
                            <button
                                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
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
