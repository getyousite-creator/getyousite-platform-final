"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { AlertCircle, Loader2, ShieldCheck, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (!error) {
            router.push('/customizer');
            router.refresh();
        } else {
            setError(error.message || 'Verification Protocol Failed');
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
        } catch (_err) {
            setError('OAuth Handshake Failed');
            setLoading(false);
        }
    };

    return (
        <div className="relative p-10 rounded-[2.5rem] bg-[#020617]/80 backdrop-blur-3xl border border-white/5 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Background Grain/Effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')]" />

            <div className="relative z-10">
                {/* Header: Institutional Protocol */}
                <div className="mb-10 text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 text-primary mb-4">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">
                        Sovereign_Identity
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                        Verification Protocol Required
                    </p>
                </div>

                {/* Secure Messaging Area */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-4">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Access_Denied</p>
                                    <p className="text-[11px] text-red-400/80 leading-relaxed uppercase font-medium">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Primary Actions: OAuth Logic */}
                <div className="mb-8">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <svg className="w-4 h-4 mr-3 opacity-60" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Neural_Passport_Login
                    </Button>
                </div>

                {/* Divider Protocol */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.5em] text-white/20">
                        <span className="bg-[#020617] px-4">Standard_Encryption</span>
                    </div>
                </div>

                {/* Tactical Entry Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                                Identifier
                            </Label>
                        </div>
                        <Input
                            id="email"
                            type="email"
                            placeholder="OPERATOR@GYS-GLOBAL.COM"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-white placeholder:text-white/10 text-[11px] font-bold tracking-widest focus:border-primary/50 transition-all uppercase px-6"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-end px-1">
                            <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                                Passcode
                            </Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="bg-white/[0.03] border-white/5 h-14 rounded-2xl text-white placeholder:text-white/10 text-[11px] font-bold tracking-widest focus:border-primary/50 transition-all px-6"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="group relative w-full h-14 bg-primary text-[#020617] rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all overflow-hidden"
                        disabled={loading}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Fingerprint className="w-4 h-4" />
                                    Initiate_Protocol
                                </>
                            )}
                        </span>
                    </Button>
                </form>

                {/* Footer Logistics */}
                <div className="mt-10 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                        Encrypted_Session · GYS Global Intelligence · v2.0
                    </p>
                </div>
            </div>
        </div>
    );
}
