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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { categories, templates, Template } from "@/data/template-data";
import { getTemplateFeatureLabel } from "@/lib/utils/template-feature-label";
import CategoryFilter from "./CategoryFilter";
import { getPublicStoresAction } from "@/app/actions/store-actions";


export default function ShowcaseGallery() {
    const t = useTranslations('Showcase');
    const { updateBlueprint } = useTemplateEditor();
    const onOpen = useLaunchModal((state) => state.onOpen);
    const router = useRouter();
    const [featuredSites, setFeaturedSites] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");

    // Localize categories
    const localizedCategories = categories.map(cat => ({
        ...cat,
        label: t(`tabs.${cat.id}`)
    }));

    useEffect(() => {
        const fetchFeatured = async () => {
            const result = await getPublicStoresAction(6);
            if (result.success && result.data) {
                setFeaturedSites(result.data);
            }
        };
        fetchFeatured();
    }, []);


    const filteredTemplates = activeCategory === "all"
        ? templates
        : templates.filter(t => t.category === activeCategory);

    const translateFeature = (feature: string) => getTemplateFeatureLabel(t, feature);

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

    const handleEdit = (themeId: string) => {
        const allThemes = SITE_TEMPLATES.categories.flatMap(c => c.themes);
        const theme = allThemes.find(t => t.id === themeId);

        if (theme) {
            updateBlueprint(theme.blueprint);
            router.push('/customizer');
        } else {
            onOpen(themeId);
        }
    };

    return (
        <div className="space-y-32">
            {/* CATEGORY NAV - WIX STYLE */}
            <div className="flex flex-col items-center space-y-8 mb-16">
                <CategoryFilter
                    categories={localizedCategories}
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
                            className="group relative bg-[#0A2540]/5 border border-white/5 rounded-[40px] overflow-hidden hover:border-[#00D09C]/50 hover:shadow-[0_0_30px_rgba(0,208,156,0.1)] transition-all duration-700"
                        >
                            {/* Preview Image */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                    src={template.image}
                                    alt={t(`projects.${template.id}.title`)}
                                    fill
                                    className="object-cover grayscale-[0.8] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-transparent to-transparent" />

                                {template.badge && (
                                    <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#00D09C] rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl z-20">
                                        {template.badge}
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[4px]">
                                    <div className="flex flex-col gap-4">
                                        <Button
                                            onClick={() => handlePreview(template.id)}
                                            className="bg-white text-[#0A2540] hover:bg-[#00D09C] hover:text-white font-black uppercase tracking-widest text-[10px] px-10 py-7 rounded-2xl shadow-2xl transition-all active:scale-95 border-none"
                                        >
                                            {t('preview')}
                                        </Button>
                                        <Button
                                            onClick={() => handleEdit(template.id)}
                                            variant="outline"
                                            className="bg-transparent border-white/20 text-white hover:border-[#00D09C] hover:text-[#00D09C] font-black uppercase tracking-widest text-[10px] px-10 py-7 rounded-2xl backdrop-blur-md transition-all active:scale-95"
                                        >
                                            {t('edit')}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="w-3.5 h-3.5 text-[#00D09C]" />
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{template.category}</span>
                                </div>
                                <h4 className="text-2xl font-black text-foreground mb-4 uppercase tracking-tighter italic">
                                    {t(`projects.${template.id}.title`)}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                    {t(`projects.${template.id}.desc`)}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {template.features.slice(0, 3).map(f => (
                                        <span key={f} className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#0A2540]/5 border border-white/5 rounded-md text-gray-400">
                                            {translateFeature(f)}
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
                        <div className="w-20 h-20 bg-[#00D09C]/10 rounded-[32px] flex items-center justify-center border border-[#00D09C]/20 mb-4 animate-pulse">
                            <Layers className="w-10 h-10 text-[#00D09C]" />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter italic">{t('live_title')}</h3>
                        <p className="text-[#00D09C] text-sm font-bold uppercase tracking-[0.3em]">{t('live_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredSites.map((site) => (
                            <motion.div
                                key={site.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="group relative bg-[#0A2540]/5 border border-white/5 rounded-[40px] p-2 hover:border-[#00D09C]/30 transition-all duration-700 backdrop-blur-sm"
                            >
                                <div className="aspect-[16/10] relative rounded-[32px] overflow-hidden">
                                    <Image
                                        src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop`}
                                        alt={site.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/90 via-[#0A2540]/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xl font-bold text-white uppercase tracking-tight italic">{site.name}</h4>
                                                <p className="text-[#00D09C] text-[10px] font-black uppercase tracking-widest">{site.site_type || "Sovereign Node v1.0"}</p>
                                            </div>
                                            <Button
                                                onClick={() => window.open(`https://${site.slug}.getyousite.com`, '_blank')}
                                                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#00D09C] hover:text-white backdrop-blur-xl border border-white/10 p-0 transition-all group/btn"
                                            >
                                                <ArrowRight size={20} className="text-white group-hover/btn:scale-110 transition-transform" />
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








