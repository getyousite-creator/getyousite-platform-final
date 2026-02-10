"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from 'lucide-react';
import { ComponentLibrary } from './ComponentLibrary';

interface PreviewProps {
    config: any; // Data from CustomizerEngine
    isGenerating: boolean;
    selectedPageSlug?: string;
}

export const LivePreview: React.FC<PreviewProps> = ({ config, isGenerating, selectedPageSlug = 'index' }) => {
    // 1. Logic Hardening: Analytics Ingestion
    useEffect(() => {
        if (config?.id || config?.site_id) {
            const trackView = async () => {
                try {
                    await fetch('/api/dashboard/analytics', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            storeId: config.id || config.site_id,
                            path: `/${selectedPageSlug}`,
                            metadata: {
                                device: window.innerWidth < 768 ? 'mobile' : 'desktop',
                                referrer: document.referrer,
                                source: 'live_preview'
                            }
                        })
                    });
                } catch (e) {
                    console.error("ANALYTICS_INGEST_FAIL:", e);
                }
            };
            trackView();
        }
    }, [config?.id, config?.site_id]);

    // 2. Generation Logic: If generating and no config, show skeleton
    if (isGenerating && !config) {
        return <GenerationSkeleton />;
    }

    return (
        <div className="relative w-full h-full bg-card overflow-hidden shadow-2xl rounded-2xl border-4 border-border aspect-[9/16] md:aspect-[16/10]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={config?.site_id || 'initial'}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="w-full h-full overflow-y-auto scrollbar-hide"
                >
                    {/* DYNAMIC INJECTION ENGINE */}
                    <DynamicRenderer
                        blueprint={config?.final_config || config}
                        selectedPageSlug={selectedPageSlug}
                    />
                </motion.div>
            </AnimatePresence>

            {/* HUD: AI Processing Layer */}
            {isGenerating && <AIProcessingHUD />}
        </div>
    );
};

const DynamicRenderer = ({ blueprint, selectedPageSlug = 'index', isGenerating }: any) => {
    if (!blueprint && !isGenerating) return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Initializing Neural Link...</p>
        </div>
    );

    const primaryColor = blueprint?.theme?.primary || '#3b82f6';

    // Extract layout based on selected page
    let activeLayout = blueprint?.layout || [];
    if (blueprint?.pages && blueprint?.pages[selectedPageSlug]) {
        activeLayout = blueprint.pages[selectedPageSlug].layout || [];
    }

    // If generating and no layout yet, show skeleton sequence
    if (isGenerating && activeLayout.length === 0) {
        return (
            <div className="p-12 space-y-12">
                <div className="h-20 bg-white/[0.03] rounded-3xl animate-pulse w-full" />
                <div className="h-[400px] bg-white/[0.03] rounded-[3rem] animate-pulse w-full" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="h-48 bg-white/[0.03] rounded-3xl animate-pulse" />
                    <div className="h-48 bg-white/[0.03] rounded-3xl animate-pulse" />
                    <div className="h-48 bg-white/[0.03] rounded-3xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div style={{ '--primary-color': primaryColor } as any} className="min-h-full">
            {/* 1. Header Rendering */}
            <section id="preview-header" className={`border-b border-white/5 p-6 md:p-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-10 ${blueprint?.navigation?.transparent ? 'absolute inset-x-0 bg-transparent border-none' : ''}`}>
                <div className="font-black text-2xl tracking-tighter" style={{ color: primaryColor }}>
                    {blueprint?.navigation?.logo || blueprint?.name || "Sovereign_Site"}
                </div>
                <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
                    {blueprint?.navigation?.links ? (
                        blueprint.navigation.links.map((link: any, i: number) => (
                            <span key={i} className={selectedPageSlug === (link.href === '/' ? 'index' : link.href.replace('/', '')) ? 'text-primary' : ''}>
                                {link.label}
                            </span>
                        ))
                    ) : (
                        <>
                            <span>Logic_Home</span>
                            <span>Capabilities</span>
                            <span>Empire_Contact</span>
                        </>
                    )}
                </div>
            </section>

            {/* 2. Content Injection (Silos) */}
            {activeLayout.length > 0 ? (
                activeLayout.map((section: any, index: number) => (
                    <motion.div
                        key={section.id || index}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 70
                        }}
                    >
                        <ComponentLibrary
                            type={section.type}
                            content={section.content}
                            primaryColor={primaryColor}
                            backgroundColor={blueprint?.theme?.backgroundColor}
                            textColor={blueprint?.theme?.textColor}
                        />
                    </motion.div>

                ))
            ) : (
                <div className="flex flex-col items-center justify-center p-32 text-center space-y-8 min-h-[600px]">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                        <Layout className="w-8 h-8 text-white/20" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-widest text-white/80">Draft_Neural_Silo</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] max-w-xs mx-auto mt-4 leading-relaxed">
                            Generate this page in the Sovereign Architect to reveal the structural logic.
                        </p>
                    </div>
                </div>
            )}

            {/* 3. Footer Rendering */}
            <footer className="p-20 bg-black/40 border-t border-white/5 text-center">
                <div className="mb-10 flex justify-center gap-10">
                    {blueprint?.footer?.links?.map((link: any, i: number) => (
                        <span key={i} className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] cursor-pointer hover:text-white transition-colors">{link.label}</span>
                    ))}
                </div>
                <p className="text-[11px] text-white/10 uppercase tracking-[0.5em] font-black mb-6">
                    {blueprint?.footer?.copyright || `© 2026 ${blueprint?.name || 'Sovereign'} Systems Verified`}
                </p>
                <div className="flex justify-center gap-6 text-white/20">
                    {blueprint?.footer?.social && Object.entries(blueprint.footer.social).map(([platform, url]: any) => (
                        <span key={platform} className="text-[9px] font-black uppercase tracking-widest">{platform}_Secure</span>
                    ))}
                </div>
            </footer>
        </div>
    );
};


const AIProcessingHUD = () => (
    <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] pointer-events-none flex items-center justify-center z-50">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#020617]/90 text-primary p-8 font-mono text-[10px] rounded-[2rem] border border-primary/20 shadow-[0_32px_120px_rgba(0,0,0,0.5)] space-y-4 min-w-[300px]"
        >
            <div className="flex gap-4 items-center border-b border-white/5 pb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="font-black uppercase tracking-[0.3em]">Neural_Link_Status: Active</span>
            </div>
            <div className="space-y-2 opacity-60">
                <div className="flex justify-between"><span>{">"} INJECTING_STRATEGIC_LOGIC</span><span>DONE</span></div>
                <div className="flex justify-between"><span>{">"} SYNTHESIZING_ATOMIC_STACK</span><span className="animate-pulse">RUNNING</span></div>
                <div className="flex justify-between"><span>{">"} DEPLOYING_TO_EDGE</span><span>PENDING</span></div>
            </div>
            <div className="pt-4 border-t border-white/5 text-center text-white/20 uppercase tracking-[0.2em]">
                Protocol_v2_Sovereign
            </div>
        </motion.div>
    </div>
);


const GenerationSkeleton = () => (
    <div className="w-full h-full bg-background flex items-center justify-center rounded-2xl border border-border">
        <div className="space-y-4 w-2/3">
            <div className="h-4 bg-secondary rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-secondary rounded-full w-1/2 animate-pulse" />
            <div className="h-32 bg-secondary rounded-xl w-full animate-pulse" />
        </div>
    </div>
);
