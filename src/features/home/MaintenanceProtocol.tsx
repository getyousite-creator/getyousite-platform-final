"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Hammer, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { captureMaintenanceLead } from "@/app/actions/maintenance-actions";

export default function MaintenanceProtocol() {
    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 selection:bg-neon-lime/30 overflow-hidden relative">
            {/* AMBIENT GLOW */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-neon-lime/5 blur-[150px] rounded-full pointer-events-none" />

            {/* LOGICAL HEADER */}
            <div className="mb-20 flex items-center gap-4 opacity-100 z-10 transition-all hover:opacity-100">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center rotate-45 bg-black">
                    <Hammer className="w-6 h-6 -rotate-45 text-neon-lime" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic">GYS Global Sovereign</span>
            </div>

            {/* STATUS CAROUSEL (TACTICAL PROTOCOL) */}
            <div className="max-w-3xl w-full border border-white/10 bg-black/40 backdrop-blur-3xl p-12 rounded-[40px] relative overflow-hidden shadow-vip-glow border-t-white/20">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime mb-8">
                        <ShieldCheck className="w-4 h-4" /> System_Ascension_Protocol_Active
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tightest leading-[0.85] mb-10 italic">
                        Strategic <br /> Reconstruction <br /> <span className="text-white/20">Active.</span>
                    </h1>

                    <p className="text-xl text-white/50 font-medium mb-16 leading-relaxed max-w-xl uppercase tracking-widest font-bold">
                        We are currently implementing <span className="text-neon-lime italic underline decoration-white/10 underline-offset-8">The Sovereign Engine V3.1</span>. Expect absolute technical honesty and high-status infrastructure upon reactivation.
                    </p>

                    {/* LEAN EMAIL CAPTURE */}
                    <MaintenanceForm />
                </div>

                {/* BACKGROUND LOGIC DECOR */}
                <div className="absolute bottom-10 left-10 text-[8px] font-mono text-white/10 uppercase tracking-[0.5em] opacity-50">
                    Logic_Verified: 2026.02.22_STP
                </div>
            </div>

            {/* FOOTER METRICS */}
            <div className="mt-20 flex gap-12 md:gap-20 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                <div className="flex flex-col gap-2">
                    <span className="text-white/40">Architectural_Purity</span>
                    <span className="text-neon-lime">100%</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-white/40">Market_Authority</span>
                    <span className="text-neon-lime">99.9th</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-white/40">System_Latency</span>
                    <span className="text-neon-lime">Sub_Realtime</span>
                </div>
            </div>
        </div>
    );
}

function MaintenanceForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const result = await captureMaintenanceLead(email);
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
            } else {
                setStatus('error');
                setMessage(result.message || "Engine failure.");
            }
        } catch {
            setStatus('error');
            setMessage("Critical logic crash.");
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-16 flex items-center gap-4 bg-neon-lime/10 border border-neon-lime/20 rounded-2xl px-6 text-neon-lime font-black text-xs uppercase tracking-widest shadow-vip-glow"
            >
                <CheckCircle className="w-5 h-5" />
                {message}
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Sovereign_Contact@GYS Global.com"
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neon-lime/30 transition-all text-white disabled:opacity-50"
                    required
                    disabled={status === 'loading'}
                />
                {status === 'error' && (
                    <span className="absolute -bottom-6 left-2 text-[10px] text-red-500 font-bold uppercase tracking-widest">{message}</span>
                )}
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                className="h-16 px-10 bg-neon-lime text-obsidian font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-neon-lime/90 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 shadow-vip-glow"
            >
                {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    "Authorize_Notification"
                )}
            </button>
        </form>
    );
}
