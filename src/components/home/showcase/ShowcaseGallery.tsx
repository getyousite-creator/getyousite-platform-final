"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SITE_TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SiteBlueprint } from "@/lib/schemas";
import { ArrowRight, Box, Layers, Sparkles, Globe } from "lucide-react";
import Image from "next/image";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { categories, templates, Template } from "@/data/template-data";
import CategoryFilter from "./CategoryFilter";

export default function ShowcaseGallery() {
    const { updateBlueprint } = useTemplateEditor();
    const onOpen = useLaunchModal((state) => state.onOpen);
    const [featuredSites, setFeaturedSites] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");

    useEffect(() => {
        const fetchFeatured = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('stores')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(6);

            if (data) setFeaturedSites(data);
        };
        fetchFeatured();
    }, []);

    const filteredTemplates = activeCategory === "all"
        ? templates
        : templates.filter(t => t.category === activeCategory);

    const handlePreview = (themeId: string) => {
        // Find the matching blueprint in SITE_TEMPLATES
        const allThemes = SITE_TEMPLATES.categories.flatMap(c => c.themes);
        const theme = allThemes.find(t => t.id === themeId);

        if (theme) {
            updateBlueprint(theme.blueprint);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Optionally redirect to customizer if not already there
        } else {
            // Fallback for demo URL
            const template = templates.find(t => t.id === themeId);
            if (template?.demoUrl) {
                window.open(template.demoUrl, '_blank');
            }
        }
    };

    return (
        <div className="space-y-32">
            {/* CATEGORY NAV - WIX STYLE */}
            <div className="flex flex-col items-center space-y-8 mb-16">
                <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />
            </div>

            {/* MAIN TEMPLATE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                    {filteredTemplates.map((template) => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-zinc-900/50 border border-white/5 rounded-[40px] overflow-hidden hover:border-blue-500/50 hover:shadow-[0_0_80px_rgba(37,99,235,0.15)] transition-all duration-700"
                        >
                            {/* Preview Image */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                    src={template.image}
                                    alt={template.title}
                                    fill
                                    className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                                {template.badge && (
                                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                                        {template.badge}
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                                    <div className="flex flex-col gap-4">
                                        <Button
                                            onClick={() => handlePreview(template.id)}
                                            className="bg-white text-black hover:bg-zinc-100 font-black uppercase tracking-widest text-[10px] px-10 py-7 rounded-2xl shadow-2xl transition-transform active:scale-95"
                                        >
                                            View Demo Site
                                        </Button>
                                        <Button
                                            onClick={() => onOpen(template.title)}
                                            variant="outline"
                                            className="bg-black/50 border-white/20 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-[10px] px-10 py-7 rounded-2xl backdrop-blur-md transition-all active:scale-95"
                                        >
                                            Edit This Site
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{template.category}</span>
                                </div>
                                <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">{template.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {template.features.slice(0, 3).map(f => (
                                        <span key={f} className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-zinc-400">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* LIVE DEPLOYMENTS SECTION - PROOF OF POWER */}
            {featuredSites.length > 0 && activeCategory === "all" && (
                <div className="pt-32 border-t border-white/5 space-y-16">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-[32px] flex items-center justify-center border border-blue-600/20 mb-4">
                            <Layers className="w-10 h-10 text-blue-400" />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">Live Masterpieces</h3>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-[0.3em]">The Sovereignty of Real Businesses</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredSites.map((site) => (
                            <motion.div
                                key={site.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="group relative bg-zinc-950 border border-white/5 rounded-[40px] p-2 hover:border-blue-500/30 transition-all duration-700"
                            >
                                <div className="aspect-[16/10] relative rounded-[32px] overflow-hidden">
                                    <Image
                                        src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop`}
                                        alt={site.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xl font-bold text-white uppercase tracking-tight italic">{site.name}</h4>
                                                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{site.site_type || "Sovereign Deployment"}</p>
                                            </div>
                                            <Button
                                                onClick={() => window.open(`https://${site.slug}.getyousite.com`, '_blank')}
                                                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white hover:text-black backdrop-blur-xl border border-white/10 p-0"
                                            >
                                                <ArrowRight size={24} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

