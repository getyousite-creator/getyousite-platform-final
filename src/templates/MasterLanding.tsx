"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Zap,
    Shield,
    CheckCircle2,
    ArrowRight,
    Play,
    Star,
    ArrowUpRight,
    MousePointer2,
    Lock,
    Globe,
    Cpu,
    Target
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";

export default function MasterLanding(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.landing");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#2563eb" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === 'hero');
    const featuresSection = blueprint?.layout?.find((s) => s.type === 'features');

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSub = (heroSection?.content?.subheadline as string) || subheadline;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pillarsRaw = (featuresSection?.content?.items as any[]) || [];
    const pillars = pillarsRaw.length > 0 ? pillarsRaw.slice(0, 3).map(item => ({
        icon: Zap, // Default icon since we can't easily map string to Icon component without a map
        title: item.title,
        desc: item.description
    })) : [
        { icon: Zap, title: t("neural_latency"), desc: t("neural_latency_desc") },
        { icon: Cpu, title: t("logic_synthesis"), desc: t("logic_synthesis_desc") },
        { icon: Globe, title: t("sovereign_scale"), desc: t("sovereign_scale_desc") }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-white text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
                    {/* LANDING NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 shadow-lg shadow-slate-900/10">
                                    <Target className="text-white w-5 h-5" />
                                </div>
                                <span className="text-lg font-black tracking-tighter uppercase">{blueprint?.name || t("protocol")}</span>
                            </div>
                            <div className="hidden lg:flex items-center gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span className="hover:text-slate-900 cursor-pointer">{t("features")}</span>
                                <span className="hover:text-slate-900 cursor-pointer">{t("security")}</span>
                                <span className="hover:text-slate-900 cursor-pointer">{t("pricing")}</span>
                                <button
                                    onClick={() => onOpen("Primary CTA")}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-full hover:scale-105 transition-transform"
                                >
                                    {t("get_access")}
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO CONVERSION ENGINE */}
                    <section className="pt-40 pb-24 px-6 relative">
                        <div
                            className="absolute -top-[20%] right-0 w-[800px] h-[800px] blur-[150px] rounded-full opacity-10 pointer-events-none"
                            style={{ backgroundColor: primaryColor }}
                        />

                        <div className="container mx-auto text-center max-w-5xl space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="space-y-8"
                            >
                                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-slate-100 bg-slate-50 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">{t("network_stable")}</span>
                                </div>
                                <h1 className="text-[14vw] lg:text-[10vw] font-black uppercase tracking-tighter leading-[0.82] text-slate-900">
                                    {heroHeadline.split(' ')[0]} <br />
                                    <span style={{ color: primaryColor }}>{heroHeadline.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <p className="text-xl lg:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                                    {heroSub}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                            >
                                <button
                                    onClick={() => onOpen("Main Hero CTA")}
                                    className="w-full sm:w-auto h-20 px-12 rounded-3xl text-white font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {t("start_trial")} <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="w-full sm:w-auto h-20 px-12 rounded-3xl border border-slate-200 bg-white font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                                    <Play className="w-4 h-4 fill-slate-900" /> {t("watch_demo")}
                                </button>
                            </motion.div>
                        </div>

                        {/* PRODUCT DASHBOARD MOCKUP */}
                        <div className="container mx-auto mt-24">
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 1.2 }}
                                className="relative aspect-[16/9] lg:aspect-[21/9] rounded-[40px] lg:rounded-[60px] bg-slate-900 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                    alt="Platform"
                                    fill
                                    className="object-cover opacity-60"
                                />
                                <div className="absolute inset-x-12 bottom-12 flex items-center justify-between">
                                    <div className="flex gap-4">
                                        {[1, 2, 3].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10" />)}
                                    </div>
                                    <div className="h-12 px-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                                        <Lock className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase text-white tracking-widest">{t("encrypted")}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* PILLARS OF PERFORMANCE */}
                    <section className="py-40 bg-slate-50">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {pillars.map((pill, i) => (
                                    <div key={i} className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
                                        <div
                                            className="w-16 h-16 rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${primaryColor}10` }}
                                        >
                                            <pill.icon className="w-8 h-8" style={{ color: primaryColor }} />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tightest mb-4 italic leading-none">{pill.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed uppercase text-xs tracking-widest">{pill.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CLOSING CONVERSION */}
                    <section className="py-40 px-6">
                        <div
                            className="container mx-auto rounded-[60px] p-20 lg:p-40 text-center text-white space-y-12 relative overflow-hidden"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-slate-900/10 backdrop-blur-[2px]" />
                            <h2 className="text-5xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none relative z-10 whitespace-pre-line">
                                {t("ready_to_command")}
                            </h2>
                            <p className="text-xl opacity-80 max-w-2xl mx-auto relative z-10">
                                {t("join_architects")}
                            </p>
                            <button
                                onClick={() => onOpen("Final Conversion")}
                                className="h-20 px-16 bg-white text-slate-950 rounded-3xl font-black text-xs uppercase tracking-[0.4em] hover:scale-105 transition-transform shadow-3xl relative z-10"
                            >
                                {t("deploy_now")}
                            </button>
                        </div>
                    </section>

                    {/* MINIMAL FOOTER */}
                    <footer className="py-20 border-t border-slate-100 flex flex-col items-center gap-10">
                        <span className="text-2xl font-black tracking-widest uppercase italic">{blueprint?.name}</span>
                        <div className="flex gap-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{t("privacy")}</span>
                            <span>{t("security")}</span>
                            <span>{t("infrastructure_footer")}</span>
                            <span>{t("legal")}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.5em] mt-8">{t("system_verified")}</p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
