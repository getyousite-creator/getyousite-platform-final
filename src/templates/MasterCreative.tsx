"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Camera,
    Sparkles,
    Eye,
    Zap,
    ArrowUpRight,
    Instagram,
    Dribbble,
    Twitter,
    Figma,
    Layers,
    MousePointer2,
    Plus
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

interface CaseStudy {
    title: string;
    category: string;
    img: string;
    year: string;
}

export default function MasterCreative(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#1d1d1f" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === 'hero');
    const portfolioSection = blueprint?.layout?.find((s) => s.type === 'features');

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroImg = (heroSection?.content?.image as string) || "https://images.unsplash.com/photo-1493424440862-621b185fbb44?q=80&w=2400&auto=format&fit=crop";

    const projects = (portfolioSection?.content?.projects as CaseStudy[]) || [
        { title: "Kinetic Fluidity", category: "Motion_Audit", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2400&auto=format&fit=crop", year: "2026" },
        { title: "Sovereign UI", category: "Eco_System", img: "https://images.unsplash.com/photo-1581291518151-0ca98316f31f?q=80&w=2400&auto=format&fit=crop", year: "2025" },
        { title: "Neural Branding", category: "Identity_Shift", img: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?q=80&w=2400&auto=format&fit=crop", year: "2026" },
        { title: "Void Minimal", category: "Visual_Zero", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2400&auto=format&fit=crop", year: "2024" }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#0a0a0a] text-white min-h-screen selection:bg-white selection:text-black font-sans">
                    {/* CREATIVE NAVIGATION */}
                    <nav className="fixed top-0 w-full px-8 lg:px-16 h-20 flex items-center justify-between z-[500] mix-blend-difference">
                        <span className="text-lg font-black tracking-widest uppercase">{blueprint?.name || "STUDIO_ZERO"}</span>
                        <div className="flex items-center gap-12 text-[9px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">
                            <span className="cursor-pointer hover:text-white transition-colors">Works</span>
                            <span className="cursor-pointer hover:text-white transition-colors">About</span>
                            <div className="w-10 h-[1px] bg-white/20" />
                            <span className="cursor-pointer hover:text-white transition-colors">Archive</span>
                        </div>
                    </nav>

                    {/* HERO VISION */}
                    <section className="min-h-screen flex flex-col justify-center px-8 lg:px-16 relative overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.3, scale: 1 }}
                            transition={{ duration: 2 }}
                            className="absolute inset-0 z-0"
                        >
                            <Image
                                src={heroImg}
                                alt="Vision"
                                fill
                                className="object-cover grayscale"
                            />
                        </motion.div>

                        <div className="relative z-10 space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 opacity-40" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Absolute Aesthetic Intelligence</span>
                                </div>
                                <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-[0.75] mb-12 italic">
                                    {heroHeadline.split(' ')[0]} <br />
                                    <span className="opacity-20">{heroHeadline.split(' ').slice(1).join(' ')}</span>
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="flex flex-col lg:flex-row gap-12 items-end justify-between"
                            >
                                <p className="text-xl lg:text-3xl font-medium max-w-2xl leading-tight opacity-60">
                                    {subheadline}
                                </p>
                                <div
                                    className="w-40 h-40 rounded-full flex items-center justify-center cursor-pointer group hover:scale-110 transition-transform relative p-4"
                                    onClick={() => onOpen("Initiate")}
                                >
                                    <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow" />
                                    <div className="text-[10px] font-black uppercase tracking-widest text-center">
                                        Work <br /> With <br /> Us
                                    </div>
                                    <MousePointer2 className="absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Bottom Decor */}
                        <div className="absolute bottom-12 right-16 flex gap-12 text-[10px] font-black uppercase tracking-widest opacity-20">
                            <span>Lon_Archive_26.0</span>
                            <span>Sovereign_Creative</span>
                        </div>
                    </section>

                    {/* CAPABILITIES PANEL */}
                    <section className="py-40 bg-white text-black rounded-[60px] lg:rounded-[100px] relative z-20">
                        <div className="px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-32">
                            <div>
                                <h2 className="text-7xl font-black uppercase tracking-tightest mb-16 leading-none">Core <br /> Pillars.</h2>
                                <div className="space-y-12">
                                    {[
                                        { title: "Neural Brand Design", icon: Layers, desc: "Constructing identities that survive market fluctuations." },
                                        { title: "Kinetic UI/UX", icon: MousePointer2, desc: "Motion-adaptive interfaces built for human behavior." },
                                        { title: "Visual Strategy", icon: Eye, desc: "Art direction that commands absolute attention." }
                                    ].map((item, i) => (
                                        <div key={i} className="group cursor-pointer flex gap-10 items-center">
                                            <span className="text-4xl font-black opacity-10 group-hover:opacity-100 transition-opacity italic">0{i + 1}</span>
                                            <div className="flex-1 border-b border-black/5 pb-8 group-hover:border-black transition-colors">
                                                <h4 className="text-xl font-black uppercase tracking-tightest mb-1">{item.title}</h4>
                                                <p className="text-sm font-medium opacity-40 uppercase tracking-widest">{item.desc}</p>
                                            </div>
                                            <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative aspect-square rounded-[80px] overflow-hidden bg-zinc-100 group">
                                <Image
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
                                    alt="Process"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm">
                                    <button className="h-16 px-10 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full">Explore_Process</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PORTFOLIO MASONRY */}
                    <section className="py-40 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {projects.map((project, i) => (
                            <motion.div
                                key={i}
                                className="group relative"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-10 cursor-pointer">
                                    <Image
                                        src={project.img}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    <div className="absolute top-10 right-10 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end px-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-2">{project.category}</p>
                                        <h3 className="text-4xl font-black uppercase tracking-tighter italic">{project.title}</h3>
                                    </div>
                                    <span className="text-[10px] font-black opacity-20">{project.year}</span>
                                </div>
                            </motion.div>
                        ))}
                    </section>

                    {/* SOCIAL FOOTER */}
                    <footer className="py-40 border-t border-white/5 flex flex-col items-center gap-16">
                        <div className="flex gap-12">
                            {[Instagram, Dribbble, Twitter, Figma].map((Icon, i) => (
                                <Icon key={i} className="w-6 h-6 opacity-20 hover:opacity-100 cursor-pointer transition-opacity" />
                            ))}
                        </div>
                        <div className="text-center space-y-4">
                            <span className="text-3xl font-black tracking-widest uppercase italic">{blueprint?.name}</span>
                            <p className="text-[8px] font-black uppercase tracking-[1em] opacity-20">Sovereign Visual Engine. v1.0. Zero-Human Logic.</p>
                        </div>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
