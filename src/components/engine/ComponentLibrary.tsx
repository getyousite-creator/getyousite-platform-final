"use client";

import React from 'react';
import { Search } from 'lucide-react';

import ContactForm from './sections/ContactForm';
import Stats from './sections/Stats';
import Team from './sections/Team';
import Services from './sections/Services';
import Booking from './sections/Booking';

interface ComponentLibraryProps {
    type: string;
    content: any;
    primaryColor: string;
    isEditable?: boolean;
    onEdit?: (type: string, content: any) => void;
}

export function ComponentLibrary({ type, content, primaryColor, isEditable, onEdit }: ComponentLibraryProps) {
    const renderComponent = () => {
        switch (type) {
            case 'hero':
                return <PreviewHero content={content} primaryColor={primaryColor} />;
            case 'features':
                return <PreviewFeatures content={content} primaryColor={primaryColor} />;
            case 'benefits':
                return <PreviewBenefits content={content} primaryColor={primaryColor} />;
            case 'trust_bar':
            case 'logo-bar':
                return <PreviewTrustBar content={content} primaryColor={primaryColor} />;
            case 'faq':
                return <PreviewFAQ content={content} primaryColor={primaryColor} />;
            case 'cta':
                return <PreviewCTA content={content} primaryColor={primaryColor} />;
            case 'testimonials':
                return <PreviewTestimonials content={content} primaryColor={primaryColor} />;
            case 'gallery':
                return <PreviewGallery content={content} primaryColor={primaryColor} />;
            case 'contact':
                return <ContactForm content={content} primaryColor={primaryColor} />;
            case 'booking':
                return <Booking content={content} />;
            case 'stats':
                return <Stats content={content} primaryColor={primaryColor} />;
            case 'team':
                return <Team content={content} primaryColor={primaryColor} />;
            case 'services':
                return <Services content={content} primaryColor={primaryColor} />;
            default:
                return (
                    <div className="p-12 text-center border-b border-border bg-background">
                        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                            [{type}] Section_Pending_Orchestration
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="relative group/section">
            {renderComponent()}

            {isEditable && (
                <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 transition-opacity z-30 flex gap-2">
                    <button
                        onClick={() => onEdit?.(type, content)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        تعديل بالذكاء الاصطناعي <Search className="w-3 h-3" />
                    </button>
                    <button className="p-2 bg-background border border-border text-foreground rounded-full hover:bg-secondary transition-colors">
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

function PreviewTestimonials({ content, primaryColor }: any) {
    const reviews = content?.reviews || [
        { name: "Dr. Sarah L.", role: "Clinic Director", text: "The architectural precision increased our patient trust by 200%." },
        { name: "James K.", role: "CEO", text: "Sovereign execution. The definition of excellence." },
        { name: "Amira B.", role: "Founder", text: "A truly transformative digital experience." }
    ];

    return (
        <section className="py-24 px-8 bg-card text-foreground relative overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review: any, i: number) => (
                    <div key={i} className="p-8 bg-secondary/10 border border-border rounded-2xl relative group hover:bg-secondary/20 transition-colors">
                        <div className="text-4xl text-muted-foreground font-serif absolute top-4 left-6">"</div>
                        <p className="text-lg text-muted-foreground mb-6 relative z-10 leading-relaxed">
                            {review.text}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/20 to-transparent" />
                            <div>
                                <h4 className="font-bold text-sm tracking-wide">{review.name}</h4>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{review.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewBenefits({ content, primaryColor }: any) {
    const items = content?.items || ["Instant Setup", "High Security", "Growth Ready"];
    return (
        <section className="py-20 px-8 bg-background text-center">
            <h2 className="text-3xl font-black mb-12 tracking-tight text-foreground">Core Advantages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {items.map((benefit: string, i: number) => (
                    <div key={i} className="space-y-4">
                        <div className="text-4xl font-black text-foreground mb-2">0{i + 1}</div>
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
        <section className="py-12 bg-card overflow-hidden">
            <div className="flex gap-16 justify-center opacity-30 grayscale">
                {logos.map((logo: string, i: number) => (
                    <span key={i} className="text-xl font-black tracking-tighter text-muted-foreground whitespace-nowrap">{logo}</span>
                ))}
            </div>
        </section>
    );
}

function PreviewFAQ({ content, primaryColor }: any) {
    const items = content?.items || [{ q: "How long does it take?", a: "Seconds with our AI." }];
    return (
        <section className="py-20 px-8 bg-background border-t border-border">
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl font-black text-center mb-12 text-foreground">Common Inquiries</h2>
                {items.map((item: any, i: number) => (
                    <div key={i} className="p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h4 className="font-bold mb-2 text-foreground">{item.q}</h4>
                        <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewHero({ content, primaryColor }: any) {
    return (
        <section className="py-24 px-8 text-center bg-background">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight text-foreground">
                {content?.headline || "Untitled Ambition"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                {content?.subheadline || "A blueprint awaiting its architectural destiny."}
            </p>
            <button
                className="px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest text-primary-foreground shadow-xl transition-transform hover:scale-105"
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
        <section className="py-20 px-8 bg-background border-y border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {items.map((item: any, i: number) => (
                    <div key={i} className="p-8 bg-card rounded-2xl border border-border shadow-sm">
                        <div className="w-10 h-10 rounded-lg mb-6 flex items-center justify-center text-primary-foreground" style={{ backgroundColor: primaryColor }}>
                            {i + 1}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewCTA({ content, primaryColor }: any) {
    return (
        <section className="py-24 px-8 text-foreground relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
            <div className="relative z-10 text-center space-y-8">
                <h2 className="text-4xl font-black tracking-tight">{content?.headline || "Ready for Deployment?"}</h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto">{content?.subheadline || "Join the sovereign network and scale your vision."}</p>
                <button className="px-10 py-5 bg-card text-foreground rounded-full font-black uppercase text-xs tracking-widest shadow-2xl">
                    Get Started Now
                </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
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
        <section className="py-20 px-8 bg-background">
            <h2 className="text-3xl font-black text-center mb-12">Visual Perspective</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((img: string, i: number) => (
                    <div key={i} className="aspect-square relative group overflow-hidden rounded-2xl shadow-lg border border-border bg-secondary/10">
                        <img
                            src={img}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-card/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                                <Search className="w-4 h-4 text-foreground" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
