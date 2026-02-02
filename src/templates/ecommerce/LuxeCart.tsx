"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Search, User, ArrowRight, Star, Truck } from "lucide-react";
import Image from "next/image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { useTemplateEditor } from "@/hooks/use-template-editor";

import { SovereignTemplateProps } from "@/lib/types/template";
import { SovereignImage } from "@/components/ui/sovereign-image";

export default function LuxeCart({ settings, blueprint }: SovereignTemplateProps) {
    const { primaryColor, secondaryColor, headline, subheadline, fontFamily } = settings;

    // Modular Data Extraction
    const heroSection = blueprint?.layout?.find((s: any) => s.type === 'hero');
    const heroHeadline = heroSection?.content?.headline || headline;
    const heroSubheadline = heroSection?.content?.subheadline || subheadline;
    const heroImage = heroSection?.content?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430";

    const updatePulse = useTemplateEditor((state) => state.updatePulse);
    const onOpen = useLaunchModal((state) => state.onOpen);

    // Products
    const productsSection = blueprint?.layout?.find((s: any) => s.type === 'features' || s.type === 'custom');
    const products = productsSection?.content?.products || [
        { name: "Astra Chrono", price: "$850", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2430" },
        { name: "Neon Mist", price: "$1,200", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2430" },
        { name: "Vault Bag", price: "$2,400", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=2430" },
        { name: "Core Lens", price: "$540", image: "https://images.unsplash.com/photo-1526170315830-ef18a283ac13?auto=format&fit=crop&q=80&w=2430" }
    ];

    return (
        <motion.div
            key={updatePulse}
            animate={{ opacity: [0.98, 1] }}
            className="w-full min-h-screen bg-white text-zinc-900"
            style={{ fontFamily }}
        >
            {/* Luxury Nav */}
            <nav className="px-12 py-6 flex items-center justify-between border-b border-zinc-100 uppercase tracking-tighter sticky top-0 bg-white z-50">
                <div className="flex items-center gap-8 text-[10px] font-bold text-zinc-400 hidden lg:flex">
                    <span className="hover:text-black cursor-pointer">Collections</span>
                    <span className="hover:text-black cursor-pointer">E-Boutique</span>
                </div>
                <div className="text-2xl font-black tracking-widest text-zinc-950 flex items-center gap-2 cursor-pointer" onClick={() => onOpen("LuxeCart Home")}>
                    LUXE<ShoppingBag className="w-5 h-5" style={{ color: primaryColor }} />CART
                </div>
                <div className="flex items-center gap-6">
                    <Search className="w-4 h-4 text-zinc-400 cursor-pointer" />
                    <User className="w-4 h-4 text-zinc-400 cursor-pointer" />
                    <div className="relative cursor-pointer" onClick={() => onOpen("Cart")}>
                        <ShoppingBag className="w-5 h-5 text-zinc-950" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[7px] text-white">2</span>
                    </div>
                </div>
            </nav>

            {/* Fashion Hero */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-zinc-100">
                <SovereignImage
                    src={heroImage}
                    alt="E-commerce Hero"
                    fill
                    className="object-cover object-center transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 text-center text-white px-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-9xl font-black uppercase mb-8 leading-[0.8] tracking-tighter"
                    >
                        {heroHeadline}
                    </motion.h1>
                    <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto opacity-90">
                        {heroSubheadline}
                    </p>
                    <button
                        onClick={() => onOpen("Shop Collection")}
                        className="px-12 py-5 rounded-none font-bold uppercase tracking-[0.2em] text-sm transition-all hover:bg-white hover:text-black"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Shop the Collection <ArrowRight className="inline-block ml-2 w-4 h-4" />
                    </button>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 px-12 bg-white">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-[0.5em] text-zinc-400">Curated Essentials</h2>
                    <div className="h-[1px] flex-1 mx-12 bg-zinc-100" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest hover:text-blue-500 cursor-pointer">View All</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-1px bg-zinc-100 border border-zinc-100">
                    {products.map((product: any, i: number) => (
                        <ProductCard key={i} name={product.name} price={product.price} image={product.image} onOpen={onOpen} />
                    ))}
                </div>
            </section>
        </motion.div>
    );
}

function ProductCard({ name, price, image, onOpen }: any) {
    return (
        <div className="bg-white p-8 group cursor-pointer" onClick={() => onOpen(name)}>
            <div className="relative aspect-[3/4] mb-8 overflow-hidden bg-zinc-50">
                <SovereignImage src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                    <span className="bg-white text-[8px] font-black px-3 py-1 uppercase tracking-widest border border-zinc-100 shadow-sm">New In</span>
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-1">{name}</h3>
                    <div className="flex text-amber-400 gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                    <p className="text-sm font-black">{price}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
