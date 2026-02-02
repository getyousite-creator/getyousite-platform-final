"use client";

import { motion } from "framer-motion";
import { GraduationCap, Play, BookOpen, Trophy, Clock, Search } from "lucide-react";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

interface EliteLMSProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
    };
}

export default function EliteLMS({ settings }: EliteLMSProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen bg-indigo-50/30 text-slate-900"
            style={{ fontFamily }}
        >
            {/* LMS Header */}
            <nav className="px-10 py-5 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-indigo-600 cursor-pointer" onClick={() => onOpen("EliteLMS Home")}>
                    <GraduationCap className="w-8 h-8" style={{ color: primaryColor }} />
                    EliteLMS
                </div>
                <div className="hidden lg:flex flex-1 max-w-md mx-10">
                    <div className="w-full relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Sign In</button>
                    <button
                        onClick={() => onOpen("Enroll")}
                        className="px-6 py-3 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/20"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="px-10 py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-10"
                    >
                        <Trophy className="w-3 h-3" />
                        Top Rated #1 Learning System
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tightest leading-[0.9] mb-8">
                        {headline}
                    </h1>
                    <p className="text-xl text-slate-500 mb-12 leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => onOpen("LMS Join")}
                            className="h-16 px-10 rounded-2xl text-white font-bold flex items-center gap-3 hover:scale-105 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Start Learning Now <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button className="h-16 px-10 rounded-2xl bg-white border border-slate-200 font-bold hover:bg-slate-50 transition-colors">
                            Browse Paths
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-indigo-500/10 rounded-3xl blur-3xl" />
                    <div
                        onClick={() => onOpen("EliteLMS Preview")}
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=2430"
                            alt="LMS Interface"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-indigo-600 fill-current ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Grid */}
            <section className="bg-slate-900 py-32 px-10 rounded-t-[60px] text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                    <Module title="Quantum Thinking" duration="12h" icon={BookOpen} color="#6366f1" />
                    <Module title="Neural Architectures" duration="24h" icon={ShieldCheck} color="#10b981" />
                    <Module title="Sovereign Design" duration="18h" icon={Trophy} color="#f59e0b" />
                </div>
            </section>
        </motion.div>
    );
}

function Module({ title, duration, icon: Icon, color }: any) {
    return (
        <div className="group cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8" style={{ color }} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">{title}</h3>
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest">
                <Clock className="w-3 h-3" /> {duration} Professional Training
            </div>
        </div>
    );
}

function ShieldCheck({ className, style }: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className={className}
            style={style}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
        </svg>
    );
}
