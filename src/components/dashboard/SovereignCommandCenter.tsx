/**
 * SovereignCommandCenter (SCC)
 * 
 * High-status executive dashboard for Strategic Asset Management.
 * Logic: Synthesizes real-time performance, predictive risk, and architectural integrity.
 */

"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import {
    Activity, Shield, AlertTriangle, CheckCircle2,
    BrainCircuit, TrendingUp, Users, Target
} from "lucide-react";
import { motion } from "framer-motion";

const FUNNEL_DATA = [
    { stage: "Discovery", count: 1200, fill: "#065f46" },
    { stage: "Synthesis", count: 850, fill: "#059669" },
    { stage: "Blueprint", count: 420, fill: "#10b981" },
    { stage: "Deployment", count: 180, fill: "#34d399" },
    { stage: "Retention", count: 155, fill: "#60a5fa" }
];

const RETENTION_DATA = [
    { name: "Mon", value: 92 },
    { name: "Tue", value: 88 },
    { name: "Wed", value: 95 },
    { name: "Thu", value: 91 },
    { name: "Fri", value: 94 },
    { name: "Sat", value: 97 },
    { name: "Sun", value: 99 }
];

export default function SovereignCommandCenter() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    if (!isLoaded) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* 1. STRATEGIC FUNNEL (RECHART) */}
            <div className="lg:col-span-2 p-8 bg-obsidian border border-white/5 rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Conversion_Architecture</h3>
                        <p className="text-xl font-black tracking-tighter">Strategic Funnel Depth</p>
                    </div>
                    <Activity className="w-5 h-5 text-neon-lime" />
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={FUNNEL_DATA} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="stage"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff40", fontSize: 10, fontWeight: 900 }}
                                width={80}
                            />
                            <Tooltip
                                cursor={{ fill: "transparent" }}
                                contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "12px", fontSize: "10px" }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {FUNNEL_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. CHURN PREDICTION (SOVEREIGN ENGINE) */}
            <div className="p-8 bg-obsidian border border-white/5 rounded-[2.5rem] space-y-8 flex flex-col justify-between">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Predictive_Stability</h3>
                    <p className="text-xl font-black tracking-tighter">Churn Risk Index</p>
                </div>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-4xl font-black tracking-tighter text-neon-lime">4.2%</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Risk_Level: Low</p>
                        </div>
                    </div>
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <circle
                            cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - 0.042)}
                            className="text-neon-lime shadow-vip-glow"
                        />
                    </svg>
                </div>

                <div className="p-4 bg-emerald-deep/10 border border-emerald-deep/20 rounded-2xl flex items-start gap-4">
                    <BrainCircuit className="w-5 h-5 text-neon-lime mt-1" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">STRATEGIC_REACTION_ACTIVE</p>
                        <p className="text-[9px] text-white/40">Growth pattern detected. High retention probability.</p>
                    </div>
                </div>
            </div>

            {/* 3. DIP INTEGRITY INDEX */}
            <div className="p-8 bg-emerald-deep border border-emerald-deep/30 rounded-[2.5rem] space-y-8 flex flex-col justify-between group">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Architectural_Vigilance</h3>
                    <p className="text-xl font-black tracking-tighter text-white">Integrity Matrix</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/60">
                        <span>Latency_Gate</span>
                        <span className="text-white">142ms</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} className="h-full bg-white" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-white/60">
                        <span>Security_Sync</span>
                        <span className="text-white">100%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} className="h-full bg-white" />
                    </div>
                </div>

                <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all">
                    Initiate_Audit
                </button>
            </div>

        </div>
    );
}
