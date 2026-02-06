"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Globe,
    Shield,
    BarChart3,
    Briefcase,
    Building2,
    CheckCircle2,
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    Search,
    PieChart,
    Users
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

export default function MasterCorporate(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline } = settings;

    // AI Blueprint Extraction
    const services = blueprint?.layout?.find((s) => s.type === 'features')?.content?.items || [
        { title: "Strategic M&A Intelligence", desc: "Complex transaction logic with absolute regulatory compliance.", icon: Briefcase },
        { title: "Sovereign Asset Protection", desc: "Capital preservation protocols for the elite global tier.", icon: Shield },
        { title: "Market Alpha Algorithms", desc: "Proprietary predictive modeling for industrial dominance.", icon: TrendingUp }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-white text-slate-950 min-h-screen selection:bg-blue-900 selection:text-white font-sans overflow-x-hidden">
                    {/* CORPORATE NAVIGATION */}
                    <nav className="h-24 px-8 lg:px-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100">
                        <div className="flex items-center gap-12">
                            <span className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
                                <Globe className="w-6 h-6 text-blue-900" /> {blueprint?.name || "CORP_GLOBAL"}
                            </span>
                            <div className="hidden lg:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <span className="hover:text-blue-900 cursor-pointer transition-colors">Strategic_Units</span>
                                <span className="hover:text-blue-900 cursor-pointer transition-colors">Market_Insights</span>
                                <span className="hover:text-blue-900 cursor-pointer transition-colors">Governance</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <Search className="w-5 h-5 text-slate-300 cursor-pointer hover:text-blue-900 transition-colors" />
                            <button
                                onClick={() => onOpen("Consultation")}
                                className="h-12 px-8 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                            >
                                Executive_Entry
                            </button>
                        </div>
                    </nav>

                    {/* HERO AUTHORITY ENGINE */}
                    <section className="pt-32 pb-48 px-10 relative bg-slate-50">
                        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="space-y-12"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 border border-blue-100">
                                    <Shield className="w-4 h-4 text-blue-900" />
                                    <span className="text-[10px] font-black uppercase text-blue-900 tracking-widest">Global Stability Standard Verified</span>
                                </div>
                                <h1 className="text-6xl md:text-[6vw] font-black tracking-tighter leading-[0.9] text-slate-950 uppercase">
                                    {headline}
                                </h1>
                                <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                                    {subheadline}
                                </p>
                                <div className="flex flex-wrap gap-6 pt-6">
                                    <button className="h-20 px-12 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] hover:bg-blue-900 transition-colors flex items-center gap-4">
                                        View_Capabilities <ChevronRight className="w-5 h-5" />
                                    </button>
                                    <button className="h-20 px-12 border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[11px] hover:bg-white transition-colors">
                                        Annual_Report_2026
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2 }}
                                className="relative h-[600px] border-[20px] border-white shadow-2xl rounded-sm overflow-hidden"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                                    alt="Corporate"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-10 right-10 p-8 bg-blue-900 text-white shadow-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-60">Global_Market_Cap</p>
                                    <p className="text-3xl font-black tabular-nums font-mono">$1.4T+</p>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* MARKET STRATEGY UNITS */}
                    <section className="py-40">
                        <div className="container mx-auto px-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-slate-100 border border-slate-100">
                                {services.map((unit: any, i: number) => (
                                    <div key={i} className="bg-white p-12 lg:p-20 space-y-10 group hover:bg-slate-50 transition-colors">
                                        <div className="w-16 h-16 bg-blue-50 flex items-center justify-center group-hover:bg-blue-900 transition-colors">
                                            <unit.icon className="w-8 h-8 text-blue-900 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{unit.title}</h3>
                                        <p className="text-slate-400 leading-relaxed text-sm font-medium">{unit.desc}</p>
                                        <div className="pt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Learn_More</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* GLOBAL IMPACT MATRICES */}
                    <section className="py-40 bg-slate-950 text-white">
                        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
                            {[
                                { icon: Building2, val: "42", label: "Global_Outposts" },
                                { icon: PieChart, val: "18%", label: "Alpha_Yield" },
                                { icon: Users, val: "12K", label: "Elite_Operators" },
                                { icon: BarChart3, val: "0.2s", label: "Logic_Latency" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-4">
                                    <stat.icon className="w-8 h-8 text-blue-500" />
                                    <div className="space-y-1">
                                        <p className="text-5xl font-black tabular-nums">{stat.val}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CORPORATE FOOTER */}
                    <footer className="py-24 px-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.5em] text-slate-300">
                            <span>Slavery_Policy</span>
                            <span>Privacy_Trust</span>
                            <span>Regulatory_Log</span>
                            <span>Investor_Relations</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-200 font-bold uppercase tracking-[1em]">© 2026 Sovereign Global Infrastructure Group.</p>
                        </div>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
