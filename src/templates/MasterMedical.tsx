"use client";

import { motion } from "framer-motion";
import {
    Stethoscope,
    ShieldCheck,
    Clock,
    Users2,
    Phone,
    ChevronRight,
    CheckCircle2,
    Star,
    LucideIcon,
    HeartPulse,
} from "lucide-react";
import SovereignWrapper from "./SovereignWrapper";
import type { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Section } from "@/lib/schemas";

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    desc: string;
    primaryColor: string;
}

function ServiceCard({ icon: Icon, title, desc, primaryColor }: ServiceCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div
                className="absolute top-0 right-0 w-20 h-20 rounded-bl-full -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: `${primaryColor}10` }}
            />
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10"
                style={{ backgroundColor: `${primaryColor}15` }}
            >
                <Icon className="w-7 h-7" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                {title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed rtl:text-right">{desc}</p>
        </div>
    );
}

export default function MasterMedical(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.medical");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#0ea5e9" } = settings;

    // Modular Extraction from Blueprint
    const heroSection = blueprint?.layout?.find((s) => s.type === "hero");
    const featuresSection = blueprint?.layout?.find((s) => s.type === "features");

    // Niche Detection Logic
    const isDental =
        blueprint?.name?.toLowerCase().includes("dental") ||
        blueprint?.description?.toLowerCase().includes("dental");
    const NickName = isDental ? "Dental" : "Medical";
    const MainIcon = isDental ? Stethoscope : HeartPulse;

    const DEFAULT_IMAGES = [
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
    ];

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-slate-50 min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900">
                    {/* MASTER NAVIGATION */}
                    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/50">
                        <div className="container mx-auto px-6 h-20 flex items-center justify-between rtl:flex-row-reverse">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                                    }}
                                >
                                    <MainIcon className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tight uppercase">
                                    {blueprint?.name?.split(" ")[0] || t("professional")}{" "}
                                    <span style={{ color: primaryColor }}>
                                        {blueprint?.name?.split(" ")[1] || NickName}
                                    </span>
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest rtl:flex-row-reverse">
                                <a href="#services" className="hover:opacity-70 transition-opacity">
                                    {t('services')}
                                </a>
                                <a href="#about" className="hover:opacity-70 transition-opacity">
                                    {t('experience')}
                                </a>
                                <button
                                    className="px-8 py-3 text-white rounded-full transition-all active:scale-95 duration-300 shadow-lg"
                                    style={{ backgroundColor: "#1a1a1a" }}
                                >
                                    {t('book')}
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* HERO SECTION */}
                    <section className="pt-40 pb-20 px-6 relative overflow-hidden">
                        <div
                            className="absolute top-20 right-0 w-[500px] h-[500px] blur-[120px] rounded-full mix-blend-multiply pointer-events-none opacity-20"
                            style={{ backgroundColor: primaryColor }}
                        />
                        <div
                            className="absolute bottom-0 left-0 w-[500px] h-[500px] blur-[120px] rounded-full mix-blend-multiply pointer-events-none opacity-10"
                            style={{ backgroundColor: "#2563eb" }}
                        />

                        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center rtl:flex-row-reverse">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="relative z-10 rtl:text-right"
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm mb-8 rtl:flex-row-reverse">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                        {t('certified')}
                                    </span>
                                </div>

                                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-8 uppercase tracking-tighter">
                                    {heroSection?.content?.headline || headline}
                                </h1>

                                <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed font-medium rtl:ml-auto">
                                    {heroSection?.content?.subheadline || subheadline}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 rtl:flex-row-reverse">
                                    <button
                                        className="h-16 px-10 text-white rounded-2xl font-bold text-sm uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 group rtl:flex-row-reverse"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {t('consultation')}
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                    </button>
                                    <div className="flex items-center gap-4 px-6 border border-white bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm rtl:flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div className="rtl:text-right">
                                            <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                                                {t('emergency')}
                                            </div>
                                            <div className="text-sm font-bold text-slate-900 font-mono">
                                                +212 5XX XX XX XX
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                                    <Image
                                        src={heroSection?.content?.image || DEFAULT_IMAGES[0]}
                                        alt={heroSection?.content?.alt || "Clinical Environment"}
                                        fill
                                        className="object-cover scale-105 hover:scale-110 transition-transform duration-1000"
                                        priority
                                    />
                                    <div
                                        className="absolute inset-0 opacity-20 mix-blend-overlay"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* SERVICES PANEL */}
                    <section id="services" className="py-32 bg-white relative">
                        <div className="container mx-auto px-6">
                            <div className="text-center mb-20 space-y-4">
                                <span
                                    className="font-black uppercase tracking-[0.2em] text-xs"
                                    style={{ color: primaryColor }}
                                >
                                    {blueprint?.name} {t('capabilities')}
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                                    {t('specialist_services').split(' ').slice(0, 2).join(' ')}{" "}
                                    <span
                                        className="underline decoration-4 underline-offset-8"
                                        style={{ textDecorationColor: `${primaryColor}40` }}
                                    >
                                        {t('specialist_services').split(' ').slice(2).join(' ')}
                                    </span>
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 rtl:flex-row-reverse">
                                {featuresSection?.content?.items &&
                                    featuresSection.content.items.length > 0 ? (
                                    featuresSection.content.items.map(
                                        (
                                            feature: { title: string; description: string },
                                            idx: number,
                                        ) => (
                                            <ServiceCard
                                                key={idx}
                                                icon={
                                                    idx === 0
                                                        ? Users2
                                                        : idx === 1
                                                            ? ShieldCheck
                                                            : Clock
                                                }
                                                title={feature.title}
                                                desc={feature.description}
                                                primaryColor={primaryColor}
                                            />
                                        ),
                                    )
                                ) : (
                                    <>
                                        <ServiceCard
                                            icon={Users2}
                                            title={t("patient_portals")}
                                            desc={t("patient_portals_desc")}
                                            primaryColor={primaryColor}
                                        />
                                        <ServiceCard
                                            icon={ShieldCheck}
                                            title={t("secure_treatment")}
                                            desc={t("secure_treatment_desc")}
                                            primaryColor={primaryColor}
                                        />
                                        <ServiceCard
                                            icon={Clock}
                                            title={t("response_247")}
                                            desc={t("response_247_desc")}
                                            primaryColor={primaryColor}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* CTA BLOCK */}
                    <section className="py-20 px-6">
                        <div className="container mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                                <div
                                    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px]"
                                    style={{ backgroundColor: primaryColor }}
                                />
                            </div>

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                    {t('initiate_success').split(' ').slice(0, 2).join(' ')} <br />
                                    <span style={{ color: primaryColor }}>{t('initiate_success').split(' ').slice(2).join(' ')}</span>
                                </h2>
                                <p className="text-slate-400 text-lg md:text-xl font-medium">
                                    {t('join_patients')}
                                </p>
                                <button className="h-16 px-12 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3 mx-auto">
                                    {t('book_now')} <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="py-12 text-center border-t border-slate-100 bg-white">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div
                                className="w-6 h-6 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <MainIcon className="text-white w-4 h-4" />
                            </div>
                            <span className="font-black text-slate-900 uppercase tracking-tight">
                                {blueprint?.name}
                            </span>
                        </div>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest">
                            {t("copyright")}
                        </p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
