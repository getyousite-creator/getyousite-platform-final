"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    FileText,
    TrendingUp,
    MessageCircle,
    Share2,
    Calendar,
    Clock,
    Search,
    Menu,
    ChevronRight,
    ArrowUpRight,
    Sparkles,
    Bookmark
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTranslations } from "next-intl";

interface Article {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    img: string;
    category: string;
}

export default function MasterPublic(props: SovereignTemplateProps) {
    const t = useTranslations("Templates.public");
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#1a1a1a" } = settings;

    // AI Blueprint Extraction
    const blogSection = blueprint?.layout?.find((s) => s.type === 'features');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articlesRaw = (blogSection?.content?.items as any[]) || [];
    const articles: Article[] = articlesRaw.length > 0 ? articlesRaw.map((item) => ({
        title: item.title,
        excerpt: item.description?.substring(0, 80) + "..." || t("manifesto_excerpt"),
        author: t("def_author"),
        date: "FEB 2026",
        img: item.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
        category: t("cat_philosophy")
    })) : [
        { title: t("manifesto"), excerpt: t("manifesto_excerpt"), author: t("def_author"), date: "FEB 2026", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop", category: t("cat_philosophy") },
        { title: t("neural_synthesis"), excerpt: t("neural_synthesis_desc"), author: t("def_author"), date: "JAN 2026", img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop", category: t("cat_technology") },
        { title: t("economic_resilience"), excerpt: t("economic_resilience_desc"), author: t("def_author"), date: "DEC 2025", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop", category: t("cat_economy") }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#fffefe] text-zinc-950 min-h-screen selection:bg-zinc-950 selection:text-white font-serif">
                    {/* PUBLIC NAVIGATION */}
                    <nav className="h-20 lg:h-32 px-8 lg:px-20 flex items-center justify-between border-b border-zinc-100 font-sans sticky top-0 bg-white/80 backdrop-blur-xl z-[100]">
                        <div className="flex items-center gap-12">
                            <span className="text-3xl font-black tracking-tighter uppercase italic">{blueprint?.name || t("public_journal")}</span>
                            <div className="hidden lg:flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400">
                                <span>{t("dispatch")}</span>
                                <span>{t("archives")}</span>
                                <span>{t("dossiers")}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <Search className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-zinc-950 transition-colors" />
                            <button
                                onClick={() => onOpen("Subscribe")}
                                className="h-12 px-6 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full"
                            >
                                {t("subscribe")}
                            </button>
                        </div>
                    </nav>

                    {/* FEATURED STORY HERO */}
                    <section className="py-20 lg:py-40 px-6 lg:px-20 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 border-b border-zinc-100">
                        <div className="lg:col-span-12 mb-12 flex items-center justify-between font-sans border-b border-zinc-950/5 pb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">{t("featured_dispatch")}</span>
                            <div className="flex gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest">{t("global_index")}</span>
                                <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <span className="inline-block px-4 py-1.5 bg-zinc-100 text-[10px] font-black uppercase tracking-widest rounded-full mb-10 font-sans">
                                    {t("strategic_analysis")}
                                </span>
                                <h1 className="text-6xl lg:text-[6.5vw] font-black tracking-tighter leading-[0.85] mb-12 italic uppercase">
                                    {headline}
                                </h1>
                                <p className="text-2xl lg:text-3xl text-zinc-500 leading-tight italic max-w-2xl">
                                    {subheadline}
                                </p>
                            </motion.div>

                            <div className="flex items-center gap-10 pt-12 border-t border-zinc-100 font-sans">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-950" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{t("architect")}</p>
                                        <p className="text-sm font-bold uppercase italic">{t("sovereign_protocol")}</p>
                                    </div>
                                </div>
                                <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 12 {t("min_read")}</span>
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> FEB 2026</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="relative aspect-square rounded-[40px] overflow-hidden"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Dispatch"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-zinc-950/20" />
                            </motion.div>
                        </div>
                    </section>

                    {/* DISPATCH FEED */}
                    <section className="py-40 px-6 lg:px-20">
                        <div className="flex items-baseline justify-between mb-32 border-b border-zinc-100 pb-12 font-sans">
                            <h2 className="text-5xl font-black uppercase tracking-tightest italic leading-none">{t("the_archives")}</h2>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300">{t("historical_logic")}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
                            {articles.map((article, i) => (
                                <motion.article
                                    key={i}
                                    className="group cursor-pointer"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="relative aspect-[16/10] mb-10 overflow-hidden rounded-3xl">
                                        <Image
                                            src={article.img}
                                            alt={article.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest font-sans">{article.category}</div>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic border-b border-zinc-100 pb-6 mb-6 leading-tight group-hover:text-zinc-500 transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-lg text-zinc-500 leading-relaxed italic mb-8">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between font-sans opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{article.date}</span>
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </section>

                    {/* NEWSLETTER INFRASTRUCTURE */}
                    <section className="py-32 px-6 lg:px-20 border-t border-zinc-100 bg-zinc-50">
                        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-8">
                                <h2 className="text-5xl font-black uppercase tracking-tightest leading-none italic whitespace-pre-line">{t("sovereign_intelligence")}</h2>
                                <p className="text-xl text-zinc-500 max-w-sm font-sans font-medium">{t("direct_injection")}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 font-sans">
                                <input
                                    type="email"
                                    placeholder={t("email_placeholder")}
                                    className="flex-1 h-16 bg-white border border-zinc-200 px-8 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-zinc-950 ring-0"
                                />
                                <button className="h-16 px-12 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3">
                                    {t("activate_feed")} <Sparkles className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* PUBLIC FOOTER */}
                    <footer className="py-24 px-10 border-t border-zinc-100 flex flex-col items-center gap-12 font-sans">
                        <span className="text-4xl font-black tracking-tighter uppercase italic">{blueprint?.name}</span>
                        <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
                            <span>{t("archives")}</span>
                            <span>{t("masthead")}</span>
                            <span>{t("ethics_audit")}</span>
                            <span>{t("legal")}</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[1em] opacity-20 mt-12">{t("dispatch_architecture")}</p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
