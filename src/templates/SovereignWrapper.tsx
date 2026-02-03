"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplateEditor } from "@/hooks/use-template-editor";
import { useLaunchModal } from "@/hooks/use-launch-modal";
import { SiteBlueprint, Section } from "@/lib/schemas";
import styles from "@/styles/isolation.module.css";
import { Shield, CloudCheck, HardDrive, LucideIcon } from "lucide-react";

interface SovereignWrapperProps {
    children?: (props: {
        settings: {
            primaryColor: string;
            secondaryColor: string;
            fontFamily: string;
            [key: string]: any;
        };
        blueprint: SiteBlueprint | null;
        onOpen: (title: string) => void;
        pulse: number;
        primary: string;
        secondary: string;
    }) => React.ReactNode;
}

/**
 * SOVEREIGN WRAPPER (Structural Hardening)
 * Centralizes hook logic and serves as the Layout Orchestrator's execution environment.
 */
export default function SovereignWrapper({ children }: SovereignWrapperProps) {
    const { settings, blueprint, updatePulse: pulse } = useTemplateEditor();
    const onOpen = useLaunchModal((state) => state.onOpen);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pulse}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.canvasRoot}
                style={{ fontFamily: settings.fontFamily }}
            >
                {/* PERSISTENCE HUB: ARCHITECTURAL STATUS BAR */}
                <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl"
                    >
                        <Shield className="w-3 h-3 text-blue-400" />
                        <span>Sovereign_Protocol: Active</span>
                    </motion.div>

                    {blueprint && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 px-4 py-2 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-green-400 shadow-2xl"
                        >
                            <CloudCheck className="w-3 h-3" />
                            <span>Cloud_Sync: Synchronized</span>
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 shadow-2xl"
                    >
                        <HardDrive className="w-3 h-3" />
                        <span>State: Persistent</span>
                    </motion.div>
                </div>

                {/* 1. If a blueprint exists, we can render its instructions */}
                {blueprint && (
                    <div className="blueprint-composition-root">
                        {blueprint.layout.map((section: Section) => (
                            <BlueprintSectionRenderer key={section.id} section={section} />
                        ))}
                    </div>
                )}

                {/* 2. Legacy/Hybrid support for existing hardcoded components */}
                {children && children({
                    settings,
                    blueprint,
                    onOpen,
                    pulse,
                    primary: settings.primaryColor,
                    secondary: settings.secondaryColor,
                })}
            </motion.div>
        </AnimatePresence>
    );
}

/**
 * BLUEPRINT SECTION RENDERER
 * The bridge between JSON logic and React UI.
 */
function BlueprintSectionRenderer({ section }: { section: Section }) {
    // This will eventually map all sections to high-fidelity components
    switch (section.type) {
        case "hero":
            return <DynamicHero content={section.content} />;
        case "features":
            return <DynamicFeatures content={section.content} />;
        default:
            return (
                <div className="p-20 text-center border-2 border-dashed border-zinc-900/10 rounded-3xl m-10">
                    <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                        [{section.type}] Orchestration Pending...
                    </span>
                </div>
            );
    }
}

// STUB DYNAMIC COMPONENTS (To be expanded in later sub-phases)
function DynamicHero({ content }: { content: Record<string, any> }) {
    return (
        <section className="py-24 px-10 text-center">
            <h1 className="text-6xl font-black mb-6">{content.headline}</h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto">{content.subheadline}</p>
        </section>
    );
}

function DynamicFeatures({ content }: { content: Record<string, any> }) {
    return (
        <section className="py-24 px-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.items?.map((item: Record<string, any>, i: number) => (
                <div key={i} className="p-8 bg-zinc-50 rounded-2xl">
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-500">{item.description}</p>
                </div>
            ))}
        </section>
    );
}
