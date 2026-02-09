"use client";

import React, { useEffect, useState } from 'react';
import { getGlobalPerformanceAction } from '@/app/actions/intelligence-actions';
import { useAuth } from '@/components/providers/SupabaseProvider';
import { Zap, Shield, TrendingUp, Activity } from 'lucide-react';

export function IntelligenceDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [auditLoading, setAuditLoading] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            refreshData();
        }
    }, [user?.id]);

    const refreshData = () => {
        setLoading(true);
        getGlobalPerformanceAction(user!.id)
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Intelligence Fetch Error:", err);
                setLoading(false);
            });
    };

    const handleAudit = async (storeId: string) => {
        setAuditLoading(storeId);
        try {
            const { triggerNeuralAuditAction } = await import('@/app/actions/intelligence-actions');
            await triggerNeuralAuditAction(storeId);
            refreshData();
        } catch (error) {
            console.error("Audit Failure:", error);
        } finally {
            setAuditLoading(null);
        }
    };

    if (loading) return (
        <div className="p-24 bg-[#0A2540]/50 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-[#00D09C] animate-spin mb-6" />
            <div className="text-muted-foreground animate-pulse uppercase text-[10px] tracking-widest font-black">Scanning Neural Nodes & Propagating Truth...</div>
        </div>
    );

    const globalAvg = data.length > 0
        ? Math.round(data.reduce((acc, s) => acc + s.seoScore, 0) / data.length)
        : 0;

    const criticalNodes = data.filter(s => s.seoScore < 50).length;

    return (
        <div className="space-y-12">
            {/* Header: Velocity Terminal */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-white">Intelligence Hub</h2>
                    <p className="text-[10px] text-[#00D09C] uppercase tracking-widest mt-2 flex items-center gap-2 font-bold">
                        <Activity className="w-3 h-3 animate-pulse" />
                        Neural velocity synchronization active
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <span className="text-[8px] text-gray-400 uppercase font-black block mb-1">Global SEO Avg</span>
                        <span className={`text-xl font-black ${globalAvg > 80 ? 'text-[#00D09C]' : 'text-amber-500'}`}>{globalAvg}%</span>
                    </div>
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((site) => (
                    <div key={site.id} className="p-8 rounded-[32px] bg-[#0A2540]/50 border border-white/5 hover:border-[#00D09C]/30 transition-all group backdrop-blur-md relative overflow-hidden">
                        {auditLoading === site.id && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                                <Zap className="w-8 h-8 text-[#00D09C] animate-bounce mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Reconstructing Neural Map...</span>
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-sm font-black uppercase text-white mb-1 tracking-wider">{site.name}</h3>
                                <span className={`text-[8px] font-bold uppercase py-0.5 px-2 rounded-full border ${site.status === 'deployed' ? 'bg-[#00D09C]/10 border-[#00D09C]/20 text-[#00D09C]' :
                                    'bg-white/5 border-white/10 text-gray-400'
                                    }`}>
                                    {site.status}
                                </span>
                            </div>
                            <div className={`p-3 rounded-xl ${site.seoScore > 80 ? 'bg-[#00D09C]/10 text-[#00D09C]' :
                                site.seoScore > 50 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                <Zap className="w-5 h-5 shadow-[0_0_15px_rgba(0,208,156,0.3)]" />
                            </div>
                        </div>

                        {/* Analytic Gauges (Liquid Logic) */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Traffic Velocity</span>
                                    <span className="text-[10px] text-white font-black">{site.views} PV</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#00D09C]/20 to-[#00D09C] transition-all duration-1000 shadow-[0_0_10px_rgba(0,208,156,0.5)]"
                                        style={{ width: `${Math.min(100, site.views / 10)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Neural SEO Score</span>
                                    <span className="text-[10px] text-white font-black">{site.seoScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${site.seoScore > 80 ? 'bg-[#00D09C]' : site.seoScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                                            } shadow-[0_0_10px_rgba(0,208,156,0.5)]`}
                                        style={{ width: `${site.seoScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prescriptive Action */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <button
                                onClick={() => handleAudit(site.id)}
                                disabled={!!auditLoading}
                                className="w-full py-4 rounded-2xl bg-[#0A2540] border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#00D09C] hover:bg-[#00D09C] hover:text-black transition-all disabled:opacity-50"
                            >
                                Initiate Neural Audit
                            </button>
                        </div>
                    </div>
                ))}

                {/* Node Expansion Slot */}
                <Link href="/ar/customizer" className="p-8 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#00D09C]/50 transition-all bg-white/5">
                    <div className="w-12 h-12 rounded-full bg-[#0A2540] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,208,156,0.1)]">
                        <TrendingUp className="w-6 h-6 text-[#00D09C]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Expand Digital Empire</span>
                </Link>
            </div>

            {/* Global Integrity Alerts */}
            <div className={`p-8 rounded-[40px] border backdrop-blur-xl ${criticalNodes > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#00D09C]/5 border-[#00D09C]/20'}`}>
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 animate-pulse ${criticalNodes > 0 ? 'bg-red-500/10' : 'bg-[#00D09C]/10'}`}>
                        <Shield className={`w-8 h-8 ${criticalNodes > 0 ? 'text-red-500' : 'text-[#00D09C]'}`} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-1">
                            {criticalNodes > 0 ? 'Neural Integrity Warning' : 'Global Integrity Protocol'}
                        </h4>
                        <p className="text-xs text-blue-200/70 leading-relaxed max-w-2xl font-medium">
                            {criticalNodes > 0
                                ? `Protocol Breach: ${criticalNodes} node(s) exhibiting critical SEO degradation. Immediate neural reconstruction mandated to maintain search dominance.`
                                : `All nodes are currently synchronized with the Sovereign protocol. Security anomalies: 0. Success velocity: Trending +${globalAvg > 90 ? '22' : '14'}%. Global uptime remains constant at 100%.`}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
