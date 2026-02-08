"use client";

import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle, ShieldAlert, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInForm() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="space-y-6 w-full max-w-sm mx-auto p-8 rounded-3xl bg-card border border-border shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Access Command Center</h2>
                <p className="text-muted-foreground text-sm">Synchronize your digital empire.</p>
            </div>

            {/* VISUAL DEBUGGER: RED CONNECTION WARNING (PHASE 2 AUDIT) */}
            {!isSupabaseConfigured && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/50 flex items-start gap-3 animate-pulse">
                    <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <div className="text-xs font-black text-destructive uppercase tracking-widest mb-1">Critical Failure</div>
                        <p className="text-[10px] text-destructive/80 leading-relaxed">
                            Supabase keys missing. Architecture is in read-only mode. Authentication is disabled.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity (Email)</label>
                    <input
                        type="email"
                        disabled={!isSupabaseConfigured}
                        className="w-full h-12 rounded-xl bg-secondary border border-border px-4 text-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="commander@getyousite.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Key</label>
                    <input
                        type="password"
                        disabled={!isSupabaseConfigured}
                        className="w-full h-12 rounded-xl bg-secondary border border-border px-4 text-foreground focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <Button
                variant="default"
                className="w-full h-14 rounded-2xl font-bold text-md mt-4 disabled:opacity-20"
                disabled={!isSupabaseConfigured}
            >
                Authorize Launch <Rocket className="ml-2 w-4 h-4" />
            </Button>

            <div className="text-center mt-6">
                <span className="text-xs text-muted-foreground">New Architect?</span>
                <button className="text-xs text-primary font-bold ml-2 hover:underline">Apply for Access</button>
            </div>
        </div>
    );
}
