"use client";

import React, { useEffect, useState } from 'react';
import { getGlobalPerformanceAction } from '@/app/actions/intelligence-actions';
import { useAuth } from '@/components/providers/SupabaseProvider';
import { Zap, Shield, TrendingUp, Activity, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useTranslations } from 'next-intl';

export function IntelligenceDashboard() {
    const { user } = useAuth();
    const t = useTranslations("Dashboard.intelligence");
    const params = useParams();
    const locale = params.locale as string || 'en';
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [auditLoading, setAuditLoading] = useState<string | null>(null);
    const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
    const [showDiagnostics, setShowDiagnostics] = useState(false);

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

    const handleViewDiagnostics = async (storeId: string) => {
        try {
            const { getAuditDetailsAction } = await import('@/app/actions/intelligence-actions');
            const details = await getAuditDetailsAction(storeId);
            // If we have the deep 'details' JSON, use it. Otherwise fallback to flat structure.
            const deepAudit = details?.details || details;
            setSelectedAudit(deepAudit);
            setShowDiagnostics(true);
        } catch (error) {
            console.error("Fetch Details Error:", error);
        }
    };

    if (loading) return (
        <div className="p-24 bg-[#051423]/50 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center">
            <Activity className="w-12 h-12 text-[#00D09C] animate-spin mb-6" />
            <div className="text-muted-foreground animate-pulse uppercase text-[10px] tracking-widest font-black">{t('loading')}</div>
        </div>
    );

    const globalAvg = data.length > 0
        ? Math.round(data.reduce((acc, s) => acc + s.seoScore, 0) / data.length)
        : 0;

    const criticalNodes = data.filter(s => s.seoScore < 50).length;

    return (
        <div className="space-y-12 sovereign">
            {/* Header: Velocity Terminal */}
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tightest text-white">{t('title')}</h2>
                    <p className="text-[10px] text-[#00D09C] uppercase tracking-widest mt-2 flex items-center gap-2 font-bold">
                        <Activity className="w-3 h-3 animate-pulse" />
                        {t('subtitle')}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <span className="text-[8px] text-gray-400 uppercase font-black block mb-1">{t('global_avg')}</span>
                        <span className={`text-xl font-black ${globalAvg > 80 ? 'text-[#00D09C]' : 'text-amber-500'}`}>{globalAvg}%</span>
                    </div>
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((site) => (
                    <div key={site.id} className="p-8 rounded-[32px] bg-[#051423]/50 border border-white/5 hover:border-[#00D09C]/30 transition-all group backdrop-blur-md relative overflow-hidden flex flex-col">
                        {auditLoading === site.id && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                                <Zap className="w-8 h-8 text-[#00D09C] animate-bounce mb-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{t('scanning')}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1 mr-4">
                                <h3 className="text-sm font-black uppercase text-white mb-2 tracking-wider truncate">{site.name}</h3>
                                <span className={`text-[8px] font-bold uppercase py-1 px-3 rounded-full border ${site.status === 'deployed' ? 'bg-[#00D09C]/10 border-[#00D09C]/20 text-[#00D09C]' :
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
                        <div className="space-y-6 flex-1">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('traffic_velocity')}</span>
                                    <span className="text-[10px] text-white font-black">{site.views} PV</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#00D09C]/20 to-[#00D09C] transition-all duration-1000 shadow-[0_0_10px_rgba(0,208,156,0.5)]"
                                        style={{ width: `${Math.min(100, site.views / 10)}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('seo_score')}</span>
                                    <span className="text-[10px] text-white font-black">{site.seoScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full transition-all duration-1000 ${site.seoScore > 80 ? 'bg-[#00D09C]' : site.seoScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                                            } shadow-[0_0_10px_rgba(0,208,156,0.5)]`}
                                        style={{ width: `${site.seoScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prescriptive Actions */}
                        <div className="mt-8 pt-8 border-t border-white/5 flex gap-3">
                            <button
                                onClick={() => handleAudit(site.id)}
                                disabled={!!auditLoading}
                                className="flex-1 py-4 rounded-2xl bg-[#051423] border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#00D09C] hover:bg-[#00D09C] hover:text-black transition-all disabled:opacity-50"
                            >
                                {t('rescan')}
                            </button>
                            {site.seoScore > 0 && (
                                <button
                                    onClick={() => handleViewDiagnostics(site.id)}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                                    title={t('diagnostics')}
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Node Expansion Slot */}
                <Link href={`/${locale}/customizer`} className="p-8 rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#00D09C]/50 transition-all bg-white/5 min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-[#051423] border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,208,156,0.1)]">
                        <TrendingUp className="w-6 h-6 text-[#00D09C]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{t('expand')}</span>
                </Link>
            </div>

            {/* Global Integrity Alerts */}
            <div className={`p-8 rounded-[40px] border backdrop-blur-xl transition-all duration-700 ${criticalNodes > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#00D09C]/5 border-[#00D09C]/20'}`}>
                <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center flex-shrink-0 ${criticalNodes > 0 ? 'bg-red-500/10 animate-pulse' : 'bg-[#00D09C]/10 animate-pulse'}`}>
                        <Shield className={`w-8 h-8 ${criticalNodes > 0 ? 'text-red-500' : 'text-[#00D09C]'}`} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-1">
                            {criticalNodes > 0 ? t('integrity_warning') : t('integrity_protocol')}
                        </h4>
                        <p className="text-xs text-blue-200/70 leading-relaxed max-w-2xl font-medium">
                            {criticalNodes > 0
                                ? t('breach_msg', { count: criticalNodes })
                                : t('synchronized_msg')}
                        </p>
                    </div>
                </div>
            </div>

            {/* DIAGNOSTICS MODAL */}
            <Dialog open={showDiagnostics} onOpenChange={setShowDiagnostics}>
                <DialogContent className="max-w-2xl bg-[#051423] border-white/10 text-white rounded-[40px] p-0 overflow-hidden">
                    <DialogHeader className="p-8 border-b border-white/5 bg-[#051423]/50">
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                            <Activity className="w-6 h-6 text-[#00D09C]" />
                            {t('report_title')}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        {/* Summary Block */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black block mb-2">SEO</span>
                                <span className="text-3xl font-black text-[#00D09C]">{selectedAudit?.vectors?.seo?.score ?? selectedAudit?.seo_score}%</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black block mb-2">Conv.</span>
                                <span className="text-3xl font-black text-blue-500">{selectedAudit?.vectors?.conversion?.score ?? selectedAudit?.performance_score}%</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black block mb-2">Visual</span>
                                <span className="text-3xl font-black text-purple-500">{selectedAudit?.vectors?.visual?.score ?? selectedAudit?.accessibility_score}%</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
                                <span className="text-[10px] text-gray-500 uppercase font-black block mb-2">Content</span>
                                <span className="text-3xl font-black text-amber-500">{selectedAudit?.vectors?.content?.score ?? selectedAudit?.best_practices_score}%</span>
                            </div>
                        </div>

                        {/* Executive Summary */}
                        {selectedAudit?.executive_summary && (
                            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                                <h5 className="text-[10px] font-black uppercase text-blue-400 mb-2">Executive Summary</h5>
                                <p className="text-sm text-blue-100/80 leading-relaxed italic">"{selectedAudit.executive_summary}"</p>
                            </div>
                        )}

                        {/* Critical Issues */}
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#00D09C] mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                {t('anomalies')}
                            </h5>
                            <div className="space-y-3">
                                {selectedAudit?.issues?.map((issue: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${issue.type === 'error' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-amber-500'}`} />
                                        <div>
                                            <p className="text-xs font-bold text-white mb-1 uppercase tracking-wider">{issue.message}</p>
                                            <p className="text-[10px] text-gray-400 leading-relaxed uppercase">{issue.suggestion}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!selectedAudit?.issues || selectedAudit.issues.length === 0) && (
                                    <div className="p-12 text-center text-gray-600 border border-white/5 rounded-[32px]">
                                        <CheckCircle className="w-8 h-8 mx-auto mb-4 text-[#00D09C]/20" />
                                        <p className="text-[10px] font-black uppercase">{t('no_anomalies')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Prescriptive Mapping */}
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-3 h-3" />
                                {t('roadmap')}
                            </h5>
                            <div className="p-6 rounded-[32px] bg-[#00D09C]/5 border border-[#00D09C]/10">
                                <ul className="space-y-3">
                                    {/* Handle both flat recommendations array and vectors-based recommendations */}
                                    {(selectedAudit?.action_plan || selectedAudit?.recommendations || []).map((rec: string, idx: number) => (
                                        <li key={idx} className="text-xs text-blue-100 flex gap-3 items-center">
                                            <div className="w-1 h-1 bg-[#00D09C] rounded-full flex-shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                    {(!selectedAudit?.recommendations || selectedAudit.recommendations.length === 0) && (
                                        <li className="text-[10px] uppercase font-bold text-zinc-500 italic">{t('peak_efficiency')}</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-[#051423]/50 flex justify-end">
                        <button
                            onClick={() => setShowDiagnostics(false)}
                            className="px-10 py-4 rounded-2xl bg-[#00D09C] text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                            {t('acknowledge')}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
