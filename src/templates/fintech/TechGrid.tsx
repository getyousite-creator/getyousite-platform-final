"use client";

import { motion } from "framer-motion";
import { BarChart3, PieChart, Activity, Cpu, Layers, Layout, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

interface TechGridProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
    };
}

export default function TechGrid({ settings }: TechGridProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full min-h-screen bg-slate-900 text-slate-100"
            style={{ fontFamily }}
        >
            {/* GRID OVERLAY */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* NAV */}
            <nav className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => onOpen("TechGrid Home")}>
                    <Layers className="w-6 h-6" style={{ color: primaryColor }} />
                    TECHGRID
                </div>
                <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="hover:text-white cursor-pointer">Protocol</span>
                    <span className="hover:text-white cursor-pointer">Engine</span>
                    <span className="hover:text-white cursor-pointer">Security</span>
                    <button
                        onClick={() => onOpen("TechGrid Start")}
                        className="px-5 py-2.5 rounded-lg text-white font-bold transition-all hover:bg-white hover:text-slate-900"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Deploy Node
                    </button>
                </div>
            </nav>

            {/* METRIC HERO */}
            <section className="px-8 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-10">
                        <Activity className="w-3 h-3" />
                        System Live: 99.99% Uptime
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black leading-[1.05] tracking-tightest mb-8">
                        {headline}
                    </h1>
                    <p className="text-lg text-slate-400 mb-12 leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => onOpen("API Docs")}
                            className="px-8 py-4 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            View Components <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* DASHBOARD MOCKUP */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                    <MetricBox icon={BarChart3} label="Scale Operations" value="12.4x" color={primaryColor} />
                    <MetricBox icon={PieChart} label="Data Density" value="94%" color={secondaryColor} />
                    <div className="col-span-2 p-6 rounded-3xl bg-slate-800/50 border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => onOpen("System Graph")}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Infrastructure</div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <div className="flex items-end gap-1 h-20">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scaleY: 0.1 }}
                                    animate={{ scaleY: [0.1, Math.random() + 0.5, 0.1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                    className="flex-1 rounded-sm origin-bottom"
                                    style={{ backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* TECH STACK SECTION */}
            <section className="py-32 px-8 border-t border-white/5 bg-slate-900/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-bold mb-6">Deterministic Infrastructure for the Sovereign Era.</h2>
                        <p className="text-slate-500 text-sm leading-relaxed">No shared state. No compromises. Pure binary performance delivered to your edge.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-4">
                            <Cpu className="w-8 h-8 text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Core</span>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-4">
                            <Layout className="w-8 h-8 text-purple-400" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Grid System</span>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

function MetricBox({ icon: Icon, label, value, color }: any) {
    return (
        <div className="p-8 rounded-3xl bg-slate-800/50 border border-white/5 flex flex-col items-start gap-4 hover:border-white/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</div>
                <div className="text-3xl font-black">{value}</div>
            </div>
        </div>
    );
}
