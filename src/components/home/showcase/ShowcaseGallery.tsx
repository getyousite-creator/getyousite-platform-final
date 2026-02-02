"use client";

import { motion } from "framer-motion";
import { SITE_TEMPLATES, TemplateTheme } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SiteBlueprint } from "@/lib/schemas";
import { ArrowRight, Box, Cpu, Layout, Layers } from "lucide-react";
import Image from "next/image";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function ShowcaseGallery() {
    const { updateBlueprint } = useTemplateEditor();
    const [featuredSites, setFeaturedSites] = useState<any[]>([]);

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

    const handlePreview = (blueprint: SiteBlueprint) => {
        updateBlueprint(blueprint);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-32">
            {/* FEATURED DEPLOYED SITES SECTION */}
            {featuredSites.length > 0 && (
                <div className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <Layers className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Deployed Masterpieces</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Real Businesses Running on Sovereign Infrastructure</p>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredSites.map((site) => (
                            <motion.div
                                key={site.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="group relative bg-zinc-900 border border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/30 hover:shadow-[0_0_50px_rgba(37,99,235,0.1)] transition-all duration-700"
                            >
                                <div className="aspect-video relative">
                                    <Image
                                        src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop`}
                                        alt={site.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                </div>
                                <div className="p-8">
                                    <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight italic">{site.name}</h4>
                                    <p className="text-zinc-500 text-xs font-medium mb-6 line-clamp-2">{site.description || "A high-performance digital empire deployed via Getyousite."}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">
                                            Live Deployment
                                        </div>
                                        <Button
                                            onClick={() => handlePreview(site.blueprint)}
                                            variant="ghost"
                                            className="text-white hover:text-blue-400 p-0 h-auto"
                                        >
                                            <ArrowRight size={20} />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* HARDCODED TEMPLATES SECTION */}
            <div className="space-y-12 opacity-80 pt-16 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                        <Box className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-zinc-400 uppercase tracking-tighter">Architecture Blueprints</h3>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Starting Points for Sovereign Deployment</p>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {SITE_TEMPLATES.categories.flatMap(c => c.themes).slice(0, 4).map((theme) => (
                        <motion.div
                            key={theme.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="group relative bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all"
                        >
                            <div className="aspect-[21/9] relative overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity">
                                <Image
                                    src={theme.image}
                                    alt={theme.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                            <div className="p-8 flex items-center justify-between">
                                <div>
                                    <h4 className="text-xl font-bold text-white uppercase tracking-tight">{theme.name}</h4>
                                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">{theme.description}</p>
                                </div>
                                <Button
                                    onClick={() => handlePreview(theme.blueprint)}
                                    variant="glow"
                                    className="h-12 w-12 rounded-full p-0 flex items-center justify-center"
                                >
                                    <ArrowRight size={18} />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

