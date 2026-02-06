"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Calculator,
    Receipt,
    LineChart,
    Wallet,
    FileText,
    ArrowUpCircle,
    ArrowDownCircle,
    Plus,
    Key,
    Database,
    ChevronRight,
    Search,
    ShieldCheck,
    CreditCard
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

export default function MasterAccounting(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline } = settings;

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#f4f7f6] text-slate-900 min-h-screen selection:bg-teal-600 selection:text-white font-sans overflow-x-hidden pt-20">
                    {/* FINANCIAL NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between">
                        <div className="flex items-center gap-10">
                            <span className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-teal-600" /> {blueprint?.name || "FINANCE_CORE"}
                            </span>
                            <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="hover:text-teal-600 cursor-pointer">Ledger</span>
                                <span className="hover:text-teal-600 cursor-pointer">Invoicing</span>
                                <span className="hover:text-teal-600 cursor-pointer">Tax_Portal</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                                <Search className="w-4 h-4 text-slate-500" />
                            </div>
                            <button
                                onClick={() => onOpen("Upgrade")}
                                className="h-10 px-6 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                            >
                                Get_Access
                            </button>
                        </div>
                    </nav>

                    {/* DASHBOARD HERO */}
                    <section className="p-8 lg:p-20">
                        <div className="container mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-12 space-y-6 mb-12">
                                    <h1 className="text-5xl font-black tracking-tightest leading-none text-slate-950 uppercase">
                                        {headline}
                                    </h1>
                                    <p className="text-lg text-slate-500 max-w-2xl font-medium">
                                        {subheadline}
                                    </p>
                                </div>

                                {/* METRIC GRID */}
                                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center">
                                                <Wallet className="w-6 h-6 text-teal-600" />
                                            </div>
                                            <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-full uppercase">Verified_Flow</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total_Revenue</p>
                                            <p className="text-4xl font-black tabular-nums">$1,248,390.00</p>
                                        </div>
                                        <div className="pt-4 flex items-center gap-2 text-xs font-black text-teal-600">
                                            <ArrowUpCircle className="w-4 h-4" /> 24% Growth_Logic
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-slate-950 p-10 rounded-3xl space-y-8 text-white"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-teal-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full uppercase">Operating_Margin</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-white/40">Total_Expenses</p>
                                            <p className="text-4xl font-black tabular-nums">$384,120.00</p>
                                        </div>
                                        <div className="pt-4 flex items-center gap-2 text-xs font-black text-rose-400">
                                            <ArrowDownCircle className="w-4 h-4" /> 12% Cost_Reduction
                                        </div>
                                    </motion.div>
                                </div>

                                {/* SIDEBAR TOOLS */}
                                <div className="lg:col-span-4 space-y-8">
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-full">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Industrial_Integrations</h3>
                                        <div className="space-y-6">
                                            {[
                                                { icon: Database, label: "Excel & QuickBooks Sync", val: "Active" },
                                                { icon: ShieldCheck, label: "Tax Compliance Logic", val: "Secure" },
                                                { icon: LineChart, label: "Real-time Cash Flow", val: "99.9% Acc" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-teal-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                                                        <span className="text-xs font-black uppercase text-slate-600">{item.label}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 group-hover:text-teal-600">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-full mt-10 h-14 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-teal-600 transition-colors flex items-center justify-center gap-3">
                                            Configure_Imports <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* TRANSACTION LEDGER */}
                    <section className="px-8 lg:px-20 pb-40">
                        <div className="container mx-auto">
                            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="text-2xl font-black uppercase tracking-tight italic">Transaction_Intelligence</h2>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-teal-600 flex items-center gap-2 hover:gap-4 transition-all">
                                        Export_Report <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                <th className="px-10 py-6">Reference</th>
                                                <th className="px-10 py-6">Category</th>
                                                <th className="px-10 py-6">Date</th>
                                                <th className="px-10 py-6">Amount</th>
                                                <th className="px-10 py-6 text-right">Logic_Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {[
                                                { ref: "RF-98212", cat: "Infrastructure", date: "Feb 06, 2026", amt: "+ $14,200.00", status: "Verified", positive: true },
                                                { ref: "RF-98213", cat: "SaaS Ops", date: "Feb 05, 2026", amt: "- $2,100.00", status: "Reconciled", positive: false },
                                                { ref: "RF-98214", cat: "Contractor", date: "Feb 04, 2026", amt: "- $8,500.00", status: "Auto-Pay", positive: false },
                                                { ref: "RF-98215", cat: "Retainer", date: "Feb 04, 2026", amt: "+ $45,000.00", status: "Verified", positive: true }
                                            ].map((row, i) => (
                                                <tr key={i} className="text-xs group hover:bg-slate-50 transition-colors">
                                                    <td className="px-10 py-8 font-black font-mono text-slate-400 group-hover:text-slate-950">{row.ref}</td>
                                                    <td className="px-10 py-8 font-bold uppercase">{row.cat}</td>
                                                    <td className="px-10 py-8 text-slate-400">{row.date}</td>
                                                    <td className={`px-10 py-8 font-black ${row.positive ? 'text-teal-600' : 'text-slate-950'}`}>{row.amt}</td>
                                                    <td className="px-10 py-8 text-right">
                                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest">{row.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FINANCIAL FOOTER */}
                    <footer className="bg-slate-950 py-32 text-center text-white/20">
                        <div className="container mx-auto px-10 space-y-10">
                            <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest">
                                <span className="hover:text-white cursor-pointer transition-colors">Encryption_Log</span>
                                <span className="hover:text-white cursor-pointer transition-colors">FCA_Compliance</span>
                                <span className="hover:text-white cursor-pointer transition-colors">SWIFT_Bypass</span>
                                <span className="hover:text-white cursor-pointer transition-colors">Legal_Ledger</span>
                            </div>
                            <span className="block text-2xl font-black tracking-tighter uppercase italic text-white/10">{blueprint?.name}</span>
                            <p className="text-[10px] uppercase font-black tracking-[1em]">Sovereign Financial Terminal v2.0. Bank Intelligence Integrated.</p>
                        </div>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
