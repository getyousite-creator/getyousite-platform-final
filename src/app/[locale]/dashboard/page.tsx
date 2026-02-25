"use client";

import { NexusStatCards } from "@/components/dashboard/NexusStatCards";
import StrategicInsightsHUD from "@/components/dashboard/StrategicInsightsHUD";
import SovereignCommandCenter from "@/components/dashboard/SovereignCommandCenter";
import { ArrowUpRight, Zap, Globe, ShieldCheck, Activity } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export default function DashboardHome() {
    return (
        <div className="space-y-12">
            {/* Contextual Intelligence Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-deep/20 border border-emerald-deep/30 text-[9px] font-black uppercase tracking-[0.3em] text-neon-lime shadow-vip-glow">
                        <Zap className="w-3 h-3" />
                        System_Ready
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                        Strategic <span className="text-neon-lime not-italic underline decoration-white/10 underline-offset-8">Overview</span>
                    </h1>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-widest pl-1">
                        Monitoring strategic assets and architectural performance.
                    </p>
                </div>

                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        Generate_Report
                    </button>
                    <button className="vip-button px-6 py-3 text-[10px] font-black uppercase tracking-widest shadow-vip-glow">
                        Initiate_New_Project
                    </button>
                </div>
            </div>

            {/* SOVEREIGN COMMAND CENTER (Visionary Engine) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Activity className="w-4 h-4 text-neon-lime animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Universal_Strategic_Matrix</h3>
                </div>
                <SovereignCommandCenter />
            </div>

            {/* STRATEGIC INTELLIGENCE HUD */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Zap className="w-4 h-4 text-neon-lime animate-pulse" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Live_Architectural_Synthesis</h3>
                </div>
                <StrategicInsightsHUD siteId="global" />
            </div>

            {/* Project Matrix & Architectural Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Active_Project_Matrix</h3>
                        <Link href="/dashboard/sites" className="text-[10px] font-black uppercase tracking-widest text-neon-lime hover:underline">View_All_Assets</Link>
                    </div>

                    {[
                        { name: "Sovereign Commerce GYS", url: "sovereign-gys.gysglobal.com", status: "Live", perf: 98, updated: "2m ago" },
                        { name: "Institutional Astra Hub", url: "astra-inst.gysglobal.com", status: "Syncing", perf: 94, updated: "15h ago" },
                        { name: "Emerald Strategic Estates", url: "emerald-strat.gysglobal.com", status: "Staging", perf: 99, updated: "4d ago" }
                    ].map((site, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ x: 4 }}
                            className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.04] transition-all duration-500"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-obsidian border border-white/10 flex items-center justify-center text-white/20 group-hover:text-neon-lime transition-colors">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight">{site.name}</h4>
                                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{site.url}</p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center gap-12">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Perf_Index</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-lime" style={{ width: `${site.perf}%` }} />
                                        </div>
                                        <span className="text-[10px] font-black text-white/60">{site.perf}%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Status</p>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${site.status === 'Live' ? 'text-neon-lime' : 'text-amber-400'}`}>
                                        {site.status}
                                    </span>
                                </div>
                                <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 px-2">Operational_Security</h3>
                    <div className="p-8 bg-gradient-to-br from-emerald-deep/20 to-transparent border border-emerald-deep/20 rounded-[3rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-32 h-32 text-neon-lime" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-xl font-black uppercase tracking-tighter">Verified_Zone</h4>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] leading-relaxed">
                                Your digital footprint is secured via GYS-Shield protocol.
                                Active monitoring: 1,402 checks/hr.
                            </p>
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all relative z-10">
                            Review_Encryption_Logs
                        </button>
                    </div>

                    <div className="vip-card p-8 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Upcoming_Milestones</h4>
                        <ul className="space-y-4">
                            {[
                                "Sovereign SEO Integration v2.0",
                                "Global CDN Optimization",
                                "Nexus Mobile App Sync"
                            ].map((task, i) => (
                                <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-lime/40" />
                                    {task}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
