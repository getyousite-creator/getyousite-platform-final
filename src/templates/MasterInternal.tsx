"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    LayoutDashboard,
    Users2,
    Package,
    Settings,
    Bell,
    Layers,
    Activity,
    Server,
    Database,
    Shield,
    Terminal,
    Cpu,
    Zap,
    ChevronDown,
    Search
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

export default function MasterInternal(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline } = settings;

    // AI Blueprint Extraction
    const dashboardSection = blueprint?.layout?.find((s) => s.type === 'features');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsRaw = (dashboardSection?.content?.items as any[]) || [];
    
    const sidebarItems = itemsRaw.slice(0, 5).map(item => ({
        label: item.title || "Module",
        icon: LayoutDashboard // Default icon, could be dynamic mapped if needed
    }));

    const statsRaw = itemsRaw.slice(0, 3).map((item, i) => ({
        label: item.title || "Metric",
        val: i === 0 ? "98.2%" : i === 1 ? "1.4GB" : "12ms",
        icon: i === 0 ? Cpu : i === 1 ? Layers : Zap,
        color: i === 0 ? "text-blue-500" : i === 1 ? "text-purple-500" : "text-emerald-500"
    }));

    // If no AI data, fallbacks must be generic but strictly typed
    const navigationItems = sidebarItems.length > 0 ? sidebarItems : [
        { icon: LayoutDashboard, label: "Overview_Logic" },
        { icon: Users2, label: "Neural_Registry" },
        { icon: Package, label: "Asset_Inventory" },
        { icon: Activity, label: "System_Flux" },
        { icon: Database, label: "Data_Silo" }
    ];

    const stats = statsRaw.length > 0 ? statsRaw : [
        { label: "CPU_Load", val: "12.4%", icon: Cpu, color: "text-blue-500" },
        { label: "Memory_Usage", val: "4.2 GB", icon: Layers, color: "text-purple-500" },
        { icon: Zap, label: "latency", val: "14ms", color: "text-emerald-500" }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#0a0a0b] text-[#9ca3af] min-h-screen selection:bg-blue-600 selection:text-white font-mono overflow-x-hidden flex">
                    {/* INTERNAL SIDEBAR */}
                    <aside className="w-72 bg-[#121214] border-r border-white/5 hidden lg:flex flex-col p-8 fixed h-full z-50">
                        <div className="flex items-center gap-4 mb-20">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-2xl shadow-blue-600/30">
                                <Cpu className="w-6 h-6" />
                            </div>
                            <span className="text-white font-black tracking-tighter uppercase text-sm">{blueprint?.name || "CORE_INTEL"}</span>
                        </div>

                        <nav className="space-y-2 flex-grow">
                            {navigationItems.map((item, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${i === 0 ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-white/5 hover:text-white'}`}>
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </nav>

                        <div className="pt-8 border-t border-white/5">
                            <div className="p-4 bg-zinc-900 rounded-2xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Sovereign_Server_v4</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-blue-600" />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN DASHBOARD CONTENT */}
                    <main className="flex-grow lg:ml-72 p-6 lg:p-12 space-y-10">
                        {/* TOP HEADER */}
                        <header className="flex items-center justify-between pb-10 border-b border-white/5">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{headline}</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Root_Admin_Terminal_01</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <Search className="w-5 h-5 text-zinc-600 cursor-pointer" />
                                <Bell className="w-5 h-5 text-zinc-600 cursor-pointer" />
                                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                                    <Zap className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </header>

                        {/* STATUS MATRIX */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[#121214] p-8 rounded-3xl border border-white/5 group hover:border-blue-600/30 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 bg-zinc-900 rounded-2xl ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-zinc-800" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-white tabular-nums">{stat.val}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* SYSTEM CONSOLE */}
                        <div className="bg-[#121214] rounded-[40px] border border-white/5 overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Terminal className="w-5 h-5 text-blue-500" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white">System_Logs_CLI</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                    <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                </div>
                            </div>
                            <div className="p-10 font-mono text-[11px] space-y-4 max-h-[400px] overflow-y-auto bg-black/40">
                                <p className="text-emerald-500/80">[09:24:12] :: Sovereign_Logic_Protocol Initialized.</p>
                                <p className="text-blue-400">[09:24:14] :: Syncing User Assets... DONE</p>
                                <p className="text-zinc-600">[09:24:15] :: Cache_Purge triggered in 14ms.</p>
                                <p className="text-zinc-600">[09:24:20] :: Inbound API Request from Gateway_01 (Paris)</p>
                                <p className="text-purple-400">[09:24:22] :: Payment_Verified: $4,000.00 Sovereign_Tier</p>
                                <p className="text-rose-500">[09:24:25] :: ALERT: Unauthorized SSH Attempt from 192.168.1.1 - Blocked.</p>
                                <p className="text-emerald-500/80">[09:24:30] :: Performance Stable. Uptime: 99.9992%</p>
                                <div className="flex gap-2">
                                    <span className="text-blue-600">$</span>
                                    <span className="w-2 h-4 bg-blue-600 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* INTERNAL FOOTER */}
                        <footer className="pt-20 pb-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30 group cursor-default">
                            <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest lg:ml-0">
                                <span>Security_Audit</span>
                                <span>Registry_V3</span>
                                <span>Node_Status</span>
                            </div>
                            <p className="text-[8px] font-black uppercase tracking-widest">Sovereign Internal Engine. Total Autonomy Active.</p>
                        </footer>
                    </main>
                </div>
            )}
        </SovereignWrapper>
    );
}
