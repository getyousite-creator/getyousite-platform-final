"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComponentLibrary } from './ComponentLibrary';
import { registerPreviewListener } from '@/lib/engine/refinement';
import type { SiteBlueprint } from "@/lib/schemas";
import { SOVEREIGN_IDENTITY } from '@/lib/config/identity';

interface PreviewProps {
    config: SiteBlueprint | null;
    isGenerating: boolean;
    selectedPageSlug?: string;
    onTextChange?: (sectionId: string, text: string) => void;
    onReorder?: (sourceId: string, targetId: string) => void;
}

export const LivePreview: React.FC<PreviewProps> = ({
    config,
    isGenerating,
    selectedPageSlug = 'index',
    onTextChange,
    onReorder
}) => {
    const [liveBlueprint, setLiveBlueprint] = useState<SiteBlueprint | null>(config);

    useEffect(() => {
        if (config) setLiveBlueprint(config);
    }, [config]);

    // 1. Logic Hardening: Analytics Oracle
    const trackInteraction = useCallback(async (path: string) => {
        if (!config?.id) return;
        try {
            await fetch('/api/dashboard/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    storeId: config.id,
                    path,
                    metadata: {
                        device: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'server',
                        source: 'live_preview'
                    }
                })
            });
        } catch (e) { /* Silent protocol recovery */ }
    }, [config?.id]);

    useEffect(() => {
        trackInteraction(`/${selectedPageSlug}`);
    }, [selectedPageSlug, trackInteraction]);

    // 2. STRP: Subscription to Remote Preview Updates
    useEffect(() => {
        return registerPreviewListener((payload) => {
            if (payload?.type === "blueprint-update" && payload.blueprint) {
                setLiveBlueprint(payload.blueprint as SiteBlueprint);
            }
        });
    }, []);

    // Synthetic Sync
    useEffect(() => {
        if (config && config !== liveBlueprint) {
            setLiveBlueprint(config);
        }
    }, [config]);

    if (isGenerating && !liveBlueprint) {
        return <GenerationSkeleton />;
    }

    return (
        <div className="relative w-full h-full bg-[#020617] overflow-hidden shadow-[0_64px_128px_-12px_rgba(0,0,0,0.8)] rounded-3xl border border-white/5 aspect-[9/16] md:aspect-[16/10]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={liveBlueprint?.id || 'empty'}
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full overflow-y-auto scrollbar-hide selection:bg-primary/30"
                >
                    <DynamicRenderer
                        blueprint={liveBlueprint}
                        selectedPageSlug={selectedPageSlug}
                        isGenerating={isGenerating}
                        onTextChange={onTextChange}
                        onReorder={onReorder}
                    />
                </motion.div>
            </AnimatePresence>

            {isGenerating && <SovereignProcessingHUD />}
        </div>
    );
};

const DynamicRenderer: React.FC<{
    blueprint: SiteBlueprint | null;
    selectedPageSlug: string;
    isGenerating: boolean;
    onTextChange?: (id: string, text: string) => void;
    onReorder?: (s: string, t: string) => void;
}> = ({ blueprint, selectedPageSlug, isGenerating, onReorder }) => {

    const activeLayout = useMemo(() => {
        if (!blueprint) return [];
        return blueprint.layout || [];
    }, [blueprint]);

    if (!blueprint && !isGenerating) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-12 h-12 border border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">Establishing_Secure_Link</p>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col">
            {/* Header: Institutional Branding */}
            <header className="sticky top-0 z-[100] p-8 flex justify-between items-center bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5">
                <div className="font-black text-2xl tracking-tighter text-white">
                    {blueprint?.navigation?.logo || "GYS_PROTOCOL"}
                </div>
                <nav className="hidden md:flex gap-8">
                    {blueprint?.navigation?.links?.map((link, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors cursor-pointer">
                            {link.label}
                        </span>
                    ))}
                </nav>
            </header>

            <main className="flex-1">
                {activeLayout.map((section, index) => (
                    <motion.div
                        key={section.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group transition-all"
                    >
                        <ComponentLibrary
                            id={section.id}
                            type={section.type}
                            content={section.content}
                            primaryColor={blueprint?.theme?.primary || '#3b82f6'}
                            isEditable={true}
                        />
                        <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 pointer-events-none transition-colors" />
                    </motion.div>
                ))}
            </main>

            <footer className="p-20 bg-black/40 border-t border-white/5 text-center">
                <p className="text-[10px] text-white/10 uppercase tracking-[0.4em] font-black">
                    {blueprint?.footer?.copyright || `© ${new Date().getFullYear()} GYS Global Systems`}
                </p>
            </footer>
        </div>
    );
};

const SovereignProcessingHUD = () => (
    <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[4px] flex items-center justify-center z-[200]">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f172a]/95 border border-primary/30 p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(59,130,246,0.15)] min-w-[320px] space-y-6"
        >
            <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Strategic_Orchestration</span>
            </div>
            <div className="space-y-3 font-mono text-[9px] text-white/40 uppercase">
                <div className="flex justify-between"><span>{">"} ANALYZING_VECTORS</span><span className="text-primary">COMPLETE</span></div>
                <div className="flex justify-between"><span>{">"} SYNTHESIZING_BLUEPRINT</span><span className="animate-pulse">ACTIVE</span></div>
                <div className="flex justify-between"><span>{">"} HARDENING_LOGIC</span><span>WAITING</span></div>
            </div>
            <div className="pt-6 border-t border-white/5 text-[9px] text-center text-white/10 font-black uppercase tracking-[0.3em]">
                {SOVEREIGN_IDENTITY.PROTOCOL_VERSION}
            </div>
        </motion.div>
    </div>
);

const GenerationSkeleton = () => (
    <div className="w-full h-full bg-[#020617] flex items-center justify-center rounded-3xl border border-white/5 p-12">
        <div className="w-full max-w-md space-y-8">
            <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse" />
            <div className="h-64 bg-white/5 rounded-[2rem] w-full animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-white/5 rounded-[2rem] animate-pulse" />
                <div className="h-32 bg-white/5 rounded-[2rem] animate-pulse" />
            </div>
        </div>
    </div>
);

