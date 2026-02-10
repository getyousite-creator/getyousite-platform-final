"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Globe, CheckCircle2 } from "lucide-react";
import SovereignWrapper from "./SovereignWrapper";
import { SovereignTemplateProps } from "@/lib/types/template";
import type { Section } from "@/lib/schemas";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MasterProfessional(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.professional");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#3b82f6" } = settings;

    // Modular Data Extraction
    const heroSection = blueprint?.layout?.find((s: Section) => s.type === "hero");
    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSubheadline = (heroSection?.content?.subheadline as string) || subheadline;
    const heroImage =
        (heroSection?.content?.image as string) ||
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2432";

    const featuresSection = blueprint?.layout?.find((s: Section) => s.type === "features");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (featuresSection?.content?.items as unknown as {
        title: string;
        icon: any;
        description: string;
        value?: string;
        label?: string;
    }[]) || [
            {
                title: t("strategic_security"),
                icon: Shield,
                description: t("strategic_security_desc"),
            },
            {
                title: t("edge_delivery"),
                icon: Zap,
                description: t("edge_delivery_desc"),
            },
            {
                title: t("global_expansion"),
                icon: Globe,
                description: t("global_expansion_desc"),
            },
        ];

    return (
        <SovereignWrapper {...props}>
            {({ onOpen }) => (
                <div className="w-full min-h-screen bg-zinc-950 text-white selection:bg-white/10 overflow-x-hidden relative font-sans">
                    {/* PROFESSIONAL NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
                        <div className="container mx-auto px-8 h-20 flex items-center justify-between rtl:flex-row-reverse">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-2xl"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <Sparkles className="text-white w-4 h-4" />
                                </div>
                                <span className="text-lg font-black tracking-widest uppercase">
                                    {blueprint?.name || t("professional")}
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 rtl:flex-row-reverse">
                                <a
                                    href="#capabilities"
                                    className="hover:text-white transition-colors"
                                >
                                    {t('capabilities')}
                                </a>
                                <a
                                    href="#infrastructure"
                                    className="hover:text-white transition-colors"
                                >
                                    {t('infrastructure')}
                                </a>
                                <button
                                    onClick={() => onOpen("Consultation")}
                                    className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white font-black"
                                >
                                    {t('get_started')}
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO SECTION */}
                    <section className="relative z-10 pt-48 pb-32 px-8">
                        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center rtl:flex-row-reverse">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="relative z-20 rtl:text-right"
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 rtl:flex-row-reverse">
                                    <div
                                        className="w-2 h-2 rounded-full animate-pulse"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        {t('active_status')}
                                    </span>
                                </div>

                                <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-8 tracking-tighter uppercase whitespace-pre-line">
                                    {heroHeadline}
                                </h1>

                                <p className="text-xl text-zinc-500 mb-12 max-w-xl leading-relaxed font-medium">
                                    {heroSubheadline}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 rtl:flex-row-reverse">
                                    <button
                                        onClick={() => onOpen("Start Project")}
                                        className="h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-widest text-zinc-950 flex items-center gap-3 transition-all hover:scale-105 shadow-2xl shadow-blue-500/20"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {t('start_project')} <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <div className="flex items-center gap-4 px-6 border border-white/5 bg-white/5 rounded-2xl backdrop-blur-xl">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            {t('efficiency_index')}: 99.4%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2 }}
                                className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10 shadow-3xl group"
                            >
                                <Image
                                    src={heroImage}
                                    alt="Professional Architecture"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-x-10 bottom-10 p-10 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] z-10 transition-transform group-hover:-translate-y-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                            {t('live_network')}
                                        </span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className="w-1 h-3 bg-blue-500/30 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-lg font-black uppercase tracking-tightest">
                                        {t('node_active')}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* INFRASTRUCTURE STATS */}
                    <section className="py-24 border-y border-white/5 bg-zinc-900/40">
                        <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                            {(features.length > 0
                                ? features.slice(0, 4)
                                : [
                                    { icon: Shield, value: "100%", label: "Security" },
                                    { icon: Zap, value: "42ms", label: "Latency" },
                                    { icon: Globe, value: "Node-G", label: "Scale" },
                                    { icon: BarChart3, value: "12X", label: "Efficiency" },
                                ]
                            ).map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 mx-auto mb-6 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <div style={{ color: primaryColor }}>
                                            {/* Logic to fallback icon if not present in dynamic data */}
                                            {stat.icon ? (
                                                <stat.icon className="w-6 h-6" />
                                            ) : (
                                                <Shield className="w-6 h-6" />
                                            )}
                                        </div>
                                    </div>
                                    {/* Handle dynamic content mapping flexibility */}
                                    <div className="text-3xl font-black mb-1">
                                        {stat.value || "99.9%"}
                                    </div>
                                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                                        {stat.label || (stat as any).title || "Metric"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CAPABILITIES GRID */}
                    <section id="capabilities" className="py-32 bg-zinc-950">
                        <div className="container mx-auto px-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                                <div className="max-w-xl">
                                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 italic leading-none">
                                        {t('strategic_capabilities')}.
                                    </h2>
                                    <p className="text-zinc-500 font-medium leading-relaxed uppercase text-xs tracking-widest">
                                        {t('dominance')}
                                    </p>
                                </div>
                                <div className="h-[1px] flex-1 bg-white/5 hidden md:block mb-6 mx-10" />
                                <span className="text-[10px] font-bold text-zinc-600 uppercase font-mono tracking-widest">
                                    {t("ref_code")}
                                </span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {features.map((feature, i) => (
                                    <div
                                        key={i}
                                        className="p-10 bg-white/5 border border-white/5 rounded-[40px] hover:bg-white/[0.08] transition-all group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 transition-transform">
                                            {feature.icon ? (
                                                <feature.icon
                                                    className="w-7 h-7"
                                                    style={{ color: primaryColor }}
                                                />
                                            ) : (
                                                <Sparkles
                                                    className="w-7 h-7"
                                                    style={{ color: primaryColor }}
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tightest mb-4 group-hover:translate-x-1 transition-transform">
                                            {feature.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                            {feature.description}
                                        </p>

                                        {/* Hover Decor */}
                                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CALL TO ACTION */}
                    <section className="py-20 px-8">
                        <div className="container mx-auto bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[60px] border border-white/5 p-16 md:p-32 relative overflow-hidden text-center group">
                            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[200px]" />
                            </div>

                            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                                    {t('secure_asset').split(' ').slice(0, 2).join(' ')} <br />
                                    <span style={{ color: primaryColor }}>{t('secure_asset').split(' ').slice(2).join(' ')}</span>
                                </h2>
                                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                                    {t('elite_network')}
                                </p>
                                <button
                                    onClick={() => onOpen("Deploy")}
                                    className="h-20 px-16 bg-white text-zinc-950 rounded-[30px] font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-3xl mx-auto flex items-center justify-center gap-4"
                                >
                                    {t('deploy_now')} <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="py-20 px-10 border-t border-white/5 bg-zinc-950 flex flex-col items-center gap-10">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-zinc-500" />
                            </div>
                            <span className="text-lg font-black tracking-widest uppercase text-white">
                                {blueprint?.name}
                            </span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
                            <span>{t('security')}</span>
                            <span>{t('infrastructure')}</span>
                            <span>{t('network')}</span>
                            <span>{t('legal')}</span>
                            <span>{t('dossier')}</span>
                        </div>
                        <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-[0.5em] mt-10">
                            {t("copyright")}
                        </p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
