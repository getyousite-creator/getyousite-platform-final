"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import { UtensilsCrossed, Clock, MapPin, ChefHat, CalendarCheck, Phone } from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";

interface MenuItem {
    name: string;
    price: string;
    description: string;
    img: string;
    category?: string;
}

export default function MasterResto(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#c2410c" } = settings;

    // AI Blueprint Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === "hero");
    const menuSection = blueprint?.layout?.find((s) => s.type === "features");
    const aboutSection = blueprint?.layout?.find((s) => s.type === "about");

    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSub = (heroSection?.content?.subheadline as string) || subheadline;
    const heroImg =
        (heroSection?.content?.image as string) ||
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop";

    // About/Philosophy Images (Use AI injected or Fallback)
    const aboutImg1 =
        (aboutSection?.content?.image as string) ||
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop";
    const aboutImg2 =
        (aboutSection?.content?.images?.[1]?.src as string) ||
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop";

    const menuItems = (menuSection?.content?.menu as MenuItem[]) || [
        {
            name: "Chef&apos;s Signature",
            price: "$42",
            description: "Aged Wagyu, truffle essence, wild marrow.",
            img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
        },
        {
            name: "Atlas Platter",
            price: "$28",
            description: "Mediterranean heritage selection.",
            img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop",
        },
        {
            name: "Neon Spice",
            price: "$19",
            description: "South-East Asian high-intensity fusion.",
            img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
        },
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-[#fafaf9] text-stone-900 min-h-screen selection:bg-orange-100 selection:text-orange-900 font-serif">
                    {/* RESTO NAVIGATION */}
                    <nav className="h-24 px-8 lg:px-20 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-[100] border-b border-stone-100">
                        <div className="flex items-center gap-12">
                            <span className="text-2xl font-black tracking-tighter uppercase italic font-sans">
                                {blueprint?.name || "THE_KITCHEN"}
                            </span>
                            <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 font-sans">
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">
                                    Menû
                                </span>
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">
                                    Private_Table
                                </span>
                                <span className="hover:text-stone-900 cursor-pointer transition-colors">
                                    Philosophy
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onOpen("Reservation")}
                            className="h-14 px-8 border border-stone-200 text-[10px] font-black uppercase tracking-widest hover:bg-stone-950 hover:text-white transition-all font-sans"
                        >
                            Reserve_Table
                        </button>
                    </nav>

                    {/* HERO ATMOSPHERE */}
                    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                        <Image
                            src={heroImg}
                            alt="Atmosphere"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-stone-950/40" />

                        <div className="relative z-10 text-center px-6 max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.5em] mb-8 block font-sans">
                                    Excellence Culinary Standards
                                </span>
                                <h1 className="text-white text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-10 drop-shadow-2xl font-serif italic text-balance">
                                    {heroHeadline}
                                </h1>
                                <button
                                    onClick={() => onOpen("Menu")}
                                    className="px-14 h-20 text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform shadow-2xl font-sans"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    View_Menu
                                </button>
                            </motion.div>
                        </div>
                    </section>

                    {/* PHILOSOPHY GRID */}
                    <section className="py-32 px-6 lg:px-12 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 space-y-8">
                            <div className="w-16 h-[1px] bg-stone-900" />
                            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">
                                Engineering <br /> The Perfect Bite.
                            </h2>
                            <p className="text-stone-500 text-lg font-medium leading-relaxed font-sans italic">
                                {heroSub}
                            </p>
                            <div className="flex flex-col gap-6 pt-10">
                                {[
                                    {
                                        icon: ChefHat,
                                        title: "Executive Chefs",
                                        desc: "Mastery directed by tradition and innovation.",
                                    },
                                    {
                                        icon: UtensilsCrossed,
                                        title: "Zero-Waste Logic",
                                        desc: "Sustainability integrated into every recipe.",
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 items-start border-l-2 border-stone-100 pl-6"
                                    >
                                        <item.icon className="w-6 h-6 text-stone-900 shrink-0" />
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest mb-1 font-sans">
                                                {item.title}
                                            </h4>
                                            <p className="text-[11px] text-stone-400 font-bold uppercase font-sans tracking-wide">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-7 grid grid-cols-2 gap-6 h-[600px]">
                            <div className="relative rounded-[40px] overflow-hidden translate-y-12">
                                <Image src={aboutImg1} alt="Detail" fill className="object-cover" />
                            </div>
                            <div className="relative rounded-[40px] overflow-hidden -translate-y-12">
                                <Image src={aboutImg2} alt="Detail" fill className="object-cover" />
                            </div>
                        </div>
                    </section>

                    {/* DYNAMIC MENU MATRIX */}
                    <section className="py-32 bg-stone-900 text-white">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-4">
                                <div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter italic">
                                        L&apos;Archive Menû.
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500 mt-4 font-sans">
                                        Seasonal Chef Selections
                                    </p>
                                </div>
                                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-stone-600 font-sans">
                                    <span className="text-white border-b border-white pb-2 cursor-pointer">
                                        Starters
                                    </span>
                                    <span className="hover:text-white cursor-pointer transition-colors pb-2">
                                        Main_Assets
                                    </span>
                                    <span className="hover:text-white cursor-pointer transition-colors pb-2">
                                        Elixirs
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20">
                                {menuItems.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="group cursor-pointer"
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors" />
                                            <div className="absolute top-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-900 text-xl font-black italic shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                                {item.price}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight italic border-b border-white/5 pb-4 mb-4">
                                            {item.name}
                                        </h3>
                                        <p className="text-stone-500 font-medium leading-relaxed font-sans uppercase text-[10px] tracking-widest">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* LOCATION & RESERVATION CTAs */}
                    <section className="py-40 bg-white">
                        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
                            <div className="space-y-12">
                                <h2 className="text-5xl font-black uppercase tracking-tighter italic">
                                    Foundations.
                                </h2>
                                <div className="space-y-10">
                                    <div className="flex gap-6 items-center">
                                        <MapPin className="w-8 h-8 text-stone-300" />
                                        <div className="font-sans">
                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                                                Location
                                            </p>
                                            <p className="text-lg font-bold">
                                                12 Central District, Casablanca, MA
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <Clock className="w-8 h-8 text-stone-300" />
                                        <div className="font-sans">
                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                                                Service Hours
                                            </p>
                                            <p className="text-lg font-bold">
                                                MON - SUN: 12:00 - 01:00
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-center">
                                        <Phone className="w-8 h-8 text-stone-300" />
                                        <div className="font-sans">
                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                                                Direct Line
                                            </p>
                                            <p className="text-lg font-bold">+212 522 XXX XXX</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="rounded-[60px] p-20 flex flex-col items-center justify-center text-center gap-10 text-white relative overflow-hidden"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <CalendarCheck className="w-20 h-20 opacity-20" />
                                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tightest italic leading-none">
                                    Initiate <br /> The_Table.
                                </h3>
                                <button className="h-16 px-14 bg-white text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl font-sans">
                                    Reserve_Now
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="py-20 border-t border-stone-100 flex flex-col items-center gap-8 font-sans">
                        <span className="text-2xl font-black tracking-tighter uppercase italic">
                            {blueprint?.name}
                        </span>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.6em]">
                            © 2026 Professional Kitchen Architecture. All Systems Verified.
                        </p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
