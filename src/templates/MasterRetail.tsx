"use client";

import { motion } from "framer-motion";
import SovereignWrapper from "./SovereignWrapper";
import {
    ShoppingBag,
    Search,
    User,
    Filter,
    ArrowRight,
    Star,
    Plus,
    Tag,
    Truck,
    Shield,
    CheckCircle2,
} from "lucide-react";
import { SovereignTemplateProps } from "@/lib/types/template";
import { SovereignImage } from "@/components/ui/sovereign-image";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import Logo from "@/components/ui/Logo";
import Image from "next/image";

interface Product {
    name: string;
    price: string;
    img: string;
}

export default function MasterRetail(props: SovereignTemplateProps) {
    const { settings, blueprint } = props;
    const { headline, subheadline, primaryColor = "#1a1a1a" } = settings;

    // Modular Extraction
    const heroSection = blueprint?.layout?.find((s) => s.type === "hero");
    const heroHeadline = (heroSection?.content?.headline as string) || headline;
    const heroSubheadline = (heroSection?.content?.subheadline as string) || subheadline;
    const heroImage =
        (heroSection?.content?.image as string) ||
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2430";

    const productsSection = blueprint?.layout?.find((s) => s.type === "features");
    // Inject dynamic products if available, with intelligent fallback mapping
    const products = (productsSection?.content?.products as Product[]) || [
        {
            name: productsSection?.content?.items?.[0]?.title || "Industrial Essential",
            price: "$120",
            img:
                productsSection?.content?.items?.[0]?.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop",
        },
        {
            name: productsSection?.content?.items?.[1]?.title || "Classic Performance",
            price: "$450",
            img:
                productsSection?.content?.items?.[1]?.image ||
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2430",
        },
        {
            name: productsSection?.content?.items?.[2]?.title || "Core Asset",
            price: "$890",
            img:
                productsSection?.content?.items?.[2]?.image ||
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2430",
        },
        {
            name: productsSection?.content?.items?.[3]?.title || "Shift 01",
            price: "$65",
            img:
                productsSection?.content?.items?.[3]?.image ||
                "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2430",
        },
    ];

    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <SovereignWrapper {...props}>
            {() => (
                <div className="bg-white text-zinc-900 min-h-screen selection:bg-zinc-950 selection:text-white">
                    {/* RETAIL NAVIGATION */}
                    <nav className="h-24 px-10 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-[100]">
                        <div className="flex items-center gap-10">
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                {blueprint?.name || "RETAIL"}
                            </span>
                            <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <span className="hover:text-zinc-900 cursor-pointer">Shop</span>
                                <span className="hover:text-zinc-900 cursor-pointer">
                                    New_Arrivals
                                </span>
                                <span className="hover:text-zinc-900 cursor-pointer">Archive</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Search className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-zinc-900 transition-colors" />
                            <div className="relative cursor-pointer" onClick={() => onOpen("Cart")}>
                                <ShoppingBag className="w-6 h-6 text-zinc-900" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-950 text-white rounded-full flex items-center justify-center text-[8px] font-black">
                                    3
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* HERO SHOWCASE */}
                    <section className="px-6 py-12 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1920px] mx-auto">
                        <div className="lg:col-span-8 relative aspect-[16/9] lg:aspect-auto lg:h-[700px] rounded-[48px] overflow-hidden group">
                            <Image
                                src={heroImage}
                                alt="Collection"
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
                            <div className="absolute inset-x-12 bottom-12">
                                <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-6 whitespace-pre-line drop-shadow-2xl">
                                    {heroHeadline}
                                </h1>
                                <button
                                    className="px-10 h-16 text-white font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-2xl"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Explore_Collection
                                </button>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-zinc-50 rounded-[48px] p-12 flex flex-col justify-between border border-zinc-100 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-10">
                                    <Tag className="w-4 h-4" /> Limited_Release
                                </div>
                                <h2 className="text-5xl font-black tracking-tightest leading-none mb-6">
                                    Strategic <br /> Materiality 01.
                                </h2>
                                <p className="text-zinc-500 font-medium leading-relaxed">
                                    {heroSubheadline}
                                </p>
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase text-zinc-400">
                                        Next_Drop
                                    </span>
                                    <span className="text-xs font-black">48:12:00</span>
                                </div>
                                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: primaryColor }}
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                    />
                                </div>
                            </div>

                            {/* Abstract Decor */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full opacity-20"
                                style={{ backgroundColor: primaryColor }}
                            />
                        </div>
                    </section>

                    {/* CORE BENEFITS */}
                    <section className="py-20 bg-white">
                        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 border-y border-zinc-100 py-10">
                            {[
                                {
                                    icon: Truck,
                                    title: "Global Logistics",
                                    desc: "Express delivery protocol to 180+ countries.",
                                },
                                {
                                    icon: Shield,
                                    title: "Secure Checkout",
                                    desc: "Identity protection via end-to-end encryption.",
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "Quality Audit",
                                    desc: "Every asset hand-verified for engineering truth.",
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-zinc-900" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                                            {item.title}
                                        </h4>
                                        <p className="text-[11px] text-zinc-500 font-bold uppercase">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* PRODUCT MATRIX */}
                    <section className="py-32 bg-zinc-50">
                        <div className="px-6 lg:px-12">
                            <div className="flex items-end justify-between mb-20">
                                <div>
                                    <h2 className="text-6xl font-black uppercase tracking-tighter italic">
                                        The_Archives.
                                    </h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mt-2">
                                        Filter by high-fidelity category
                                    </p>
                                </div>
                                <button className="h-14 px-8 border border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:border-zinc-900 transition-colors flex items-center gap-3 bg-white">
                                    <Filter className="w-4 h-4" /> Filter_Silo
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                                {products.map((product, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-700">
                                            <Image
                                                src={product.img}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-x-6 bottom-6 flex gap-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                                <button className="flex-1 h-16 text-[10px] font-black uppercase tracking-widest bg-white shadow-xl hover:bg-zinc-950 hover:text-white transition-all">
                                                    Quick_Buy
                                                </button>
                                                <button className="w-16 h-16 bg-white shadow-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-between items-start px-2">
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-tight italic">
                                                    {product.name}
                                                </h3>
                                                <div className="flex gap-1 mt-1">
                                                    {[1, 2, 3, 4, 5].map((j) => (
                                                        <Star
                                                            key={j}
                                                            className="w-3 h-3 text-zinc-200 fill-zinc-200"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-2xl font-black italic">
                                                {product.price}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="py-20 px-10 border-t border-zinc-100 bg-white flex flex-col items-center gap-8">
                        <span className="text-3xl font-black tracking-tighter uppercase italic">
                            {blueprint?.name}
                        </span>
                        <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                            <span>Privacy</span>
                            <span>Orders</span>
                            <span>Sustainability</span>
                            <span>Legal</span>
                        </div>
                        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest mt-10">
                            © 2026 Professional Retail Infrastructure.
                        </p>
                    </footer>
                </div>
            )}
        </SovereignWrapper>
    );
}
