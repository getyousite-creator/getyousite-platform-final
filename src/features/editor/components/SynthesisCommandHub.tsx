"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, Zap, BrainCircuit, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { refineBlueprintAction } from '@/app/actions/synthesis-actions';
import { useEditorStore } from '../store/useEditorStore';
import { convertEntitiesToBlueprint } from '@/lib/editor/bridge';
import { SiteBlueprint } from '@/lib/schemas';

interface SynthesisCommandHubProps {
    originalBlueprint: SiteBlueprint | null;
}

export default function SynthesisCommandHub({ originalBlueprint }: SynthesisCommandHubProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [command, setCommand] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const { entities, rootIds, loadBlueprint } = useEditorStore();

    // HOTKEY PROTOCOL
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleExecute = async () => {
        if (!command.trim() || !originalBlueprint) return;

        setIsProcessing(true);
        const id = toast.loading("Strategic Synthesis in Progress...");

        try {
            // 1. Convert current 'Liquid' state to Blueprint format for synthesis context
            const currentBlueprint = convertEntitiesToBlueprint(entities, rootIds, originalBlueprint);

            // 2. Transmit to Sovereign Refinement Engine
            const refined = await refineBlueprintAction({
                currentBlueprint,
                command: command,
                businessName: originalBlueprint.name,
                niche: originalBlueprint.description || "Business",
                locale: "ar" // Defaulting to AR as per context, could be dynamic
            });

            // 3. Re-Hydrate the store with the synthesized genetic material
            loadBlueprint(refined);

            toast.success("Architectural Logic Applied", { id });
            setCommand("");
            setIsOpen(false);
        } catch (e) {
            toast.error("Refinement Protocol Interrupted", { id });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-lime/10 border border-neon-lime/20 text-neon-lime hover:bg-neon-lime/20 transition-all group"
            >
                <Sparkles className="w-4 h-4 animate-pulse group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Synthesis_Commander</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] p-6 bg-obsidian border border-neon-lime/30 rounded-3xl shadow-[0_0_100px_rgba(190,242,100,0.1)] backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-neon-lime/10 border border-neon-lime/20">
                                    <BrainCircuit className="w-6 h-6 text-neon-lime" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Strategic_Synthesis_Command</h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Protocol v3.2 \u00B7 Active_Synapse</p>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    autoFocus
                                    value={command}
                                    onChange={(e) => setCommand(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                                    placeholder="Instruct synthesis engine to redesign, modify layout, or refine copy..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-neon-lime/50 transition-all pl-14"
                                />
                                <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-lime/40" />

                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <div className="text-[9px] font-black text-white/20 uppercase bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                        Alt + K
                                    </div>
                                    <button
                                        onClick={handleExecute}
                                        disabled={isProcessing || !command.trim()}
                                        className="p-2 rounded-xl bg-neon-lime text-obsidian hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                                    >
                                        {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-3">
                                <SuggestionCard icon={Zap} title="Dark Mode" desc="Switch to a quantum dark aesthetic" onClick={() => setCommand("Switch to a quantum dark aesthetic with neon lime accents")} />
                                <SuggestionCard icon={Terminal} title="Sell Better" desc="Apply AIDA model to all sections" onClick={() => setCommand("Rewrite all headlines and body copy using the AIDA persuasion model in professional Arabic")} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function SuggestionCard({ icon: Icon, title, desc, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-neon-lime/30 hover:bg-white/10 transition-all text-left group"
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3 h-3 text-neon-lime group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{title}</span>
            </div>
            <p className="text-[9px] text-white/40 leading-relaxed">{desc}</p>
        </button>
    );
}
