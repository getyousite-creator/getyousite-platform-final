"use client";

import React from 'react';
import { Search, ArrowRight, Cpu, Layout, Info, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';



import ContactForm from './sections/ContactForm';
import Stats from './sections/Stats';
import Team from './sections/Team';
import Services from './sections/Services';
import Booking from './sections/Booking';
import { useTemplateEditor } from '@/hooks/use-template-editor';

interface ComponentLibraryProps {
    id?: string;
    type: string;
    content: any;
    primaryColor: string;
    backgroundColor?: string;
    textColor?: string;
    isEditable?: boolean;
    onEdit?: (type: string, content: any) => void;
    priority?: boolean;
    storeId?: string;
}


import { InlineEditLayer } from './InlineEditLayer';
import { SovereignTracker } from './SovereignTracker';

export function ComponentLibrary({ id, type, content, primaryColor, backgroundColor, textColor, isEditable, onEdit, priority, storeId }: ComponentLibraryProps) {

    const updateSectionContent = useTemplateEditor(state => state.updateSectionContent);

    const handleUpdate = (field: string, value: string) => {
        if (id) {
            updateSectionContent(id, { [field]: value });
        }
    };

    const renderComponent = () => {
        switch (type) {
            case 'hero':
            case 'HERO_PRIME':
                return <PreviewHero id={id} content={content} primaryColor={primaryColor} backgroundColor={backgroundColor} textColor={textColor} variant={type === 'HERO_PRIME' ? 'prime' : 'base'} onUpdate={handleUpdate} isEditable={isEditable} priority={priority} />;
            case 'features':
            case 'FEATURE_GRID':
                return <PreviewFeatures id={id} content={content} primaryColor={primaryColor} backgroundColor={backgroundColor} textColor={textColor} variant={type === 'FEATURE_GRID' ? 'grid' : 'list'} onUpdate={handleUpdate} isEditable={isEditable} priority={priority} />;
            case 'LOGIC_SERVICES':
                return <Services content={content} primaryColor={primaryColor} />;
            case 'benefits':
                return <PreviewBenefits content={content} primaryColor={primaryColor} />;
            case 'trust_bar':
            case 'logo-bar':
            case 'TRUST_BAR':
                return <PreviewTrustBar content={content} primaryColor={primaryColor} />;
            case 'faq':
                return <PreviewFAQ content={content} primaryColor={primaryColor} />;
            case 'cta':
            case 'PRO_OFFER':
                return <PreviewCTA content={content} primaryColor={primaryColor} />;
            case 'testimonials':
            case 'TESTIMONIAL_STREAM':
                return <PreviewTestimonials content={content} primaryColor={primaryColor} />;
            case 'gallery':
                return <PreviewGallery content={content} primaryColor={primaryColor} />;
            case 'contact':
            case 'SMART_FORM':
                return <ContactForm content={content} primaryColor={primaryColor} storeId={storeId} />;
            case 'booking':
            case 'APPOINTMENT_WIDGET':
                return <Booking content={content} primaryColor={primaryColor} storeId={storeId} />;
            case 'stats':
                return <Stats content={content} primaryColor={primaryColor} />;
            case 'team':
                return <Team content={content} primaryColor={primaryColor} />;
            case 'services':
                return <Services content={content} primaryColor={primaryColor} />;
            case 'pricing':
            case 'PRICE_ENGINE':
            case 'LIVE_PRICING':
                return <PreviewPricing content={content} primaryColor={primaryColor} />;
            case 'LEGAL_NOTICE':
                return <PreviewLegal content={content} />;
            case 'CINEMATIC_VIDEO':
                return <PreviewCinematicVideo id={id} content={content} primaryColor={primaryColor} />;


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
        <SovereignTracker id={id || 'unnamed'} type={type} metadata={{ storeId }}>
            <div className="relative group/section">
                {renderComponent()}

                {isEditable && (
                    <div className="absolute top-4 right-4 opacity-0 group-hover/section:opacity-100 transition-opacity z-30 flex gap-2">
                        <button
                            onClick={() => onEdit?.(type, content)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-premium hover:scale-105 active:scale-95 transition-all min-h-[48px]"
                        >
                            تكرير التوليف الاستراتيجي <Cpu className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </SovereignTracker>
    );
}

function PreviewTestimonials({ content, primaryColor, backgroundColor, textColor }: any) {
    const reviews = content?.reviews || [
        { name: "Dr. Sarah L.", role: "Clinic Director", text: "The architectural precision increased our patient trust by 200%." },
        { name: "James K.", role: "CEO", text: "Sovereign execution. The definition of excellence." },
        { name: "Amira B.", role: "Founder", text: "A truly transformative digital experience." }
    ];

    return (
        <section
            className="py-24 px-8 relative overflow-hidden"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {reviews.map((review: any, i: number) => (
                    <div key={i} className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl relative group hover:bg-white/10 transition-colors shadow-premium">
                        <div className="text-4xl text-white/10 font-serif absolute top-4 left-6">"</div>
                        <p className="text-lg text-white/60 mb-6 relative z-10 leading-relaxed italic">
                            {review.text}
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-transparent" />
                            <div>
                                <h4 className="font-bold text-sm tracking-wide text-white">{review.name}</h4>
                                <span className="text-[10px] uppercase tracking-widest text-white/40">{review.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}


function PreviewBenefits({ content, primaryColor, backgroundColor, textColor }: any) {
    const isEmeraldTheme = (primaryColor === "#064E3B" || primaryColor === "emerald-deep");
    const benefits = content?.benefits || [
        { title: "20x Faster Conversion", desc: "Optimized for the speed of thought." },
        { title: "Global Sovereignty", desc: "Direct alignment with international markets." },
        { title: "Strategic Precision", desc: "No generic code. Only architectural excellence." }
    ];

    return (
        <section className="py-24 px-8 bg-surface-slate/30 border-y border-white/5 backdrop-blur-3xl">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {benefits.map((b: any, i: number) => (
                    <div key={i} className="space-y-4 group">
                        <div className={`w-12 h-1 w-0 group-hover:w-16 transition-all duration-700 ${isEmeraldTheme ? 'bg-neon-lime' : 'bg-primary'}`} />
                        <h3 className="text-2xl font-black text-white font-heading">{b.title}</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest font-sans">{b.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewTrustBar({ content, primaryColor }: any) {
    const isEmeraldTheme = (primaryColor === "#064E3B" || primaryColor === "emerald-deep");
    return (
        <section className="py-12 border-y border-white/5 bg-obsidian">
            <div className="max-w-7xl mx-auto px-8 flex flex-wrap items-center justify-between gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
                {['QUANTUM', 'ASTRA', 'Strategic', 'SOVEREIGN', 'EMPIRE'].map((brand) => (
                    <span key={brand} className="text-xl font-black tracking-[0.5em] text-white/50">{brand}</span>
                ))}
            </div>
        </section>
    );
}

function PreviewFAQ({ content, primaryColor, backgroundColor, textColor }: any) {
    const isEmeraldTheme = (primaryColor === "#064E3B" || primaryColor === "emerald-deep");
    const faqs = content?.items || [
        { q: "How fast is the deployment?", a: "Sub-second orchestration under optimal network conditions." },
        { q: "Is the design unique?", a: "Every blueprint is a Strategic derivative of your brand's unique identity." }
    ];

    return (
        <section className="py-32 px-8 max-w-4xl mx-auto space-y-12">
            <h2 className="text-4xl font-black text-center text-white font-heading underline decoration-neon-lime decoration-4 underline-offset-8">Common_Inquiries</h2>
            <div className="space-y-6">
                {faqs.map((f: any, i: number) => (
                    <div key={i} className="vip-card p-10 space-y-4">
                        <h4 className={`text-sm font-black uppercase tracking-widest ${isEmeraldTheme ? 'text-neon-lime' : 'text-primary'}`}>{f.q}</h4>
                        <p className="text-white/60 leading-relaxed font-sans">{f.a}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function PreviewHero({ id, content, primaryColor, variant, backgroundColor, textColor, onUpdate, isEditable, priority }: any) {
    const isEmeraldTheme = (primaryColor === "#064E3B" || primaryColor === "emerald-deep");

    return (
        <section
            className={`py-40 px-8 relative overflow-hidden flex flex-col items-center text-center ${variant === 'prime' ? 'min-h-[90vh] justify-center bg-obsidian' : ''}`}
            style={{ backgroundColor: variant === 'prime' ? undefined : (backgroundColor || 'transparent'), color: textColor }}
        >

            {/* HIGH-STATUS BACKGROUND IMAGE OPTIMIZATION */}
            {content?.image && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={content.image}
                        alt={content.headline || "Hero Image"}
                        fill
                        priority={priority}
                        className="object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className={`absolute inset-0 ${isEmeraldTheme ? 'bg-gradient-to-b from-emerald-deep/50 via-obsidian/80 to-obsidian' : 'bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]'}`} />
                </div>
            )}

            {variant === 'prime' && !content?.image && (
                <div className="absolute inset-0 z-0">
                    <div className={`absolute top-1/4 left-1/4 w-[50%] h-[50%] ${isEmeraldTheme ? 'bg-emerald-deep/10' : 'bg-primary/10'} blur-[120px] rounded-full animate-pulse`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-[40%] h-[40%] ${isEmeraldTheme ? 'bg-neon-lime/5' : 'bg-blue-600/5'} blur-[100px] rounded-full delay-700`} />
                </div>
            )}


            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-5xl space-y-10"
            >
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-premium">
                    <div className={`w-2 h-2 rounded-full ${isEmeraldTheme ? 'bg-neon-lime' : 'bg-primary'} animate-ping`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Sovereign_Protocol_v2.1</span>
                </div>

                <h1 className={`font-black tracking-tighter leading-[0.9] text-white ${variant === 'prime' ? 'text-6xl md:text-8xl lg:text-[7rem]' : 'text-5xl md:text-7xl'} font-heading`}>
                    {isEditable ? (
                        <InlineEditLayer
                            onTextChange={(val) => onUpdate('headline', val)}
                        >
                            {content?.headline || "Untitled Ambition"}
                        </InlineEditLayer>
                    ) : (
                        content?.headline || "Untitled Ambition"
                    )}
                </h1>

                {isEditable ? (
                    <div className="text-white/40 text-xl font-medium max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed font-sans">
                        <InlineEditLayer
                            onTextChange={(val) => onUpdate('subheadline', val)}
                        >
                            {content?.subheadline || "A blueprint awaiting its architectural destiny."}
                        </InlineEditLayer>
                    </div>
                ) : (
                    <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed font-sans">
                        {content?.subheadline || "A blueprint awaiting its architectural destiny."}
                    </p>
                )}


                <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        className={`w-full md:w-auto px-12 py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] text-white shadow-premium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4 ${isEmeraldTheme ? 'bg-emerald-deep border border-white/10' : 'bg-primary border-none'} min-h-[48px]`}
                        style={{ backgroundColor: isEmeraldTheme ? undefined : primaryColor }}
                    >
                        {content?.cta || "Initiate Protocol"}
                        <ArrowRight className={`w-5 h-5 ${isEmeraldTheme ? 'text-neon-lime' : ''}`} />
                    </button>
                    {variant === 'prime' && (
                        <button className="w-full md:w-auto px-10 py-6 rounded-[8px] border border-white/10 bg-white/5 backdrop-blur-md text-white/60 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white/10 transition-colors min-h-[48px]">
                            Explore_Engine
                        </button>
                    )}
                </div>
            </motion.div>
        </section>
    );
}

function PreviewFeatures({ id, content, primaryColor, variant, backgroundColor, textColor, onUpdate, isEditable }: any) {
    const items = content?.items || [
        { title: "Strategic Logic", description: "Algorithmic alignment with business goals." },
        { title: "Astra Scale", description: "Built for global digital empires." },
        { title: "Self Healing", description: "Autonomous performance optimization." }
    ];

    const handleItemUpdate = (index: number, field: 'title' | 'description', value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onUpdate('items', newItems);
    };

    return (
        <section
            className="py-32 px-8 relative overflow-hidden"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >

            <div className="max-w-7xl mx-auto space-y-20">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
                        {isEditable ? (
                            <InlineEditLayer
                                onTextChange={(val) => onUpdate('title', val)}
                            >
                                {content?.title || "Capabilities"}
                            </InlineEditLayer>
                        ) : (
                            content?.title || "Capabilities"
                        )}
                    </h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
                </div>

                <div className={`grid gap-12 ${variant === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {items.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden shadow-premium"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-6xl tracking-tighter">0{i + 1}</div>
                            <div className="w-16 h-16 rounded-[1.5rem] mb-10 flex items-center justify-center bg-primary/20 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-6 text-white tracking-tight">
                                {isEditable ? (
                                    <InlineEditLayer
                                        onTextChange={(val) => handleItemUpdate(i, 'title', val)}
                                    >
                                        {item.title}
                                    </InlineEditLayer>
                                ) : (
                                    item.title
                                )}
                            </h3>
                            {isEditable ? (
                                <div className="text-white/40 text-[11px] uppercase font-black tracking-[0.2em] leading-relaxed">
                                    <InlineEditLayer
                                        onTextChange={(val) => handleItemUpdate(i, 'description', val)}
                                    >
                                        {item.description}
                                    </InlineEditLayer>
                                </div>
                            ) : (
                                <p className="text-white/40 text-[11px] uppercase font-black tracking-[0.2em] leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}


function PreviewPricing({ content, primaryColor, backgroundColor, textColor }: any) {
    const plans = content?.plans || [
        { name: "Starter", price: "29", features: ["Core Engine", "1.2GB Logic Buffer", "Secure Link"] },
        { name: "Sovereign Pro", price: "99", features: ["Strategic Link", "Infinite Scale", "Priority Execution", "24/7 Intel"], featured: true },
        { name: "Empire", price: "299", features: ["Autonomous Growth", "Direct Strategic Access", "Master Credentials"] }
    ];

    return (
        <section
            className="py-32 px-8"
            style={{ backgroundColor: backgroundColor || '#020617', color: textColor }}
        >

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {plans.map((plan: any, i: number) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className={`p-10 rounded-[3rem] border ${plan.featured ? 'bg-primary/10 border-primary shadow-premium-blue' : 'bg-white/5 border-white/10 shadow-premium'} space-y-10 relative overflow-hidden backdrop-blur-md`}
                    >
                        {plan.featured && <div className="absolute top-8 right-8 px-4 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full">Recommended</div>}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{plan.name}</h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">${plan.price}</span>
                                <span className="text-white/20 text-xs uppercase font-black tracking-widest">/mo</span>
                            </div>
                        </div>
                        <ul className="space-y-6">
                            {plan.features.map((feat: string, j: number) => (
                                <li key={j} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.2em] text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all min-h-[48px] ${plan.featured ? 'bg-primary text-white shadow-xl hover:bg-primary/80' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}>
                            Deploy_Plan
                        </button>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function PreviewLegal({ content, backgroundColor, textColor }: any) {
    return (
        <section
            className="py-20 px-8 border-t border-white/5"
            style={{ backgroundColor: backgroundColor || 'rgba(0,0,0,0.2)', color: textColor }}
        >

            <div className="max-w-4xl mx-auto space-y-6 text-center">
                <div className="flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                    <span>Privacy_Protocol</span>
                    <span>Service_Logic</span>
                    <span>License_Sovereignty</span>
                </div>
                <p className="text-[10px] text-white/10 uppercase font-black tracking-[0.2em] leading-loose">
                    {content?.text || "All digital assets generated via GYS-Sovereign-Engine are under protected logical domain and verified Strategic identification protocol 2.0. Version 2026."}
                </p>
            </div>
        </section>
    );
}


function PreviewCTA({ content, primaryColor, backgroundColor, textColor }: any) {
    return (
        <section className="py-24 px-8 relative overflow-hidden" style={{ backgroundColor: primaryColor, color: 'white' }}>

            <div className="relative z-10 text-center space-y-8">
                <h2 className="text-4xl font-black tracking-tight">{content?.headline || "Ready for Deployment?"}</h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto">{content?.subheadline || "Join the sovereign network and scale your vision."}</p>
                <button className="px-10 py-5 bg-card text-foreground rounded-full font-black uppercase text-xs tracking-widest shadow-premium min-h-[48px]">
                    Get Started Now
                </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        </section>
    );
}

function PreviewCinematicVideo({ content, primaryColor }: any) {
    const [isSynthesizing, setIsSynthesizing] = React.useState(true);
    const videoUrl = content?.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-in-a-sunny-day-36314-large.mp4";

    React.useEffect(() => {
        const timer = setTimeout(() => setIsSynthesizing(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="py-24 px-8 bg-black relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.4em] text-primary shadow-premium">
                        Strategic_Video_Synthesis
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">Cinematic Asset <span className="text-primary not-italic">Generated</span></h2>
                </div>

                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-premium group">
                    {isSynthesizing ? (
                        <div className="absolute inset-0 bg-[#020617] flex flex-col items-center justify-center space-y-6 z-20">
                            <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <div className="space-y-2 text-center">
                                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white animate-pulse">Rendering_4K_Asset...</p>
                                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">GYS-VIDEO-RENDER-NODE-22</p>
                            </div>
                        </div>
                    ) : (
                        <video
                            src={videoUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                        />
                    )}

                    {/* Video HUD */}
                    <div className="absolute top-8 left-8 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/5 z-10 flex flex-col gap-1 shadow-premium">
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Strategic_Input: {content?.prompt || "Standard_Atmosphere"}
                        </span>
                        <span className="text-[9px] font-mono text-white/40">RESOLUTION: 3840 x 2160 (4K)</span>
                    </div>

                    <div className="absolute bottom-8 right-8">
                        <div className="px-6 py-2 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] shadow-premium">
                            Verified AI Output
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function PreviewGallery({ content, primaryColor, backgroundColor, textColor }: any) {
    const images = content?.images || [
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
    ];

    return (
        <section
            className="py-20 px-8"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >

            <h2 className="text-3xl font-black text-center mb-12">Visual Perspective</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {images.map((img: string, i: number) => (
                    <div key={i} className="aspect-square relative group overflow-hidden rounded-2xl shadow-premium border border-border bg-secondary/10">
                        <Image
                            src={img}
                            alt={`Gallery ${i}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                ))}
            </div>

        </section>
    );
}
