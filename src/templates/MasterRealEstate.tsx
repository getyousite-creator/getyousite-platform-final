"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Home,
    MapPin,
    BedDouble,
    Bath,
    Maximize,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    Map,
    Key,
    Building2,
    Calendar,
    Phone,
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";

interface Property {
    title: string;
    location: string;
    price: string;
    img: string;
    beds: number;
    baths: number;
    sqft: string;
}

export default function MasterRealEstate(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.realestate");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#0f172a" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === "hero");
    const propertySection = blueprint?.layout?.find((s) => s.type === "features");

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSub = (heroSection?.content?.subheadline as string) || subheadline;
    const heroImg =
        (heroSection?.content?.image as string) ||
        "https://images.unsplash.com/photo-1600585154340-be6161a25a5c?q=80&w=2070&auto=format&fit=crop";

    // Dynamic Property Injection
    const properties = (propertySection?.content?.properties as Property[]) || [
        {
            title: propertySection?.content?.items?.[0]?.title || t("prop_heights"),
            location: propertySection?.content?.items?.[0]?.description || t("prop_skyline"),
            price: "$4.5M",
            img:
                propertySection?.content?.items?.[0]?.image ||
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
            beds: 5,
            baths: 4,
            sqft: "4,500",
        },
        {
            title: propertySection?.content?.items?.[1]?.title || t("prop_obsidian"),
            location: propertySection?.content?.items?.[1]?.description || t("prop_urban"),
            price: "$1.2M",
            img:
                propertySection?.content?.items?.[1]?.image ||
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
            beds: 2,
            baths: 2,
            sqft: "1,800",
        },
        {
            title: propertySection?.content?.items?.[2]?.title || t("prop_azure"),
            location: propertySection?.content?.items?.[2]?.description || t("prop_coastal"),
            price: "$8.9M",
            img:
                propertySection?.content?.items?.[2]?.image ||
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1984&auto=format&fit=crop",
            beds: 6,
            baths: 7,
            sqft: "8,200",
        },
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#f8fafc] text-slate-900 min-h-screen selection:bg-slate-900 selection:text-white font-sans">
                    {/* ESTATE NAVIGATION */}
                    <nav className="h-24 px-8 lg:px-20 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-2xl z-[100] border-b border-slate-100">
                        <div className="flex items-center gap-12">
                            <span className="text-2xl font-black tracking-tighter uppercase">
                                {blueprint?.name || t("estate_hub")}
                            </span>
                            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                <span className="hover:text-slate-900 cursor-pointer">
                                    {t("inventory")}
                                </span>
                                <span className="hover:text-slate-900 cursor-pointer">
                                    {t("neighborhoods")}
                                </span>
                                <span className="hover:text-slate-900 cursor-pointer">
                                    {t("sovereign_mgmt")}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onOpen("Consultation")}
                                className="h-14 px-8 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                {t("contact_agent")}
                            </button>
                        </div>
                    </nav>

                    {/* HERO ESTATE SHOWCASE */}
                    <section className="px-6 py-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto h-[80vh]">
                        <div className="lg:col-span-9 relative rounded-[48px] overflow-hidden group shadow-2xl">
                            <Image
                                src={heroImg}
                                alt="Property"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            <div className="absolute inset-x-12 bottom-12">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">
                                        {t("new_acquisition")}
                                    </span>
                                </div>
                                <h1 className="text-white text-6xl md:text-[8vw] font-black uppercase tracking-tightest leading-[0.82] mb-10 drop-shadow-2xl italic">
                                    {heroHeadline}
                                </h1>
                                <div className="flex gap-4">
                                    <button className="h-16 px-12 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-transform">
                                        {t("explore")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-3 bg-white rounded-[48px] p-10 border border-slate-200 flex flex-col justify-between shadow-sm">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <Map className="w-5 h-5" /> {t("area_search")}
                                </div>
                                <h2 className="text-4xl font-black tracking-tight leading-none uppercase italic">
                                    {t("market_intelligence").split(' ').slice(0, 1).join(' ')} <br /> {t("market_intelligence").split(' ').slice(1).join(' ')}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {heroSub}
                                </p>
                            </div>

                            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-slate-400">
                                        {t("total_asset_value")}
                                    </span>
                                    <span className="text-xl font-bold font-mono text-emerald-600">
                                        $450M+
                                    </span>
                                </div>
                                <div className="h-[1px] bg-slate-200" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {t("growth")}
                                        </p>
                                        <p className="text-lg font-bold">12.4%</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {t("portfolio")}
                                        </p>
                                        <p className="text-lg font-bold">18 {t("assets")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ASSET INVENTORY */}
                    <section className="py-40">
                        <div className="px-6 lg:px-12">
                            <div className="flex items-end justify-between mb-24 gap-4">
                                <div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter italic">
                                        {t("asset_silos")}
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">
                                        {t("verified_intelligence")}
                                    </p>
                                </div>
                                <button className="h-16 px-10 border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-4 hover:border-slate-900 transition-colors">
                                    <Filter className="w-4 h-4" /> {t("filter")}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {properties.map((prop, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={prop.img}
                                                alt={prop.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute top-6 left-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {t("exclusive")}
                                            </div>
                                            <div className="absolute bottom-6 right-6 px-6 py-3 bg-slate-900 text-white text-lg font-bold italic shadow-2xl">
                                                {prop.price}
                                            </div>
                                        </div>
                                        <div className="p-10 space-y-8">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tight italic mb-2">
                                                    {prop.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                                    <MapPin className="w-4 h-4" /> {prop.location}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-50">
                                                <div className="flex flex-col gap-1">
                                                    <BedDouble className="w-5 h-5 text-slate-300" />
                                                    <span className="text-xs font-bold">
                                                        {prop.beds} {t("beds")}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Bath className="w-5 h-5 text-slate-300" />
                                                    <span className="text-xs font-bold">
                                                        {prop.baths} {t("baths")}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <Maximize className="w-5 h-5 text-slate-300" />
                                                    <span className="text-xs font-bold">
                                                        {prop.sqft} {t("sqft")}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-slate-950 group-hover:text-white transition-all flex items-center justify-center gap-4">
                                                {t("view_spec")} <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ESTATE FOOTER */}
                    <footer className="py-24 bg-slate-900 text-white rounded-t-[60px] lg:rounded-t-[80px]">
                        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-20">
                            <div className="col-span-2 space-y-8">
                                <span className="text-4xl font-black tracking-tighter uppercase italic">
                                    {blueprint?.name}
                                </span>
                                <p className="text-slate-400 text-lg max-w-sm leading-relaxed font-medium">
                                    {t("footer_desc")}
                                </p>
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                        <Key className="w-6 h-6" />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                                    {t("navigation")}
                                </h4>
                                <div className="flex flex-col gap-4 text-xs font-bold">
                                    <span className="hover:text-white transition-colors cursor-pointer">
                                        {t("portfolio")}
                                    </span>
                                    <span className="hover:text-white transition-colors cursor-pointer">
                                        {t("intelligence")}
                                    </span>
                                    <span className="hover:text-white transition-colors cursor-pointer">
                                        {t("network")}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                                    {t("emergency")}
                                </h4>
                                <div className="flex items-center gap-4 text-xs font-black italic">
                                    <Phone className="w-5 h-5 text-emerald-400" /> +212 5XX XX XX
                                </div>
                                <div className="flex items-center gap-4 text-xs font-black italic">
                                    <Calendar className="w-5 h-5 text-emerald-400" /> {t("working_days")}
                                </div>
                            </div>
                        </div>
                        <div className="mt-40 border-t border-white/5 py-10 text-center">
                            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-slate-600">
                                {t("copyright")}
                            </p>
                        </div>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
