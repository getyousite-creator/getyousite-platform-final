"use client";

import { motion } from "framer-motion";
import { Scale, ShieldCheck, Gavel, FileText, Users, MapPin, LucideIcon } from "lucide-react";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

interface LawSiloProps {
    settings: {
        primaryColor: string;
        secondaryColor: string;
        headline: string;
        subheadline: string;
        accentColor: string;
        fontFamily: string;
    };
}

export default function LawSilo({ settings }: LawSiloProps) {
    const { primaryColor, headline, subheadline, fontFamily } = settings;
    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <motion.div
            key={updatePulse}
            animate={{ opacity: [0.95, 1], y: [5, 0] }}
            className="w-full min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white"
            style={{ fontFamily }}
        >
            {/* Legal Header */}
            <nav className="px-12 py-10 flex items-center justify-between border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3 text-2xl font-serif font-black tracking-tighter cursor-pointer" onClick={() => onOpen("LawSilo Home")}>
                    <Scale className="w-8 h-8" style={{ color: primaryColor }} />
                    LAWSILO
                </div>
                <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500">
                    <span className="hover:text-stone-950 cursor-pointer">Practices</span>
                    <span className="hover:text-stone-950 cursor-pointer">Attorneys</span>
                    <span className="hover:text-stone-950 cursor-pointer">Insights</span>
                    <button
                        onClick={() => onOpen("Legal Consultation")}
                        className="px-8 py-4 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                    >
                        Consultation
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section className="px-12 py-32 grid grid-cols-1 lg:grid-cols-12 gap-20 max-w-[1600px] mx-auto items-center">
                <div className="lg:col-span-7">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] w-12 bg-stone-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Established Excellence</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-7xl md:text-9xl font-serif leading-[0.9] mb-12"
                    >
                        {headline}
                    </motion.h1>
                    <p className="text-xl text-stone-500 max-w-2xl leading-relaxed mb-16 font-light">
                        {subheadline}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                        <Stat icon={ShieldCheck} label="Proven Defense" />
                        <Stat icon={Gavel} label="Market Authority" />
                    </div>
                    <button
                        onClick={() => onOpen("Defense Strategy")}
                        className="px-12 py-6 text-white text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Request Case Review
                    </button>
                </div>
                <div className="lg:col-span-5 relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
                    <Image
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2430"
                        alt="Law Office"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-stone-900/80 to-transparent" />
                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="text-2xl font-serif mb-2 italic">Integrity First.</div>
                        <div className="text-[9px] uppercase tracking-widest opacity-60">Architectural Legal Design</div>
                    </div>
                </div>
            </section>

            {/* Practice Areas */}
            <section className="bg-stone-900 py-32 px-12 text-white">
                <div className="max-w-[1600px] mx-auto">
                    <h2 className="text-4xl font-serif mb-20 text-center">Core Disciplines</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <PracticeBlock icon={FileText} title="Corporate Law" desc="Navigating complex regulatory frameworks for global entities." />
                        <PracticeBlock icon={Users} title="Litigation" desc="Aggressive representation in high-stakes dispute resolution." />
                        <PracticeBlock icon={MapPin} title="Real Estate" desc="Strategic advisory for massive infrastructure developments." />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}

interface StatProps {
    icon: LucideIcon;
    label: string;
}

function Stat({ icon: Icon, label }: StatProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center text-stone-500">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-600">{label}</span>
        </div>
    );
}

interface PracticeBlockProps {
    icon: LucideIcon;
    title: string;
    desc: string;
}

function PracticeBlock({ icon: Icon, title, desc }: PracticeBlockProps) {
    return (
        <div className="p-12 border border-stone-800 hover:border-stone-600 transition-colors group cursor-pointer">
            <Icon className="w-8 h-8 mb-8 text-stone-400 group-hover:text-white transition-colors" />
            <h3 className="text-2xl font-serif mb-4">{title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}
