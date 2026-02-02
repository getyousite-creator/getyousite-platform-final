"use client";

import { motion } from "framer-motion";
import { SITE_TEMPLATES, TemplateTheme } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { SiteBlueprint } from "@/lib/schemas";
import { ArrowRight, Box, Cpu, Layout, Layers } from "lucide-react";
import Image from "next/image";

export default function ShowcaseGallery() {
    const { updateBlueprint } = useTemplateEditor();

    const handlePreview = (theme: TemplateTheme) => {
        if (theme.blueprint) {
            updateBlueprint(theme.blueprint as SiteBlueprint);
            // Smooth scroll to top to see the new blueprint
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="space-y-24">
            {SITE_TEMPLATES.categories.map((category) => (
                <div key={category.id} className="space-y-12">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">{category.name}</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {category.themes.map((theme) => (
                            <motion.div
                                key={theme.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500"
                            >
                                {/* IMAGE CANVAS */}
                                <div className="aspect-[16/10] relative overflow-hidden">
                                    <Image
                                        src={theme.image}
                                        alt={theme.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                                    {/* COMPONENT TAGS */}
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                                        {theme.components.slice(0, 3).map((comp) => (
                                            <span key={comp} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white/70 uppercase tracking-widest font-black">
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="p-8 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="text-2xl font-bold text-white mb-2">{theme.name}</h4>
                                            <p className="text-zinc-500 text-sm">{theme.description}</p>
                                        </div>
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 15px ${theme.primaryColor}` }}
                                        />
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex gap-4 text-zinc-600">
                                            <Box size={16} />
                                            <Cpu size={16} />
                                            <Layers size={16} />
                                        </div>
                                        <Button
                                            onClick={() => handlePreview(theme)}
                                            variant="glow"
                                            className="rounded-full px-8 group/btn"
                                        >
                                            Instant Preview <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
