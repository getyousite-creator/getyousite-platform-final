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
}


function EditableText({ text, onUpdate, className, element: Element = 'span' }: { text: string, onUpdate: (val: string) => void, className?: string, element?: any }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [localText, setLocalText] = React.useState(text);

    React.useEffect(() => {
        setLocalText(text);
    }, [text]);

    const handleBlur = () => {
        setIsEditing(false);
        if (localText !== text) {
            onUpdate(localText);
        }
    };

    return (
        <Element
            contentEditable={true}
            suppressContentEditableWarning={true}
            onBlur={handleBlur}
            onInput={(e: any) => setLocalText(e.currentTarget.textContent)}
            className={`${className} focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 transition-all`}
        >
            {localText}
        </Element>
    );
}


export function ComponentLibrary({ id, type, content, primaryColor, backgroundColor, textColor, isEditable, onEdit, priority }: ComponentLibraryProps) {

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
                return <ContactForm content={content} primaryColor={primaryColor} />;
            case 'booking':
            case 'APPOINTMENT_WIDGET':
                return <Booking content={content} primaryColor={primaryColor} />;
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

function PreviewBenefits({ content, primaryColor, backgroundColor, textColor }: any) {
    const items = content?.items || ["Instant Setup", "High Security", "Growth Ready"];
    return (
        <section
            className="py-20 px-8 text-center"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >
            <h2 className="text-3xl font-black mb-12 tracking-tight">Core Advantages</h2>

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

function PreviewTrustBar({ content, primaryColor, backgroundColor, textColor }: any) {
    const logos = content?.logos || ["Partner Alpha", "Tech Beta", "Global Gamma"];
    return (
        <section
            className="py-12 overflow-hidden"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >
            <div className="flex gap-16 justify-center opacity-30 grayscale">

                {logos.map((logo: string, i: number) => (
                    <span key={i} className="text-xl font-black tracking-tighter text-muted-foreground whitespace-nowrap">{logo}</span>
                ))}
            </div>
        </section>
    );
}

function PreviewFAQ({ content, primaryColor, backgroundColor, textColor }: any) {
    const items = content?.items || [{ q: "How long does it take?", a: "Seconds with our AI." }];
    return (
        <section
            className="py-20 px-8 border-t border-white/5"
            style={{ backgroundColor: backgroundColor || 'transparent', color: textColor }}
        >
            <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl font-black text-center mb-12">Common Inquiries</h2>

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

function PreviewHero({ id, content, primaryColor, variant, backgroundColor, textColor, onUpdate, isEditable, priority }: any) {
    return (
        <section
            className={`py-40 px-8 relative overflow-hidden flex flex-col items-center text-center ${variant === 'prime' ? 'min-h-[90vh] justify-center bg-[#020617]' : ''}`}
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
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]" />
                </div>
            )}

            {variant === 'prime' && !content?.image && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full delay-700" />
                </div>
            )}


            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-5xl space-y-10"
            >
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Sovereign_Logic_v2</span>
                </div>

                <h1 className={`font-black tracking-tighter leading-[0.9] text-white ${variant === 'prime' ? 'text-6xl md:text-8xl lg:text-[7rem]' : 'text-5xl md:text-7xl'}`}>
                    {isEditable ? (
                        <EditableText
                            text={content?.headline || "Untitled Ambition"}
                            onUpdate={(val) => onUpdate('headline', val)}
                        />
                    ) : (
                        (content?.headline || "Untitled Ambition").split("").map((char: string, i: number) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02, duration: 0.1 }}
                            >
                                {char}
                            </motion.span>
                        ))
                    )}
                </h1>

                {isEditable ? (
                    <div className="text-white/40 text-xl font-medium max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed">
                        <EditableText
                            text={content?.subheadline || "A blueprint awaiting its architectural destiny."}
                            onUpdate={(val) => onUpdate('subheadline', val)}
                        />
                    </div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-white/40 text-xl font-medium max-w-2xl mx-auto uppercase tracking-[0.2em] leading-relaxed"
                    >
                        {content?.subheadline || "A blueprint awaiting its architectural destiny."}
                    </motion.p>
                )}


                <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6">
                    <button
                        className="w-full md:w-auto px-12 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] text-white shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 bg-gradient-to-br from-primary to-blue-700 border-none"
                    >
                        {content?.cta || "Initiate Protocol"}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    {variant === 'prime' && (
                        <button className="w-full md:w-auto px-10 py-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md text-white/60 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white/10 transition-colors">
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
        { title: "Neural Logic", description: "Algorithmic alignment with business goals." },
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
                            <EditableText
                                text={content?.title || "Capabilities"}
                                onUpdate={(val) => onUpdate('title', val)}
                            />
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
                            className="p-12 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-3xl hover:border-primary/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 font-black text-6xl tracking-tighter">0{i + 1}</div>
                            <div className="w-16 h-16 rounded-[1.5rem] mb-10 flex items-center justify-center bg-primary/20 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-6 text-white tracking-tight">
                                {isEditable ? (
                                    <EditableText
                                        text={item.title}
                                        onUpdate={(val) => handleItemUpdate(i, 'title', val)}
                                    />
                                ) : (
                                    item.title.split("").map((char: string, j: number) => (
                                        <motion.span
                                            key={j}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: (i * 0.2) + (j * 0.03) }}
                                        >
                                            {char}
                                        </motion.span>
                                    ))
                                )}
                            </h3>
                            {isEditable ? (
                                <div className="text-white/40 text-[11px] uppercase font-black tracking-[0.2em] leading-relaxed">
                                    <EditableText
                                        text={item.description}
                                        onUpdate={(val) => handleItemUpdate(i, 'description', val)}
                                    />
                                </div>
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: (i * 0.2) + 0.5 }}
                                    className="text-white/40 text-[11px] uppercase font-black tracking-[0.2em] leading-relaxed"
                                >
                                    {item.description}
                                </motion.p>
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
        { name: "Sovereign Pro", price: "99", features: ["Neural Link", "Infinite Scale", "Priority Execution", "24/7 Intel"], featured: true },
        { name: "Empire", price: "299", features: ["Autonomous Growth", "Direct Neural Access", "Master Credentials"] }
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
                        className={`p-10 rounded-[3rem] border ${plan.featured ? 'bg-primary/10 border-primary shadow-[0_30px_100px_rgba(59,130,246,0.2)]' : 'bg-white/[0.02] border-white/10'} space-y-10 relative overflow-hidden`}
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
                        <button className={`w-full py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all ${plan.featured ? 'bg-primary text-white shadow-xl hover:bg-primary/80' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'}`}>
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
                    {content?.text || "All digital assets generated via GYS-Sovereign-Engine are under protected logical domain and verified neural identification protocol 2.0. Version 2026."}
                </p>
            </div>
        </section>
    );
}


function PreviewCTA({ content, primaryColor, backgroundColor, textColor }: any) {
    return (
        <section className="py-24 px-8 relative overflow-hidden" style={{ backgroundColor: primaryColor, color: '#white' }}>

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

function PreviewGallery({ content, primaryColor, backgroundColor, textColor }: any) {
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
                    <div key={i} className="aspect-square relative group overflow-hidden rounded-2xl shadow-lg border border-border bg-secondary/10">
                        <Image
                            src={img}
                            alt={`Gallery ${i}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
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
