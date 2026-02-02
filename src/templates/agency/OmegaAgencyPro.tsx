"use client";

import SovereignWrapper from "../SovereignWrapper";
import { motion } from "framer-motion";
import {
    Zap,
    ArrowUpRight,
    Globe,
    Command,
    Layers,
    MousePointer2,
    Box,
    ChevronDown
} from "lucide-react";
import Image from "next/image";

/**
 * OMEGA AGENCY (PRO EDITION)
 * Transcription Strategy: Astra Pro Complexity + Sovereign Performance.
 * Vector: Hyper-detailed typography transitions and multi-path navigation.
 */
export default function OmegaAgency() {
    return (
        <SovereignWrapper>
            {({ settings, onOpen, primary, secondary }) => (
                <div
                    className="bg-black text-white selection:bg-blue-500/50 overflow-x-hidden min-h-screen"
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {/* ASTRA-INSPIRED OMEGA NAV (PRO) */}
                    <nav className="fixed top-0 inset-x-0 h-24 border-b border-white/5 bg-black/80 backdrop-blur-3xl z-[100] px-10 flex items-center justify-between">
                        <div
                            className="flex items-center gap-3 cursor-crosshair group"
                            onClick={() => onOpen("Omega_Protocol")}
                        >
                            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl group-hover:rotate-12 transition-transform">
                                <Command className="text-black w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-[0.2em]">Omega.</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-14 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                            <div className="group relative flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                                Solutions <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
                                <div className="absolute top-full left-0 pt-10 hidden group-hover:block">
                                    <div className="w-64 bg-zinc-900 border border-white/5 p-8 space-y-6 shadow-2xl">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-white hover:translate-x-2 transition-transform">Neural_Ads</span>
                                            <span className="text-white hover:translate-x-2 transition-transform">Astra_SEO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="hover:text-white transition-colors cursor-pointer">Expeditions</span>
                            <span className="hover:text-white transition-colors cursor-pointer">Dossier</span>
                            <button
                                onClick={() => onOpen("Omega Connect")}
                                className="px-12 h-14 bg-blue-600 text-white font-black hover:bg-blue-500 transition-colors shadow-xl shadow-blue-500/20"
                            >
                                Initiate_Link
                            </button>
                        </div>
                    </nav>

                    {/* OMEGA HERO (PRO TRANSCRIPTION) */}
                    <section className="pt-56 pb-40 px-10">
                        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
                            <div className="lg:col-span-12">
                                <div className="inline-flex items-center gap-3 mb-12 bg-white/5 border border-white/10 rounded-full px-6 py-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Status: Sovereign Architecture Active</span>
                                </div>
                                <h1 className="text-[12vw] font-black leading-[0.8] tracking-tightest uppercase mb-20 italic">
                                    THE WORLD IS <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-700">NOT STATIC.</span>
                                </h1>
                            </div>

                            <div className="lg:col-span-5 space-y-16">
                                <p className="text-3xl text-zinc-400 font-medium leading-[1.1] tracking-tighter">
                                    Transcribing the future of digital interaction through high-fidelity engineering and sensory aesthetics.
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    <Metric label="Latency" value="0.04ms" />
                                    <Metric label="Uptime" value="100%" />
                                </div>
                                <button
                                    onClick={() => onOpen("The Alpha Plan")}
                                    className="group flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em]"
                                >
                                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:rotate-45">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    Explore The Protocol
                                </button>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="relative aspect-video rounded-[60px] overflow-hidden group border border-white/5 shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                                        alt="Astra Pro Visualization"
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors" />

                                    {/* PRO UI HUD (Transcribed) */}
                                    <div className="absolute bottom-10 left-10 p-8 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 max-w-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Layers className="w-5 h-5 text-blue-400" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Layer_Sync_Active</span>
                                        </div>
                                        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: ["0%", "85%"] }}
                                                transition={{ duration: 2, delay: 1 }}
                                                className="h-full bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SERVICE ARCHITECTURE */}
                    <section className="bg-zinc-900 border-y border-white/5 py-32 px-10">
                        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-1px bg-white/5">
                            <SrvItem icon={Globe} title="Protocol" desc="Global deployment at the edge." />
                            <SrvItem icon={Box} title="Spatial" desc="Immersive UI depth sequences." />
                            <SrvItem icon={Zap} title="Direct" desc="0ms interaction latency." />
                            <SrvItem icon={MousePointer2} title="Active" desc="Behavioral data orchestration." />
                        </div>
                    </section>
                </div>
            )}
        </SovereignWrapper>
    );
}

function Metric({ label, value }: any) {
    return (
        <div className="border-l border-white/10 pl-6 py-2">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">{label}</div>
            <div className="text-3xl font-black italic">{value}</div>
        </div>
    );
}

function SrvItem({ icon: Icon, title, desc }: any) {
    return (
        <div className="bg-black p-12 hover:bg-white/[0.02] transition-colors group cursor-pointer">
            <Icon className="w-8 h-8 mb-8 text-zinc-500 group-hover:text-blue-500 transition-colors" />
            <h3 className="text-2xl font-black uppercase mb-4 tracking-tightest italic">{title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
