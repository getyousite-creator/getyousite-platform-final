"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Zap,
    Dumbbell,
    Trophy,
    Activity,
    Flame,
    Target,
    ChevronRight,
    Users,
    Clock,
    Play,
    Timer,
    Scale
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";

interface Program {
    title: string;
    level: string;
    duration: string;
    img: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
}

export default function MasterFitness(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.fitness");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#bef264" } = settings;

    // AI Blueprint Extraction
    const programsSection = blueprint?.layout?.find((s) => s.type === 'features');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const programsRaw = (programsSection?.content?.items as any[]) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const programs: Program[] = programsRaw.length > 0 ? programsRaw.map((item: any) => ({
        title: item.title,
        level: item.description?.substring(0, 50) || t("advanced"),
        duration: `12 ${t("weeks")}`,
        img: item.image || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
        icon: Dumbbell
    })) : [
        { title: t("sovereign_hypertrophy"), level: t("advanced"), duration: `12 ${t("weeks")}`, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", icon: Dumbbell },
        { title: t("kinetic_fat_loss"), level: t("beginner"), duration: `8 ${t("weeks")}`, img: "https://images.unsplash.com/photo-1541534741688-611c501f21ee?q=80&w=2070&auto=format&fit=crop", icon: Flame },
        { title: t("neural_athleticism"), level: t("elite"), duration: `6 ${t("months")}`, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop", icon: Zap }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#050505] text-white min-h-screen selection:bg-lime-400 selection:text-black font-sans overflow-x-hidden">
                    {/* FITNESS NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5">
                        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-lime-400 rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform">
                                    <Activity className="text-black w-6 h-6 -rotate-45" />
                                </div>
                                <span className="text-xl font-black tracking-tighter uppercase italic">{blueprint?.name || t("kinetic_lab")}</span>
                            </div>
                            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                <span className="hover:text-lime-400 cursor-pointer transition-colors">{t("programs")}</span>
                                <span className="hover:text-lime-400 cursor-pointer transition-colors">{t("intelligence")}</span>
                                <span className="hover:text-lime-400 cursor-pointer transition-colors">{t("community")}</span>
                                <button
                                    onClick={() => onOpen("Join")}
                                    className="px-8 py-3 bg-white text-black rounded-sm hover:bg-lime-400 transition-colors"
                                >
                                    {t("start_now")}
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO HIGH-INTENSITY */}
                    <section className="relative min-h-screen flex items-center justify-center pt-20">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                                alt="Fitness"
                                fill
                                className="object-cover opacity-30 grayscale"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black" />
                        </div>

                        <div className="relative z-10 container mx-auto px-6 text-center space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-1 border border-lime-400/30 bg-lime-400/10 rounded-full mb-10">
                                    <Zap className="w-3 h-3 text-lime-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-lime-400">{t("peak_performance")}</span>
                                </div>
                                <h1 className="text-[12vw] font-black uppercase tracking-tightest leading-[0.8] mb-12 italic">
                                    {headline.split(' ')[0]} <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">{headline.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
                                    {subheadline}
                                </p>
                            </motion.div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button className="h-20 px-14 bg-lime-400 text-black font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-transform flex items-center gap-3">
                                    {t("initiate_training")} <ChevronRight className="w-5 h-5" />
                                </button>
                                <button className="h-20 px-14 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/5 transition-colors flex items-center gap-3">
                                    <Play className="w-4 h-4" /> {t("watch_manifesto")}
                                </button>
                            </div>
                        </div>

                        {/* STATS OVERLAY */}
                        <div className="absolute bottom-10 left-0 w-full px-12 hidden lg:flex items-center justify-between border-t border-white/5 pt-10">
                            {[
                                { label: t("performance_index"), val: "9.8/10" },
                                { label: t("client_retention"), val: "94%" },
                                { label: t("fat_optimization"), val: t("verified") }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">{stat.label}</p>
                                    <p className="text-xl font-black italic">{stat.val}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* DYNAMIC PROGRAMS */}
                    <section className="py-40 px-6 container mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                            <div>
                                <h2 className="text-6xl font-black uppercase tracking-tighter italic">{t("training_protocols")}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-lime-400 mt-6">{t("biological_transformations")}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {programs.map((prog, i) => (
                                <motion.div
                                    key={i}
                                    className="group relative h-[600px] rounded-[40px] overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Image
                                        src={prog.img}
                                        alt={prog.title}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                    <div className="absolute inset-x-10 bottom-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-lime-400 rounded-lg flex items-center justify-center text-black">
                                                <prog.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest py-1 px-3 bg-black/80 rounded-full">{prog.level}</span>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tight italic leading-none">{prog.title}</h3>
                                        <div className="flex items-center gap-6 pt-4 text-xs font-bold text-zinc-400">
                                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {prog.duration}</span>
                                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 500+ {t("active")}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* LOGIC MATRICES */}
                    <section className="py-24 bg-zinc-900 overflow-hidden">
                        <div className="flex whitespace-nowrap overflow-hidden gap-20">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-20 animate-marquee items-center">
                                    <span className="text-8xl font-black uppercase tracking-tighter italic opacity-10">{t("neural_muscle")}</span>
                                    <span className="w-4 h-4 rounded-full bg-lime-400" />
                                    <span className="text-8xl font-black uppercase tracking-tighter italic opacity-10">{t("sovereign_athleticism")}</span>
                                    <span className="w-4 h-4 rounded-full bg-lime-400" />
                                    <span className="text-8xl font-black uppercase tracking-tighter italic opacity-10">{t("bio_optimization")}</span>
                                    <span className="w-4 h-4 rounded-full bg-lime-400" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PERFORMANCE FOOTER */}
                    <footer className="py-40 px-10 flex flex-col items-center gap-16 border-t border-white/5 bg-black">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-20 w-full max-w-6xl mx-auto">
                            {[
                                { icon: Timer, label: t("live_tracking") },
                                { icon: Scale, label: t("bio_metrics") },
                                { icon: Trophy, label: t("empire_lead") },
                                { icon: Activity, label: t("logic_sync") }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 group">
                                    <item.icon className="w-8 h-8 text-zinc-800 group-hover:text-lime-400 transition-colors" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="text-center space-y-6">
                            <span className="text-3xl font-black tracking-tighter uppercase italic">{blueprint?.name}</span>
                            <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-800">{t("performance_terminal")}</p>
                        </div>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
