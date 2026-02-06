"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    Sparkles,
    Heart,
    Flower,
    Sun,
    Wind,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Star,
    Leaf,
    User,
    Award,
    Clock,
    Flame
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

interface Treatment {
    title: string;
    duration: string;
    price: string;
    img: string;
    desc: string;
}

export default function MasterWellness(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#f97316" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === 'hero');
    const wellnessSection = blueprint?.layout?.find((s) => s.type === 'features');

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroImg = (heroSection?.content?.image as string) || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2440&auto=format&fit=crop";

    const treatments = (wellnessSection?.content?.treatments as Treatment[]) || [
        { title: "Neutral Balance Ritual", duration: "90 MIN", price: "$180", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=2070&auto=format&fit=crop", desc: "Holistic alignment via high-fidelity botanical essence." },
        { title: "Kinetic Glow Therapy", duration: "60 MIN", price: "$120", img: "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=1974&auto=format&fit=crop", desc: "Advanced facial architecture for mission-critical radiance." },
        { title: "Sovereign Sauna Flux", duration: "45 MIN", price: "$65", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop", desc: "Thermal logic detoxification for absolute cellular integrity." }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#fff9f5] text-stone-900 min-h-screen selection:bg-orange-100 selection:text-orange-950 font-sans">
                    {/* WELLNESS NAVIGATION */}
                    <nav className="h-24 px-8 lg:px-20 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-3xl z-[100] border-b border-orange-50">
                        <div className="flex items-center gap-12">
                            <span className="text-xl font-black tracking-tightest uppercase italic flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-orange-600" />
                                </div>
                                {blueprint?.name || "WELLNESS"}
                            </span>
                            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">Treatments</span>
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">The_Experience</span>
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">Philosophy</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpen("Booking")}
                            className="h-12 px-8 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
                        >
                            Book_Experience
                        </button>
                    </nav>

                    {/* HERO TRANQUILITY ENGINE */}
                    <section className="pt-32 pb-24 px-6 relative">
                        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="relative aspect-square rounded-[100px] overflow-hidden shadow-2xl"
                            >
                                <Image
                                    src={heroImg}
                                    alt="Wellness"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-stone-950/5" />
                                <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                                    <Sun className="w-8 h-8 text-white" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="space-y-12"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-orange-50 shadow-sm">
                                    <Leaf className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-widest font-sans">Sovereign Serenity Protocol Verified</span>
                                </div>
                                <h1 className="text-6xl md:text-[8vw] font-black tracking-tightest leading-[0.82] text-stone-950 italic uppercase">
                                    {heroHeadline.split(' ')[0]} <br />
                                    <span className="text-orange-500">{heroHeadline.split(' ').slice(1).join(' ')}</span>
                                </h1>
                                <p className="text-xl text-stone-400 max-w-xl leading-relaxed font-medium">
                                    {subheadline}
                                </p>
                                <div className="flex flex-wrap gap-6 pt-6 font-sans">
                                    <button className="h-20 px-12 bg-stone-950 text-white font-black uppercase tracking-widest text-[11px] rounded-[32px] hover:scale-105 transition-transform flex items-center justify-center gap-4">
                                        View_Treatments <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* WELLNESS PILLARS */}
                    <section className="py-32 bg-white">
                        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                            {[
                                { icon: Flame, title: "Detox Logic", label: "Cellular Integrity" },
                                { icon: Wind, title: "Breath Arc", label: "Neural Drift" },
                                { icon: Heart, title: "Core Flow", label: "Biological Sync" },
                                { icon: Award, title: "Certified Care", label: "Elite Standard" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className="w-20 h-20 rounded-[35px] bg-orange-50 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-10 h-10 text-orange-500" />
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-2">{stat.title}</h4>
                                    <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* TREATMENT CATALOG */}
                    <section className="py-40">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                                <div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic">The_Treatments.</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mt-6 font-sans">Optimized Biological Assets</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
                                {treatments.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="group cursor-pointer space-y-8"
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-xl">
                                            <Image
                                                src={item.img}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-[3s]"
                                            />
                                            <div className="absolute inset-0 bg-stone-950/10 group-hover:bg-transparent transition-colors" />
                                            <div className="absolute top-10 right-10 w-20 h-20 bg-white/90 backdrop-blur-xl rounded-full flex flex-col items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                                                <span className="text-xs font-black">{item.price}</span>
                                                <span className="text-[8px] font-black text-orange-500">{item.duration}</span>
                                            </div>
                                        </div>
                                        <div className="px-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tight italic mb-4">{item.title}</h3>
                                            <p className="text-stone-400 font-medium leading-relaxed font-sans text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* TESTIMONIAL LOUNGE */}
                    <section className="py-40 bg-white">
                        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="relative h-[500px] rounded-[60px] overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecee?q=80&w=2070&auto=format&fit=crop"
                                    alt="Testimonial"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-12">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-orange-500 fill-orange-500" />)}
                                </div>
                                <h3 className="text-4xl font-black uppercase leading-none italic italic">"The Sovereign Serenity protocol is the only benchmark for modern wellness architecture."</h3>
                                <div className="flex items-center gap-6 font-sans">
                                    <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                                        <User className="w-7 h-7 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest">Sovereign_Client</p>
                                        <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Aesthetic Index: 9.8</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* WELLNESS FOOTER */}
                    <footer className="py-24 border-t border-orange-50 flex flex-col items-center gap-10 font-sans">
                        <span className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                            <Flower className="w-5 h-5 text-orange-600" /> {blueprint?.name}
                        </span>
                        <div className="flex flex-wrap justify-center gap-12 text-[9px] font-black uppercase tracking-[0.5em] text-stone-300">
                            <span>Experience</span>
                            <span>Aromas</span>
                            <span>Sanctuary</span>
                            <span>Legal</span>
                        </div>
                        <p className="text-[9px] text-stone-200 font-bold uppercase tracking-[1em] mt-12 text-center px-4">© 2026 Sovereign Wellness Infrastructure. Biological Optimization Verified.</p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
