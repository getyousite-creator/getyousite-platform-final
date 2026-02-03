"use client";

import { motion } from "framer-motion";
import { Building2, Users2, Briefcase, Factory, ShieldCheck, Globe, LucideIcon } from "lucide-react";
import Image from "next/image";

import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

interface SierraIndustrialProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
    };
}

export default function SierraIndustrial({ settings }: SierraIndustrialProps) {
    const { primaryColor, headline, subheadline, fontFamily } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            animate={{ opacity: [0.9, 1] }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-screen bg-white text-zinc-950 selection:bg-zinc-950 selection:text-white"
            style={{ fontFamily }}
        >
            {/* Header */}
            <nav className="px-12 py-8 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => onOpen("Sierra")}>
                    <Factory className="w-8 h-8" style={{ color: primaryColor }} />
                    SIERRA IND.
                </div>
                <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                    <span className="hover:text-black cursor-pointer">Infrastructure</span>
                    <span className="hover:text-black cursor-pointer">Logistics</span>
                    <span className="hover:text-black cursor-pointer">Sustainability</span>
                    <button
                        onClick={() => onOpen("Sierra Request")}
                        className="px-6 py-3 bg-zinc-950 text-white rounded-none hover:bg-zinc-800 transition-colors"
                    >
                        Request Quote
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-[1600px] mx-auto">
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-20 h-1 mb-8"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tightest mb-10"
                    >
                        {headline}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-500 max-w-2xl leading-relaxed mb-12"
                    >
                        {subheadline}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-8"
                    >
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onOpen("Security Specs")}>
                            <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">ISO 9001 Certified</div>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onOpen("Operations")}>
                            <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Global Operations</div>
                        </div>
                    </motion.div>
                </div>
                <div
                    onClick={() => onOpen("Sierra Visuals")}
                    className="lg:col-span-5 relative aspect-[3/4] bg-zinc-100 overflow-hidden group cursor-pointer"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2340"
                        alt="Corporate Tower"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
            </section>

            {/* Grid Content */}
            <section className="bg-zinc-50 py-32 px-12">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-1px bg-zinc-200 border border-zinc-200">
                    <ServiceBlock title="Deep Logistics" desc="Advanced supply chain optimization for hyper-scale operations." icon={Building2} />
                    <ServiceBlock title="Force Multiplier" desc="Strategic consulting for industrial market penetration." icon={Users2} />
                    <ServiceBlock title="Core Assets" desc="High-yield infrastructure development and management." icon={Briefcase} />
                </div>
            </section>
        </motion.div>
    );
}

interface ServiceBlockProps {
    title: string;
    desc: string;
    icon: LucideIcon;
}

function ServiceBlock({ title, desc, icon: Icon }: ServiceBlockProps) {
    return (
        <div className="bg-white p-12 hover:bg-zinc-50 transition-colors">
            <Icon className="w-8 h-8 mb-8 text-zinc-400" />
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
