"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentLibrary } from './ComponentLibrary';

interface PreviewProps {
    config: any; // Data from CustomizerEngine
    isGenerating: boolean;
}

export const LivePreview: React.FC<PreviewProps> = ({ config, isGenerating }) => {
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
                            path: '/',
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
                    <DynamicRenderer blueprint={config?.final_config || config} />
                </motion.div>
            </AnimatePresence>

            {/* HUD: AI Processing Layer */}
            {isGenerating && <AIProcessingHUD />}
        </div>
    );
};

const DynamicRenderer = ({ blueprint }: any) => {
    if (!blueprint) return (
        <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Initializing Neural Link...</p>
        </div>
    );

    const primaryColor = blueprint.theme?.primary || '#3b82f6';

    return (
        <div style={{ '--primary-color': primaryColor } as any} className="min-h-full">
            {/* 1. Header Rendering */}
            <section id="preview-header" className={`border-b border-border p-4 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-10 ${blueprint.navigation?.transparent ? 'absolute inset-x-0 bg-transparent border-none' : ''}`}>
                <div className="font-black text-xl tracking-tighter" style={{ color: primaryColor }}>
                    {blueprint.navigation?.logo || blueprint.name || "Sovereign_Site"}
                </div>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {blueprint.navigation?.links ? (
                        blueprint.navigation.links.map((link: any, i: number) => (
                            <span key={i}>{link.label}</span>
                        ))
                    ) : (
                        <>
                            <span>Home</span>
                            <span>Features</span>
                            <span>Contact</span>
                        </>
                    )}
                </div>
            </section>

            {/* 2. Content Injection (Silos) */}
            {(blueprint.layout || []).map((section: any, index: number) => (
                <motion.div
                    key={section.id || index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                    }}
                    className={section.animation === 'fade-in' ? 'animate-fade-in' : ''}
                >
                    <ComponentLibrary type={section.type} content={section.content} primaryColor={primaryColor} />
                </motion.div>
            ))}

            {/* 3. Footer Rendering */}
            <footer className="p-12 bg-background border-t border-border text-center">
                <div className="mb-6 flex justify-center gap-6">
                    {blueprint.footer?.links?.map((link: any, i: number) => (
                        <span key={i} className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest cursor-pointer hover:text-foreground transition-colors">{link.label}</span>
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    {blueprint.footer?.copyright || "© 2024 GetYouSite Sovereign Engine"}
                </p>
                <div className="mt-4 flex justify-center gap-4 text-muted-foreground">
                    {blueprint.footer?.social && Object.entries(blueprint.footer.social).map(([platform, url]: any) => (
                        <span key={platform} className="text-[10px] font-bold uppercase">{platform}</span>
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
            className="bg-card/90 text-primary-foreground p-6 font-mono text-[10px] rounded-xl border border-border shadow-2xl space-y-2"
        >
            <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-blink" />
                <span className="animate-pulse">{">"} INJECTING_GERMAN_LOGIC...</span>
            </div>
            <div>{">"} SYNCING_STYLING_MATRIX...</div>
            <div>{">"} DEPLOYING_ASSETS_TO_CLOUD...</div>
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
