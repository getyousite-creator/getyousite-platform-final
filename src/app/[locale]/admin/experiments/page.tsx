"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { BarChart3, FlaskConical, RefreshCw, ShieldAlert, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type DecisionPayload = {
    experimentKey: string;
    windowDays: number;
    since: string;
    metrics: Record<
        string,
        {
            exposure: number;
            publishClicks: number;
            signupSuccess: number;
            publishRate: number;
            signupRate: number;
        }
    >;
    decision: {
        decision: string;
        reason: string;
        significant: boolean;
        enoughData: boolean;
        zScore: number;
        pValueApprox: number;
        liftPercent: number;
        minExposure: number;
    };
};

export default function AdminExperimentsPage() {
    const [data, setData] = useState<DecisionPayload | null>(null);
    const [days, setDays] = useState(14);
    const [minExposure, setMinExposure] = useState(100);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    const AUTHORIZED_EMAIL = "u110877386@getyousite.com";

    const fetchSummary = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch(
                `/api/experiments/summary?experimentKey=exp_playground_cta_v1&days=${days}&minExposure=${minExposure}`,
            );
            if (!response.ok) {
                throw new Error("Failed to load decision summary.");
            }
            const payload = (await response.json()) as DecisionPayload;
            setData(payload);
        } catch {
            setError("Unable to load experiment decision.");
        } finally {
            setIsLoading(false);
        }
    }, [days, minExposure]);

    const checkAuth = useCallback(async () => {
        const supabase = createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || user.email !== AUTHORIZED_EMAIL) {
            setIsAuthorized(false);
            setTimeout(() => router.push("/"), 1200);
            return;
        }

        setIsAuthorized(true);
        fetchSummary();
    }, [fetchSummary, router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const control = data?.metrics.control;
    const challenger = data?.metrics.trust_first;

    const decisionTone = useMemo(() => {
        const decision = data?.decision.decision || "";
        if (decision.startsWith("KEEP")) return "text-emerald-400";
        if (decision.startsWith("KILL")) return "text-red-400";
        return "text-yellow-300";
    }, [data?.decision.decision]);

    if (isAuthorized === false) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <ShieldAlert className="w-16 h-16 mx-auto text-red-500" />
                    <p className="text-white font-black uppercase tracking-widest text-xs">
                        Access denied
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#05070d] text-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FlaskConical className="w-6 h-6 text-cyan-300" />
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                                Experiment Decision Console
                            </h1>
                        </div>
                        <p className="text-xs uppercase tracking-widest text-white/50">
                            Playground CTA A/B Decision Engine
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min={3}
                            max={60}
                            value={days}
                            onChange={(e) => setDays(Number(e.target.value || 14))}
                            className="w-20 h-10 rounded-xl bg-white/5 border border-white/15 px-3 text-sm"
                            aria-label="window days"
                        />
                        <input
                            type="number"
                            min={20}
                            max={2000}
                            value={minExposure}
                            onChange={(e) => setMinExposure(Number(e.target.value || 100))}
                            className="w-24 h-10 rounded-xl bg-white/5 border border-white/15 px-3 text-sm"
                            aria-label="minimum exposure"
                        />
                        <Button
                            onClick={fetchSummary}
                            className="h-10 px-4 rounded-xl bg-cyan-400 text-[#02111c] hover:bg-cyan-300 font-black"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </header>

                {error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                        Loading decision...
                    </div>
                ) : (
                    <>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                                    Decision
                                </p>
                                <p className={`text-2xl font-black ${decisionTone}`}>
                                    {data?.decision.decision || "N/A"}
                                </p>
                                <p className="text-xs text-white/60 mt-2">
                                    {data?.decision.reason || ""}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                                    Lift
                                </p>
                                <p className="text-2xl font-black text-cyan-300">
                                    {(data?.decision.liftPercent || 0).toFixed(2)}%
                                </p>
                                <p className="text-xs text-white/60 mt-2">trust_first vs control</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                                    Significance
                                </p>
                                <p className="text-2xl font-black text-white">
                                    p={(data?.decision.pValueApprox || 0).toFixed(4)}
                                </p>
                                <p className="text-xs text-white/60 mt-2">
                                    z={(data?.decision.zScore || 0).toFixed(3)}
                                </p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-4 h-4 text-cyan-300" />
                                    <p className="text-sm font-black uppercase tracking-widest">
                                        Control
                                    </p>
                                </div>
                                <ul className="space-y-1 text-sm text-white/80">
                                    <li>Exposure: {control?.exposure || 0}</li>
                                    <li>Publish clicks: {control?.publishClicks || 0}</li>
                                    <li>Signup success: {control?.signupSuccess || 0}</li>
                                    <li>
                                        Signup rate: {((control?.signupRate || 0) * 100).toFixed(2)}
                                        %
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                                    <p className="text-sm font-black uppercase tracking-widest">
                                        Trust First
                                    </p>
                                </div>
                                <ul className="space-y-1 text-sm text-white/80">
                                    <li>Exposure: {challenger?.exposure || 0}</li>
                                    <li>Publish clicks: {challenger?.publishClicks || 0}</li>
                                    <li>Signup success: {challenger?.signupSuccess || 0}</li>
                                    <li>
                                        Signup rate:{" "}
                                        {((challenger?.signupRate || 0) * 100).toFixed(2)}%
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}
