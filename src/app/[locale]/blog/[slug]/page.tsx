"use client";


import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

import { KnowledgeService } from "@/lib/services/knowledge-service";
import { useEffect, useState } from "react";
import { Post } from "@/lib/schemas";

export default function BlogPostPage() {
    //@ts-expect-error - translations not typed yet
    const t = useTranslations("Blog");
    const params = useParams();
    const slug = params.slug as string;
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            const data = await KnowledgeService.getPostBySlug(slug);
            if (!data) {
                notFound();
            }
            setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-primary animate-pulse">LOADING KNOWLEDGE ENGINE...</div>;
    if (!post) return null;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="pt-32 pb-24">
                <article className="container mx-auto px-6 max-w-4xl">
                    {/* BACK NAVIGATION */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all mb-16 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                        {t('back_to_streams')}
                    </Link>

                    {/* ARTICLE HEADER */}
                    <div className="space-y-10 mb-20">
                        <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-primary">
                            <span className="flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20">{post.category}</span>
                            <span className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-3 h-3" /> {post.date}</span>
                            <span className="flex items-center gap-2 text-muted-foreground"><User className="w-3 h-3" /> {post.author.name}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tightest italic uppercase leading-[0.9]">
                            {post.title}
                        </h1>

                        <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-border">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* DYNAMIC CONTENT CLUSTER */}
                    <div
                        className="prose prose-2xl max-w-none text-muted-foreground font-medium leading-relaxed
                            prose-headings:text-foreground prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter
                            prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-10 prose-blockquote:rounded-3xl
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* ARTICLE FOOTER - TRUST SIGNALS */}
                    <div className="mt-32 pt-16 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Authenticated Author</p>
                                    <p className="text-xl font-bold">{post.author.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button className="h-14 px-8 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-all font-black uppercase tracking-widest">
                                    <Share2 className="mr-2 w-4 h-4" /> {t('share_node')}
                                </Button>
                                <Button className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 transition-all font-black uppercase tracking-widest">
                                    {t('apply_insights')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
