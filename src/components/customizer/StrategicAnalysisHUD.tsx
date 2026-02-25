"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { analyzeVisionStrategicAction } from '@/app/actions/architectural-actions';

interface StrategicAnalysisHUDProps {
    vision: string;
    niche: string;
    businessName: string;
    onOptimize: (optimal: string) => void;
}

export function StrategicAnalysisHUD({ vision, niche, businessName, onOptimize }: StrategicAnalysisHUDProps) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (vision.length < 30) return;

        const timer = setTimeout(async () => {
            setIsAnalyzing(true);
            const res = await analyzeVisionStrategicAction({ vision, niche, businessName });
            if (res.success) setAnalysis(res.data);
            setIsAnalyzing(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [vision, niche, businessName]);

    if (vision.length < 30 && !analysis) {
        return (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center space-y-3 opacity-40">
                <Sparkles className="w-5 h-5" />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting_Sufficient_Intel...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Market_Viability_Matrix</h3>
                {isAnalyzing && <Zap className="w-3 h-3 text-neon-lime animate-pulse" />}
            </div>

            <div className="bg-obsidian border border-white/5 rounded-[2rem] p-6 space-y-6 relative overflow-hidden group">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">Success_Probability</span>
                        <div className="text-4xl font-black text-neon-lime">
                            {analysis?.viabilityScore || '--'}<span className="text-sm text-neon-lime/40">%</span>
                        </div>
                    </div>
                    <div className="h-16 w-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-t-4 border-neon-lime rounded-full"
                            style={{ opacity: analysis ? 1 : 0.2 }}
                        />
                        <BarChart3 className="w-6 h-6 text-white/20" />
                    </div>
                </div>

                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-3 h-3 text-amber-400" />
                                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Tactical_Hard_Truth</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-wider">
                                {analysis.tacticalAdvice}
                            </p>
                        </div>

                        <button
                            onClick={() => onOptimize(analysis.optimizationBrief)}
                            className="w-full py-4 bg-neon-lime text-obsidian text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-vip-glow flex items-center justify-center gap-2"
                        >
                            <Zap className="w-3 h-3 fill-current" />
                            Apply_Strategic_Optimization
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
