"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface ComponentLibraryProps {
    type: string;
    content: any;
    primaryColor: string;
}

/**
 * SOVEREIGN COMPONENT LIBRARY
 * 
 * Maps blueprint types to high-fidelity visual components.
 */
export function ComponentLibrary({ type, content, primaryColor }: ComponentLibraryProps) {
    switch (type) {
        case 'hero':
            return <PreviewHero content={content} primaryColor={primaryColor} />;
        case 'features':
            return <PreviewFeatures content={content} primaryColor={primaryColor} />;
        case 'benefits':
            return <PreviewBenefits content={content} primaryColor={primaryColor} />;
        case 'trust_bar':
            return <PreviewTrustBar content={content} primaryColor={primaryColor} />;
        case 'faq':
            return <PreviewFAQ content={content} primaryColor={primaryColor} />;
        case 'cta':
            return <PreviewCTA content={content} primaryColor={primaryColor} />;
        case 'gallery':
            return <PreviewGallery content={content} primaryColor={primaryColor} />;
        default:
            return (
                <div className="p-12 text-center border-b border-black/5 bg-zinc-50">
                    <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                        [{type}] Section_Pending_Orchestration
                    </p>
                </div>
            );
    }
}

function PreviewBenefits({ content, primaryColor }: any) {
    const items = content?.items || ["Instant Setup", "High Security", "Growth Ready"];
    return (
        <section className="py-20 px-8 bg-white text-center">
            <h2 className="text-3xl font-black mb-12 tracking-tight">Core Advantages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {items.map((benefit: string, i: number) => (
                    <div key={i} className="space-y-4">
                        <div className="text-4xl font-black text-zinc-100 mb-2">0{i + 1}</div>
                        <h3 className="text-xl font-bold">{benefit}</h3>
                        <div className="h-1 w-12 mx-auto rounded-full" style={{ backgroundColor: primaryColor }} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewTrustBar({ content, primaryColor }: any) {
    const logos = content?.logos || ["Partner Alpha", "Tech Beta", "Global Gamma"];
    return (
        <section className="py-12 bg-zinc-900 overflow-hidden">
            <div className="flex gap-16 justify-center opacity-30 grayscale invert">
                {logos.map((logo: string, i: number) => (
                    <span key={i} className="text-xl font-black tracking-tighter text-white whitespace-nowrap">{logo}</span>
                ))}
            </div>
        </section>
    );
}

function PreviewFAQ({ content, primaryColor }: any) {
    const items = content?.items || [{ q: "How long does it take?", a: "Seconds with our AI." }];
    return (
        <section className="py-20 px-8 bg-zinc-50 border-t border-black/5">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl font-black text-center mb-12">Common Inquiries</h2>
                {items.map((item: any, i: number) => (
                    <div key={i} className="p-6 bg-white rounded-xl border border-black/5 shadow-sm">
                        <h4 className="font-bold mb-2">{item.q}</h4>
                        <p className="text-sm text-zinc-500">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewHero({ content, primaryColor }: any) {
    return (
        <section className="py-24 px-8 text-center bg-white">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
                {content?.headline || "Untitled Ambition"}
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                {content?.subheadline || "A blueprint awaiting its architectural destiny."}
            </p>
            <button
                className="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest text-white shadow-xl transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px ${primaryColor}44` }}
            >
                Initiate Protocol
            </button>
        </section>
    );
}

function PreviewFeatures({ content, primaryColor }: any) {
    const items = content?.items || [
        { title: "Neural Logic", description: "Algorithmic alignment with business goals." },
        { title: "Astra Scale", description: "Built for global digital empires." },
        { title: "Self Healing", description: "Autonomous performance optimization." }
    ];

    return (
        <section className="py-20 px-8 bg-zinc-50 border-y border-black/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((item: any, i: number) => (
                    <div key={i} className="p-8 bg-white rounded-2xl border border-black/5 shadow-sm">
                        <div className="w-10 h-10 rounded-lg mb-6 flex items-center justify-center text-white" style={{ backgroundColor: primaryColor }}>
                            {i + 1}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewCTA({ content, primaryColor }: any) {
    return (
        <section className="py-24 px-8 text-white relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
            <div className="relative z-10 text-center space-y-8">
                <h2 className="text-4xl font-black tracking-tight">{content?.headline || "Ready for Deployment?"}</h2>
                <p className="text-white/80 max-w-xl mx-auto">{content?.subheadline || "Join the sovereign network and scale your vision."}</p>
                <button className="px-10 py-5 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest shadow-2xl">
                    Get Started Now
                </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        </section>
    );
}

function PreviewGallery({ content, primaryColor }: any) {
    const images = content?.images || [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    ];

    return (
        <section className="py-20 px-8 bg-white">
            <h2 className="text-3xl font-black text-center mb-12">Visual Perspective</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((img: string, i: number) => (
                    <div key={i} className="aspect-square relative group overflow-hidden rounded-2xl shadow-lg border border-black/5 bg-zinc-100">
                        <img
                            src={img}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center">
                                <Search className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
