"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe } from "lucide-react";
import Image from "next/image";
import SovereignWrapper from "../SovereignWrapper";

export default function NeuraAgency() {
    return (
        <SovereignWrapper>
            {({ settings, onOpen, primary, secondary }) => (
                <div
                    className="w-full min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 overflow-x-hidden relative"
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {/* SOVEREIGN PULSE OVERLAY (Deep Innovation) */}
                    <motion.div
                        animate={{ opacity: [0, 0.05, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)]"
                        style={{ "--tw-gradient-from": primary } as any}
                    />

                    {/* Multi-Layer Dynamic Background */}
                    <div className="fixed inset-0 z-0 overflow-hidden">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, 0],
                                x: [0, 50, 0]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] opacity-20"
                            style={{ backgroundColor: primary }}
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, -15, 0],
                                x: [0, -40, 0]
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[180px] opacity-20"
                            style={{ backgroundColor: secondary }}
                        />
                        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" />
                    </div>

                    {/* Glass Nav */}
                    <nav className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/20 backdrop-blur-2xl">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 font-bold text-xl cursor-pointer group"
                            onClick={() => onOpen("NeuraAgency")}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="tracking-tighter uppercase font-black">Neura</span>
                        </motion.div>
                        <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                            <span className="hover:text-white cursor-pointer transition-colors relative group">
                                Intelligence
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all" />
                            </span>
                            <span className="hover:text-white cursor-pointer transition-colors relative group">
                                Architecture
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-500 group-hover:w-full transition-all" />
                            </span>
                            <ButtonLite color={primary} onClick={() => onOpen("NeuraAgency")}>Deploy Core</ButtonLite>
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <section className="relative z-10 pt-32 pb-40 px-8">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div className="relative">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
                                    style={{ color: primary }}
                                >
                                    <Sparkles className="w-3 h-3 animate-pulse" />
                                    Sovereign Intelligence Active
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl md:text-[8.5vw] font-black leading-[0.85] mb-10 tracking-tightest"
                                >
                                    <span className="block">{settings.headline.split(' ').slice(0, 3).join(' ')}</span>
                                    <span
                                        className="text-transparent bg-clip-text"
                                        style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}
                                    >
                                        {settings.headline.split(' ').slice(3).join(' ')}
                                    </span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xl text-zinc-400 mb-14 max-w-xl leading-relaxed font-light"
                                >
                                    {settings.subheadline}
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
                                        Launch Operation <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onOpen("View Dossier")} className="px-10 h-16 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                                        View Dossier
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
                                <Image
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
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Neural Sync</span>
                                        <span className="text-[10px] font-mono text-blue-400">92.4% MATCH</span>
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
