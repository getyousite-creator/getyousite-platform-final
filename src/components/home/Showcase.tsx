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
        <section id="showcase" className="py-32 bg-background relative overflow-hidden">
            {/* Background Orbs - Deep Spectrum */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section - Clinical Precision */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-secondary border border-border text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                        >
                            Professional Architecture Library
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black text-foreground mb-10 leading-[0.85] tracking-tighter uppercase"
                        >
                            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground">Peak Performance</span>
                        </motion.h2>
                        <p className="text-muted-foreground text-xl leading-relaxed max-w-xl font-medium">
                            Every template is a battle-tested industrial blueprint. Optimized for global speed and ready to be deployed as a high-performance business asset.
                        </p>
                    </div>
                    <Button
                        variant="default"
                        className="h-16 px-10 bg-primary hover:bg-primary/90 border-none text-primary-foreground font-black tracking-widest uppercase text-xs shadow-lg group"
                        onClick={() => openLaunchModal()}
                    >
                        Custom Build Request <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
