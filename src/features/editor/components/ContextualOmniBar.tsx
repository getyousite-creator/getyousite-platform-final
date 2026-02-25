"use client";

import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image as ImageIcon, Layout, Trash2, Layers, Move, Zap } from 'lucide-react';

export default function ContextualOmniBar() {
    const selectedId = useEditorStore((state) => state.selectedId);
    const entities = useEditorStore((state) => state.entities);
    const updateElement = useEditorStore((state) => state.updateElement);

    if (!selectedId || !entities[selectedId]) return null;

    const element = entities[selectedId];
    const isSection = !!element.metadata;
    const isText = ['h1', 'h2', 'h3', 'p', 'span'].includes(element.tag);

    const applyClass = (cls: string) => {
        const newClasses = [...new Set([...element.classes, cls])];
        updateElement(selectedId, { classes: newClasses });
    };

    const updateContent = (content: string) => {
        updateElement(selectedId, { content });
    };

    const updateMetadataField = (field: string, value: string) => {
        if (!element.metadata) return;
        updateElement(selectedId, {
            metadata: {
                ...element.metadata,
                data: { ...element.metadata.data, [field]: value }
            }
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-neon-lime/20 shadow-[0_0_50px_rgba(190,242,100,0.2)] backdrop-blur-3xl"
            >
                <div className="flex items-center gap-2 px-3 border-r border-white/10 mr-1">
                    <Layers className="w-3.5 h-3.5 text-neon-lime animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-neon-lime">{element.metadata?.type || element.tag}</span>
                        <span className="text-[8px] font-medium text-white/30 truncate max-w-[60px]">{selectedId}</span>
                    </div>
                </div>

                {isText && (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={element.content}
                            onChange={(e) => updateContent(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-neon-lime/50 w-48 transition-all"
                        />
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <ToolbarButton icon={Type} label="Large" onClick={() => applyClass('text-5xl')} />
                        <ToolbarButton icon={Zap} label="Neon" onClick={() => applyClass('text-neon-lime')} />
                    </div>
                )}

                {isSection && (
                    <div className="flex items-center gap-2">
                        {/* Heuristic: Find first 2 string keys in metadata.data */}
                        {Object.entries(element.metadata?.data || {})
                            .filter(([_, v]) => typeof v === 'string' && v.length < 100)
                            .slice(0, 2)
                            .map(([key, value]: [string, any]) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-white/40 ml-1">{key}</span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => updateMetadataField(key, e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-neon-lime/50 w-32 transition-all"
                                    />
                                </div>
                            ))}
                        <div className="w-px h-4 bg-white/10 mx-1" />
                        <ToolbarButton icon={Move} label="Spacing" onClick={() => applyClass('py-24')} />
                    </div>
                )}

                <div className="w-px h-4 bg-white/10 mx-1" />

                <ToolbarButton
                    icon={Trash2}
                    label="Delete"
                    onClick={() => { }}
                    variant="danger"
                />
            </motion.div>
        </AnimatePresence>
    );
}

function ToolbarButton({
    icon: Icon,
    onClick,
    variant = 'default'
}: {
    icon: any,
    label: string,
    onClick: () => void,
    variant?: 'default' | 'danger'
}) {
    return (
        <button
            onClick={onClick}
            className={`p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 ${variant === 'danger' ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-white/5 text-white/60 hover:text-neon-lime'
                }`}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}
