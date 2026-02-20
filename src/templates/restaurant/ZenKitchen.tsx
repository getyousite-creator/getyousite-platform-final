"use client";

import { motion } from "framer-motion";
import { Utensils, Clock, MapPin, Star, ChefHat, Instagram } from "lucide-react";
import Image from "next/image";
import SovereignWrapper from "../SovereignWrapper";

export default function ZenKitchen() {
    return (
        <SovereignWrapper>
            {({ settings, onOpen, primary }) => (
                <div
                    className="w-full min-h-screen bg-stone-50 text-zinc-900 relative"
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {/* ORGANIC OVERLAY (Deep Innovation) */}
                    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

                    {/* Culinary Nav */}
                    <nav className="px-10 py-8 flex items-center justify-between bg-white/60 backdrop-blur-2xl border-b border-stone-200 sticky top-0 z-50">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 font-black text-2xl tracking-tightest text-zinc-950 cursor-pointer"
                            onClick={() => onOpen("ZenKitchen Home")}
                        >
                            <div className="w-12 h-12 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                                <Utensils className="w-5 h-5" style={{ color: primary }} />
                            </div>
                            <span className="uppercase tracking-[0.2em] text-lg">Zen Kitchen</span>
                        </motion.div>
                        <div className="hidden lg:flex items-center gap-14 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
                            <span className="hover:text-zinc-950 cursor-pointer transition-colors relative group">
                                Season_Menu
                                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-zinc-900 group-hover:w-full transition-all" />
                            </span>
                            <span className="hover:text-zinc-950 cursor-pointer transition-colors relative group">
                                Sovereign_Table
                                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-zinc-900 group-hover:w-full transition-all" />
                            </span>
                            <button
                                onClick={() => onOpen("Zen Reservation")}
                                className="px-10 py-4 bg-zinc-950 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20"
                            >
                                Reservation_Access
                            </button>
                        </div>
                    </nav>

                    {/* Sensory Hero */}
                    <section className="px-10 py-40 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                        <div
                            className="lg:col-span-6 relative aspect-square rounded-[80px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] group cursor-pointer"
                            onClick={() => onOpen("Zen Visuals")}
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2430"
                                alt="Chef Preparing Food"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-x-12 bottom-12 p-10 rounded-[40px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl">
                                <div className="flex items-center gap-6 text-white">
                                    <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center">
                                        <ChefHat className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <div className="font-serif text-2xl italic mb-1">
                                            Artisanal Purity.
                                        </div>
                                        <div className="text-[9px] uppercase tracking-[0.4em] font-black opacity-60 italic">
                                            Sovereign Standards Center
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-20 h-[2px] bg-zinc-900 mb-14"
                            />
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-7xl md:text-[10vw] font-black leading-[0.8] mb-14 tracking-tightest uppercase italic font-serif"
                            >
                                {settings.headline}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-2xl text-zinc-500 mb-16 leading-relaxed italic font-serif max-w-xl"
                            >
                                {settings.subheadline}
                            </motion.p>
                            <div className="flex flex-col gap-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-zinc-900" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                                        Service: 17:00 — 23:00 / GMT+4
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-zinc-900" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">
                                        Astra Plaza, Sovereign Sovereign_101
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Signature Dishes */}
                    <section className="bg-zinc-950 py-40 px-10 text-white rounded-t-[100px] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-500/20 blur-[150px]" />
                        </div>
                        <div className="max-w-7xl mx-auto text-center mb-32 relative z-10">
                            <h2 className="text-6xl md:text-8xl font-serif italic mb-6">
                                Signature Assets
                            </h2>
                            <p className="text-zinc-500 text-sm uppercase tracking-[0.6em] font-black">
                                Strategic Culinary Orchestration
                            </p>
                        </div>
                        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-16 relative z-10">
                            <Dish name="Quantum Truffle" price="$74" />
                            <Dish name="Sovereign Wagyu" price="$142" />
                            <Dish name="Neural Spices" price="$48" />
                            <Dish name="Astra Infused Sea Bass" price="$89" />
                        </div>
                    </section>
                </div>
            )}
        </SovereignWrapper>
    );
}

interface DishProps {
    name: string;
    price: string;
}

function Dish({ name, price }: DishProps) {
    return (
        <div className="flex items-center justify-between pb-8 border-b border-zinc-800 hover:border-orange-500/50 transition-colors group cursor-pointer group">
            <div>
                <h3 className="text-xl font-bold mb-1 group-hover:text-orange-400 transition-colors">
                    {name}
                </h3>
                <div className="flex text-orange-400/60 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                </div>
            </div>
            <div className="text-2xl font-black">{price}</div>
        </div>
    );
}
