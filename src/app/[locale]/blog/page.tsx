"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Calendar, User, Tag, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// MOCKED DATA FOR IMMEDIATE INNOVATIVE VALUE
const FEATURED_POSTS = [
    {
        slug: "sovereign-ai-the-future-of-digital-commerce",
        title: "Sovereign AI: The Future of Digital Commerce",
        excerpt: "Why traditional e-commerce is failing and how the new AI-orchestrated infrastructure is decentralizing market power.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        date: "Feb 05, 2026",
        author: "Architect Prime",
        category: "AI Ethics"
    },
    {
        slug: "optimizing-for-quantum-seo-strategies",
        title: "Optimizing for Quantum SEO Strategies",
        excerpt: "Ditching the old backlink logic for semantic authority. How to rank higher in the era of generative search engines.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        date: "Feb 03, 2026",
        author: "SEO Tactical Unit",
        category: "SEO Strategy"
    },
    {
        slug: "the-psychology-of-innovative-simplicity",
        title: "The Psychology of Innovative Simplicity",
        excerpt: "Why the design language of Wix and GetYouSite is winning. The neuro-science behind minimalist UI.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
        date: "Jan 30, 2026",
        author: "Lead Designer",
        category: "UX/UI Deep-Dive"
    }
];

export default function BlogPage() {
    const t = useTranslations('Blog');

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* BLOG HEADER */}
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8"
                        >
                            {t('badge')}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-[7rem] font-black tracking-tighter italic uppercase mb-8 leading-[0.8]"
                        >
                            {t('title')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    {/* FEATURED GRID - SEO DOMINANT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {FEATURED_POSTS.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 border border-white/5">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 rounded-full bg-blue-600 text-[9px] font-black uppercase tracking-widest">
                                            {post.category}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-blue-500" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User className="w-3 h-3 text-slate-400" /> {post.author}</span>
                                    </div>
                                    <h2 className="text-3xl font-black italic tracking-tighter leading-tight group-hover:text-blue-400 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-blue-400 transition-all pt-4 group/btn"
                                    >
                                        {t('read_more')}
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* NEWSLETTER NODE - INNOVATIVE CONVERSION */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 p-12 rounded-[3rem] bg-blue-600 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white mb-6">
                                    Join the Digital Sovereignty Protocol.
                                </h2>
                                <p className="text-blue-100/80 font-medium">
                                    Receive tactical insights on AI architecture and market dominance directly to your signal link.
                                </p>
                            </div>
                            <div className="w-full max-w-md flex gap-2">
                                <input
                                    className="w-full bg-white/10 border-white/20 rounded-2xl px-6 h-16 focus:bg-white/20 transition-all outline-none placeholder:text-blue-100/50"
                                    placeholder="commander@nexus.io"
                                />
                                <button className="h-16 px-8 rounded-2xl bg-white text-blue-600 font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                    Join
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
