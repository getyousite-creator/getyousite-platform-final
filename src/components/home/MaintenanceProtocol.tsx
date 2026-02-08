import React from "react";
import { Hammer, Mail, ShieldCheck } from "lucide-react";

export default function MaintenanceProtocol() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 selection:bg-primary/30">
            {/* LOGICAL HEADER */}
            <div className="mb-20 flex items-center gap-4 opacity-60">
                <div className="w-12 h-12 border border-border flex items-center justify-center rotate-45 bg-card">
                    <Hammer className="w-6 h-6 -rotate-45 text-foreground" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase italic">GetYouSite Platform</span>
            </div>

            {/* STATUS CAROUSEL (STATIC LOGIC) */}
            <div className="max-w-3xl w-full border border-border bg-card p-12 rounded-[40px] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Engineering_Protocol_Active
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tightest leading-none mb-10">
                        System <br /> Optimization <br /> <span className="text-muted-foreground">In Progress.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground font-light mb-16 leading-relaxed max-w-xl">
                        We are currently implementing <span className="text-foreground font-bold italic underline decoration-primary underline-offset-8">The Unyielding Blueprint V2.0</span>. Expect absolute technical honesty and high-status infrastructure upon reactivation.
                    </p>

                    {/* LEAN EMAIL CAPTURE */}
                    <form className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Engineering_Contact@email.com"
                            className="flex-1 h-16 bg-background border-input rounded-2xl px-6 font-mono text-sm focus:outline-none focus:ring-primary transition-colors text-foreground"
                            required
                        />
                        <button className="h-16 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-primary/90 transition-all">
                            Notify_Me
                        </button>
                    </form>
                </div>

                {/* BACKGROUND LOGIC DECOR */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-10 left-10 text-[8px] font-mono text-muted-foreground uppercase tracking-widest opacity-20">
                    Logic_Verified: 2026.02.07.00.44.42
                </div>
            </div>

            {/* FOOTER METRICS */}
            <div className="mt-20 flex gap-20 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">Purity</span>
                    <span>100%</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">Jargon</span>
                    <span>0%</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">Latency</span>
                    <span>Sub_100ms</span>
                </div>
            </div>
        </div>
    );
}
