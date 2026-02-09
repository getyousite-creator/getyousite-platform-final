"use client";

import React, { useEffect, useState } from 'react';
import { getGlobalPerformanceAction } from '@/app/actions/intelligence-actions';
import { useAuth } from '@/components/providers/SupabaseProvider';
import { Zap, Shield, TrendingUp, Activity } from 'lucide-react';

export function IntelligenceDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            getGlobalPerformanceAction(user.id)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Intelligence Fetch Error:", err);
                    setLoading(false);
                });
        }
    }, [user?.id]);

    if (loading) return <div className="p-24 text-muted-foreground animate-pulse uppercase text-[10px] tracking-widest font-black">Scanning Neural Nodes...</div>;

    return (
        <div className="space-y-12">
            {/* Header: Velocity Terminal */}
            <div className="flex justify-between items-end border-b border-border pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-foreground">Intelligence Hub</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-primary animate-pulse" />
                        Real-time success velocity tracking active
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <span className="text-[8px] text-muted-foreground uppercase font-bold block mb-1">Global SEO Avg</span>
                        <span className="text-xl font-black text-foreground">88%</span>
                    </div>
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((site) => (
                    <div key={site.id} className="p-8 rounded-[32px] bg-card border border-border hover:border-border/50 transition-all group">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black uppercase text-foreground mb-1">{site.name}</h3>
                                <span className={`text-[8px] font-bold uppercase py-0.5 px-2 rounded-full border ${site.status === 'deployed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    'bg-secondary/10 border-secondary/30 text-muted-foreground'
                                    }`}>
                                    {site.status}
                                </span>
                            </div>
                            <div className={`p-3 rounded-xl ${site.seoScore > 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                site.seoScore > 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Analytic Gauges (Liquid Logic) */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black">Traffic Volume</span>
                                    <span className="text-[10px] text-foreground font-black">{site.views} PV</span>
                                </div>
                                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${Math.min(100, site.views / 10)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-muted-foreground uppercase font-black">Neural SEO Score</span>
                                    <span className="text-[10px] text-foreground font-black">{site.seoScore}%</span>
                                </div>
                                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${site.seoScore > 80 ? 'bg-emerald-500' : site.seoScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${site.seoScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prescriptive Action */}
                        <div className="mt-8 pt-8 border-t border-border">
                            <button className="w-full py-4 rounded-2xl bg-secondary/5 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary/10 hover:text-foreground transition-all">
                                Run Deep Neural Audit
                            </button>
                        </div>
                    </div>
                ))}

                {/* Node Expansion Slot */}
                <div className="p-8 rounded-[32px] border border-dashed border-border flex flex-col items-center justify-center text-center group cursor-pointer hover:border-border/50 transition-all">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">Expand Empire</span>
                </div>
            </div>

            {/* Global Integrity Alerts */}
            <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic uppercase tracking-tight text-foreground mb-1">Integrity Advisory</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                            All site nodes are currently synchronized with the PayPal capture protocol. No security anomalies detected in the last 24 hours. SEO performance is trending +14%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
