"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe } from "lucide-react";
import SovereignWrapper from "../SovereignWrapper";
import { SovereignImage } from "@/components/ui/sovereign-image";

export default function NeuraAgency({ settings, blueprint }: { settings: any, blueprint?: any }) {

    // Schema-Driven Data: Prefer blueprint data if available (Sovereign Mandate)
    const headline = blueprint?.layout?.find((s: any) => s.type === 'hero')?.content?.headline || settings.headline;
    const subheadline = blueprint?.layout?.find((s: any) => s.type === 'hero')?.content?.subheadline || settings.subheadline;

    return (
        <SovereignWrapper>
            {({ onOpen, primary, secondary }) => (
                <div
                    className="w-full min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 overflow-x-hidden relative"
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {/* ... (pulse overlay) */}

                    {/* ... (background) */}

                    {/* ... (glass nav) */}

                    {/* Hero Section */}
                    <section className="relative z-10 pt-32 pb-40 px-8">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div className="relative">
                                {/* ... (sovereign intelligence active badge) */}

                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-[8.5vw] font-black leading-[0.85] mb-10 tracking-tightest"
                                >
                                    {/* Dynamic Headline Rendering */}
                                    <span className="block">{headline.split(' ').slice(0, 3).join(' ')}</span>
                                    <span
                                        className="text-transparent bg-clip-text"
                                        style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}
                                    >
                                        {headline.split(' ').slice(3).join(' ')}
                                    </span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xl text-zinc-400 mb-14 max-w-xl leading-relaxed font-light"
                                >
                                    {subheadline}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-wrap items-center gap-6"
                                >
                                    <button
                                        onClick={() => onOpen(settings.headline)}
                                        className="px-10 h-16 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-950 flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        style={{ backgroundColor: primary }}
                                    >
                                        Start Project <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onOpen("View Case Study")} className="px-10 h-16 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                        View Case Study
                                    </button>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group cursor-pointer perspective-1000 shadow-2xl"
                                onClick={() => onOpen("Visual Interface")}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group cursor-pointer perspective-1000 shadow-2xl"
                                    onClick={() => onOpen("Visual Interface")}
                                >
                                    <SovereignImage
                                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2432"
                                        alt="Neural Interface"
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* HUD Elements */}
                                    <div className="absolute top-10 right-10 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-10 group-hover:translate-x-0">
                                        <div className="px-3 py-1 bg-blue-500 text-[8px] font-black uppercase tracking-widest">Target Found</div>
                                        <div className="text-[10px] font-mono text-blue-400">LOC: 42.92N 74.01W</div>
                                    </div>

                                    <div className="absolute bottom-10 left-10 right-10 p-8 rounded-[30px] bg-zinc-950/40 backdrop-blur-2xl border border-white/10 overflow-hidden">
                                        <motion.div
                                            animate={{ x: ["-100%", "100%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
                                        />
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Sync</span>
                                            <span className="text-[10px] font-mono text-blue-400">92.4% PERFORMANCE</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "92.4%" }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="relative z-10 py-32 border-y border-white/5 bg-zinc-950/20 backdrop-blur-3xl">
                        <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-16">
                            <StatItem icon={Shield} value="100%" label="Security" color={primary} />
                            <StatItem icon={Zap} value="42ms" label="Latency" color={secondary} />
                            <StatItem icon={BarChart3} value="12X" label="Growth" color={primary} />
                            <StatItem icon={Globe} value="Global" label="Scale" color={secondary} />
                        </div>
                    </section>
                </div>
            )}
        </SovereignWrapper>
    );
}

function StatItem({ icon: Icon, value, label, color }: any) {
    return (
        <div className="text-center">
            <div
                className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-white/5 border border-white/5"
                style={{ color }}
            >
                <Icon className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function ButtonLite({ children, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="px-5 py-2 rounded-lg text-sm font-bold text-zinc-950 shadow-lg"
            style={{ backgroundColor: color }}
        >
            {children}
        </button>
    );
}
