"use client";

import React, { useEffect, useState } from 'react';
import { getGlobalPerformanceAction } from '@/app/actions/intelligence-actions';
import { useAuth } from '@/components/providers/SupabaseProvider';
import { Zap, Shield, TrendingUp, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

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

    if (loading) return <div className="p-24 text-zinc-500 animate-pulse uppercase text-[10px] tracking-widest font-black">Scanning Neural Nodes...</div>;

    return (
        <div className="space-y-12">
            {/* Header: Velocity Terminal */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-white">Intelligence Hub</h2>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
                        Real-time success velocity tracking active
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <span className="text-[8px] text-zinc-600 uppercase font-bold block mb-1">Global SEO Avg</span>
                        <span className="text-xl font-black text-white">88%</span>
                    </div>
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((site) => (
                    <div key={site.id} className="p-8 rounded-[32px] bg-zinc-900 border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black uppercase text-white mb-1">{site.name}</h3>
                                <span className={`text-[8px] font-bold uppercase py-0.5 px-2 rounded-full border ${site.status === 'deployed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                        'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
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
                                    <span className="text-[10px] text-zinc-500 uppercase font-black">Traffic Volume</span>
                                    <span className="text-[10px] text-white font-black">{site.views} PV</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000"
                                        style={{ width: `${Math.min(100, site.views / 10)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-zinc-500 uppercase font-black">Neural SEO Score</span>
                                    <span className="text-[10px] text-white font-black">{site.seoScore}%</span>
                                </div>
                                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${site.seoScore > 80 ? 'bg-emerald-500' : site.seoScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                                            }`}
                                        style={{ width: `${site.seoScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prescriptive Action */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <button className="w-full py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/5 hover:text-white transition-all">
                                Run Deep Neural Audit
                            </button>
                        </div>
                    </div>
                ))}

                {/* Node Expansion Slot */}
                <div className="p-8 rounded-[32px] border border-dashed border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-white/20 transition-all">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-6 h-6 text-zinc-700" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors">Expand Empire</span>
                </div>
            </div>

            {/* Global Integrity Alerts */}
            <div className="p-8 rounded-[40px] bg-blue-600/5 border border-blue-500/20">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-1">Integrity Advisory</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
                            All site nodes are currently synchronized with the PayPal capture protocol. No security anomalies detected in the last 24 hours. SEO performance is trending +14%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
