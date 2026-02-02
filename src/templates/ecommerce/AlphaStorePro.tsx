"use client";

import SovereignWrapper from "../SovereignWrapper";
import {
    ShoppingBag,
    Search,
    User,
    Filter,
    ArrowRight,
    Star,
    Plus
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import { SovereignImage } from "@/components/ui/sovereign-image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import Logo from "@/components/ui/Logo";

interface Section {
    type: string;
    content: Record<string, unknown>;
}

interface Product {
    name: string;
    price: string;
    img: string;
}

export default function AlphaStore({ settings, blueprint }: SovereignTemplateProps) {
    // Modular Data Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === 'hero');
    const heroHeadline = (heroSection?.content?.headline as string) || "SOVEREIGN \n COLLECTION";
    const heroImage = (heroSection?.content?.image as string) || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430";

    // Products (Modular: Extract from features/custom or fallback)
    const productsSection = blueprint?.layout?.find((s) => s.type === 'features' || s.type === 'custom');
    const products = (productsSection?.content?.products as Product[]) || [
        { name: "Quantum Fabric 01", price: "$240", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2430" },
        { name: "Neural Shell", price: "$580", img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2430" },
        { name: "Astra Lens", price: "$1,200", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2430" },
        { name: "Sovereign Core", price: "$89", img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2430" }
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper>
            {({ settings, onOpen }) => (
                <div
                    className="bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white min-h-screen"
                    style={{ fontFamily: settings.fontFamily }}
                >
                    {/* DIVI-INSPIRED ALPHA NAV (PRO) */}
                    <nav className="h-28 border-b border-zinc-100 px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100]">
                        <Logo className="invert" showText={true} />

                        <div className="hidden lg:flex items-center gap-16 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Catalog_Archive</span>
                            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Sovereign_Drop</span>
                            <span className="hover:text-zinc-950 transition-colors cursor-pointer">Affiliates</span>
                            <div className="flex items-center gap-8 pl-10 border-l border-zinc-100">
                                <Search className="w-5 h-5 text-zinc-950 hover:scale-110 transition-transform cursor-pointer" />
                                <User className="w-5 h-5 text-zinc-950 hover:scale-110 transition-transform cursor-pointer" />
                                <div className="relative cursor-pointer" onClick={() => onOpen("Cart")}>
                                    <ShoppingBag className="w-5 h-5 text-zinc-950" />
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-zinc-950 text-white rounded-full flex items-center justify-center text-[7px] font-black">2</div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* STORE HERO (PRO TRANSCRIPTION) */}
                    <section className="px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1920px] mx-auto">
                        <div className="lg:col-span-8 relative aspect-[21/9] rounded-[40px] bg-zinc-100 overflow-hidden group cursor-pointer" onClick={() => onOpen("Season Drop")}>
                            <SovereignImage
                                src={heroImage}
                                alt="Pro Showcase"
                                fill
                                className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                            />
                            <div className="absolute inset-x-12 bottom-12 max-w-xl">
                                <h2 className="text-white text-7xl font-black uppercase leading-none tracking-tightest mb-8 whitespace-pre-line">
                                    {heroHeadline}
                                </h2>
                                <button className="px-12 h-16 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:invert transition-all">
                                    Discover_Now
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-zinc-950 rounded-[40px] p-12 text-white flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-8 block">Exclusive_Access</span>
                                <h3 className="text-5xl font-black leading-tight italic tracking-tighter mb-6">
                                    Neural <br /> Textures 01.
                                </h3>
                                <p className="text-zinc-500 font-medium italic">High-fidelity materials transcribed for the new digital era. Limited release.</p>
                            </div>
                            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => onOpen("View Textures")}>
                                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em]">View_Dossier</span>
                            </div>
                        </div>
                    </section>

                    {/* PRODUCT GRID (DIVI-INSPIRED PRO) */}
                    <section className="px-10 py-32 bg-zinc-50 rounded-t-[100px]">
                        <div className="flex items-end justify-between mb-24">
                            <div>
                                <h2 className="text-5xl font-black tracking-tightest uppercase italic font-serif">Curated Assets.</h2>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Transcribed from Sovereign Archives</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] px-6 py-3 border border-zinc-200 hover:border-zinc-900 transition-colors">
                                    <Filter className="w-3 h-3" /> Filter_Silo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                            {products.map((product, i) => (
                                <ProductCard key={i} name={product.name} price={product.price} img={product.img} />
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </SovereignWrapper>
    );
}

interface ProductCardProps {
    name: string;
    price: string;
    img: string;
    settings: unknown;
}

function ProductCard({ name, price, img }: Omit<ProductCardProps, 'settings'>) {
    return (
        <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden bg-white shadow-sm group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700">
                <SovereignImage src={img} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* QUICK ACTIONS */}
                <div className="absolute inset-x-6 bottom-6 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <button className="flex-1 h-14 bg-white text-zinc-950 font-black text-[9px] uppercase tracking-widest hover:bg-zinc-950 hover:text-white transition-all shadow-xl">
                        Quick_Buy
                    </button>
                    <button className="w-14 h-14 bg-white text-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-xl">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="mt-8 flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-md font-bold uppercase tracking-tightest">{name}</h3>
                    <div className="flex gap-0.5 text-orange-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-current" />)}
                    </div>
                </div>
                <div className="text-xl font-black italic">{price}</div>
            </div>
        </div>
    );
}
