"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2, Shield, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// REDUNDANT BUT LOGICAL REPRODUCTION OF MOCK DATA
const POSTS = [
    {
        slug: "sovereign-ai-the-future-of-digital-commerce",
        title: "Sovereign AI: The Future of Digital Commerce",
        excerpt: "Why traditional e-commerce is failing and how the new AI-orchestrated infrastructure is decentralizing market power.",
        content: `
            <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8">
                In the last decade, we have seen the rise of centralized platforms that dictate the terms of digital existence. From high commissions to rigid templates, the 'old' internet has become a cage for visionaries.
            </p>
            <h2 className="text-3xl font-black italic uppercase italic tracking-tightest mt-12 mb-6">The Death of Standard Templates</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
                Standard templates are no longer enough. The modern consumer demands a dynamic experience that feels alive. That's where Sovereign AI comes in. It doesn't just display content; it orchestrates an ecosystem.
            </p>
            <blockquote className="border-l-4 border-blue-600 pl-10 my-12 py-4 italic text-2xl font-black text-white">
                "Digital sovereignty is not a luxury; it is the fundamental requirement for high-frequency commerce in 2026."
            </blockquote>
            <h2 className="text-3xl font-black italic uppercase italic tracking-tightest mt-12 mb-6">Engineered for Success</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
                By leveraging server-side rendering and edge computation, platforms like GetYouSite ensure that your digital empire is never offline and never slow. We are moving from 'websites' to 'digital organisms'.
            </p>
        `,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        date: "Feb 05, 2026",
        author: "Architect Prime",
        category: "AI Ethics"
    }
];

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    // LOGICAL SEARCH
    const post = POSTS.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white">
            <Header />

            <main className="pt-32 pb-24">
                <article className="container mx-auto px-6 max-w-4xl">
                    {/* BACK NAVIGATION */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all mb-16 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                        Back to Intelligence_Streams
                    </Link>

                    {/* ARTICLE HEADER */}
                    <div className="space-y-10 mb-20">
                        <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-blue-500">
                            <span className="flex items-center gap-2 px-3 py-1 rounded bg-blue-600/10 border border-blue-500/20">{post.category}</span>
                            <span className="flex items-center gap-2 text-slate-400"><Calendar className="w-3 h-3" /> {post.date}</span>
                            <span className="flex items-center gap-2 text-slate-400"><User className="w-3 h-3" /> {post.author}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tightest italic uppercase leading-[0.9]">
                            {post.title}
                        </h1>

                        <div className="relative aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/5">
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
                        className="prose prose-invert prose-2xl max-w-none text-slate-300 font-medium leading-relaxed
                            prose-headings:text-white prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter
                            prose-strong:text-white prose-blockquote:border-blue-600 prose-blockquote:bg-blue-600/5 prose-blockquote:p-10 prose-blockquote:rounded-3xl
                        "
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* ARTICLE FOOTER - TRUST SIGNALS */}
                    <div className="mt-32 pt-16 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <Sparkles className="w-8 h-8 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Authenticated Author</p>
                                    <p className="text-xl font-bold">{post.author}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button className="h-14 px-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest">
                                    <Share2 className="mr-2 w-4 h-4" /> Share_Node
                                </Button>
                                <Button className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-black uppercase tracking-widest">
                                    Apply_Insights
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
