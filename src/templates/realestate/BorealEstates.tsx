"use client";

import { motion } from "framer-motion";
import { Home, Map, Ruler, BedDouble, Bath, LucideIcon } from "lucide-react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { cn } from "@/lib/utils";
import { MarketIntelligenceBridge, CurrencyLocale, UnitSystem } from "@/lib/engine/market-intelligence";
import CinematicVideo from "@/components/home/showcase/CinematicVideo";
import { useState } from "react";

interface BorealEstatesProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
        locale?: string;
    };
}

import Logo from "@/components/ui/Logo";

export default function BorealEstates({ settings }: BorealEstatesProps) {
    const { primaryColor, headline, subheadline, fontFamily, locale = 'en' } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    // Global Market Toggles
    const [currency, setCurrency] = useState<CurrencyLocale>(MarketIntelligenceBridge.getDefaults(locale).currency);
    const [units, setUnits] = useState<UnitSystem>(MarketIntelligenceBridge.getDefaults(locale).units);

    return (
        <motion.div
            key={updatePulse}
            animate={{ opacity: [0.95, 1], scale: [0.99, 1] }}
            className="w-full min-h-screen bg-slate-950 text-white selection:bg-blue-500/30"
            style={{ fontFamily }}
        >
            {/* Real Estate Header - High-Fi Glass */}
            <nav className="px-10 py-6 flex items-center justify-between border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
                <Logo />

                <div className="hidden lg:flex items-center gap-8">
                    {/* Market Toggles */}
                    <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800">
                        {(['USD', 'EUR', 'AED', 'CHF'] as CurrencyLocale[]).map((cur) => (
                            <button
                                key={cur}
                                onClick={() => setCurrency(cur)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all",
                                    currency === cur ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {cur}
                            </button>
                        ))}
                    </div>
                    <div className="flex bg-slate-900 rounded-full p-1 border border-slate-800">
                        {(['imperial', 'metric'] as UnitSystem[]).map((unit) => (
                            <button
                                key={unit}
                                onClick={() => setUnits(unit)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black tracking-widest transition-all uppercase",
                                    units === unit ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                                )}
                            >
                                {unit === 'imperial' ? 'FT' : 'M'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    <span className="hover:text-blue-400 cursor-pointer transition-colors">Portfolios</span>
                    <button
                        onClick={() => onOpen("Boreal Private Briefing")}
                        className="px-8 py-3 rounded-xl bg-white text-black hover:bg-slate-200 transition-all font-bold tracking-widest"
                    >
                        Private Briefing
                    </button>
                </div>
            </nav>

            {/* Immersive Cinematic Hero */}
            <section className="relative h-screen flex flex-col justify-end px-10 pb-20 overflow-hidden">
                <CinematicVideo
                    videoUrl="https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-house-exterior-at-night-42651-large.mp4"
                    posterUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2430"
                    className="absolute inset-0 z-0"
                />

                <div className="relative z-10 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="px-4 py-1.5 rounded-full bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-[10px] font-black uppercase tracking-widest text-blue-400">Global Portfolio #A24</div>
                        <div className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Live Architectural Preview</div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12 uppercase"
                    >
                        {headline}
                    </motion.h1>

                    <div className="flex flex-wrap items-end justify-between gap-12">
                        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium">
                            {subheadline}
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Invest from</div>
                            <div className="text-6xl font-black tracking-tighter text-blue-400">
                                {MarketIntelligenceBridge.formatPrice(12400000, currency)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Property Intelligence Grid */}
            <section className="py-32 px-10 grid grid-cols-1 md:grid-cols-4 gap-12 bg-white text-slate-950">
                <PropertySpec icon={Map} label="Location" value="St. Moritz, Swiss Alps" />
                <PropertySpec icon={Ruler} label="Total Area" value={MarketIntelligenceBridge.formatArea(12400, units)} />
                <PropertySpec icon={BedDouble} label="Sleeping" value="6 Grand Suites" />
                <PropertySpec icon={Bath} label="Wellness" value="8 Spa En-Suites" />
            </section>
        </motion.div>
    );
}

interface PropertySpecProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

function PropertySpec({ icon: Icon, label, value }: PropertySpecProps) {
    return (
        <div className="flex flex-col gap-6 group">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-110">
                <Icon className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{label}</div>
                <div className="text-2xl font-black tracking-tight text-slate-900">{value}</div>
            </div>
        </div>
    );
}
