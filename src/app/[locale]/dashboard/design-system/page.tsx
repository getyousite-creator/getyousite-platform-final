"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Box, Zap, Layers, Smartphone, Share2, ShieldCheck } from 'lucide-react';

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-obsidian text-white p-12 space-y-24 font-sans">
            {/* Header */}
            <header className="space-y-6 max-w-4xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-deep/20 border border-emerald-deep/30 text-neon-lime text-xs font-black uppercase tracking-widest shadow-vip-glow">
                    Sovereign_Protocol_v2.1
                </div>
                <h1 className="text-7xl font-heading font-black tracking-tighter leading-none italic">
                    The Sovereign <span className="text-neon-lime not-italic underline decoration-emerald-deep transition-all">Design System</span>
                </h1>
                <p className="text-xl text-white/40 max-w-2xl leading-relaxed uppercase tracking-[0.2em]">
                    A geometric philosophy of digital dominance. Beyond templates. Beyond limits.
                </p>
            </header>

            {/* 1. Color Palette */}
            <section className="space-y-12">
                <div className="flex items-center gap-4 text-white/20 uppercase font-black tracking-[0.5em] text-sm">
                    <Palette className="w-5 h-5" /> 01_Sovereign_Palette
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { name: "Emerald Deep", hex: "#064E3B", class: "bg-emerald-deep", desc: "Trust & Growth" },
                        { name: "Neon Lime", hex: "#BEF264", class: "bg-neon-lime text-black", desc: "AI Pulse & Energy" },
                        { name: "Obsidian", hex: "#0A0A0A", class: "bg-obsidian border border-white/10", desc: "Infinite Surface" },
                        { name: "Surface Slate", hex: "#171717", class: "bg-surface-slate", desc: "Functional Depth" }
                    ].map((color, i) => (
                        <div key={i} className="space-y-4">
                            <div className={`h-48 rounded-3xl ${color.class} flex items-end p-6 shadow-premium`}>
                                <span className="font-black tracking-tighter text-xl">{color.hex}</span>
                            </div>
                            <div className="px-2">
                                <h4 className="font-black uppercase tracking-widest text-xs">{color.name}</h4>
                                <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">{color.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Typography Engine */}
            <section className="space-y-12">
                <div className="flex items-center gap-4 text-white/20 uppercase font-black tracking-[0.5em] text-sm">
                    <Type className="w-5 h-5" /> 02_Multilingual_Typography
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-premium">
                        <div className="text-[10px] text-neon-lime font-black uppercase tracking-[0.4em]">Latin_Matrix</div>
                        <div className="space-y-10">
                            <h2 className="text-6xl font-heading font-black tracking-tighter">Clash Display</h2>
                            <p className="text-xl font-sans text-white/60 leading-relaxed uppercase tracking-widest">
                                Satoshi: A typeface designed for high-end digital precision.
                                The Golden Ratio (1.618) is strictly enforced in these scales.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-premium text-right" dir="rtl">
                        <div className="text-[10px] text-neon-lime font-black uppercase tracking-[0.4em]">Arabic_Matrix</div>
                        <div className="space-y-10 font-arabic-heading">
                            <h2 className="text-6xl font-black tracking-tighter">IBM Plex Arabic</h2>
                            <p className="text-xl font-arabic text-white/60 leading-relaxed">
                                تجول: خط يجسد الحداثة والوضوح المعاصر. تم تصميمه ليعكس الفخامة والقوة المعمارية في كل حرف.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Atomic Components */}
            <section className="space-y-12">
                <div className="flex items-center gap-4 text-white/20 uppercase font-black tracking-[0.5em] text-sm">
                    <Box className="w-5 h-5" /> 03_Atomic_Components
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Buttons */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">VIP_Interaction</h4>
                        <div className="flex flex-col gap-6">
                            <button className="vip-button px-10 py-5 text-xs font-black uppercase tracking-[0.3em]">
                                Primary_Action
                            </button>
                            <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[8px] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                                Secondary_Neutral
                            </button>
                        </div>
                    </div>

                    {/* Cards */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Frosted_Surfaces</h4>
                        <div className="vip-card p-10 h-48 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-neon-lime/20 border border-neon-lime/30 animate-pulse" />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geometric_Icons</h4>
                        <div className="grid grid-cols-3 gap-6">
                            {[Zap, Layers, Smartphone, Share2, ShieldCheck, Box].map((Icon, i) => (
                                <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center group hover:border-emerald-deep transition-all shadow-premium">
                                    <Icon className="w-6 h-6 text-neon-lime group-hover:scale-110 transition-transform stroke-[1.5px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Tag */}
            <footer className="pt-24 border-t border-white/5 text-center">
                <p className="text-[10px] uppercase font-black tracking-[1em] text-white/10 animate-pulse">
                    Verified_Sovereign_Asset_2026
                </p>
            </footer>
        </div>
    );
}
