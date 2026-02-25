"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Activity, BarChart3 } from 'lucide-react';
import { getAnalyticsSummaryAction } from '@/app/actions/analytics-actions';

interface StrategicInsightsHUDProps {
    siteId: string;
}

export default function StrategicInsightsHUD({ siteId }: StrategicInsightsHUDProps) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const res = await getAnalyticsSummaryAction(siteId);
            if (res.success) setData(res.data);
            setIsLoading(false);
        };
        fetch();
    }, [siteId]);

    if (isLoading) return null;
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PERFORMANCE MATRIX */}
            <div className="bg-obsidian border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neon-lime mb-1">Funnel_Velocity</span>
                        <span className="text-2xl font-black tracking-tighter">Strategic_Conversion</span>
                    </div>
                    <div className="p-3 bg-neon-lime/10 rounded-2xl">
                        <TrendingUp className="w-5 h-5 text-neon-lime" />
                    </div>
                </div>

                <div className="flex items-end gap-6">
                    <div className="text-6xl font-black tracking-tighter text-white">
                        {data.conversionRate.toFixed(1)}<span className="text-2xl text-white/20">%</span>
                    </div>
                    <div className="flex flex-col pb-2">
                        <span className="text-[10px] font-black text-neon-lime uppercase tracking-widest">+12.4%</span>
                        <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest underline decoration-white/5 underline-offset-4">vs_Global_Baseline</span>
                    </div>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.conversionRate}%` }}
                        className="h-full bg-neon-lime shadow-[0_0_20px_#bef264]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Total_Impressions</p>
                        <p className="text-lg font-bold">{data.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Intent_Confirmed</p>
                        <p className="text-lg font-bold">{data.totalInteractions.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Strategic INSIGHTS GRID */}
            <div className="bg-obsidian border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Brain className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sovereign_Intelligence_Output</span>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {data.insights.map((insight: any) => (
                            <motion.div
                                key={insight.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-4 rounded-2xl border ${insight.type === 'positive'
                                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                        : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                                    } flex gap-4 items-start`}
                            >
                                {insight.type === 'positive' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    {insight.text}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors border-t border-white/5 mt-4">
                    Calibrate_Strategic_Model
                </button>
            </div>
        </div>
    );
}
