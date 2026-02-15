"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOG_MESSAGES = [
    "INITIALIZING_SOVEREIGN_CORE...",
    "EXTRACTING_BRAND_DNA...",
    "SYNTHESIZING_NEURAL_NODES...",
    "OPTIMIZING_EDGE_PROPAGATION...",
    "INJECTING_STRATEGIC_LOGIC...",
    "ARCHITECTING_MARKET_DOMINANCE_LAYER...",
    "LATENCY_REDUCTION_PROTOCOL_ACTIVE",
    "DECODING_USER_VISION...",
    "ASSEMBLING_HIGH_FREQUENCY_ASSETS...",
    "SECURITY_SHIELD_SYNTHESIS_COMPLETE",
    "HYDRATING_SOVEREIGN_INTERFACE...",
    "FINALIZING_LOGIC_CONSTRAINTS..."
];

export function NeuralLoadingHUD() {
    const [logIndex, setLogIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLogIndex((prev) => (prev + 1) % LOG_MESSAGES.length);
        }, 1200);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 98) return prev;
                return prev + (Math.random() * 2);
            });
        }, 400);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="absolute top-8 left-8 p-8 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 z-[100] pointer-events-none space-y-6 shadow-[0_40px_100px_rgba(0,0,0,0.9)] w-[400px] animate-in fade-in zoom-in duration-700">
            {/* HUD Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-primary animate-ping" />
                        <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Neural_Link_V4.0</span>
                </div>
                <span className="text-[10px] font-mono text-primary/60">GYS-EDGE-01</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Synthesis_Progress</span>
                    <span className="text-[14px] font-black text-primary font-mono">{Math.floor(progress)}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0 }}
                    />
                </div>
            </div>

            {/* Technical Logs */}
            <div className="h-20 flex flex-col justify-end">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={logIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-1.5"
                    >
                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] italic">
                            &gt; {LOG_MESSAGES[logIndex]}
                        </p>
                        <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest">
                            {btoa(LOG_MESSAGES[logIndex]).substring(0, 16)}...
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Status Footer */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest">Logic_Stable</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Buffer: 4.8PB/s</span>
                </div>
            </div>
        </div>
    );
}
