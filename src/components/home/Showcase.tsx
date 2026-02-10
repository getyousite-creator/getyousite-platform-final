"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLaunchModal } from "@/hooks/use-launch-modal";

import { categories, templates, Template } from "@/data/template-data";
import TemplateCard from "./showcase/TemplateCard";
import ShowcaseEditor from "./showcase/ShowcaseEditor";

import ShowcaseGallery from "./showcase/ShowcaseGallery";

export default function Showcase() {
    const openLaunchModal = useLaunchModal((state) => state.onOpen);

    return (
        <section id="showcase" className="py-32 bg-[#020617] relative overflow-hidden">
            {/* Logic Mesh Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 opacity-70" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 opacity-70" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section - GYS-V2 Precision */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-[0.3em] mb-10"
                        >
                            Professional Architecture Library
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-8xl font-bold text-white mb-10 leading-[1.05] tracking-tight"
                        >
                            Engineered for <span className="text-primary italic font-light">Peak Performance</span>
                        </motion.h2>
                        <p className="text-white/40 text-xl leading-relaxed max-w-2xl font-light">
                            Every template is a battle-tested industrial blueprint. Optimized for global speed and ready to be deployed as a high-performance business asset.
                        </p>
                    </div>
                    <Button
                        className="h-16 px-12 bg-primary hover:bg-[#2563eb] text-[#020617] font-bold tracking-widest uppercase text-xs shadow-[0_0_40px_rgba(59,130,246,0.3)] group transition-all rounded-xl"
                        onClick={() => openLaunchModal()}
                    >
                        Custom Build Request <ArrowUpRight className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </div>

                {/* DYNAMIC GALLERY CORE */}
                <div className="relative">
                    <ShowcaseGallery />
                </div>
            </div>
        </section>
    );
}
