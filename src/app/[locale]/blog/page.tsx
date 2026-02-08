"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Calendar, User, Tag, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
    const t = useTranslations('Blog');

    // Generate posts from translations
    const posts = [
        {
            slug: "ai-ecommerce-future",
            title: t('posts.post1.title'),
            excerpt: t('posts.post1.excerpt'),
            author: t('posts.post1.author'),
            category: t('posts.post1.category'),
            date: t('posts.post1.date'),
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
        },
        {
            slug: "seo-strategies-2026",
            title: t('posts.post2.title'),
            excerpt: t('posts.post2.excerpt'),
            author: t('posts.post2.author'),
            category: t('posts.post2.category'),
            date: t('posts.post2.date'),
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        },
        {
            slug: "psychology-minimalist-design",
            title: t('posts.post3.title'),
            excerpt: t('posts.post3.excerpt'),
            author: t('posts.post3.author'),
            category: t('posts.post3.category'),
            date: t('posts.post3.date'),
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* BLOG HEADER */}
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8"
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
                            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium"
                        >
                            {t('subtitle')}
                        </motion.p>
                    </div>

                    {/* FEATURED GRID - SEO DOMINANT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-8 border border-border">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 rounded-full bg-primary text-[9px] font-black uppercase tracking-widest text-primary-foreground">
                                            {post.category}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-primary" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User className="w-3 h-3 text-muted-foreground" /> {post.author}</span>
                                    </div>
                                    <h2 className="text-3xl font-black italic tracking-tighter leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-primary/80 transition-all pt-4 group/btn"
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
                        className="mt-32 p-12 rounded-[3rem] bg-primary relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-primary-foreground mb-6">
                                    {t('newsletter.title')}
                                </h2>
                                <p className="text-primary-foreground/80 font-medium">
                                    {t('newsletter.subtitle')}
                                </p>
                            </div>
                            <div className="w-full max-w-md flex gap-2">
                                <input
                                    className="w-full bg-primary-foreground/10 border-primary-foreground/20 rounded-2xl px-6 h-16 focus:bg-primary-foreground/20 transition-all outline-none placeholder:text-primary-foreground/50 text-primary-foreground"
                                    placeholder={t('newsletter.placeholder')}
                                />
                                <button className="h-16 px-8 rounded-2xl bg-primary-foreground text-primary font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                    {t('newsletter.button')}
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
